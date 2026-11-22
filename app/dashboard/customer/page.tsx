import Link from "next/link"
import {
  CalendarDays,
  Eye,
  CircleCheck,
  CircleX,
  Clock3,
  MapPin,
  Search,
} from "lucide-react"
import { dashboardApi } from "@/lib/core/dashboard-api"
import { DashboardTitle, StatCards } from "@/components/dashboard/dashboard-ui"

type Booking = {
  _id: string
  eventDate: string
  eventLocation: string
  status: string
  createdAt?: string
  service?: {
    serviceName?: string
    price?: number
    image?: string
    images?: string[]
  }
  vendor?: { businessName?: string; name?: string }
}
type Overview = {
  total: number
  pending: number
  accepted: number
  rejected: number
  recent: Booking[]
}

function formatBookingDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function CustomerOverviewPage() {
  const data = await dashboardApi<Overview>("/customer/overview")
  return (
    <div className="dashboard-page customer-overview-page">
      <DashboardTitle
        title="Customer Overview"
        description="Track your wedding service inquiries and confirmed vendors at a glance."
      />
      <StatCards
        className="customer-overview-stat-grid"
        items={[
          {
            label: "Total Booking Requests",
            value: data?.total ?? "—",
            iconTone: "stat-rose",
            icon: <CalendarDays size={18} />,
          },
          {
            label: "Pending Bookings",
            value: data?.pending ?? "—",
            iconTone: "stat-amber",
            icon: <Clock3 size={18} />,
          },
          {
            label: "Accepted Bookings",
            value: data?.accepted ?? "—",
            iconTone: "stat-green",
            icon: <CircleCheck size={18} />,
          },
          {
            label: "Rejected Bookings",
            value: data?.rejected ?? "—",
            iconTone: "stat-rose",
            icon: <CircleX size={18} />,
          },
        ]}
      />
      <section className="dashboard-panel customer-overview-bookings">
        <div className="dashboard-panel-heading">
          <h2>Recent Booking Requests</h2>
          <div className="customer-overview-actions">
            <Link
              className="button button-outline"
              href="/dashboard/customer/bookings"
            >
              Manage All
            </Link>
            <Link className="button button-primary" href="/services">
              <Search size={14} /> Browse Services
            </Link>
          </div>
        </div>
        {data?.recent?.length ? (
          <div className="dashboard-booking-list">
            {data.recent.map((booking) => (
              <article
                className="customer-recent-booking-card"
                key={booking._id}
              >
                <div className="customer-recent-booking-thumb">
                  {booking.service?.images?.[0] || booking.service?.image ? (
                    <img
                      src={
                        booking.service?.images?.[0] ||
                        booking.service?.image ||
                        ""
                      }
                      alt=""
                    />
                  ) : (
                    <CalendarDays size={21} />
                  )}
                </div>
                <div className="customer-recent-booking-content">
                  <div className="customer-recent-booking-title-row">
                    <h3>
                      {booking.service?.serviceName || "Wedding service"}
                    </h3>
                    <span
                      className={`status-chip status-${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="customer-recent-booking-vendor">
                    {booking.vendor?.businessName ||
                      booking.vendor?.name ||
                      "Wedding vendor"}
                    {booking.service?.price !== undefined && (
                      <strong>
                        ${Number(booking.service.price).toLocaleString()}
                      </strong>
                    )}
                  </p>
                  <div className="customer-recent-booking-meta">
                    <span>
                      <CalendarDays size={14} />
                      Event {formatBookingDate(booking.eventDate)}
                    </span>
                    <span>
                      <MapPin size={14} />
                      {booking.eventLocation}
                    </span>
                    {booking.createdAt && (
                      <span className="customer-recent-booking-requested">
                        Requested {formatBookingDate(booking.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  className="customer-recent-booking-details"
                  href="/dashboard/customer/bookings"
                >
                  <Eye size={14} /> Details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="customer-empty-state">
            <h3>No booking requests yet</h3>
            <p>Explore our wedding marketplace to send your first inquiry.</p>
            <Link href="/services" className="button button-primary">
              Explore Services
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
