/* ============================================================================
   МАСКОТ: ВЫБОР + ТЕМА.
   ----------------------------------------------------------------------------
   Выбранный зверёк живёт в localStorage ("tally.mascot.v1") и красит интерфейс:
   на <html> ставится data-mascot, а в index.css каждая зверюшка переопределяет
   primary-акцент — семью --color-green/--color-greend/--color-greenl. Все
   bg-green / btn3d-green / border-green / text-green перекрашиваются сами,
   семантика blue/gold/red (повторение / пройдено / ошибка) не трогается.
   Поменять зверька можно в любой момент через MascotPicker.
   ========================================================================== */

import { useEffect, useSyncExternalStore } from "react";
import { CHARACTERS, type MascotChar } from "./tally-mascots";

const KEY = "tally.mascot.v1";

function isChar(v: unknown): v is MascotChar {
  return typeof v === "string" && CHARACTERS.some((c) => c.id === v);
}

function read(): MascotChar {
  try {
    const v = localStorage.getItem(KEY);
    if (isChar(v)) return v;
  } catch {
    /* приватный режим — берём дефолт */
  }
  return "pip"; /* дефолт = текущий зелёный акцент, ничего не меняет */
}

let current: MascotChar = read();
const listeners = new Set<() => void>();

export function getMascot(): MascotChar {
  return current;
}

export function setMascot(ch: MascotChar, at?: { x: number; y: number }): void {
  if (ch === current) return;
  current = ch;
  try {
    localStorage.setItem(KEY, ch);
  } catch {
    /* ignore */
  }
  /* та же круговая волна, что и у темы: акцент перетекает по клику */
  const swap = () => {
    /* дата-атрибут ставим синхронно: снимок нового состояния для
       View Transition должен уже видеть новый акцент */
    document.documentElement.dataset.mascot = ch;
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

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Текущий зверёк + перекраска <html> (data-mascot → CSS-тема из index.css). */
export function useMascot(): MascotChar {
  const ch = useSyncExternalStore(subscribe, getMascot);
  useEffect(() => {
    document.documentElement.dataset.mascot = ch;
  }, [ch]);
  return ch;
}
