import { useId, useMemo } from "react";
import { compile, fmt } from "@/lib/graph";
import type { Plot } from "@/lib/ai";

/* ============================================================================
   ГРАФИК
   ----------------------------------------------------------------------------
   SVG, без библиотек. Задача — чтобы по картинке можно было ЧИТАТЬ значения:
   сетка с шагом 1/2/5·10ⁿ, оси с числами, и главное — одинаковый масштаб по
   x и y. Без одинакового масштаба наклон выглядит не таким, какой он есть,
   и «Lies die Steigung ab» превращается в угадайку.

   Высота картинки считается из диапазона данных, чтобы кадр совпадал с
   областью графика: иначе линия висит в пустой рамке и масштаб врёт на глаз.
   ========================================================================== */

const W = 400;
const PAD = 14;

/** шаг сетки из ряда 1, 2, 5, 10, 20, 50 … чтобы линий было около восьми */
function niceStep(span: number, target = 8): number {
  const raw = Math.abs(span) / target;
  if (!(raw > 0)) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

function ticks(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  const start = Math.ceil(min / step - 1e-9) * step;
  for (let v = start; v <= max + 1e-9; v += step) out.push(Math.round(v / step) * step);
  return out;
}

export default function Graph({ plot }: { plot: Plot }) {
  const uid = useId().replace(/:/g, "");
  const f = useMemo(() => compile(plot.fn), [plot.fn]);

  const g = useMemo(() => {
    let { xmin, xmax, ymin, ymax } = plot;
    if (!(xmax > xmin)) [xmin, xmax] = [xmin - 5, xmin + 5];
    if (!(ymax > ymin)) [ymin, ymax] = [ymin - 5, ymin + 5];

    /* Окно от модели бывает вытянутым (8 по x, 15 по y). При честном
       масштабе это узкая полоска, где подписи осей налезают друг на друга.
       Поэтому диапазон расширяем до разумных пропорций — показывать больше
       безвредно, ответ всё равно внутри. Масштаб остаётся одинаковым. */
    const ASPECT = 1.35;
    let dx = xmax - xmin;
    let dy = ymax - ymin;
    if (dx / dy < ASPECT) {
      const add = (dy * ASPECT - dx) / 2;
      xmin -= add;
      xmax += add;
    } else {
      const add = (dx / ASPECT - dy) / 2;
      ymin -= add;
      ymax += add;
    }
    dx = xmax - xmin;
    dy = ymax - ymin;

    const H = Math.round(W / ASPECT);
    const k = Math.min((W - 2 * PAD) / dx, (H - 2 * PAD) / dy);
    const ox = PAD + ((W - 2 * PAD) - dx * k) / 2;
    const oy = PAD + ((H - 2 * PAD) - dy * k) / 2;

    const sx = (x: number) => ox + (x - xmin) * k;
    const sy = (y: number) => H - oy - (y - ymin) * k;

    // кадр = ровно область данных
    const box = { x: sx(xmin), y: sy(ymax), w: dx * k, h: dy * k };

    // линия: рвём там, где функция не определена или ушла далеко за кадр
    let d = "";
    let pen = false;
    const N = 560;
    for (let i = 0; i <= N; i++) {
      const x = xmin + (dx * i) / N;
      const y = f ? f(x) : NaN;
      if (!Number.isFinite(y) || y < ymin - dy || y > ymax + dy) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
      pen = true;
    }

    return {
      H,
      sx,
      sy,
      box,
      d,
      xs: ticks(xmin, xmax, niceStep(dx)),
      ys: ticks(ymin, ymax, niceStep(dy)),
      hasZeroX: ymin <= 0 && ymax >= 0,
      hasZeroY: xmin <= 0 && xmax >= 0,
    };
  }, [plot, f]);

  const axisY = g.hasZeroX ? g.sy(0) : g.box.y + g.box.h;
  const axisX = g.hasZeroY ? g.sx(0) : g.box.x;

  /* Пустая рамка хуже, чем честная надпись: если функция не разобралась,
     человек должен видеть, что дело в отрисовке, а не в нём. */
  if (!f) {
    return (
      <div className="grid h-40 place-items-center rounded-lg border-2 border-dashed border-line text-[11px] font-bold text-muted">
        Graph nicht darstellbar
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${g.H}`}
      className="w-full select-none"
      role="img"
      aria-label="Graph einer Funktion"
    >
      <defs>
        <clipPath id={`c${uid}`}>
          <rect x={g.box.x} y={g.box.y} width={g.box.w} height={g.box.h} rx="3" />
        </clipPath>
      </defs>

      <rect
        x={g.box.x}
        y={g.box.y}
        width={g.box.w}
        height={g.box.h}
        rx="3"
        fill="#fcfcfb"
        stroke="#e5e5e5"
      />

      {/* сетка */}
      <g stroke="#e6e6e6" strokeWidth="1" clipPath={`url(#c${uid})`}>
        {g.xs.map((v) => (
          <line key={`gx${v}`} x1={g.sx(v)} y1={g.box.y} x2={g.sx(v)} y2={g.box.y + g.box.h} />
        ))}
        {g.ys.map((v) => (
          <line key={`gy${v}`} x1={g.box.x} y1={g.sy(v)} x2={g.box.x + g.box.w} y2={g.sy(v)} />
        ))}
      </g>

      {/* оси */}
      <g stroke="#b0b0b0" strokeWidth="1.5">
        <line x1={g.box.x} y1={axisY} x2={g.box.x + g.box.w} y2={axisY} />
        <line x1={axisX} y1={g.box.y} x2={axisX} y2={g.box.y + g.box.h} />
      </g>

      {/* подписи осей: белая обводка, чтобы читались поверх кривой */}
      <g
        fill="#8a8a8a"
        fontSize="9.5"
        fontWeight="700"
        textAnchor="middle"
        stroke="#fcfcfb"
        strokeWidth="3"
        paintOrder="stroke"
      >
        {g.xs.map((v) =>
          v === 0 ? null : (
            <text key={`tx${v}`} x={g.sx(v)} y={axisY + (g.hasZeroX ? 13 : -5)}>
              {fmt(v)}
            </text>
          ),
        )}
        {g.ys.map((v) =>
          v === 0 ? null : (
            <text
              key={`ty${v}`}
              x={axisX + (g.hasZeroY ? -6 : 8)}
              y={g.sy(v)}
              textAnchor={g.hasZeroY ? "end" : "start"}
              dominantBaseline="middle"
            >
              {fmt(v)}
            </text>
          ),
        )}
      </g>

      {/* кривая */}
      <g clipPath={`url(#c${uid})`}>
        <path
          d={g.d}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {(plot.marks ?? []).map(([mx, my], i) => (
          <circle
            key={i}
            cx={g.sx(mx)}
            cy={g.sy(my)}
            r="4.5"
            fill="#ff4b4b"
            stroke="#fff"
            strokeWidth="1.6"
          />
        ))}
      </g>
    </svg>
  );
}
