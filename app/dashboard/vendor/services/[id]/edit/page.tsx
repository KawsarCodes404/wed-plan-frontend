import Link from "next/link"
import { notFound } from "next/navigation"
import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { VendorServiceForm } from "@/components/dashboard/vendor-services-manager"
import { dashboardApi } from "@/lib/core/dashboard-api"

type Service = {
  _id: string
  serviceName: string
  category: string
  location: string
  price: number
  status: string
  isActive: boolean
  description: string
  images: string[]
}
export default async function EditVendorServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const rows = await dashboardApi<Service[]>("/vendor/services")
  const service = rows?.find((row) => row._id === id)
  if (!service) return notFound()
  return (
    <div className="dashboard-page">
      <Link className="back-link" href="/dashboard/vendor/services">
        ← Back to my services
      </Link>
      <DashboardTitle
        title="Edit a wedding service"
        description="Update your package details. Changes go through admin review again."
      />
      <section className="dashboard-panel vendor-service-form-panel">
        <VendorServiceForm service={service} />
      </section>
    </div>
  )
}
