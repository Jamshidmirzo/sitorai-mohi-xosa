import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const posts = await prisma.post.findMany({
      include: { translations: true },
      orderBy: { createdAt: "desc" },
    })

    return Response.json(posts)
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, coverImage, published, translations } = body

    if (!slug || !translations || translations.length === 0) {
      return Response.json(
        { error: "Slug and at least one translation are required" },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
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

    return Response.json(post, { status: 201 })
  } catch (error) {
    console.error("Failed to create post:", error)
    return Response.json({ error: "Failed to create post" }, { status: 500 })
  }
}
