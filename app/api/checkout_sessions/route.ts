import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

export async function POST() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    return Response.json(
      { message: "Sign in to upgrade your plan." },
      { status: 401 }
    )
  }
  if (session.user.role !== "vendor" || session.user.isBlocked) {
    return Response.json(
      { message: "Only active vendor accounts can upgrade." },
      { status: 403 }
    )
  }

  const token = await auth.api.getToken({ headers: requestHeaders })
  if (!token?.token) {
    return Response.json(
      { message: "Your session expired. Sign in again." },
      { status: 401 }
    )
  }

  try {
    const response = await fetch(`${apiBase}/payments/checkout-session`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.token}` },
      cache: "no-store",
    })
    const result = await response.json()
    return Response.json(result, { status: response.status })
  } catch {
    return Response.json(
      { message: "Stripe checkout is unavailable. Please try again." },
      { status: 502 }
    )
  }
}
