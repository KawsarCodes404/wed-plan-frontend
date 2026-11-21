"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, BadgeCheck, CircleCheck, RefreshCw } from "lucide-react"
import { useSession } from "@/lib/auth-client"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
export function CheckoutStatus({ sessionId }: { sessionId: string }) {
  const { data: session } = useSession()
  const [status, setStatus] = useState<
    "checking" | "pending" | "completed" | "failed"
  >("checking")
  const [message, setMessage] = useState("")
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    async function check() {
      const token = (session as { session?: { token?: string } } | null)
        ?.session?.token
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
          setStatus(result.status === "Completed" ? "completed" : "pending")
          setMessage(
            result.status === "Completed"
              ? "Your Premium subscription is active."
              : "Stripe has returned you to WedPlan. Premium will appear once Stripe confirms the payment."
          )
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
          <CircleCheck size={31} />
        )}
      </span>
      <span className="eyebrow">WEDPLAN PREMIUM</span>
      <h1>
        {status === "completed"
          ? "You’re all set"
          : status === "checking"
            ? "Confirming your payment"
            : "Thanks for upgrading"}
      </h1>
      <p>{message || "We’re checking the status of your Stripe checkout."}</p>
      {status === "pending" || status === "failed" ? (
        <button
          className="button button-outline"
          onClick={() => setRetry((value) => value + 1)}
        >
          <RefreshCw size={15} /> Check again
        </button>
      ) : null}
      <Link
        className="button button-primary"
        href="/dashboard/vendor/subscription"
      >
        Back to subscription <ArrowRight size={15} />
      </Link>
    </section>
  )
}
