"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { toast } from "@/components/ui/toast"

export function RouteToast() {
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("welcome") !== "1") return

    toast.add({
      title: "Account created successfully!",
      description: "Welcome to WedPlan.",
      type: "success",
    })

    params.delete("welcome")
    const query = params.toString()
    const nextUrl = `${pathname}${query ? `?${query}` : ""}${window.location.hash}`
    window.history.replaceState(window.history.state, "", nextUrl)
  }, [pathname])

  return null
}
