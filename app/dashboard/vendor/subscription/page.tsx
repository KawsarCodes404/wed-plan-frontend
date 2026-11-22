"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BadgeCheck, Check, Crown } from "lucide-react"
import { DashboardTitle } from "@/components/dashboard/dashboard-ui"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"
import { SubscriptionContentSkeleton } from "@/components/dashboard/loading-skeletons"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

type Overview = { activeServices: number; subscriptionPlan: string }
type Transaction = {
  _id: string
  plan: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

function formatAmount(amount: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export default function VendorSubscriptionPage() {
  const { data: session, isPending } = useSession()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const role = session?.user as
    { role?: string; subscriptionPlan?: string } | undefined
  const currentPlan =
    overview?.subscriptionPlan || role?.subscriptionPlan || "Free"

  useEffect(() => {
    if (isPending) return
    async function loadSubscription() {
      try {
        const token = await getApiToken()
        if (!token) {
          setLoading(false)
          return
        }
        const headers = { Authorization: `Bearer ${token}` }
        const [overviewResponse, transactionsResponse] = await Promise.all([
          fetch(`${apiBase}/vendor/overview`, { headers, cache: "no-store" }),
          fetch(`${apiBase}/vendor/transactions`, {
            headers,
            cache: "no-store",
          }),
        ])
        if (!overviewResponse.ok || !transactionsResponse.ok) {
          throw new Error("Unable to load subscription details.")
        }
        const overviewData = await overviewResponse.json()
        const transactionData = await transactionsResponse.json()
        setOverview(overviewData)
        setTransactions(Array.isArray(transactionData) ? transactionData : [])
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load subscription details."
        )
      } finally {
        setLoading(false)
      }
    }

    void loadSubscription()
  }, [isPending, session])

  if (isPending || loading) {
    return (
      <div className="dashboard-page">
        <DashboardTitle
          title="Subscription Plans"
          description="Choose the plan that fits your wedding business. Premium unlocks unlimited services and featured placement."
        />
        <SubscriptionContentSkeleton />
      </div>
    )
  }

  async function upgrade() {
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
      })
      const result = await response.json()
      if (!response.ok || !result.url)
        throw new Error(result.message || "Checkout is currently unavailable.")
      window.location.assign(result.url)
    } catch (upgradeError) {
      setError(
        upgradeError instanceof Error
          ? upgradeError.message
          : "Checkout is currently unavailable."
      )
      setBusy(false)
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardTitle
        title="Subscription Plans"
        description="Choose the plan that fits your wedding business. Premium unlocks unlimited services and featured placement."
      />

      <section className="subscription-status-card">
        <div>
          <span className="eyebrow">ACTIVE PLAN STATUS</span>
          <div className="subscription-status-line">
            <h2>{currentPlan} Plan</h2>
            <span className="service-count-badge">
              {currentPlan === "Premium"
                ? `${overview?.activeServices ?? 0} Active Services`
                : `${overview?.activeServices ?? 0} / 3 Active Services`}
            </span>
          </div>
        </div>
        {currentPlan !== "Premium" && (
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => void upgrade()}
          >
            <Crown size={15} />{" "}
            {busy ? "Redirecting to Stripe…" : "Upgrade to Premium"}
          </button>
        )}
      </section>

      <div className="plan-cards subscription-plan-cards">
        <article className="plan-card">
          <div className="plan-card-heading">
            <h2>Free Plan</h2>
            {currentPlan === "Free" && (
              <span className="plan-current">Current Plan</span>
            )}
          </div>
          <p>Ideal for boutique vendors getting started on WedPlan.</p>
          <p className="plan-price">
            $0 <small>/ month</small>
          </p>
          <ul>
            <li>
              <Check size={15} /> Maximum 3 active services
            </li>
            <li>
              <Check size={15} /> Basic vendor dashboard
            </li>
            <li>
              <Check size={15} /> Booking request management
            </li>
          </ul>
          {currentPlan === "Premium" && (
            <span className="plan-current">Available plan</span>
          )}
        </article>

        <article className="plan-card plan-card-premium">
          <div className="plan-card-heading">
            <h2>
              <Crown size={19} /> Premium Plan
            </h2>
            <span className="recommended-badge">Recommended</span>
          </div>
          <p>Built for established wedding studios scaling bookings.</p>
          <p className="plan-price">
            $29 <small>/ month</small>
          </p>
          <ul>
            <li>
              <Check size={15} /> Unlimited active services
            </li>
            <li>
              <Check size={15} /> Premium vendor badge
            </li>
            <li>
              <Check size={15} /> Featured service placement
            </li>
            <li>
              <Check size={15} /> All Free Plan features
            </li>
          </ul>
          {currentPlan === "Premium" ? (
            <span className="plan-current premium-active">
              <BadgeCheck size={15} /> Premium is active
            </span>
          ) : (
            <button
              className="button button-primary"
              disabled={busy}
              onClick={() => void upgrade()}
            >
              <Crown size={15} />{" "}
              {busy ? "Redirecting to Stripe…" : "Upgrade to Premium"}
            </button>
          )}
        </article>
      </div>

      {error && (
        <p role="alert" className="dashboard-error">
          {error}
        </p>
      )}

      <section className="dashboard-panel subscription-history">
        <div className="dashboard-panel-heading">
          <div>
            <span className="eyebrow">STRIPE CHECKOUT</span>
            <h2>Your Payment History</h2>
          </div>
        </div>
        {transactions.length ? (
          <div className="subscription-history-scroll">
            <table className="subscription-history-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.plan}</td>
                    <td>
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>
                    <td>
                      <span
                        className={`transaction-status status-${transaction.status.toLowerCase()}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-empty">
            <h3>No subscription payments yet</h3>
            <p>Your Stripe transactions will appear here after checkout.</p>
          </div>
        )}
      </section>
      <p className="subscription-help">
        Need to update your plan?{" "}
        <Link href="/dashboard/vendor/settings">Visit profile settings</Link>.
      </p>
    </div>
  )
}
