import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })

    return Response.json(images)
  } catch (error) {
    console.error("Failed to fetch gallery images:", error)
    return Response.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { url, alt, category, order } = body

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 })
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        alt: alt || null,
        category: category || null,
        order: order ?? 0,
      },
    })

    return Response.json(image, { status: 201 })
  } catch (error) {
    console.error("Failed to create gallery image:", error)
    return Response.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    )
  }
}
