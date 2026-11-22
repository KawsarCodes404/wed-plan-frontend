import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { BookingManager } from "@/components/dashboard/booking-manager"
export default function CustomerBookingsPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="My Bookings"
        description="View all your submitted booking requests and cancel pending inquiries if plans change."
      />
      <BookingManager role="customer" />
    </div>
  )
}
