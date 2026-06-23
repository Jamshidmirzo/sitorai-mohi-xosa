import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const LOCALES = ["en", "ru", "uz"] as const

type TranslationInput = {
  locale: string
  q: string
  options?: string[]
  answerText?: string
  explain: string
}

type QuestionInput = {
  type?: "choice" | "text"
  order?: number
  correctIndex?: number | null
  accept?: string[]
  translations?: TranslationInput[]
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    const body = (await request.json()) as QuestionInput
    const result = await prisma.$transaction(async (tx) => {
      await tx.quizQuestion.update({
        where: { id },
        data: {
          ...(body.type ? { type: body.type } : {}),
          ...(typeof body.order === "number" ? { order: body.order } : {}),
          ...(body.type === "choice"
            ? { correctIndex: body.correctIndex ?? 0, accept: [] }
            : {}),
          ...(body.type === "text"
            ? { correctIndex: null, accept: body.accept ?? [] }
            : {}),
        },
      })
      if (body.translations) {
        for (const loc of LOCALES) {
          const t = body.translations.find((x) => x.locale === loc)
          if (!t) continue
          // Force-clear the fields that don't apply to the chosen type so
          // switching choice→text leaves no orphan options behind.
          const isChoice = (body.type ?? "choice") === "choice"
          const cleanOptions = isChoice ? t.options ?? [] : []
          const cleanAnswerText = !isChoice ? t.answerText || null : null
          await tx.quizQuestionTranslation.upsert({
            where: {
              questionId_locale: { questionId: id, locale: loc },
            },
            create: {
              questionId: id,
              locale: loc,
              q: t.q,
              options: cleanOptions,
              answerText: cleanAnswerText,
              explain: t.explain,
            },
            update: {
              q: t.q,
              options: cleanOptions,
              answerText: cleanAnswerText,
              explain: t.explain,
            },
          })
        }
      }
      return tx.quizQuestion.findUnique({
        where: { id },
        include: { translations: true },
      })
    })
    return Response.json(result)
  } catch (e) {
    console.error("update quiz question failed", e)
    return Response.json({ error: "Failed to update question" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await prisma.quizQuestion.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (e) {
    console.error("delete quiz question failed", e)
    return Response.json({ error: "Failed to delete question" }, { status: 500 })
  }
}
