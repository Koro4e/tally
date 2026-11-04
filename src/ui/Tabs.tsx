/* ============================================================================
   TABS — сегментный переключатель со скользящим «пилюлей»-индикатором
   (из макета: ::before с translateX(calc(var(--i)*100%)) и spring 500ms).
   Единственный переключатель уровней/разделов/темы — вместо россыпи
   рамочных кнопок, у которых каждая перерисовка выглядела по-своему.
   ========================================================================== */

import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

export default function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  /** короткие подписи; id — значение для onChange */
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const i = Math.max(
    0,
    items.findIndex((t) => t.id === value),
  );
  return (
    <div
      role="tablist"
      className={cn("relative flex rounded-xl bg-sf2 p-1", className)}
      style={{ "--n": items.length, "--i": i } as CSSProperties}
    >
      {/* индикатор: ширина = доля секции, сдвиг = i × своя ширина */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-[9px] bg-card shadow-[var(--sh)] transition-transform [transition-duration:var(--d3)] [transition-timing-function:var(--spring)]"
        style={{
          width: "calc((100% - 8px) / var(--n))",
          transform: "translateX(calc(var(--i) * 100%))",
        }}
      />
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={(e) => onChange(t.id, e)}
            className={cn(
              "relative flex-1 truncate rounded-[9px] px-1 py-2 text-[13px] font-extrabold transition-colors [transition-duration:var(--d2)]",
              on ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
