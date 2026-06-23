import { ExhibitForm } from "@/components/admin/exhibit-form"

export default function NewExhibitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Exhibit</h1>
        <p className="text-muted-foreground">Create a new museum exhibit</p>
      </div>
      <ExhibitForm />
    </div>
  )
}
