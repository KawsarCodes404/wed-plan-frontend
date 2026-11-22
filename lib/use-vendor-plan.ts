"use client"

import { useEffect, useState } from "react"
import { getApiToken } from "@/lib/api-token"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

type VendorOverview = {
  subscriptionPlan?: string
}

export function useVendorPlan(enabled: boolean, sessionPlan?: string | null) {
  const [plan, setPlan] = useState(sessionPlan || "Free")

  useEffect(() => {
    setPlan(sessionPlan || "Free")

    if (!enabled) return

    let isCurrent = true

    async function loadPlan() {
      try {
        const token = await getApiToken()
        if (!token) return

        const response = await fetch(`${apiBase}/vendor/overview`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        if (!response.ok) return

        const overview = (await response.json()) as VendorOverview
        if (isCurrent && overview.subscriptionPlan) {
          setPlan(overview.subscriptionPlan)
        }
      } catch {
        // Keep the plan from the signed-in session if the overview is unavailable.
      }
    }

    void loadPlan()

    return () => {
      isCurrent = false
    }
  }, [enabled, sessionPlan])

  return plan
}
