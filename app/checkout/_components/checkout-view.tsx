import Link from "next/link"
import { ArrowRight, BadgeCheck, CircleX, Crown } from "lucide-react"

type CheckoutResult = {
  status: "Completed" | "Pending" | "Failed" | "Cancelled"
  plan?: string
  amount?: number
  currency?: string
  createdAt?: string
  message?: string
}

export function CheckoutView({ result }: { result: CheckoutResult | null }) {
  const complete = result?.status === "Completed"
  const cancelled = result?.status === "Cancelled"
  const title = complete
    ? "Welcome to WedPlan Premium!"
    : cancelled
      ? "Checkout canceled"
      : result?.status === "Failed"
        ? "Payment not completed"
        : "Payment could not be confirmed"

  return (
    <section className="checkout-result-card">
      <span
        className={`checkout-result-icon ${complete ? "is-complete" : "is-cancelled"}`}
      >
        {complete ? <BadgeCheck size={31} /> : <CircleX size={31} />}
      </span>
      <span className="eyebrow">WEDPLAN PREMIUM</span>
      <h1>{title}</h1>
      <p>
        {complete
          ? "Your Stripe payment is verified, your transaction is recorded, and your Premium Vendor benefits are now active."
          : result?.message ||
            "Your current plan is unchanged. Return to your subscription page to try again."}
      </p>

      {complete && result && (
        <dl className="checkout-transaction-details">
          <div>
            <dt>Plan</dt>
            <dd>
              <span className="checkout-plan-label">
                <Crown size={13} /> Premium
              </span>
            </dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>
              {result.amount == null
                ? "—"
                : new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: (result.currency || "USD").toUpperCase(),
                  }).format(result.amount / 100)}
            </dd>
          </div>
          <div>
            <dt>Transaction Status</dt>
            <dd>
              <span className="transaction-status status-completed">
                Completed
              </span>
            </dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>
              {result.createdAt
                ? new Date(result.createdAt).toLocaleDateString()
                : "—"}
            </dd>
          </div>
        </dl>
      )}

      <div className="checkout-result-actions">
        <Link
          className="button button-primary"
          href="/dashboard/vendor/subscription"
        >
          View Subscription <ArrowRight size={15} />
        </Link>
        {complete && (
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
