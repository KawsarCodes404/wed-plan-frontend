"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarDays, MapPin } from "lucide-react"
import { useSession } from "@/lib/auth-client"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
type Booking = {
  _id: string
  status: string
  eventDate: string
  eventLocation: string
  message?: string
  service?: { serviceName?: string; price?: number }
  customer?: { name?: string; email?: string }
  vendor?: { businessName?: string; name?: string }
}

export function BookingManager({ role }: { role: "customer" | "vendor" }) {
  const { data: session } = useSession()
  const [rows, setRows] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")
  const load = useCallback(async () => {
    const token = (session as { session?: { token?: string } } | null)?.session
      ?.token
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
  }, [session, role])
  useEffect(() => {
    void load()
  }, [load])
  async function update(row: Booking, status: string) {
    const token = (session as { session?: { token?: string } } | null)?.session
      ?.token
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
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update the request.")
    } finally {
      setBusy("")
    }
  }
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <span className="eyebrow">
            {role === "vendor" ? "COUPLE INQUIRIES" : "YOUR WEDDING PLANS"}
          </span>
          <h2>{role === "vendor" ? "Booking requests" : "My bookings"}</h2>
        </div>
      </div>
      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dashboard-muted">Loading your booking requests…</p>
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
          {rows.map((row) => (
            <article className="request-card" key={row._id}>
              <div className="request-card-top">
                <div>
                  <h3>{row.service?.serviceName || "Wedding service"}</h3>
                  <span>
                    {role === "vendor"
                      ? `${row.customer?.name || "Couple"} · ${row.customer?.email || ""}`
                      : `${row.vendor?.businessName || row.vendor?.name || "Wedding vendor"}`}
                  </span>
                </div>
                <span
                  className={`status-chip status-${row.status.toLowerCase()}`}
                >
                  {row.status}
                </span>
              </div>
              <div className="request-details">
                <span>
                  <CalendarDays size={14} />
                  {row.eventDate}
                </span>
                <span>
                  <MapPin size={14} />
                  {row.eventLocation}
                </span>
                {row.service?.price !== undefined && (
                  <span>${Number(row.service.price).toLocaleString()}</span>
                )}
              </div>
              {row.message && (
                <p className="request-message">“{row.message}”</p>
              )}
              {role === "vendor" && row.status === "Pending" && (
                <div className="request-actions">
                  <button
                    disabled={busy === row._id}
                    className="button button-primary"
                    onClick={() => void update(row, "Accepted")}
                  >
                    Accept request
                  </button>
                  <button
                    disabled={busy === row._id}
                    className="button button-outline"
                    onClick={() => void update(row, "Rejected")}
                  >
                    Decline
                  </button>
                </div>
              )}
              {role === "customer" && row.status === "Pending" && (
                <div className="request-actions">
                  <button
                    disabled={busy === row._id}
                    className="button button-outline"
                    onClick={() => void update(row, "Cancelled")}
                  >
                    Cancel request
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
