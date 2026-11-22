import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { SiteNavbar } from "@/components/side-navbar"
import { SiteFooter } from "@/app/components/SiteFooter"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteNavbar />
      <SidebarProvider className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">{children}</main>
      </SidebarProvider>
      <SiteFooter />
    </>
  )
}
