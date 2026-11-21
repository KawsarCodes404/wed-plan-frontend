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
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    {
      name: "Service Reviews",
      url: "/dashboard/admin/services",
      icon: ClipboardCheck,
    },
    {
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: CreditCard,
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

  return (
    <Sidebar className="border-r border-[#e9e2dd] bg-[#fffefd] text-[#342d2b]">
      <SidebarHeader>
        <Link href="/" className="dashboard-brand">
          <span className="brand-mark">
            <HeartIcon />
          </span>
          <span>
            <strong>WedPlan</strong>
            <small>{title}</small>
          </span>
        </Link>
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

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}
