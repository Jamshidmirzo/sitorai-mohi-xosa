import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

interface AnswerInput {
  questionId: string
  optionId?: string
  textValue?: string
  ratingValue?: number
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { sessionId, locale, exhibitId, answers } = body

    if (!sessionId || !locale || !answers?.length) {
      return Response.json(
        { error: "sessionId, locale, and answers are required" },
        { status: 400 }
      )
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
      select: { id: true, active: true },
    })

    if (!survey) {
      return Response.json({ error: "Survey not found" }, { status: 404 })
    }

    if (!survey.active) {
      return Response.json({ error: "Survey is not active" }, { status: 400 })
    }

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: id,
        sessionId,
        locale,
        exhibitId: exhibitId || null,
        answers: {
          create: (answers as AnswerInput[]).map((a) => ({
            questionId: a.questionId,
            optionId: a.optionId || null,
            textValue: a.textValue || null,
            ratingValue: a.ratingValue ?? null,
          })),
        },
      },
      include: { answers: true },
    })

    return Response.json(response, { status: 201 })
  } catch (error) {
    console.error("Failed to submit survey response:", error)
    return Response.json(
      { error: "Failed to submit response" },
      { status: 500 }
    )
  }
}
