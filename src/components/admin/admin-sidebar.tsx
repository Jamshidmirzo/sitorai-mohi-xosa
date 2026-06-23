"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  Settings,
  Info,
  LogOut,
  Sparkles,
  Globe,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useAdminT } from "./admin-locale"

type Group = {
  labelKey: string
  items: { titleKey: string; url: string; icon: typeof Package }[]
}

const GROUPS: Group[] = [
  {
    labelKey: "shell.management",
    items: [{ titleKey: "nav.dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    labelKey: "groups.content",
    items: [
      { titleKey: "nav.landing", url: "/admin/landing", icon: Globe },
      { titleKey: "nav.exhibits", url: "/admin/exhibits", icon: Package },
      { titleKey: "nav.posts", url: "/admin/posts", icon: FileText },
      { titleKey: "nav.gallery", url: "/admin/gallery", icon: ImageIcon },
    ],
  },
  {
    labelKey: "groups.engagement",
    items: [
      { titleKey: "nav.surveys", url: "/admin/surveys", icon: ClipboardList },
    ],
  },
  {
    labelKey: "groups.system",
    items: [
      { titleKey: "nav.visitorInfo", url: "/admin/visitor-info", icon: Info },
      { titleKey: "nav.settings", url: "/admin/settings", icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useAdminT()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-700 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              {t("shell.title")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("shell.subtitle")}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {GROUPS.map((group) => (
          <SidebarGroup key={group.labelKey}>
            <SidebarGroupLabel className="text-[10px] tracking-widest uppercase">
              {t(group.labelKey)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={
                        item.url === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.url)
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.titleKey)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4" />
          {t("shell.signOut")}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
