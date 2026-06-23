import { SurveyForm } from "@/components/admin/survey-form"

export default function NewSurveyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Survey</h1>
        <p className="text-muted-foreground">Create a new visitor survey</p>
      </div>
      <SurveyForm />
    </div>
  )
}
