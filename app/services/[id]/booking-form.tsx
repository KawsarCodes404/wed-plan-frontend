"use client"

import Link from "next/link"
import { useState } from "react"
import { getApiToken } from "@/lib/api-token"
import { CalendarDays, CircleCheck, MapPin } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { BookingFormSkeleton } from "@/components/dashboard/loading-skeletons"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

export function BookingForm({ serviceId }: { serviceId: string }) {
  const { data: session, isPending } = useSession()
  const [eventDate, setEventDate] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const token = await getApiToken()
      if (!token)
        throw new Error(
          "Your sign-in session is missing. Please sign in again."
        )
      const response = await fetch(`${apiBase}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId, eventDate, eventLocation, message }),
      })
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.message || "We couldn't send your request.")
      setSubmitted(true)
      toast.add({
        title: result.message || "Booking request sent.",
        type: "success",
      })
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn't send your request."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="booking-panel">
      <h2>Request a Booking</h2>
      <p>
        Reserve this vendor for your wedding date and share celebration details.
      </p>
      {submitted ? (
        <div className="booking-success">
          <CircleCheck size={36} />
          <h3>Request sent</h3>
          <p>
            Your request is now pending vendor review. You can track its status
            from your customer dashboard.
          </p>
          <Link href="/dashboard/customer" className="button button-primary">
            View my bookings
          </Link>
        </div>
      ) : isPending ? (
        <BookingFormSkeleton />
      ) : session?.user?.role === "vendor" ? (
        <div className="booking-login-note">
          <p>Vendor accounts can’t send customer booking requests.</p>
        </div>
      ) : !session?.user ? (
        <div className="booking-login-note">
          <p>Sign in as a customer to send a booking request.</p>
          <Link
            className="button button-primary"
            href={`/sign-in?callbackURL=${encodeURIComponent(`/services/${serviceId}`)}`}
          >
            Sign in to continue
          </Link>
        </div>
      ) : session.user.role !== "customer" ? (
        <div className="booking-login-note">
          <p>Booking requests are available to customer accounts.</p>
        </div>
      ) : (
        <form className="booking-form" onSubmit={submit}>
          <label>
            Event Date
            <span className="input-with-icon">
              <CalendarDays size={16} />
              <input
                required
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
            </span>
          </label>
          <label>
            Event Location / Venue
            <span className="input-with-icon">
              <MapPin size={16} />
              <input
                required
                maxLength={160}
                value={eventLocation}
                onChange={(event) => setEventLocation(event.target.value)}
                placeholder="e.g. Meadowood Estate, Napa, CA"
              />
            </span>
          </label>
          <label>
            Additional Message <small>(Optional)</small>
            <textarea
              maxLength={1000}
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Guest count, timeline, or anything else to share…"
            />
          </label>
          {error && (
            <p role="alert" className="booking-error">
              {error}
            </p>
          )}
          <button
            disabled={submitting}
            className="button button-primary booking-submit"
          >
            {submitting ? "Sending request…" : "Send Booking Request"}
          </button>
        </form>
      )}
    </aside>
  )
}
