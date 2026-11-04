import io
p = "D:/AI-Workspace/projects/tally/src/App.tsx"
s = io.open(p, encoding="utf-8").read()

def sub1(s, a, b):
    assert a in s, "ANCHOR MISS: " + a[:70]
    return s.replace(a, b, 1)

# ================= 3. App.tsx: перестановка =================
p = r"D:/AI-Workspace/projects/tally/src/App.tsx"
s = io.open(p, encoding="utf-8").read()

# 3a. состояние «настройки открыты»
a = "  const [deView, setDeView] = useState<\"grammatik\" | \"woerter\" | \"pruefung\">(\"grammatik\");"
b = a + "\n  const [settingsOpen, setSettingsOpen] = useState(false);"
assert a in s; s = s.replace(a, b, 1)

# 3b. weg-колонна: без правой панели, одна центрированная колонна
a = """      {subject === "mathe" ? (
        <div className="mx-auto flex w-full max-w-[1160px] items-start gap-8 px-4 lg:px-8">
          <div className={cn(
            "min-w-0 flex-1",
            /* центр есть только на Weg (там правая панель); Prüfung и
               Programm без панели центрируются, чтобы не липнуть к сайдбару */
            matheView === "weg" && view === "weg"
              ? "lg:max-w-[540px] lg:shrink-0"
              : "lg:max-w-[620px] lg:mx-auto",
          )}>"""
b = """      {settingsOpen ? (
        <Einstellungen onBack={() => setSettingsOpen(false)} />
      ) : subject === "mathe" ? (
        <div className="mx-auto w-full max-w-[680px] px-4 lg:px-0">
          <div className="min-w-0 flex-1">"""
assert a in s, "mathe container"
s = s.replace(a, b, 1)

# 3c. убрать правую панель из Weg и вставить NextUp+Mix перед деревом
a = """            {matheView === "weg" ? (
              view === "weg" ? (
                <Weg m={m} mv={mv} onPick={pickSkill} onKontrolle={setKontrolle} onMix={() => setMix(true)} />
              ) : (
                <Programm m={m} />
              )
            ) : (
              <Pruefung
                onExam={() => setExam(true)}
                onKontrolle={(b) => setKontrolle(b)}
                onMix={() => setMix(true)}
              />
            )}
          </div>
          {matheView === "weg" && (
            <Aside m={m} mv={mv} onPick={pickSkill} onExam={() => setExam(true)} onMix={() => setMix(true)} />
          )}
        </div>"""
b = """            {matheView === "weg" ? (
              view === "weg" ? (
                <>
                  <NextUp m={m} onPick={pickSkill} />
                  <Weg m={m} mv={mv} onPick={pickSkill} onKontrolle={setKontrolle} onMix={() => setMix(true)} />
                </>
              ) : (
                <Programm m={m} />
              )
            ) : (
              <Pruefung
                onExam={() => setExam(true)}
                onKontrolle={(b) => setKontrolle(b)}
                onMix={() => setMix(true)}
              />
            )}
          </div>
        </div>"""
assert a in s, "weg branch"
s = s.replace(a, b, 1)

# 3d. deutsch-контейнер тоже через settingsOpen
a = """      ) : (
        <div className="mx-auto w-full max-w-[720px] px-4 lg:px-0">"""
b = """      ) : (
        <div className="mx-auto w-full max-w-[720px] px-4 lg:px-0">
          {/* Deutsch — та же центрированная колонна */}"""
assert a in s; s = s.replace(a, b, 1)

# 3e. NextUp: карточка «Jetzt dran» (переехала из Aside)
a = "function Weg({"
b = """function NextUp({ m, onPick }: { m: M; onPick: (s: Skill) => void }) {
  const cur = useMemo(() => current(m), [m]);
  if (!cur) return null;
  return (
    <div className="card3d mb-4 rounded-card border-2 border-green bg-white p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-green">
        Jetzt dran
      </p>
      <p className="mt-1 text-[15px] leading-tight font-extrabold">{cur.de}</p>
      <p className="text-[11.5px] font-semibold text-muted">{cur.ru}</p>
      {covText(cur, m[cur.id]) && (
        <p className="tnum mt-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted">
          {covText(cur, m[cur.id])} Proben
        </p>
      )}
      <button
        type="button"
        onClick={() => onPick(cur)}
        className="btn3d btn3d-green mt-3 w-full rounded-xl px-3 py-3 text-[11.5px] font-extrabold tracking-[0.04em] uppercase"
      >
        <span className="block truncate">Weiter: {cur.de}</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------- настройки ------- */

function Einstellungen({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<ThemeMode>(getTheme());
  useEffect(() => subscribe(() => setMode(getTheme())), []);
  const [snd, setSnd] = useState(soundOn);
  const modes: { id: ThemeMode; de: string }[] = [
    { id: "light", de: "Светлая" },
    { id: "dark", de: "Тёмная" },
    { id: "auto", de: "Системная" },
  ];
  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted hover:text-ink"
      >
        ← Назад
      </button>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.01em]">Настройки</h1>

      <section className="card3d mt-4 rounded-card border-2 border-line bg-white p-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">Тема</p>
        <div className="mt-2 flex gap-2">
          {modes.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setTheme(x.id)}
              aria-pressed={mode === x.id}
              className={cn(
                "btn3d flex-1 rounded-xl border-2 px-2 py-2.5 text-[12px] font-extrabold",
                mode === x.id
                  ? "border-green bg-greenl text-greend [--btn-shadow:var(--color-greend)]"
                  : "border-line bg-white text-muted [--btn-shadow:var(--color-line)]",
              )}
            >
              {x.de}
            </button>
          ))}
        </div>
      </section>

      <section className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">Маскот</p>
        <MascotPicker className="mt-2 border-0 p-0 shadow-none" />
      </section>

      <section className="card3d mt-3 rounded-card border-2 border-line bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold">Звук</p>
          <button
            type="button"
            onClick={() => {
              const next = !snd;
              setSnd(next);
              setSound(next);
              if (next) toggleClick();
            }}
            aria-pressed={snd}
            className={cn(
              "btn3d rounded-xl px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em]",
              snd ? "btn3d-green" : "btn3d-white",
            )}
          >
            {snd ? "An" : "Aus"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Weg({"""
assert a in s, "Weg fn"
s = s.replace(a, b, 1)

# 3f. сайдбар: вместо ThemeToggle — кнопка «Настройки»
a = """        <div className="mt-3 border-t-2 border-line pt-3">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Оформление
          </p>
          <ThemeToggle />
        </div>"""
b = """        <div className="mt-3 border-t-2 border-line pt-3">
          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent("tally:settings"))}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-extrabold text-ink/70 transition-colors hover:bg-black/[0.04] hover:text-ink"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="3.2" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
            </svg>
            Настройки
          </button>
        </div>"""
assert a in s, "sidebar settings row"
s = s.replace(a, b, 1)

# слушаем событие настроек из сайдбара
a = "  const [settingsOpen, setSettingsOpen] = useState(false);"
b = a + """
  useEffect(() => {
    const open = () => setSettingsOpen(true);
    document.addEventListener("tally:settings", open);
    return () => document.removeEventListener("tally:settings", open);
  }, []);"""
assert a in s; s = s.replace(a, b, 1)

# 3g. мобильная шапка: шестерёнка вместо ThemeToggle compact
a = "        <ThemeToggle compact />"
b = """        <button
          type="button"
          aria-label="Настройки"
          onClick={() => document.dispatchEvent(new CustomEvent("tally:settings"))}
          className="rounded-lg p-1.5 text-ink transition-colors hover:bg-black/[0.04]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3.2" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
          </svg>
        </button>"""
assert a in s, "mobile gear"
s = s.replace(a, b, 1)

# 3h. удалить ThemeToggle-компонент и Aside целиком (не используются)
i = s.index("const THEME_META:")
j = s.index("function ShellSidebar({")
s = s[:i] + s[j:]
i = s.index("function Aside({")
j = s.index("/* ------------------------------------------------------- настройки ------- */") if "/* ------------------------------------------------------- настройки ------- */" in s else s.index("function NextUp({")
# Aside заканчивается перед NextUp (вставлен перед Weg) — ищем его закрывающую скобку:
k = s.index("function NextUp({")
seg = s[i:k]
# Aside заканчивается на "}\n\n" перед комментарием NextUp — отрезаем до него
end = seg.rindex("}\n\n")
s = s[:i] + s[i + end + 3:]

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("App restructured")
