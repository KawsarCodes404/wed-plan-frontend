import Link from "next/link"
import {
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Crown,
  PlusCircle,
} from "lucide-react"
import { dashboardApi } from "@/lib/core/dashboard-api"
import { DashboardTitle, StatCards } from "@/components/dashboard/dashboard-ui"

type Overview = {
  serviceCount: number
  activeServices: number
  pendingBookings: number
  acceptedBookings: number
  subscriptionPlan: string
}

export default async function VendorOverviewPage() {
  const data = await dashboardApi<Overview>("/vendor/overview")
  return (
    <div className="dashboard-page vendor-overview-page">
      <DashboardTitle
        title="Vendor Dashboard Overview"
        description="Monitor your published wedding services, incoming couple requests, and subscription status."
      />
      <StatCards
        className="vendor-overview-stat-grid"
        items={[
          {
            label: "Total Services",
            value: data?.serviceCount ?? "—",
            iconTone: "stat-rose",
            icon: <BriefcaseBusiness size={19} />,
          },
          {
            label: "Approved & Active",
            value: data?.activeServices ?? "—",
            iconTone: "stat-green",
            icon: <CheckCircle2 size={19} />,
          },
          {
            label: "Pending Requests",
            value: data?.pendingBookings ?? "—",
            iconTone: "stat-amber",
            icon: <Clock3 size={19} />,
          },
          {
            label: "Accepted Bookings",
            value: data?.acceptedBookings ?? "—",
            iconTone: "stat-blue",
            icon: <CalendarCheck size={19} />,
          },
        ]}
      />
      <section
        className={`dashboard-plan-card vendor-overview-plan ${data?.subscriptionPlan === "Premium" ? "premium" : "free"}`}
      >
        <div className="vendor-plan-copy">
          <h2>
            <Crown size={18} /> Current Subscription Plan
            <span className="vendor-plan-badge">
              {data?.subscriptionPlan || "Free"} Plan
            </span>
          </h2>
          <p>
            {data?.subscriptionPlan === "Premium"
              ? "Your studio is on Premium with unlimited active wedding services."
              : "Free Plan allows up to 3 active wedding services. Upgrade to Premium for unlimited services."}
          </p>
        </div>
        <div className="dashboard-actions">
          <Link
            className="button button-outline"
            href="/dashboard/vendor/add-service"
          >
            <PlusCircle size={15} /> Add Service
          </Link>
          <Link
            className="button button-primary"
            href="/dashboard/vendor/subscription"
          >
            {data?.subscriptionPlan === "Premium"
              ? "Manage Subscription"
              : "Upgrade to Premium"}
          </Link>
        </div>
      </section>
    </div>
  )
}
