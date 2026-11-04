import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { toggleClick } from "@/lib/sfx";
import { MascotThumb } from "./Mascot";
import { CHARACTERS } from "./tally-mascots";
import { setMascot, useMascot } from "./store";

/* ============================================================================
   ВЫБОР МАСКОТА.
   ----------------------------------------------------------------------------
   Пять СТАТИЧНЫХ миниатюр (MascotThumb: один кадр, без движка и rAF) — живёт
   только главный маскот. Выбранный подсвечен рамкой акцентного цвета и смотрит
   довольным («happy»), остальные спокойные («calm»). Выбор сразу красит
   интерфейс (data-mascot → index.css) и запоминается в localStorage. Место
   показа — временное (под карточкой «Сегодня»), компонент самодостаточный.
   ========================================================================== */

export default function MascotPicker({
  className,
  noTitle = false,
}: {
  className?: string;
  noTitle?: boolean;
}) {
  const cur = useMascot();
  return (
    <div className={cn("card3d rounded-card border border-line bg-card p-4", className)}>
      {!noTitle && (
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
          Dein Maskottchen
        </p>
      )}
      <div className="grid grid-cols-5 gap-2">
        {CHARACTERS.map((ch) => {
          const on = ch.id === cur;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={(e) => {
                setMascot(ch.id, { x: e.clientX, y: e.clientY });
                toggleClick();
              }}
              aria-pressed={on}
              className={cn(
                "btn3d flex flex-col items-center rounded-xl border-2 bg-card px-0.5 pt-2 pb-1.5",
                on ? "border-green" : "border-line hover:bg-bg",
              )}
              style={on ? ({ "--btn-shadow": "var(--color-greend)" } as CSSProperties) : undefined}
            >
              <MascotThumb char={ch.id} pose={on ? "happy" : "calm"} className="h-[58px] w-auto" />
              <span className={cn("mt-0.5 text-[10px] font-extrabold", on ? "text-green" : "text-muted")}>
                {ch.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
