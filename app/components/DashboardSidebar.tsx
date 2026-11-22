"use client"

import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  CalendarDays,
  Crown,
  Settings,
  Users,
  ClipboardCheck,
  CreditCard,
  Home,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Item = { name: string; url: string; icon: LucideIcon }
const menus: Record<string, Item[]> = {
  vendor: [
    { name: "Overview", url: "/dashboard/vendor", icon: LayoutDashboard },
    {
      name: "My Services",
      url: "/dashboard/vendor/services",
      icon: BriefcaseBusiness,
    },
    {
      name: "Add Service",
      url: "/dashboard/vendor/add-service",
      icon: PlusCircle,
    },
    {
      name: "Booking Requests",
      url: "/dashboard/vendor/bookings",
      icon: CalendarDays,
    },
    {
      name: "Subscription",
      url: "/dashboard/vendor/subscription",
      icon: Crown,
    },
    {
      name: "Profile Settings",
      url: "/dashboard/vendor/settings",
      icon: Settings,
    },
  ],
  customer: [
    { name: "Overview", url: "/dashboard/customer", icon: LayoutDashboard },
    {
      name: "My Bookings",
      url: "/dashboard/customer/bookings",
      icon: CalendarDays,
    },
    {
      name: "Profile Settings",
      url: "/dashboard/customer/settings",
      icon: Settings,
    },
  ],
  admin: [
    { name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
    {
      name: "Manage Services",
      url: "/dashboard/admin/services",
      icon: ClipboardCheck,
    },
    {
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      name: "Profile Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

export function DashboardSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const role = session?.user?.role || pathname.split("/")[2] || "customer"
  const title =
    role === "admin"
      ? "Admin Workspace"
      : role === "vendor"
        ? "Vendor Portal"
        : "Customer Portal"
  const items = menus[role] || menus.customer
  const accountName =
    (role === "vendor"
      ? (session?.user as { businessName?: string } | undefined)?.businessName
      : undefined) ||
    session?.user?.name ||
    "WedPlan member"
  const isPremium = session?.user?.subscriptionPlan === "Premium"

  return (
    <Sidebar collapsible="none" className="dashboard-sidebar-card">
      <SidebarHeader className="dashboard-workspace-header">
        <span className="dashboard-workspace-label">WORKSPACE</span>
        <div className="dashboard-workspace-title">
          <div>
            <strong>{title}</strong>
            <small>{accountName}</small>
          </div>
          {role === "vendor" && (
            <span
              className={`dashboard-plan-badge ${isPremium ? "premium" : ""}`}
            >
              {isPremium ? "Premium" : "Free"}
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map(({ name, url, icon: Icon }) => (
              <SidebarMenuItem key={url}>
                <SidebarMenuButton
                  isActive={pathname === url}
                  render={<Link href={url} />}
                >
                  <Icon />
                  <span>{name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />}>
              <Home />
              <span>Back to WedPlan</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
