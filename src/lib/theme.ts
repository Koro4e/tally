/* ============================================================================
   ТЕМА: light (по умолчанию) / dark / auto. Хранится в localStorage
   "tally.theme". Дефолт — светлая (решение хозяина: белый дефолт,
   «Системная» — осознанный выбор в настройках, а не стартовое состояние). data-theme на <html> ставит CSS-блоки
   из index.css; JS резолвит auto сразу при загрузке, чтобы не мигало.
   ========================================================================== */

export type ThemeMode = "auto" | "dark" | "light";

const KEY = "tally.theme";
const listeners = new Set<() => void>();

let current: ThemeMode = read();
let applied = "";

function read(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "dark" || v === "light" || v === "auto") return v;
  } catch {
    /* приватный режим — светлая */
  }
  return "light";
}

export function getTheme(): ThemeMode {
  return current;
}

export function setTheme(t: ThemeMode, at?: { x: number; y: number }): void {
  current = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
  /* Смена темы — круговая волна от места клика (View Transitions API из
     макета; центр волны пишется в --x/--y). Fallback — простое применение. */
  const swap = () => {
    apply();
    for (const l of listeners) l();
  };
  if (at && typeof document.startViewTransition === 'function') {
    const r = document.documentElement;
    r.style.setProperty('--x', at.x + 'px');
    r.style.setProperty('--y', at.y + 'px');
    document.startViewTransition(swap);
  } else {
    swap();
  }
}

export function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** резолв auto → тёмная/светлая по системе */
function isDark(): boolean {
  if (current === "dark") return true;
  if (current === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function apply(): void {
  const v = isDark() ? "dark" : "light";
  if (applied === v) return;
  applied = v;
  document.documentElement.dataset.theme = v;
  /* цвет рамки мобильного браузера следует за темой */
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", v === "dark" ? "#14171C" : "#FBF5E9");
}

/** вызывается один раз из main.tsx до рендера */
export function themeInit(): void {
  apply();
  /* система переключила тему, пока mode = auto — реагируем живьём */
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    if (current === "auto") apply();
  });
}

/** следующий режим по кругу: auto → dark → light → auto */
export function cycleTheme(): ThemeMode {
  const next: ThemeMode = current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
  setTheme(next);
  return next;
}
