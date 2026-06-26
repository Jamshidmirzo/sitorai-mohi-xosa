import { setRequestLocale } from "next-intl/server";
import { SourcesView } from "./view";


export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SourcesView />;
}
