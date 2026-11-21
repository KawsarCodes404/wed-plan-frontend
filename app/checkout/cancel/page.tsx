import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteNavbar } from "@/components/side-navbar"

export const metadata: Metadata = { title: "Checkout canceled — WedPlan" }
export default function CheckoutCancelPage() {
  return (
    <>
      <SiteNavbar />
      <main className="checkout-result-page">
        <section className="checkout-result-card">
          <span className="eyebrow">WEDPLAN PREMIUM</span>
          <h1>No worries, you can come back to it.</h1>
          <p>Your checkout was canceled, and your current plan is unchanged.</p>
          <Link
            className="button button-primary"
            href="/dashboard/vendor/subscription"
          >
            <ArrowLeft size={15} /> Return to plans
          </Link>
        </section>
      </main>
    </>
  )
}
