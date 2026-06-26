import { setRequestLocale } from "next-intl/server";
import { MastersView } from "./view";


export default async function MastersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MastersView />;
}
