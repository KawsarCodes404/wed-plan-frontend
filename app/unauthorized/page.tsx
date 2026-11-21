import Link from "next/link"
import { LockKeyhole } from "lucide-react"
import { SiteNavbar } from "@/components/side-navbar"

export default function UnauthorizedPage() {
  return (
    <>
      <SiteNavbar />
      <main className="unauthorized-page">
        <section className="unauthorized-card">
          <span><LockKeyhole size={22} /></span>
          <h1>This workspace is private</h1>
          <p>Sign in with an account that has access to this area, or head back to the marketplace.</p>
          <div>
            <Link className="button button-primary" href="/sign-in">Sign in</Link>
            <Link className="button button-outline" href="/">Go to WedPlan</Link>
          </div>
        </section>
      </main>
    </>
  )
}
