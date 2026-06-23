import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const survey = await prisma.survey.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!survey) {
    return Response.json({ error: "Survey not found" }, { status: 404 })
  }

  const responses = await prisma.surveyResponse.findMany({
    where: { surveyId: id },
    include: {
      answers: {
        include: {
          option: { include: { translations: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(responses)
}
