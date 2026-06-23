import { EditSurveyClient } from "./client"

export default async function EditSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditSurveyClient id={id} />
}
