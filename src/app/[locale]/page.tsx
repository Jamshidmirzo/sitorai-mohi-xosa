import { setRequestLocale } from "next-intl/server";
import { Landing } from "@/components/narrative/landing";
import { fetchExhibits, fetchQuizByExhibit } from "@/lib/narrative-data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const exhibits = fetchExhibits(locale);
  const quizByExhibit = fetchQuizByExhibit(locale);
  return <Landing exhibits={exhibits} quizByExhibit={quizByExhibit} />;
}
