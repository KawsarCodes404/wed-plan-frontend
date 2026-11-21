import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { SiteNavbar } from "@/components/side-navbar"
import { safeRedirectPath } from "@/lib/auth-redirect"

export const metadata: Metadata = {
  title: "Create an account — WedPlan",
  description:
    "Join WedPlan as a couple planning your wedding or a vendor offering trusted services.",
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirectTo?: string | string[]
    callbackURL?: string | string[]
  }>
}) {
  const search = await searchParams
  const redirectTo = safeRedirectPath(search.redirectTo ?? search.callbackURL)

  return (
    <>
      <SiteNavbar />
      <main className="auth-page">
        <AuthForm mode="sign-up" redirectTo={redirectTo} />
      </main>
    </>
  )
}
