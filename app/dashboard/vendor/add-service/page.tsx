import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { VendorServiceForm } from "@/components/dashboard/vendor-services-manager"

export default function AddServicePage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Add a wedding service"
        description="Share a clear package, location, and a few beautiful images."
      />
      <section className="dashboard-panel">
        <VendorServiceForm />
      </section>
    </div>
  )
}
