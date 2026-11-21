import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { SiteNavbar } from "@/components/side-navbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteNavbar />
      <SidebarProvider>
        <DashboardSidebar />
        <main className="min-w-0 flex-1">
          <SidebarTrigger />
          {children}
        </main>
        <Toaster />
      </SidebarProvider>
    </>
  )
}
