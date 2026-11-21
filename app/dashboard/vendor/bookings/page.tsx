import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { BookingManager } from "@/components/dashboard/booking-manager"
export default function VendorBookingsPage() {
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Booking requests"
        description="Review incoming wedding inquiries from couples. Pending requests can be accepted or declined once."
      />
      <BookingManager role="vendor" />
    </div>
  )
}
