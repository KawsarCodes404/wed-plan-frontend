import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CircleX, Crown } from "lucide-react"
import { SiteNavbar } from "@/components/side-navbar"

export const metadata: Metadata = { title: "Checkout canceled — WedPlan" }
export default function CheckoutCancelPage() {
  return (
    <>
      <SiteNavbar />
      <main className="checkout-result-page">
        <section className="checkout-result-card">
          <span className="checkout-result-icon is-cancelled">
            <CircleX size={31} />
          </span>
          <span className="eyebrow">WEDPLAN PREMIUM</span>
          <h1>Checkout canceled</h1>
          <p>
            Your current plan is unchanged. You can return to your plans and try
            Premium checkout again whenever you’re ready.
          </p>
          <Link
            className="button button-primary"
            href="/dashboard/vendor/subscription"
          >
            <Crown size={15} /> Return to plans
          </Link>
          <Link className="checkout-cancel-back" href="/dashboard/vendor">
            <ArrowLeft size={14} /> Back to vendor dashboard
          </Link>
        </section>
      </main>
    </>
  )
}
