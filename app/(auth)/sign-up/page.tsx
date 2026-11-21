import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { SiteNavbar } from "@/components/side-navbar"

export const metadata: Metadata = {
    title: "Create an account — WedPlan",
    description: "Join WedPlan as a couple planning your wedding or a vendor offering trusted services.",
}

export default function SignUpPage() {

    return (
        <><SiteNavbar/><main className="auth-page">
            <AuthForm mode="sign-up" />
        </main></>
    )
}
