import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Crown,
  Heart,
  MapPin,
  Quote,
  Sparkles,
} from "lucide-react"
import { SiteNavbar } from "@/components/side-navbar"
import { AnimatedSection } from "@/components/animated-section"
import { SiteFooter } from "@/app/components/SiteFooter"
import { RevealGrid } from "@/components/reveal-grid"

const categories = [
  {
    title: "Photography & Videography",
    kicker: "Cinematic Capture",
    detail: "Timeless editorial stories, drone films, and candid moments",
    image: "photo-1537633552985-df8429e8048b",
  },
  {
    title: "Wedding Venues",
    kicker: "Curated Spaces",
    detail: "Historic estates, garden conservatories, and grand ballrooms",
    image: "photo-1519167758481-83f550bb49b3",
  },
  {
    title: "Decoration & Florist",
    kicker: "Botanical Artistry",
    detail: "Floral arches, candlelit tablescapes, and thoughtful details",
    image: "photo-1490750967868-88aa4486c946",
  },
  {
    title: "Catering Services",
    kicker: "Gather Around",
    detail: "Seasonal menus and beautiful feasts made for sharing",
    image: "photo-1511795409834-ef04bbd61622",
  },
  {
    title: "Makeup & Styling",
    kicker: "The Finishing Touch",
    detail: "Beauty and styling that feels unmistakably like you",
    image: "photo-1522335789203-aabd1fc54bc9",
  },
  {
    title: "Wedding Fashion",
    kicker: "Made for the Moment",
    detail: "The looks, tailoring, and finishing touches for your day",
    image: "photo-1594552072238-b8a33785b261",
  },
]

type FeaturedService = {
  _id: string
  serviceName: string
  category: string
  location: string
  price: number
  images?: string[]
  vendor?: { name?: string; businessName?: string; isPremium?: boolean }
}

async function getFeaturedServices(): Promise<FeaturedService[]> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  try {
    const response = await fetch(`${apiBase}/services?sort=newest&limit=6`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    const payload = await response.json()
    return Array.isArray(payload.services) ? payload.services.slice(0, 6) : []
  } catch {
    return []
  }
}

function imageUrl(id: string, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function ServiceCard({ service }: { service: FeaturedService }) {
  return (
    <article className="service-card">
      <div
        className="service-image"
        style={{
          backgroundImage: service.images?.[0]
            ? `url(${service.images[0]})`
            : undefined,
        }}
      >
        <span className="category-pill">{service.category}</span>
        {service.vendor?.isPremium && (
          <span className="partner-pill">
            <Sparkles size={13} /> Featured Partner
          </span>
        )}
        <span className="price-pill">${service.price.toLocaleString()}</span>
      </div>
      <div className="service-content">
        <h3>{service.serviceName}</h3>
        <p className="service-location">
          <MapPin size={15} />
          {service.location}
        </p>
        <div className="vendor-line">
          <span className="vendor-avatar">
            {(
              service.vendor?.businessName ||
              service.vendor?.name ||
              "W"
            ).slice(0, 1)}
          </span>
          <div>
            <strong>
              {service.vendor?.businessName ||
                service.vendor?.name ||
                "Wedding vendor"}
            </strong>
            <small>
              {service.vendor?.isPremium ? "Premium Vendor" : "Wedding Vendor"}
            </small>
          </div>
          <BadgeCheck className="verified-icon" size={18} />
        </div>
        <Link
          className="button button-primary card-link"
          href={`/services/${service._id}`}
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default async function HomePage() {
  const featured = await getFeaturedServices()
  return (
    <main>
      <SiteNavbar />
      <section className="hero-section">
        <div className="hero-backdrop" />
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">
              <Sparkles size={14} /> A little more magic, a lot less planning
            </span>
            <h1>
              Make room for
              <br />
              your <em>happily ever</em>
              <br />
              after.
            </h1>
            <p>
              Meet the wedding pros who make your day feel like you.
              Thoughtfully chosen, easy to compare, and right here when you need
              them.
            </p>
            <div className="hero-actions">
              <Link href="/services" className="button button-gold">
                <Heart size={17} /> Explore wedding services{" "}
                <ArrowRight size={17} />
              </Link>
              <Link href="/sign-up" className="button button-glass">
                Join as a vendor <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="hero-proof">
              <div>
                <strong>6+</strong>
                <span>curated categories</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>admin vetted</span>
              </div>
              <div>
                <strong>One place</strong>
                <span>to keep it all together</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="hero-photo"
              style={{
                backgroundImage: `url(${imageUrl("photo-1519741497674-611481863552", 1200)})`,
              }}
            >
              <div className="hero-photo-caption">
                <span>YOUR DAY, YOUR WAY</span>
                <strong>
                  All the little things.
                  <br />
                  All in one place.
                </strong>
              </div>
            </div>
            <div className="verified-note">
              <span className="verified-seal">
                <BadgeCheck size={20} />
              </span>
              <div>
                <strong>Good people, vetted</strong>
                <small>Every vendor reviewed before going live</small>
              </div>
            </div>
            <div className="heart-stamp">
              <Heart size={19} fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>PLAN WITH PEOPLE WHO GET IT</span>
          <span className="hero-bottom-rule" />
          <span>EST. FOR YOUR FOREVER</span>
        </div>
      </section>

      <AnimatedSection className="featured-section content-wrap">
        <div className="section-row">
          <SectionHeading
            eyebrow="A GOOD PLACE TO START"
            title="Featured wedding services"
            description="Meet some of the talented people making celebrations unforgettable."
          />
          <Link href="/services" className="text-link">
            View all services <ArrowRight size={16} />
          </Link>
        </div>
        {featured.length ? (
          <RevealGrid className="service-grid">
            {featured.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </RevealGrid>
        ) : (
          <p className="empty-state">
            New wedding services are coming soon. Browse all services to explore
            the marketplace.
          </p>
        )}
      </AnimatedSection>

      <AnimatedSection className="category-section">
        <div className="content-wrap">
          <SectionHeading
            eyebrow="EXPLORE BY SPECIALTY"
            title="Wedding service categories"
            description="Find the right kind of wonderful for every chapter of your wedding weekend."
          />
          <RevealGrid className="category-grid">
            {categories.map(({ title, kicker, detail, image }) => (
              <Link
                href={`/services?category=${encodeURIComponent(title)}`}
                className="category-card"
                key={title}
                style={{
                  backgroundImage: `linear-gradient(0deg,rgba(31,18,21,.74),rgba(31,18,21,.08) 76%),url(${imageUrl(image, 700)})`,
                }}
              >
                <span className="category-kicker">{kicker}</span>
                <span className="category-text">
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
              </Link>
            ))}
          </RevealGrid>
        </div>
      </AnimatedSection>

      <AnimatedSection className="promise-section content-wrap">
        <div className="promise-benefits">
          <div className="promise-intro">
            <span className="eyebrow">THE WEDPLAN PROMISE</span>
            <h2>Why Choose WedPlan?</h2>
            <p>
              Designed for modern couples and ambitious wedding vendors alike,
              WedPlan replaces scattered spreadsheets with verified partnerships
              and streamlined booking workflows.
            </p>
          </div>
          <div className="promise-feature-grid">
            <article className="promise-feature-card">
              <CheckCircle2 size={20} />
              <strong>Curated &amp; Admin-Vetted Vendors</strong>
              <p>
                Every wedding service undergoes administrative review before
                appearing publicly, ensuring trusted professionals for your
                celebration.
              </p>
            </article>
            <article className="promise-feature-card">
              <CheckCircle2 size={20} />
              <strong>Transparent Pricing &amp; Instant Requests</strong>
              <p>
                Compare package rates upfront, filter by your city or
                destination, and submit date-specific booking requests in
                seconds.
              </p>
            </article>
            <article className="promise-feature-card">
              <CheckCircle2 size={20} />
              <strong>Dedicated Role Dashboards</strong>
              <p>
                Couples track every request status in real time while vendors
                manage packages, schedules, and bookings from one workspace.
              </p>
            </article>
            <article className="promise-feature-card">
              <CheckCircle2 size={20} />
              <strong>Verified Premium Vendor Badges</strong>
              <p>
                Spot top-tier wedding partners backed by Stripe-verified Premium
                memberships and priority service showcases.
              </p>
            </article>
          </div>
        </div>

        <aside className="promise-premium-panel">
          <span className="promise-premium-label">
            <Crown size={14} /> For Wedding Businesses
          </span>
          <h3>Grow Your Studio With WedPlan Premium</h3>
          <p className="promise-premium-description">
            Start free with up to 3 active services, or unlock unlimited
            listings, a verified Premium Vendor badge, and top-of-feed placement
            powered by Stripe Checkout.
          </p>
          <ol className="promise-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Discover Curated Services</strong>
                <p>
                  Explore approved photography, venues, florists, catering,
                  beauty, and couture filtered by location and budget.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Send a Booking Request</strong>
                <p>
                  Pick your wedding date and venue location, add personal notes,
                  and send a direct inquiry to your chosen vendor.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Track &amp; Celebrate</strong>
                <p>
                  Receive prompt acceptances from vendors and keep all confirmed
                  wedding services organized inside your dashboard.
                </p>
              </div>
            </li>
          </ol>
        </aside>
      </AnimatedSection>

      <AnimatedSection className="testimonial-section">
        <div className="content-wrap">
          <SectionHeading
            eyebrow="LOVE NOTES"
            title="Stories From Happy Couples"
          />
          <RevealGrid className="testimonial-grid">
            <blockquote>
              <Quote aria-hidden="true" />
              <p>
                “WedPlan helped us find our dream garden estate, floral
                designer, and editorial photographer in a single weekend.
                Tracking every booking status in one place removed all the
                stress.”
              </p>
              <footer>
                <strong>Sophia & Liam Harrison</strong>
                <small>Napa Valley, CA · Married October 2025</small>
              </footer>
            </blockquote>
            <blockquote>
              <Quote aria-hidden="true" />
              <p>
                “Being able to filter vendors by location and compare pricing
                transparently saved us weeks of back-and-forth emails. Every
                vendor we booked was responsive and extraordinary.”
              </p>
              <footer>
                <strong>Amara & Daniel Vance</strong>
                <small>Austin, TX · Married May 2026</small>
              </footer>
            </blockquote>
            <blockquote>
              <Quote aria-hidden="true" />
              <p>
                “From bridal styling to multi-course catering, WedPlan connected
                us with verified artisans who understood our vision from day
                one.”
              </p>
              <footer>
                <strong>Clara & Ethan Brooks</strong>
                <small>Charleston, SC · Married August 2026</small>
              </footer>
            </blockquote>
          </RevealGrid>
        </div>
      </AnimatedSection>

      <SiteFooter />
    </main>
  )
}
