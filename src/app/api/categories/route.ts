import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const categories = await prisma.category.findMany({
    include: { translations: true },
    orderBy: { slug: "asc" },
  })

  return Response.json(categories)
}
