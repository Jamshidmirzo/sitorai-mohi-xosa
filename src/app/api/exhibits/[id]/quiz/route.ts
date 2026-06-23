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
  type: "choice" | "text"
  order?: number
  correctIndex?: number | null
  accept?: string[]
  translations: TranslationInput[]
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const questions = await prisma.quizQuestion.findMany({
    where: { exhibitId: id },
    orderBy: { order: "asc" },
    include: { translations: true },
  })
  return Response.json(questions)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    const body = (await request.json()) as QuestionInput
    if (body.type !== "choice" && body.type !== "text") {
      return Response.json({ error: "Invalid type" }, { status: 400 })
    }
    const existing = await prisma.quizQuestion.count({
      where: { exhibitId: id },
    })
    const created = await prisma.quizQuestion.create({
      data: {
        exhibitId: id,
        type: body.type,
        order: typeof body.order === "number" ? body.order : existing,
        correctIndex: body.type === "choice" ? body.correctIndex ?? 0 : null,
        accept: body.type === "text" ? body.accept ?? [] : [],
        translations: {
          create: LOCALES.map((loc) => {
            const t = body.translations.find((x) => x.locale === loc)
            return {
              locale: loc,
              q: t?.q ?? "",
              options: t?.options ?? [],
              answerText: t?.answerText || null,
              explain: t?.explain ?? "",
            }
          }),
        },
      },
      include: { translations: true },
    })
    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error("create quiz question failed", e)
    return Response.json({ error: "Failed to create question" }, { status: 500 })
  }
}
