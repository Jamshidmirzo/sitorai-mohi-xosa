import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { translations: true },
    })

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json(post)
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return Response.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { slug, coverImage, published, translations } = body

    if (!slug || !translations || translations.length === 0) {
      return Response.json(
        { error: "Slug and at least one translation are required" },
        { status: 400 }
      )
    }

    const post = await prisma.$transaction(async (tx) => {
      await tx.postTranslation.deleteMany({
        where: { postId: id },
      })

      return tx.post.update({
        where: { id },
        data: {
          slug,
          coverImage: coverImage || null,
          published: published ?? false,
          translations: {
            create: translations.map(
              (t: { locale: string; title: string; excerpt?: string; content?: string }) => ({
                locale: t.locale,
                title: t.title,
                excerpt: t.excerpt || null,
                content: t.content || null,
              })
            ),
          },
        },
        include: { translations: true },
      })
    })

    return Response.json(post)
  } catch (error) {
    console.error("Failed to update post:", error)
    return Response.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.post.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete post:", error)
    return Response.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
