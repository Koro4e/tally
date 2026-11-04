/* ============================================================================
   ЗВУК ЗВЕРЬКА — сэмплы + синтез
   ----------------------------------------------------------------------------
   Гибрид, и это осознанно.

   Сэмплы (public/sfx/*.mp3, CC0, OpenGameArt — «80 CC0 creature SFX» и
   «51 UI SFX»): голос существа. Синтезировать «милое урчание» невозможно —
   там форманты, которых нет у осциллятора. Файлы короткие (0.25–0.75 с),
   моно, 56 kbps, нормализованы в ffmpeg до −18 LUFS: 11 штук = 60 КБ.

   Синтез: то, что сэмплом делать дороже, чем посчитать, — «прур» под грудью,
   подскок, искры на комбо. Плюс он работает, пока файлы ещё не приехали.

   Правила, которые нельзя нарушать:
   - контекст создаётся только по жесту, иначе браузер блокирует звук;
   - громкость 0.03–0.12: это фон, а не уведомление;
   - каждый звук играется с рандомом питча ±7 % — на пятидесятом повторе
     одинаковый «поп» начинает бесить, а чуть разный — нет;
   - выключатель в localStorage `tally.sound`, по умолчанию включено.
   ========================================================================== */

const KEY = "tally.sound";

const NAMES = [
  "tap",
  "ok",
  "ok2",
  "combo",
  "no",
  "sad",
  "eat",
  "nudge",
  "doze",
  "grunt",
  "toggle",
] as const;

type Name = (typeof NAMES)[number];

let ctx: AudioContext | null = null;
const buffers = new Map<Name, AudioBuffer>();
let loading = false;

export function soundOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSound(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* приватный режим */
  }
}

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Тянем все файлы один раз. 60 КБ, параллельно, молча при ошибке:
    если сеть не дала — остаётся синтез, и приложение этого не замечает. */
function load(): void {
  if (loading || !ctx) return;
  loading = true;
  const a = ctx;
  void Promise.all(
    NAMES.map(async (n) => {
      try {
        const r = await fetch(`/sfx/${n}.mp3`);
        if (!r.ok) return;
        const ab = await r.arrayBuffer();
        const buf = await a.decodeAudioData(ab);
        buffers.set(n, buf);
      } catch {
        /* остаёмся на синтезе */
      }
    }),
  );
}

/** true — если сэмпл реально сыграл; иначе вызывающий играет синтез */
function play(name: Name, gain: number, detune = 0): boolean {
  const a = ctx;
  if (!a) return false;
  const buf = buffers.get(name);
  if (!buf) return false;
  const src = a.createBufferSource();
  src.buffer = buf;
  // ±7 % питча — этого достаточно, чтобы два «попа» не были близнецами
  src.playbackRate.value = 1 + detune + (Math.random() * 2 - 1) * 0.07;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(g).connect(a.destination);
  src.start();
  return true;
}

/* --------------------------------------------------------------- синтез --- */

function tone(
  a: AudioContext,
  freq: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine",
  slideTo?: number,
): void {
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, a.currentTime + dur);
  g.gain.setValueAtTime(0.0001, a.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, a.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + dur + 0.02);
}

function noise(a: AudioContext, dur: number, gain: number, from: number, to: number): void {
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(from, a.currentTime);
  f.frequency.exponentialRampToValueAtTime(to, a.currentTime + dur);
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(a.destination);
  src.start();
}

/* --------------------------------------------------------------- события --- */

/** довольное урчание — когда покормили */
export function purr(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("eat", 0.30)) return;
  tone(a, 96, 0.55, 0.07, "sine", 78);
  tone(a, 144, 0.5, 0.035, "triangle", 118);
  noise(a, 0.55, 0.05, 900, 260);
}

/** короткий писк — на нажатие */
export function chirp(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("tap", 0.26)) return;
  tone(a, 760, 0.1, 0.05, "sine", 1180);
  tone(a, 1180, 0.09, 0.03, "sine", 980);
}

/** вздох — когда зверёк ждал */
export function sigh(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("sad", 0.28)) return;
  noise(a, 0.6, 0.06, 700, 180);
  tone(a, 220, 0.5, 0.03, "sine", 150);
}

/** щелчок — верный ответ */
export function pop(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("ok", 0.34)) return;
  tone(a, 520, 0.07, 0.05, "triangle", 760);
}

/** верный ответ; n — сколько подряд, чтобы серия звучала выше и бодрее */
export function correct(n = 1): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  const step = Math.min(4, Math.max(0, n - 1));
  // серия: питч ползёт вверх, но не бесконечно — иначе на 10-м станет пискляво
  const detune = step * 0.055;
  if (play(step >= 3 ? "combo" : Math.random() < 0.5 ? "ok" : "ok2", 0.34, detune)) return;
  tone(a, 520 + step * 40, 0.07, 0.05, "triangle", 760 + step * 60);
}

/** неверный ответ */
export function wrong(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("no", 0.30)) return;
  tone(a, 300, 0.16, 0.05, "sine", 190);
}

/** подскок — короткий «боинг» */
export function boing(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  tone(a, 340, 0.16, 0.045, "triangle", 620);
  tone(a, 680, 0.10, 0.02, "sine", 900);
}

/** искры — комбо или закрытый узел */
export function sparkle(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  const base = [1046, 1318, 1568, 2093];
  base.forEach((f, i) => {
    const o = a.createOscillator();
    const g = a.createGain();
    const t = a.currentTime + i * 0.055;
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.032, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + 0.3);
  });
}

/** зовёт, если человек залип */
export function nudge(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("nudge", 0.30)) return;
  tone(a, 620, 0.12, 0.05, "sine", 880);
}

/** дремота */
export function doze(): void {
  if (!soundOn()) return;
  ac();
  load();
  play("doze", 0.16);
}

/** ворчит — когда тыкают слишком часто */
export function grunt(): void {
  if (!soundOn()) return;
  const a = ac();
  if (!a) return;
  load();
  if (play("grunt", 0.22)) return;
  tone(a, 180, 0.18, 0.04, "sawtooth", 140);
}

/** переключатель звука в интерфейсе */
export function toggleClick(): void {
  const a = ac();
  if (!a) return;
  load();
  if (play("toggle", 0.24)) return;
  tone(a, 420, 0.05, 0.04, "square", 560);
}

/* Браузер разрешает звук только после действия человека. Первое «прур»
   играет на экране итога, а это не жест, поэтому контекст создаём заранее —
   на первом касании в любом месте приложения. Там же тянем файлы. */
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    () => {
      ac();
      load();
    },
    { once: true, passive: true },
  );
}
