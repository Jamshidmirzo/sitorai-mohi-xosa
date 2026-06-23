"use client"

import { ExhibitForm } from "@/components/admin/exhibit-form"
import { useAdminT } from "@/components/admin/admin-locale"

export default function NewExhibitPage() {
  const { t } = useAdminT()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("exForm.create")}</h1>
        <p className="text-muted-foreground">{t("exForm.subtitleCreate")}</p>
      </div>
      <ExhibitForm />
    </div>
  )
}
