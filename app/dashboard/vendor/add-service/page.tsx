import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { VendorServiceForm } from "@/components/dashboard/vendor-services-manager"

export default function AddServicePage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Add New Wedding Service"
        description="Publish a new wedding package. Submissions start as Pending until reviewed by an administrator."
      />
      <section className="dashboard-panel vendor-service-form-panel">
        <VendorServiceForm />
      </section>
    </div>
  )
}
