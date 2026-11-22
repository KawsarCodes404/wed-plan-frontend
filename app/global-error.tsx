"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import "./globals.css"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("WedPlan application error:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main className="app-fallback-page">
          <section
            className="app-fallback-card"
            aria-labelledby="global-error-title"
          >
            <span className="fallback-icon fallback-icon-error">
              <AlertCircle size={24} />
            </span>
            <span className="fallback-eyebrow">WedPlan needs a moment</span>
            <h1 id="global-error-title">We couldn’t open the page.</h1>
            <p className="fallback-description">
              Something unexpected happened. Try loading the page again.
            </p>
            {error.digest && (
              <p className="fallback-reference">Reference: {error.digest}</p>
            )}
            <div className="fallback-actions">
              <button className="button button-primary" onClick={retry}>
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}
