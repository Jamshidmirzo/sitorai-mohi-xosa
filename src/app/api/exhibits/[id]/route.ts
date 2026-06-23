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

  const exhibit = await prisma.exhibit.findUnique({
    where: { id },
    include: {
      translations: true,
      images: { orderBy: { order: "asc" } },
      category: { include: { translations: true } },
      hall: { include: { translations: true } },
    },
  })

  if (!exhibit) {
    return Response.json({ error: "Exhibit not found" }, { status: 404 })
  }

  return Response.json(exhibit)
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
    const {
      translations,
      images,
      slug,
      categoryId,
      hallId,
      period,
      material,
      bg,
      shot,
      order,
      featured,
    } = body

    const exhibit = await prisma.$transaction(async (tx) => {
      await tx.exhibit.update({
        where: { id },
        data: {
          slug,
          categoryId: categoryId || null,
          hallId: hallId || null,
          period: period || null,
          material: material || null,
          bg: bg || null,
          shot: shot || null,
          order: typeof order === "number" ? order : 0,
          featured: featured ?? false,
        },
      })

      if (translations) {
        for (const t of translations as {
          locale: string
          name: string
          description?: string
          tag?: string
          story?: string
        }[]) {
          await tx.exhibitTranslation.upsert({
            where: { exhibitId_locale: { exhibitId: id, locale: t.locale } },
            create: {
              exhibitId: id,
              locale: t.locale,
              name: t.name,
              description: t.description || null,
              tag: t.tag || null,
              story: t.story || null,
            },
            update: {
              name: t.name,
              description: t.description || null,
              tag: t.tag || null,
              story: t.story || null,
            },
          })
        }
      }

      if (images) {
        await tx.exhibitImage.deleteMany({ where: { exhibitId: id } })
        await tx.exhibitImage.createMany({
          data: (
            images as { url: string; alt?: string; order?: number }[]
          ).map((img, i) => ({
            exhibitId: id,
            url: img.url,
            alt: img.alt || null,
            order: img.order ?? i,
          })),
        })
      }

      return tx.exhibit.findUnique({
        where: { id },
        include: {
          translations: true,
          images: { orderBy: { order: "asc" } },
          category: { include: { translations: true } },
          hall: { include: { translations: true } },
        },
      })
    })

    return Response.json(exhibit)
  } catch (error) {
    console.error("Failed to update exhibit:", error)
    return Response.json({ error: "Failed to update exhibit" }, { status: 500 })
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
    await prisma.exhibit.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete exhibit:", error)
    return Response.json({ error: "Failed to delete exhibit" }, { status: 500 })
  }
}
