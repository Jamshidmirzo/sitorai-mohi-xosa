import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

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
    const { alt, category, order } = body

    const existing = await prisma.galleryImage.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Image not found" }, { status: 404 })
    }

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(alt !== undefined && { alt: alt || null }),
        ...(category !== undefined && { category: category || null }),
        ...(order !== undefined && { order }),
      },
    })

    return Response.json(image)
  } catch (error) {
    console.error("Failed to update gallery image:", error)
    return Response.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const existing = await prisma.galleryImage.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: "Image not found" }, { status: 404 })
    }

    await prisma.galleryImage.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to delete gallery image:", error)
    return Response.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    )
  }
}
