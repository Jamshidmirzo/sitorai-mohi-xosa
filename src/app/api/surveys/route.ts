import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const surveys = await prisma.survey.findMany({
    include: {
      translations: true,
      exhibit: { include: { translations: true } },
      _count: { select: { questions: true, responses: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(surveys)
}

interface TranslationInput {
  locale: string
  title: string
  description?: string
}

interface OptionInput {
  order?: number
  translations: { locale: string; text: string }[]
}

interface QuestionInput {
  type: string
  order?: number
  required?: boolean
  translations: { locale: string; text: string }[]
  options?: OptionInput[]
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { translations, questions, exhibitId, active } = body

    const survey = await prisma.survey.create({
      data: {
        exhibitId: exhibitId || null,
        active: active ?? true,
        translations: {
          create: (translations || []).map((t: TranslationInput) => ({
            locale: t.locale,
            title: t.title,
            description: t.description || null,
          })),
        },
        questions: {
          create: (questions || []).map((q: QuestionInput, qi: number) => ({
            type: q.type,
            order: q.order ?? qi,
            required: q.required ?? false,
            translations: {
              create: (q.translations || []).map(
                (t: { locale: string; text: string }) => ({
                  locale: t.locale,
                  text: t.text,
                })
              ),
            },
            options: {
              create: (q.options || []).map(
                (o: OptionInput, oi: number) => ({
                  order: o.order ?? oi,
                  translations: {
                    create: (o.translations || []).map(
                      (t: { locale: string; text: string }) => ({
                        locale: t.locale,
                        text: t.text,
                      })
                    ),
                  },
                })
              ),
            },
          })),
        },
      },
      include: {
        translations: true,
        exhibit: { include: { translations: true } },
        questions: {
          include: {
            translations: true,
            options: { include: { translations: true }, orderBy: { order: "asc" } },
          },
          orderBy: { order: "asc" },
        },
        _count: { select: { questions: true, responses: true } },
      },
    })

    return Response.json(survey, { status: 201 })
  } catch (error) {
    console.error("Failed to create survey:", error)
    return Response.json({ error: "Failed to create survey" }, { status: 500 })
  }
}
