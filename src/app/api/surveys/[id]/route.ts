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
    include: {
      translations: true,
      exhibit: { include: { translations: true } },
      questions: {
        include: {
          translations: true,
          options: {
            include: { translations: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { responses: true } },
    },
  })

  if (!survey) {
    return Response.json({ error: "Survey not found" }, { status: 404 })
  }

  return Response.json(survey)
}

interface TranslationInput {
  locale: string
  title: string
  description?: string
}

interface OptionInput {
  id?: string
  order?: number
  translations: { locale: string; text: string }[]
}

interface QuestionInput {
  id?: string
  type: string
  order?: number
  required?: boolean
  translations: { locale: string; text: string }[]
  options?: OptionInput[]
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const { translations, questions, exhibitId, active } = body

    const survey = await prisma.$transaction(async (tx) => {
      await tx.survey.update({
        where: { id },
        data: {
          exhibitId: exhibitId || null,
          active: active ?? true,
        },
      })

      if (translations) {
        for (const t of translations as TranslationInput[]) {
          await tx.surveyTranslation.upsert({
            where: { surveyId_locale: { surveyId: id, locale: t.locale } },
            create: {
              surveyId: id,
              locale: t.locale,
              title: t.title,
              description: t.description || null,
            },
            update: {
              title: t.title,
              description: t.description || null,
            },
          })
        }
      }

      if (questions) {
        const incomingQuestionIds = (questions as QuestionInput[])
          .filter((q) => q.id)
          .map((q) => q.id!)

        const existingQuestions = await tx.surveyQuestion.findMany({
          where: { surveyId: id },
          select: { id: true },
        })

        const questionsToDelete = existingQuestions
          .filter((eq) => !incomingQuestionIds.includes(eq.id))
          .map((eq) => eq.id)

        if (questionsToDelete.length > 0) {
          await tx.surveyQuestion.deleteMany({
            where: { id: { in: questionsToDelete } },
          })
        }

        for (const [qi, q] of (questions as QuestionInput[]).entries()) {
          if (q.id) {
            await tx.surveyQuestion.update({
              where: { id: q.id },
              data: {
                type: q.type,
                order: q.order ?? qi,
                required: q.required ?? false,
              },
            })

            for (const t of q.translations) {
              await tx.questionTranslation.upsert({
                where: {
                  questionId_locale: { questionId: q.id, locale: t.locale },
                },
                create: {
                  questionId: q.id,
                  locale: t.locale,
                  text: t.text,
                },
                update: { text: t.text },
              })
            }

            if (q.options) {
              const incomingOptionIds = q.options
                .filter((o) => o.id)
                .map((o) => o.id!)

              const existingOptions = await tx.questionOption.findMany({
                where: { questionId: q.id },
                select: { id: true },
              })

              const optionsToDelete = existingOptions
                .filter((eo) => !incomingOptionIds.includes(eo.id))
                .map((eo) => eo.id)

              if (optionsToDelete.length > 0) {
                await tx.questionOption.deleteMany({
                  where: { id: { in: optionsToDelete } },
                })
              }

              for (const [oi, o] of q.options.entries()) {
                if (o.id) {
                  await tx.questionOption.update({
                    where: { id: o.id },
                    data: { order: o.order ?? oi },
                  })

                  for (const t of o.translations) {
                    await tx.optionTranslation.upsert({
                      where: {
                        optionId_locale: { optionId: o.id, locale: t.locale },
                      },
                      create: {
                        optionId: o.id,
                        locale: t.locale,
                        text: t.text,
                      },
                      update: { text: t.text },
                    })
                  }
                } else {
                  await tx.questionOption.create({
                    data: {
                      questionId: q.id,
                      order: o.order ?? oi,
                      translations: {
                        create: o.translations.map((t) => ({
                          locale: t.locale,
                          text: t.text,
                        })),
                      },
                    },
                  })
                }
              }
            }
          } else {
            await tx.surveyQuestion.create({
              data: {
                surveyId: id,
                type: q.type,
                order: q.order ?? qi,
                required: q.required ?? false,
                translations: {
                  create: q.translations.map((t) => ({
                    locale: t.locale,
                    text: t.text,
                  })),
                },
                options: {
                  create: (q.options || []).map((o, oi) => ({
                    order: o.order ?? oi,
                    translations: {
                      create: o.translations.map((t) => ({
                        locale: t.locale,
                        text: t.text,
                      })),
                    },
                  })),
                },
              },
            })
          }
        }
      }

      return tx.survey.findUnique({
        where: { id },
        include: {
          translations: true,
          exhibit: { include: { translations: true } },
          questions: {
            include: {
              translations: true,
              options: {
                include: { translations: true },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          _count: { select: { responses: true } },
        },
      })
    })

    return Response.json(survey)
  } catch (error) {
    console.error("Failed to update survey:", error)
    return Response.json({ error: "Failed to update survey" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    await prisma.survey.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete survey:", error)
    return Response.json({ error: "Failed to delete survey" }, { status: 500 })
  }
}
