"use client"

import { useState } from "react"
import { BadgeCheck, Check, Crown } from "lucide-react"
import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { useSession } from "@/lib/auth-client"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
export default function VendorSubscriptionPage() {
  const { data: session } = useSession()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const role = session?.user as
    { role?: string; subscriptionPlan?: string } | undefined
  async function upgrade() {
    const token = (session as { session?: { token?: string } } | null)?.session
      ?.token
    if (!token) {
      setError("Your session expired. Sign in again.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const response = await fetch(`${apiBase}/payments/checkout-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await response.json()
      if (!response.ok || !result.url)
        throw new Error(result.message || "Checkout is currently unavailable.")
      window.location.assign(result.url)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Checkout is currently unavailable."
      )
      setBusy(false)
    }
  }
  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="A plan that fits your studio"
        description="Start free, then grow your listings when the time is right."
      />
      <div className="plan-cards">
        <article className="plan-card">
          <span className="eyebrow">A LOVELY PLACE TO BEGIN</span>
          <h2>Free</h2>
          <p className="plan-price">
            $0 <small>/ forever</small>
          </p>
          <p>Everything you need to introduce your work to couples.</p>
          <ul>
            <li>
              <Check size={15} /> Up to 3 active services
            </li>
            <li>
              <Check size={15} /> Booking request management
            </li>
            <li>
              <Check size={15} /> Vendor profile and settings
            </li>
          </ul>
          <span className="plan-current">
            {role?.subscriptionPlan === "Premium"
              ? "Available plan"
              : "Your current plan"}
          </span>
        </article>
        <article className="plan-card plan-card-premium">
          <span className="premium-ribbon">
            <Crown size={14} /> WEDPLAN PREMIUM
          </span>
          <h2>Premium</h2>
          <p className="plan-price">
            $29 <small>/ month</small>
          </p>
          <p>
            More room to show the range and care you bring to every celebration.
          </p>
          <ul>
            <li>
              <Check size={15} /> Unlimited active services
            </li>
            <li>
              <Check size={15} /> Premium vendor badge
            </li>
            <li>
              <Check size={15} /> Priority placement in discovery
            </li>
          </ul>
          {role?.subscriptionPlan === "Premium" ? (
            <span className="plan-current premium-active">
              <BadgeCheck size={15} /> Premium is active
            </span>
          ) : (
            <button
              className="button button-primary"
              disabled={busy}
              onClick={() => void upgrade()}
            >
              {busy
                ? "Opening secure checkout…"
                : "Upgrade securely with Stripe"}
            </button>
          )}
        </article>
      </div>
      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}
    </div>
  )
}
