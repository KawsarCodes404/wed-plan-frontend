"use client"

import { useCallback, useEffect, useState } from "react"
import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  Mail,
  MapPin,
  UserRound,
  X,
} from "lucide-react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { BookingListSkeleton } from "@/components/dashboard/loading-skeletons"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
type Booking = {
  _id: string
  status: string
  eventDate: string
  eventLocation: string
  message?: string
  createdAt?: string
  service?: {
    serviceName?: string
    price?: number
    image?: string
    images?: string[]
  }
  customer?: { name?: string; email?: string }
  vendor?: { businessName?: string; name?: string }
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

export function BookingManager({ role }: { role: "customer" | "vendor" }) {
  const { data: session, isPending } = useSession()
  const [rows, setRows] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")
  const [expandedBooking, setExpandedBooking] = useState("")
  const load = useCallback(async () => {
    if (isPending) return
    const token = await getApiToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const response = await fetch(`${apiBase}/${role}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = await response.json()
      if (!response.ok)
        throw new Error(payload.message || "Unable to load booking requests.")
      setRows(payload)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load bookings.")
    } finally {
      setLoading(false)
    }
  }, [isPending, session, role])
  useEffect(() => {
    void load()
  }, [load])
  async function update(row: Booking, status: string) {
    const token = await getApiToken()
    if (!token) return
    setBusy(row._id)
    setError("")
    try {
      const url =
        role === "vendor"
          ? `${apiBase}/vendor/bookings/${row._id}/status`
          : `${apiBase}/customer/bookings/${row._id}/cancel`
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: role === "vendor" ? JSON.stringify({ status }) : undefined,
      })
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.message || "Unable to update this request.")
      toast.add({
        title: result.message || "Booking request updated.",
        type: "success",
      })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update the request.")
    } finally {
      setBusy("")
    }
  }
  return (
    <section
      className={
        role === "customer"
          ? "customer-bookings-manager"
          : "vendor-bookings-manager"
      }
    >
      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}
      {loading || isPending ? (
        <BookingListSkeleton role={role} />
      ) : !rows.length ? (
        <div className="dashboard-empty">
          <span className="empty-heart">
            <CalendarDays size={19} />
          </span>
          <h3>{role === "vendor" ? "No requests yet" : "No bookings yet"}</h3>
          <p>
            {role === "vendor"
              ? "New couple inquiries will show up here."
              : "Browse wedding services and send your first inquiry."}
          </p>
        </div>
      ) : (
        <div className="dashboard-booking-list">
          {rows.map((row) =>
            role === "customer" ? (
              <article className="customer-booking-card" key={row._id}>
                <div className="customer-booking-image">
                  {row.service?.images?.[0] || row.service?.image ? (
                    <img
                      src={row.service?.images?.[0] || row.service?.image || ""}
                      alt=""
                    />
                  ) : (
                    <CalendarDays size={22} />
                  )}
                </div>
                <div className="customer-booking-content">
                  <div className="customer-booking-heading">
                    <h3>{row.service?.serviceName || "Wedding service"}</h3>
                    <span
                      className={`status-chip status-${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="customer-booking-vendor">
                    Vendor:{" "}
                    {row.vendor?.businessName ||
                      row.vendor?.name ||
                      "Wedding vendor"}
                    {row.service?.price !== undefined && (
                      <> · ${Number(row.service.price).toLocaleString()}</>
                    )}
                  </p>
                  <div className="customer-booking-meta">
                    <span>
                      <CalendarDays size={14} /> Event:{" "}
                      {formatBookingDate(row.eventDate)}
                    </span>
                    <span>
                      <MapPin size={14} /> {row.eventLocation}
                    </span>
                    {row.createdAt && (
                      <span>Requested: {formatBookingDate(row.createdAt)}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="customer-booking-details-button"
                  aria-expanded={expandedBooking === row._id}
                  aria-controls={`booking-details-${row._id}`}
                  onClick={() =>
                    setExpandedBooking((current) =>
                      current === row._id ? "" : row._id
                    )
                  }
                >
                  <Eye size={14} />
                  {expandedBooking === row._id ? "Hide details" : "Details"}
                </button>
                {expandedBooking === row._id && (
                  <section
                    id={`booking-details-${row._id}`}
                    className="customer-booking-extra"
                    aria-label="Booking details"
                  >
                    <div className="customer-booking-extra-heading">
                      <div>
                        <span className="eyebrow">REQUEST SUMMARY</span>
                        <h4>Booking details</h4>
                      </div>
                      <span className="customer-booking-reference">
                        Request #{row._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="customer-booking-detail-grid">
                      <div>
                        <span>
                          <CalendarDays size={14} /> Event date
                        </span>
                        <strong>{formatBookingDate(row.eventDate)}</strong>
                      </div>
                      <div>
                        <span>
                          <MapPin size={14} /> Event location
                        </span>
                        <strong>{row.eventLocation}</strong>
                      </div>
                      <div>
                        <span>
                          <UserRound size={14} /> Vendor
                        </span>
                        <strong>
                          {row.vendor?.businessName ||
                            row.vendor?.name ||
                            "Wedding vendor"}
                        </strong>
                      </div>
                      <div>
                        <span>
                          <Clock3 size={14} /> Requested on
                        </span>
                        <strong>
                          {row.createdAt
                            ? formatBookingDate(row.createdAt)
                            : "Date unavailable"}
                        </strong>
                      </div>
                    </div>
                    <div className="customer-booking-message">
                      <strong>Your message</strong>
                      <p>
                        {row.message ||
                          "No additional message was added to this request."}
                      </p>
                    </div>
                    {row.status === "Pending" && (
                      <div className="customer-booking-extra-actions">
                        <button
                          disabled={busy === row._id}
                          className="button button-outline"
                          onClick={() => void update(row, "Cancelled")}
                        >
                          {busy === row._id ? "Cancelling…" : "Cancel request"}
                        </button>
                      </div>
                    )}
                  </section>
                )}
              </article>
            ) : (
              <article className="request-card" key={row._id}>
                <div className="request-card-heading">
                  <div className="request-card-title-group">
                    <h3>{row.service?.serviceName || "Wedding service"}</h3>
                    <span
                      className={`status-chip status-${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>
                    {row.service?.price !== undefined && (
                      <span className="request-price">
                        ${Number(row.service.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {role === "vendor" && row.status === "Pending" && (
                    <div className="request-actions">
                      <button
                        disabled={busy === row._id}
                        className="button request-accept-button"
                        onClick={() => void update(row, "Accepted")}
                      >
                        <Check size={15} />
                        {busy === row._id ? "Saving…" : "Accept"}
                      </button>
                      <button
                        disabled={busy === row._id}
                        className="button request-reject-button"
                        onClick={() => void update(row, "Rejected")}
                      >
                        <X size={15} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                <div className="request-details">
                  <span>
                    <UserRound size={14} />
                    {row.customer?.name || "Couple"}
                  </span>
                  {row.customer?.email && (
                    <span>
                      <Mail size={14} />
                      {row.customer.email}
                    </span>
                  )}
                  <span>
                    <CalendarDays size={14} />
                    Event Date: {formatBookingDate(row.eventDate)}
                  </span>
                  <span>
                    <MapPin size={14} />
                    {row.eventLocation}
                  </span>
                </div>
                {row.message && (
                  <p className="request-message">
                    <strong>Couple&apos;s Note:</strong>
                    <span>{row.message}</span>
                  </p>
                )}
              </article>
            )
          )}
        </div>
      )}
    </section>
  )
}
