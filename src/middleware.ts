import createMiddleware from "next-intl/middleware"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { routing } from "@/i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Skip i18n for admin routes and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    // Protect admin routes (except login)
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (!req.auth) {
        const loginUrl = new URL("/admin/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    return NextResponse.next()
  }

  // Apply i18n middleware for public routes
  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // Match all pathnames except static files and API/internal Next.js paths
    "/((?!_next|.*\\..*).*)",
  ],
}
