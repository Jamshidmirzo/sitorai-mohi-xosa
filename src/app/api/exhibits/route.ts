import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")

  const exhibits = await prisma.exhibit.findMany({
    where: search
      ? {
          translations: {
            some: {
              locale: "en",
              name: { contains: search, mode: "insensitive" },
            },
          },
        }
      : undefined,
    include: {
      translations: true,
      images: { orderBy: { order: "asc" } },
      category: { include: { translations: true } },
      hall: { include: { translations: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(exhibits)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { translations, images, slug, categoryId, hallId, period, material, featured } = body

    const enTranslation = translations?.find(
      (t: { locale: string }) => t.locale === "en"
    )
    const finalSlug = slug || slugify(enTranslation?.name || "exhibit")

    const exhibit = await prisma.exhibit.create({
      data: {
        slug: finalSlug,
        categoryId: categoryId || null,
        hallId: hallId || null,
        period: period || null,
        material: material || null,
        featured: featured ?? false,
        translations: {
          create: (translations || []).map(
            (t: { locale: string; name: string; description?: string }) => ({
              locale: t.locale,
              name: t.name,
              description: t.description || null,
            })
          ),
        },
        images: {
          create: (images || []).map(
            (img: { url: string; alt?: string; order?: number }, i: number) => ({
              url: img.url,
              alt: img.alt || null,
              order: img.order ?? i,
            })
          ),
        },
      },
      include: {
        translations: true,
        images: { orderBy: { order: "asc" } },
        category: { include: { translations: true } },
        hall: { include: { translations: true } },
      },
    })

    return Response.json(exhibit, { status: 201 })
  } catch (error) {
    console.error("Failed to create exhibit:", error)
    return Response.json({ error: "Failed to create exhibit" }, { status: 500 })
  }
}
