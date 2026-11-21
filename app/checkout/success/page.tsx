import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SiteNavbar } from "@/components/side-navbar"
import { CheckoutView } from "../_components/checkout-view"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const metadata: Metadata = { title: "WedPlan Premium checkout" }

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    const returnTo = `/checkout/success?session_id=${encodeURIComponent(sessionId || "")}`
    redirect(`/sign-in?callbackURL=${encodeURIComponent(returnTo)}`)
  }
  if (session.user.role !== "vendor" || session.user.isBlocked) {
    redirect("/unauthorized")
  }

  let result = null
  if (sessionId) {
    const token = await auth.api.getToken({ headers: requestHeaders })
    if (token?.token) {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      ).replace(/\/$/, "")
      try {
        const response = await fetch(
          `${apiBase}/payments/checkout-session/${encodeURIComponent(sessionId)}`,
          {
            headers: { Authorization: `Bearer ${token.token}` },
            cache: "no-store",
          }
        )
        if (response.ok) result = await response.json()
      } catch {
        result = null
      }
    }
  }

  return (
    <>
      <SiteNavbar />
      <main className="checkout-result-page">
        <CheckoutView result={result} />
      </main>
    </>
  )
}
