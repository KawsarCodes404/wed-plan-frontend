import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

export async function dashboardApi<T>(path: string): Promise<T | null> {
  const result = await auth.api.getToken({ headers: await headers() })
  if (!result?.token) return null
  try {
    const response = await fetch(`${apiBase}${path}`, {
      headers: { Authorization: `Bearer ${result.token}` },
      cache: "no-store",
    })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}
