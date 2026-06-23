import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const records = await prisma.visitorInfo.findMany()
    return Response.json(records)
  } catch (error) {
    console.error("Failed to fetch visitor info:", error)
    return Response.json({ error: "Failed to fetch visitor info" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { locale, hours, ticketPrices, address, phone, email, mapEmbedUrl } = body

    if (!locale) {
      return Response.json({ error: "Locale is required" }, { status: 400 })
    }

    const data = { hours, ticketPrices, address, phone, email, mapEmbedUrl }

    const record = await prisma.visitorInfo.upsert({
      where: { locale },
      update: data,
      create: { locale, ...data },
    })

    return Response.json(record)
  } catch (error) {
    console.error("Failed to update visitor info:", error)
    return Response.json({ error: "Failed to update visitor info" }, { status: 500 })
  }
}
