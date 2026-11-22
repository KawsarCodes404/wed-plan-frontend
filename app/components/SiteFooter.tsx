import Link from "next/link"
import { Heart, Mail, MapPin, Phone } from "lucide-react"

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-wrap footer-main">
        <div className="footer-brand-column">
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
            Curating extraordinary wedding venues, photographers, florists,
            caterers, and bridal stylists so couples can plan unforgettable
            celebrations with confidence.
          </p>
        </div>
        <div className="footer-col">
          <strong>Navigation</strong>
          <Link href="/">Home</Link>
          <Link href="/services">Browse services</Link>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up">Create account</Link>
          <Link href="/sign-in">Dashboard</Link>
        </div>
        <div className="footer-col">
          <strong>Categories</strong>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/services?category=${encodeURIComponent(category)}`}
            >
              {category}
            </Link>
          ))}
        </div>
        <div className="footer-col footer-contact">
          <strong>Contact &amp; Connect</strong>
          <a href="mailto:concierge@wedplan.com">
            <Mail size={15} /> concierge@wedplan.com
          </a>
          <a href="tel:+14158904321">
            <Phone size={15} /> +1 (415) 890-4321
          </a>
          <a href="https://maps.google.com/?q=540+Union+Square+San+Francisco">
            <MapPin size={15} /> 540 Union Square, San Francisco
          </a>
          <div className="footer-socials" aria-label="Social media">
            <span>Instagram</span>
            <span>Pinterest</span>
            <span>Facebook</span>
          </div>
        </div>
      </div>
      <div className="content-wrap footer-bottom">
        <span>
          © 2026 WedPlan Wedding Planning Platform. All rights reserved.
        </span>
        <span>
          Crafted for couples &amp; verified wedding artisans worldwide.
        </span>
      </div>
    </footer>
  )
}
