import { redirect } from "next/navigation"
import { getSession } from "@/lib/core/server"
import { dashboardPath } from "@/lib/auth-redirect"

export default async function ContinueAfterSignInPage() {
  const session = await getSession()
  if (!session || session.user.isBlocked) redirect("/sign-in")
  redirect(dashboardPath(session.user.role))
}
