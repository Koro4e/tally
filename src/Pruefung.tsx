/* ============================================================================
   PRÜFUNG (Mathematik) — центр математических проверок
   ----------------------------------------------------------------------------
   Один из двух под-разделов таба «Mathe»: Probeprüfung целиком, Mix-раунд
   и контрольные по разделам. Немецкий экзамен живёт в своём табе Deutsch →
   Prüfung — предмет не смешивается.
   ========================================================================== */

import { lastExam } from "@/Exam";
import { BRANCHES, type Branch } from "@/lib/skills";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}

export default function Pruefung({
  onExam,
  onKontrolle,
  onMix,
}: {
  onExam: () => void;
  onKontrolle: (b: Branch) => void;
  onMix: () => void;
}) {
  const last = lastExam();

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 pt-1 pb-5">
      <div className="card3d rounded-card border-2 border-line bg-white p-4">
        <Kicker>Mathematik · Probeprüfung</Kicker>
        <button
          type="button"
          onClick={onExam}
          className="btn3d btn3d-green mt-2 w-full rounded-xl px-3 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.04em]"
        >
          Probeprüfung · 7 блоков · 20 P · 60 мин
        </button>
        <button
          type="button"
          onClick={onMix}
          className="btn3d btn3d-white mt-2 w-full rounded-xl px-3 py-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em]"
        >
          Mix-Runde · 6 задач вперемешку
        </button>
        {last && (
          <p className="tnum mt-2 text-[11px] font-extrabold text-muted">
            последняя Probeprüfung: {last.pts}/{last.max} P
          </p>
        )}

        <div className="mt-4">
          <Kicker>Kontrolle по разделам · 8 задач из банка</Kicker>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onKontrolle(b.id)}
                className="rounded-xl border-2 border-line bg-white px-2.5 py-2 text-left transition hover:border-muted"
              >
                <span className="block text-[12px] font-extrabold">{b.de}</span>
                <span className="block text-[10px] font-semibold text-muted">{b.ru}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
