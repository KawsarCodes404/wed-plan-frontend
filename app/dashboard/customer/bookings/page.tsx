import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { BookingManager } from "@/components/dashboard/booking-manager"
export default function CustomerBookingsPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="My bookings"
        description="Track every conversation with the wedding professionals you love."
      />
      <BookingManager role="customer" />
    </div>
  )
}
