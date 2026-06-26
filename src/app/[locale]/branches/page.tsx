import { setRequestLocale } from "next-intl/server";
import { BranchesView } from "./view";


export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BranchesView />;
}
