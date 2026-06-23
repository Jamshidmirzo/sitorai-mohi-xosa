"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AdminLanguageSwitcher, useAdminT } from "./admin-locale"

const NAV_LABEL_KEYS: Record<string, string> = {
  admin: "nav.dashboard",
  exhibits: "nav.exhibits",
  posts: "nav.posts",
  gallery: "nav.gallery",
  surveys: "nav.surveys",
  "visitor-info": "nav.visitorInfo",
  settings: "nav.settings",
  quiz: "nav.quiz",
}

export function AdminHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t } = useAdminT()

  const segments = pathname.split("/").filter(Boolean)

  const labelFor = (segment: string) => {
    if (NAV_LABEL_KEYS[segment]) return t(NAV_LABEL_KEYS[segment])
    return segment.replace(/-/g, " ")
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">{t("nav.dashboard")}</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.slice(1).map((segment, index) => (
            <span key={`${segment}-${index}`} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === segments.length - 2 ? (
                  <BreadcrumbPage className="capitalize">
                    {labelFor(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/${segments.slice(0, index + 2).join("/")}`}
                    className="capitalize"
                  >
                    {labelFor(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <AdminLanguageSwitcher />
        <ThemeToggle />
        {session?.user && (
          <span className="hidden sm:inline-block text-sm text-muted-foreground">
            {session.user.name || session.user.email}
          </span>
        )}
      </div>
    </header>
  )
}
