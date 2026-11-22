"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"

type PageErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function PageError({ error, retry }: PageErrorProps) {
  useEffect(() => {
    console.error("WedPlan page error:", error)
  }, [error])

  return (
    <main className="app-fallback-page">
      <section className="app-fallback-card" aria-labelledby="page-error-title">
        <span className="fallback-icon fallback-icon-error">
          <AlertCircle size={24} />
        </span>
        <span className="fallback-eyebrow">Something went wrong</span>
        <h1 id="page-error-title">We couldn’t load this page.</h1>
        <p className="fallback-description">
          Please try again. If the problem continues, return to WedPlan and try
          again in a little while.
        </p>
        {error.digest && (
          <p className="fallback-reference">Reference: {error.digest}</p>
        )}

        <div className="fallback-actions">
          <button className="button button-primary" onClick={retry}>
            <RefreshCw size={16} /> Try again
          </button>
          <Link href="/" className="button button-outline">
            <ArrowLeft size={16} /> Back to WedPlan
          </Link>
        </div>
      </section>
    </main>
  )
}
