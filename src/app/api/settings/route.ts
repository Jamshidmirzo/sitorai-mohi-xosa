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
    const records = await prisma.siteSettings.findMany()
    return Response.json(records)
  } catch (error) {
    console.error("Failed to fetch site settings:", error)
    return Response.json({ error: "Failed to fetch site settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { locale, siteName, siteDescription, heroTitle, heroSubtitle, heroImage, aboutText } = body

    if (!locale) {
      return Response.json({ error: "Locale is required" }, { status: 400 })
    }

    const data = { siteName, siteDescription, heroTitle, heroSubtitle, heroImage, aboutText }

    const record = await prisma.siteSettings.upsert({
      where: { locale },
      update: data,
      create: { locale, ...data },
    })

    return Response.json(record)
  } catch (error) {
    console.error("Failed to update site settings:", error)
    return Response.json({ error: "Failed to update site settings" }, { status: 500 })
  }
}
