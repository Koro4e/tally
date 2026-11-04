# -*- coding: utf-8 -*-
"""
audio-build.py — генерация аудио для раздела 1 (Hoerverstehen) экзамена TALLY.

Источник текстов: tools/genwork/horverstehen.ts (единственный источник истины).
Скрипт парсит его регулярками, поэтому в .ts строки должны быть:
  · без ASCII-двойных кавычек внутри (немецкие „…“ допустимы),
  · каждая строка — одной строкой кода.

Что генерируется (в public/audio/ проекта):
  diktat-1.mp3, diktat-2.mp3 — полный текст диктанта, de-DE-KatjaNeural,
                               rate=-10%, два отдельных файла (UI сыграет по
                               очереди — пауза между прочтениями в руках UI);
  mc-intro.mp3               — только вступление MC, de-DE-KatjaNeural,
                               rate=-5% (вопросы ПЕЧАТАЮТСЯ в листе, аудио их
                               не читает — как в реальном экзамене);
  dialog-1.mp3 … dialog-3.mp3 — диалоги, склеенные из реплик: A —
                               de-DE-ConradNeural, B — de-DE-AmalaNeural,
                               между репликами ~0.55 c тишины. Склейка через
                               ffmpeg concat-фильтр (ffmpeg проверен при
                               запуске; pydub не нужен).

Запуск:  python tools/audio-build.py
Проверка после генерации: каждый файл существует и > 10 KB.
Временные файлы (реплики диалогов) пишутся в tmp-каталог и удаляются.
"""

import asyncio
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import edge_tts

# --------------------------------------------------------------- константы --

ROOT = Path(__file__).resolve().parent.parent          # D:\AI-Workspace\projects\tally
TS_PATH = ROOT / "tools" / "genwork" / "horverstehen.ts"
OUT = ROOT / "public" / "audio"

VOICE_F = "de-DE-KatjaNeural"
VOICE_A = "de-DE-ConradNeural"   # реплики A (муж.)
VOICE_B = "de-DE-AmalaNeural"    # реплики B (жен.)
RATE_DIKTAT = "-10%"
RATE_MC = "-5%"
GAP_BETWEEN_LINES = 0.55          # тишина между репликами диалога, сек
MIN_FILE_BYTES = 10 * 1024        # проверка: файл не пустой

# --------------------------------------------------------------- парсинг TS --

def parse_ts() -> dict:
    """Достаёт из horverstehen.ts: diktat.full, mc.intro, реплики диалогов."""
    src = TS_PATH.read_text(encoding="utf-8")

    m_full = re.search(r'full:\s*\n?\s*"([^"]+)"', src)
    m_intro = re.search(r'intro:\s*\n?\s*"([^"]+)"', src)
    if not m_full or not m_intro:
        sys.exit("ОШИБКА: не найден full (diktat) или intro (mc) в " + str(TS_PATH))

    # диалоги: секция после 'dialogs: [' режется по 'title: "Dialog N'
    idx = src.index("dialogs: [")
    chunk = src[idx:]
    parts = re.split(r'title:\s*"Dialog \d+[^"]*"', chunk)[1:]
    if len(parts) != 3:
        sys.exit(f"ОШИБКА: ожидалось 3 диалога, найдено {len(parts)}")

    dialogs = []
    for part in parts:
        lines = re.findall(r'who:\s*"([AB])",\s*text:\s*"([^"]*)"', part)
        if not lines:
            sys.exit("ОШИБКА: в диалоге не найдено ни одной реплики")
        dialogs.append([(who, text) for who, text in lines])

    return {"diktat": m_full.group(1), "intro": m_intro.group(1), "dialogs": dialogs}

# ------------------------------------------------------------------- tts ----

async def tts(text: str, voice: str, rate: str, path: Path) -> None:
    """Одна реплика/текст -> mp3 через edge-tts."""
    com = edge_tts.Communicate(text, voice, rate=rate)
    await com.save(str(path))

# ---------------------------------------------------------------- ffmpeg ----

def check_ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit("ОШИБКА: ffmpeg не найден в PATH — склейка диалогов невозможна")
    return exe

def join_dialog(ffmpeg: str, parts: list[Path], out: Path) -> None:
    """Склеивает mp3-реплики в один файл, вставляя тишину между ними.

    [i:a]apad=pad_dur=GAP  — дописывает тишину в конец каждой реплики;
    concat=n=N:v=0:a=1     — склеивает аудиодорожки (формат у всех один,
                             т.к. все реплики из edge-tts, 24 kHz mono).
    """
    n = len(parts)
    cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error"]
    for p in parts:
        cmd += ["-i", str(p)]
    chains = [f"[{i}:a]apad=pad_dur={GAP_BETWEEN_LINES}[a{i}]" for i in range(n)]
    filters = ";".join(chains) + ";" + "".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[out]"
    cmd += ["-filter_complex", filters, "-map", "[out]", "-b:a", "96k", str(out)]
    subprocess.run(cmd, check=True)

# ------------------------------------------------------------------- main ---

async def main() -> None:
    data = parse_ts()
    ffmpeg = check_ffmpeg()
    OUT.mkdir(parents=True, exist_ok=True)

    results: list[tuple[str, int]] = []

    async def gen(name: str, text: str, voice: str, rate: str) -> None:
        path = OUT / name
        await tts(text, voice, rate, path)
        results.append((str(path.relative_to(ROOT)), path.stat().st_size))
        print(f"  ok  {path.relative_to(ROOT)}  {path.stat().st_size} B")

    print("1/3 Diktat (Katja, rate -10%, полный текст дважды):")
    for i in (1, 2):
        await gen(f"diktat-{i}.mp3", data["diktat"], VOICE_F, RATE_DIKTAT)

    print("2/3 MC intro (Katja, rate -5%):")
    await gen("mc-intro.mp3", data["intro"], VOICE_F, RATE_MC)

    print("3/3 Диалоги (A=Conrad, B=Amala, склейка ffmpeg):")
    tmp = Path(tempfile.mkdtemp(prefix="tally-audio-"))
    try:
        for di, lines in enumerate(data["dialogs"], start=1):
            parts: list[Path] = []
            for li, (who, text) in enumerate(lines, start=1):
                voice = VOICE_A if who == "A" else VOICE_B
                p = tmp / f"d{di}-{li:02d}.mp3"
                await tts(text, voice, "+0%", p)
                parts.append(p)
            out = OUT / f"dialog-{di}.mp3"
            join_dialog(ffmpeg, parts, out)
            results.append((str(out.relative_to(ROOT)), out.stat().st_size))
            print(f"  ok  {out.relative_to(ROOT)}  {out.stat().st_size} B  ({len(parts)} реплик)")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)   # временные реплики — долой

    # ----------------------------------------------------------- проверка --
    print("\nПроверка файлов:")
    bad = []
    expected = ["diktat-1.mp3", "diktat-2.mp3", "mc-intro.mp3",
                "dialog-1.mp3", "dialog-2.mp3", "dialog-3.mp3"]
    for name in expected:
        p = OUT / name
        if not p.exists():
            bad.append(f"{name}: отсутствует")
        elif p.stat().st_size <= MIN_FILE_BYTES:
            bad.append(f"{name}: {p.stat().st_size} B (<= 10 KB)")
    if bad:
        sys.exit("ОШИБКА ПРОВЕРКИ:\n  " + "\n  ".join(bad))
    for name, size in results:
        print(f"  {name:22s} {size / 1024:8.1f} KB")
    print(f"\nВсё готово: {len(expected)} файлов в {OUT}")

if __name__ == "__main__":
    asyncio.run(main())
