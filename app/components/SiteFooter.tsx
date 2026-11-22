import Link from "next/link"
import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-wrap footer-main">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">
            <Heart fill="currentColor" size={18} />
          </span>
          <span>
            <strong>WedPlan</strong>
            <small>WEDDING MARKETPLACE</small>
          </span>
        </Link>
        <p className="footer-about">
          A calmer way to find the people who make your celebration yours.
        </p>
        <div className="footer-col">
          <strong>Explore</strong>
          <Link href="/">Home</Link>
          <Link href="/services">Browse services</Link>
          <Link href="/sign-in">Sign in</Link>
        </div>
        <div className="footer-col">
          <strong>For vendors</strong>
          <Link href="/sign-up">Join WedPlan</Link>
          <Link href="/sign-in">Vendor sign in</Link>
        </div>
        <div className="footer-col">
          <strong>Say hello</strong>
          <a href="mailto:hello@wedplan.com">hello@wedplan.com</a>
          <span>Made with care, for your forever.</span>
        </div>
      </div>
      <div className="content-wrap footer-bottom">
        <span>© 2026 WedPlan. Made for the moments that matter.</span>
        <span>
          Made with <Heart size={13} fill="currentColor" /> for your forever
        </span>
      </div>
    </footer>
  )
}
