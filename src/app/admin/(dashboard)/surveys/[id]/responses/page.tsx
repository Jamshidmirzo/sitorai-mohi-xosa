import { ResponsesClient } from "./client"

export default async function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ResponsesClient surveyId={id} />
}
