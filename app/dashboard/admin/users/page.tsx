import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { AdminManager } from "@/components/dashboard/admin-manager"
export default function AdminUsersPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="User accounts"
        description="Review marketplace members and protect the WedPlan community."
      />
      <AdminManager kind="users" />
    </div>
  )
}
