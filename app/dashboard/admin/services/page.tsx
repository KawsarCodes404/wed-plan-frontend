import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { AdminManager } from "@/components/dashboard/admin-manager"
export default function AdminServicesPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Manage Services"
        description="Review vendor submissions before they appear in the public marketplace."
      />
      <AdminManager kind="services" />
    </div>
  )
}
