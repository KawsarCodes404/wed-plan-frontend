import type { Metadata } from "next"

import { AuthForm } from "@/components/auth-form"
import { SiteNavbar } from "@/components/side-navbar"
import { safeRedirectPath } from "@/lib/auth-redirect"

export const metadata: Metadata = {
  title: "Sign in — WedPlan",
  description:
    "Sign in to manage wedding services and booking requests on WedPlan.",
}

export default async function SignInPage({
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
        <AuthForm mode="sign-in" redirectTo={redirectTo} />
      </main>
    </>
  )
}
