import Link from "next/link"
import { ArrowLeft, ArrowRight, Heart } from "lucide-react"

export default function NotFound() {
  return (
    <main className="app-fallback-page">
      <section className="app-fallback-card" aria-labelledby="not-found-title">
        <Link href="/" className="fallback-brand" aria-label="WedPlan home">
          <span className="fallback-brand-mark">
            <Heart size={20} fill="currentColor" />
          </span>
          <span>
            <strong>WedPlan</strong>
            <small>WEDDING MARKETPLACE</small>
          </span>
        </Link>

        <span className="fallback-eyebrow">A little detour</span>
        <p className="fallback-code">404</p>
        <h1 id="not-found-title">We couldn’t find that page.</h1>
        <p className="fallback-description">
          This page may have moved, or the link may be out of date. Let’s get
          you back to the wedding plans.
        </p>

        <div className="fallback-actions">
          <Link href="/" className="button button-primary">
            <ArrowLeft size={16} /> Back to WedPlan
          </Link>
          <Link href="/services" className="button button-outline">
            Browse services <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}
