import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  CreditCard,
  Store,
  UserRound,
  Users,
} from "lucide-react"
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
    <div className="dashboard-page admin-overview-page">
      <DashboardTitle
        title="Admin Dashboard Overview"
        description="Monitor platform growth, approve vendor services, manage users, and audit Stripe transactions."
      />
      <StatCards
        className="admin-overview-stat-grid"
        items={[
          {
            label: "Total registered users",
            value: data?.totalUsers ?? "—",
            tone: "stat-rose",
            icon: <Users size={19} />,
          },
          {
            label: "Total vendors",
            value: data?.vendors ?? "—",
            tone: "stat-blue",
            icon: <Store size={19} />,
          },
          {
            label: "Total customers",
            value: data?.customers ?? "—",
            tone: "stat-green",
            icon: <UserRound size={19} />,
          },
          {
            label: "Total services",
            value: data?.serviceCount ?? "—",
            tone: "stat-cyan",
            icon: <BriefcaseBusiness size={19} />,
          },
          {
            label: "Pending services",
            value: data?.pendingServices ?? "—",
            tone: "stat-amber",
            icon: <Clock3 size={19} />,
          },
          {
            label: "Total transactions",
            value: data?.transactionCount ?? "—",
            tone: "stat-violet",
            icon: <CreditCard size={19} />,
          },
        ]}
      />
      <div className="admin-overview-panels">
        <section className="dashboard-panel admin-revenue-panel">
          <h2>
            <CheckCircle2 size={18} /> Verified Subscription Revenue
          </h2>
          <strong className="admin-revenue-total">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format((data?.revenue ?? 0) / 100)}
          </strong>
          <p>
            Calculated strictly from Stripe webhook-verified completed
            transactions.
          </p>
          <Link
            className="button button-outline"
            href="/dashboard/admin/transactions"
          >
            View transactions <ArrowRight size={14} />
          </Link>
        </section>
        <section className="dashboard-panel admin-moderation-panel">
          <h2>Quick Moderation</h2>
          <div>
            <Link
              className="button button-primary"
              href="/dashboard/admin/services"
            >
              Review Pending Services ({data?.pendingServices ?? 0})
            </Link>
            <Link
              className="button button-outline"
              href="/dashboard/admin/users"
            >
              Manage Users
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
