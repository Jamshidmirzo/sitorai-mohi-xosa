import QRCode from "qrcode"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const exhibit = await prisma.exhibit.findUnique({
    where: { id },
    select: { slug: true },
  })

  if (!exhibit) return Response.json({ error: "Not found" }, { status: 404 })

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const exhibitUrl = `${baseUrl}/en/exhibits/${exhibit.slug}`

  // Check if SVG format requested
  const url = new URL(request.url)
  const format = url.searchParams.get("format") || "png"

  if (format === "svg") {
    const svg = await QRCode.toString(exhibitUrl, {
      type: "svg",
      margin: 2,
      width: 300,
    })
    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    })
  }

  // Return PNG as data URL in JSON
  const dataUrl = await QRCode.toDataURL(exhibitUrl, {
    margin: 2,
    width: 300,
    color: { dark: "#000000", light: "#ffffff" },
  })
  return Response.json({ qrCode: dataUrl, url: exhibitUrl })
}
