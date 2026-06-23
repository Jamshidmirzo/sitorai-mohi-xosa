import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

// Read all overrides currently in DB. Returns: [{ key, locale, value }]
export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const rows = await prisma.landingContent.findMany({
    orderBy: [{ key: "asc" }, { locale: "asc" }],
    select: { key: true, locale: true, value: true },
  })
  return Response.json(rows)
}

type Patch = { key: string; locale: string; value: string }

// Upsert a batch of overrides; empty value deletes the override (= revert to JSON).
export async function PUT(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = (await request.json()) as { patches: Patch[] }
    const patches = body.patches ?? []
    await prisma.$transaction(async (tx) => {
      for (const p of patches) {
        if (!p.value || !p.value.trim()) {
          // Empty = revert to JSON default → delete row if present.
          await tx.landingContent.deleteMany({
            where: { key: p.key, locale: p.locale },
          })
          continue
        }
        await tx.landingContent.upsert({
          where: { key_locale: { key: p.key, locale: p.locale } },
          create: { key: p.key, locale: p.locale, value: p.value },
          update: { value: p.value },
        })
      }
    })
    return Response.json({ success: true, count: patches.length })
  } catch (e) {
    console.error("PUT /api/landing failed", e)
    return Response.json({ error: "Failed to save overrides" }, { status: 500 })
  }
}
