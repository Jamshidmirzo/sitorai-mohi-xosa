import { EditExhibitClient } from "./client"

export default async function EditExhibitPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditExhibitClient id={id} />
}
