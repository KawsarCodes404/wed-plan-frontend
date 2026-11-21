"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, BadgeCheck, Crown, RefreshCw, XCircle } from "lucide-react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
export function CheckoutStatus({ sessionId }: { sessionId: string }) {
  const { data: session } = useSession()
  const [status, setStatus] = useState<
    "checking" | "pending" | "completed" | "failed" | "cancelled"
  >("checking")
  const [transaction, setTransaction] = useState<{
    plan?: string
    amount?: number
    currency?: string
    createdAt?: string
  } | null>(null)
  const [message, setMessage] = useState("")
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    async function check() {
      const token = await getApiToken()
      if (!token || !sessionId) {
        setStatus("failed")
        setMessage(
          "We couldn’t match this checkout to a signed-in vendor account."
        )
        return
      }
      try {
        const response = await fetch(
          `${apiBase}/payments/checkout-session/${encodeURIComponent(sessionId)}`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        )
        const result = await response.json()
        if (!response.ok)
          throw new Error(result.message || "We couldn’t confirm this payment.")
        if (active) {
          setTransaction(result)
          if (result.status === "Completed") {
            setStatus("completed")
            setMessage(
              "Your Stripe payment is verified, your transaction is recorded, and your Premium Vendor benefits are now active."
            )
          } else if (result.status === "Failed") {
            setStatus("failed")
            setMessage(
              "Stripe could not complete this payment. Your current plan is unchanged. Please update your payment method and try again."
            )
          } else if (result.status === "Cancelled") {
            setStatus("cancelled")
            setMessage("Checkout was canceled. Your current plan is unchanged.")
          } else {
            setStatus("pending")
            setMessage(
              "Stripe has returned you to WedPlan. Premium will appear once Stripe confirms the payment."
            )
          }
        }
      } catch (error) {
        if (active) {
          setStatus("failed")
          setMessage(
            error instanceof Error
              ? error.message
              : "We couldn’t confirm this payment."
          )
        }
      }
    }
    void check()
    return () => {
      active = false
    }
  }, [session, sessionId, retry])
  return (
    <section className="checkout-result-card">
      <span
        className={`checkout-result-icon ${status === "completed" ? "is-complete" : ""}`}
      >
        {status === "completed" ? (
          <BadgeCheck size={31} />
        ) : status === "checking" ? (
          <RefreshCw className="spin-icon" size={28} />
        ) : (
          <XCircle size={31} />
        )}
      </span>
      <span className="eyebrow">WEDPLAN PREMIUM</span>
      <h1>
        {status === "completed"
          ? "Welcome to WedPlan Premium!"
          : status === "checking"
            ? "Confirming your payment"
            : status === "cancelled"
              ? "Checkout canceled"
              : status === "failed"
                ? "Payment not completed"
                : "Payment is processing"}
      </h1>
      <p>{message || "We’re checking the status of your Stripe checkout."}</p>
      {transaction && status !== "checking" && (
        <dl className="checkout-transaction-details">
          <div>
            <dt>Plan</dt>
            <dd>
              <CrownLabel plan={transaction.plan || "Premium"} />
            </dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>
              {transaction.amount == null
                ? "—"
                : new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: (transaction.currency || "USD").toUpperCase(),
                  }).format(transaction.amount / 100)}
            </dd>
          </div>
          <div>
            <dt>Transaction Status</dt>
            <dd>
              <span
                className={`transaction-status status-${status === "completed" ? "completed" : status === "cancelled" ? "cancelled" : status}`}
              >
                {status === "completed"
                  ? "Completed"
                  : status === "cancelled"
                    ? "Cancelled"
                    : status === "failed"
                      ? "Failed"
                      : "Pending"}
              </span>
            </dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleDateString()
                : "—"}
            </dd>
          </div>
        </dl>
      )}
      {status === "pending" || status === "failed" ? (
        <button
          className="button button-outline"
          onClick={() => setRetry((value) => value + 1)}
        >
          <RefreshCw size={15} /> Check again
        </button>
      ) : null}
      <div className="checkout-result-actions">
        <Link
          className="button button-primary"
          href="/dashboard/vendor/subscription"
        >
          View Subscription <ArrowRight size={15} />
        </Link>
        {status === "completed" && (
          <Link
            className="button button-outline"
            href="/dashboard/vendor/add-service"
          >
            Publish a Service
          </Link>
        )}
      </div>
    </section>
  )
}

function CrownLabel({ plan }: { plan: string }) {
  return (
    <span className="checkout-plan-label">
      <Crown size={13} /> {plan}
    </span>
  )
}
