"use server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const getSession = async () => {
  "use server"
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export const getToken = async () => {
  const result = await auth.api.getToken({ headers: await headers() })
  if (!result?.token) {
    redirect("/unauthorized")
  }
  return result.token
}

export const authFetch = async (api: string) => {
  const token = await getToken()
  const res = await fetch(api, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401 || res.status === 403) {
    redirect("/unauthorized")
  }

  return res
}

export const protectedMutation = async (
  api: string,
  method: string,
  data?: unknown
) => {
  const token = await getToken()
  const res = await fetch(api, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (res.status === 401 || res.status === 403) {
    redirect("/unauthorized")
  }

  return res
}

export const requireRole = async (role: "admin" | "customer" | "vendor") => {
  const session = await getSession()
  if (!session || session.user.role !== role || session.user.isBlocked) {
    redirect("/unauthorized")
  }
  return session
}
