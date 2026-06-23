import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AuthProvider } from "@/components/providers/session-provider"
import { AdminLocaleProvider } from "@/components/admin/admin-locale"
import { Toaster } from "@/components/ui/sonner"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminLocaleProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <div className="flex-1 p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors position="top-right" />
      </AdminLocaleProvider>
    </AuthProvider>
  )
}
