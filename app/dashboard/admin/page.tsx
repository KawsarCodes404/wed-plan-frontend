import Link from "next/link"
import { ArrowRight, ClipboardCheck, CreditCard, Users } from "lucide-react"
import { dashboardApi } from "@/lib/core/dashboard-api"
import { DashboardTitle, StatCards } from "@/components/dashboard/dashboard-ui"

type Overview = {
  totalUsers: number
  vendors: number
  customers: number
  serviceCount: number
  pendingServices: number
  transactionCount: number
  revenue: number
}

export default async function AdminOverviewPage() {
  const data = await dashboardApi<Overview>("/admin/overview")
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Admin overview"
        description="Review marketplace activity and keep WedPlan running smoothly."
      />
      <StatCards
        items={[
          { label: "Total users", value: data?.totalUsers ?? "—" },
          {
            label: "Wedding vendors",
            value: data?.vendors ?? "—",
            tone: "stat-blue",
          },
          {
            label: "Customer accounts",
            value: data?.customers ?? "—",
            tone: "stat-green",
          },
          {
            label: "Service reviews",
            value: data?.pendingServices ?? "—",
            tone: "stat-amber",
          },
        ]}
      />
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span className="eyebrow">MARKETPLACE OPERATIONS</span>
            <h2>Review and manage</h2>
          </div>
        </div>
        <div className="dashboard-shortcuts">
          <Link href="/dashboard/admin/users">
            <span className="shortcut-icon">
              <Users size={18} />
            </span>
            <strong>Manage users</strong>
            <span>
              Review accounts and access. <ArrowRight size={14} />
            </span>
          </Link>
          <Link href="/dashboard/admin/services">
            <span className="shortcut-icon">
              <ClipboardCheck size={18} />
            </span>
            <strong>Review services</strong>
            <span>
              {data?.pendingServices ?? 0} waiting for approval.{" "}
              <ArrowRight size={14} />
            </span>
          </Link>
          <Link href="/dashboard/admin/transactions">
            <span className="shortcut-icon">
              <CreditCard size={18} />
            </span>
            <strong>View transactions</strong>
            <span>
              {data?.transactionCount ?? 0} subscription records.{" "}
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
