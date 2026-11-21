import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { AdminManager } from "@/components/dashboard/admin-manager"
export default function AdminTransactionsPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Transactions"
        description="Review the subscription payment history recorded by Stripe."
      />
      <AdminManager kind="transactions" />
    </div>
  )
}
