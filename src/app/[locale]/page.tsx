import { setRequestLocale } from "next-intl/server";
import { Landing } from "@/components/narrative/landing";
import { fetchExhibits, fetchQuizByExhibit } from "@/lib/narrative-data";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [exhibits, quizByExhibit] = await Promise.all([
    fetchExhibits(locale),
    fetchQuizByExhibit(locale),
  ]);
  return <Landing exhibits={exhibits} quizByExhibit={quizByExhibit} />;
}
