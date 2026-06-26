import { setRequestLocale } from "next-intl/server";
import { GlossaryView } from "./view";


export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GlossaryView />;
}
