/* ============================================================================
   ТЕОРИЯ B2–C1
   ----------------------------------------------------------------------------
   Третий файл теории (после theory.ts — экзаменационное ядро — и theory2.ts —
   A1…B1). B2 и C1 в разделе Grammatik экзамена не участвуют, поэтому их
   теория живёт отдельно: читают её реже, а файл ядра не должен разбухать.

   Содержимое принадлежит шести словарям-фрагментам (b2verb/b2satz/b2wort/
   b2praep/c1a/c1b) — там же лежат и кадры с генераторами тех же тем: теория
   и упражнения одной темы написаны в одном месте и вычитаны вместе.
   ========================================================================== */

import type { Theory } from "@/lib/de/theory";
import { THEORY_B2_VERB } from "@/lib/de/b2verb";
import { THEORY_B2_SATZ } from "@/lib/de/b2satz";
import { THEORY_B2_WORT } from "@/lib/de/b2wort";
import { THEORY_B2_PRAEP } from "@/lib/de/b2praep";
import { THEORY_C1_A } from "@/lib/de/c1a";
import { THEORY_C1_B } from "@/lib/de/c1b";
/* a2-nebensatz: теорию для него пропустили в theory2, а это база задания 3.4 —
   дополнили вместе с кадрами A2 (a2.ts), сюда включаем, чтобы спред был один. */
import { THEORY_A2_EXTRA } from "@/lib/de/a2";

export const THEORY_B2C1: Record<string, Theory> = {
  ...THEORY_B2_VERB,
  ...THEORY_B2_SATZ,
  ...THEORY_B2_WORT,
  ...THEORY_B2_PRAEP,
  ...THEORY_C1_A,
  ...THEORY_C1_B,
  ...THEORY_A2_EXTRA,
};
