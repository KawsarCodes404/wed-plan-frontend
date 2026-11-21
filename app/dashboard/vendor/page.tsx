import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
    <div className="dashboard-page">
      <DashboardTitle
        title="Vendor overview"
        description="Keep your services, inquiries, and wedding calendar moving."
      />
      <StatCards
        items={[
          { label: "Total services", value: data?.serviceCount ?? "—" },
          {
            label: "Approved & active",
            value: data?.activeServices ?? "—",
            tone: "stat-green",
          },
          {
            label: "Pending requests",
            value: data?.pendingBookings ?? "—",
            tone: "stat-amber",
          },
          {
            label: "Accepted bookings",
            value: data?.acceptedBookings ?? "—",
            tone: "stat-blue",
          },
        ]}
      />
      <section className="dashboard-plan-card">
        <div>
          <span className="eyebrow">YOUR CURRENT PLAN</span>
          <h2>{data?.subscriptionPlan || "Free"} plan</h2>
          <p>
            {data?.subscriptionPlan === "Premium"
              ? "Your studio is on Premium with unlimited active listings."
              : "Free includes up to 3 active services. Upgrade when your studio is ready for more."}
          </p>
        </div>
        <div className="dashboard-actions">
          <Link
            className="button button-outline"
            href="/dashboard/vendor/add-service"
          >
            Add a service <ArrowRight size={15} />
          </Link>
          <Link
            className="button button-primary"
            href="/dashboard/vendor/subscription"
          >
            Explore plans
          </Link>
        </div>
      </section>
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span className="eyebrow">NEXT STEPS</span>
            <h2>Make your WedPlan workspace yours</h2>
          </div>
        </div>
        <div className="dashboard-shortcuts">
          <Link href="/dashboard/vendor/services">
            <strong>Review your services</strong>
            <span>
              Edit details, images, and availability. <ArrowRight size={14} />
            </span>
          </Link>
          <Link href="/dashboard/vendor/bookings">
            <strong>Respond to couples</strong>
            <span>
              Review incoming date-specific requests. <ArrowRight size={14} />
            </span>
          </Link>
          <Link href="/dashboard/vendor/settings">
            <strong>Complete your profile</strong>
            <span>
              Help couples get to know your business. <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
