import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { dashboardApi } from "@/lib/core/dashboard-api"
import { DashboardTitle, StatCards } from "@/components/dashboard/dashboard-ui"

type Booking = {
  _id: string
  eventDate: string
  eventLocation: string
  status: string
  service?: { serviceName?: string; price?: number }
  vendor?: { businessName?: string; name?: string }
}
type Overview = {
  total: number
  pending: number
  accepted: number
  rejected: number
  recent: Booking[]
}

export default async function CustomerOverviewPage() {
  const data = await dashboardApi<Overview>("/customer/overview")
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Your wedding overview"
        description="A little more organized, so you can focus on what matters."
      />
      <StatCards
        items={[
          { label: "Booking requests", value: data?.total ?? "—" },
          { label: "Pending", value: data?.pending ?? "—", tone: "stat-amber" },
          {
            label: "Accepted",
            value: data?.accepted ?? "—",
            tone: "stat-green",
          },
          {
            label: "Declined",
            value: data?.rejected ?? "—",
            tone: "stat-rose",
          },
        ]}
      />
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span className="eyebrow">YOUR LATEST INQUIRIES</span>
            <h2>Recent booking requests</h2>
          </div>
          <Link className="text-link" href="/dashboard/customer/bookings">
            Manage all <ArrowRight size={15} />
          </Link>
        </div>
        {data?.recent?.length ? (
          <div className="dashboard-booking-list">
            {data.recent.map((booking) => (
              <article className="dashboard-booking-row" key={booking._id}>
                <div className="booking-date-icon">
                  <CalendarDays size={19} />
                </div>
                <div className="booking-row-main">
                  <strong>
                    {booking.service?.serviceName || "Wedding service"}
                  </strong>
                  <span>
                    {booking.vendor?.businessName ||
                      booking.vendor?.name ||
                      "Vendor"}
                  </span>
                </div>
                <div className="booking-row-meta">
                  <span>
                    <CalendarDays size={14} />
                    {booking.eventDate}
                  </span>
                  <span>
                    <MapPin size={14} />
                    {booking.eventLocation}
                  </span>
                </div>
                <span
                  className={`status-chip status-${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <span className="empty-heart">
              <CalendarDays size={19} />
            </span>
            <h3>No booking requests yet</h3>
            <p>Find a vendor you love and send them a note about your day.</p>
            <Link href="/services" className="button button-primary">
              Browse services
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
