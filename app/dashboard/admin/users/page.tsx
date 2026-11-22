import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { AdminManager } from "@/components/dashboard/admin-manager"
export default function AdminUsersPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Manage Users"
        description="Search registered users, filter by role, inspect details, and manage account access."
      />
      <AdminManager kind="users" />
    </div>
  )
}
