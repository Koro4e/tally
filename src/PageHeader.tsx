/* ============================================================================
   PAGEHEADER — единственный заголовок экрана (см. DESIGN.md §3).
   kicker: 10px uppercase muted · title: H1 24 extrabold · sub: 13 muted.
   Все четыре ветки (Mathe Weg/Prüfung, Deutsch Grammatik/Wörter/Prüfung,
   Настройки) обязаны начинаться с него — по-другому заголовков больше нет.
   ========================================================================== */

import { cn } from "@/utils/cn";

export default function PageHeader({
  kicker,
  title,
  sub,
  className,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("pt-5", className)}>
      {kicker && (
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
          {kicker}
        </p>
      )}
      <h1 className="mt-1 text-[24px] leading-tight font-extrabold tracking-[-0.01em] text-ink">
        {title}
      </h1>
      {sub && (
        <p className="mt-1 text-[13px] leading-snug font-semibold text-muted">{sub}</p>
      )}
    </div>
  );
}
