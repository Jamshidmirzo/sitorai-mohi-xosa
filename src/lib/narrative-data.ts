import "server-only";
import { prisma } from "@/lib/prisma";
import type { Exhibit, QuizQuestion } from "@/lib/narrative-types";

export type { Exhibit, QuizQuestion } from "@/lib/narrative-types";
export { QUIZ_TOTAL_SECONDS } from "@/lib/narrative-types";

void ([] as Exhibit[]);
void ([] as QuizQuestion[]);

const FALLBACK_LOCALE = "en";

function pickTranslation<T extends { locale: string }>(
  list: T[],
  locale: string,
): T | undefined {
  return (
    list.find((t) => t.locale === locale) ??
    list.find((t) => t.locale === FALLBACK_LOCALE) ??
    list[0]
  );
}

/// Like pickTranslation, but prefers a row whose `pickField` is non-empty —
/// so a question whose RU translation is empty falls through to EN/UZ.
function pickFilledTranslation<T extends { locale: string }>(
  list: T[],
  locale: string,
  pickField: (row: T) => string | null | undefined,
): T | undefined {
  const isFilled = (row: T) => (pickField(row) ?? "").trim().length > 0;
  return (
    list.find((t) => t.locale === locale && isFilled(t)) ??
    list.find((t) => t.locale === FALLBACK_LOCALE && isFilled(t)) ??
    list.find(isFilled) ??
    pickTranslation(list, locale)
  );
}

export async function fetchExhibits(locale: string): Promise<Exhibit[]> {
  const rows = await prisma.exhibit.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: true,
      hall: { include: { translations: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });
  return rows.map((row) => {
    const tr = pickFilledTranslation(row.translations, locale, (t) => t.name);
    const hallTr = row.hall
      ? pickFilledTranslation(row.hall.translations, locale, (t) => t.name)
      : undefined;
    return {
      id: row.id,
      slug: row.slug,
      tag: tr?.tag ?? "",
      name: tr?.name ?? row.slug,
      period: row.period ?? "",
      material: row.material ?? "",
      hall: hallTr?.name ?? "",
      bg: row.bg ?? "linear-gradient(155deg,#3a3322,#241f14 70%,#15120b)",
      shot: row.shot ?? "",
      story: tr?.story ?? tr?.description ?? "",
      image: row.images[0]?.url ?? null,
    };
  });
}

export async function fetchQuizByExhibit(
  locale: string,
): Promise<Record<string, QuizQuestion[]>> {
  const rows = await prisma.quizQuestion.findMany({
    orderBy: [{ exhibitId: "asc" }, { order: "asc" }],
    include: { translations: true },
  });
  const map: Record<string, QuizQuestion[]> = {};
  for (const row of rows) {
    const tr = pickFilledTranslation(row.translations, locale, (t) => t.q);
    // Skip the question entirely if it has no question text in any language.
    if (!tr || !tr.q.trim()) continue;
    const list = (map[row.exhibitId] ??= []);
    if (row.type === "choice") {
      list.push({
        id: row.id,
        type: "choice",
        q: tr.q,
        options: tr.options,
        answer: row.correctIndex ?? 0,
        explain: tr.explain,
      });
    } else {
      list.push({
        id: row.id,
        type: "text",
        q: tr.q,
        accept: row.accept,
        answer: tr.answerText ?? "",
        explain: tr.explain,
      });
    }
  }
  return map;
}
