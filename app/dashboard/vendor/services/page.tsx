import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { VendorServicesManager } from "@/components/dashboard/vendor-services-manager"

export default function VendorServicesPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="My wedding services"
        description="Edit your packages, check approval status, and manage availability."
      />
      <VendorServicesManager />
    </div>
  )
}
