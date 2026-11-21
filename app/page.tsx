import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  Check,
  Flower2,
  Heart,
  MapPin,
  Sparkles,
  Utensils,
  Shirt,
  Building2,
} from "lucide-react"
import { SiteNavbar } from "@/components/side-navbar"

const categories = [
  {
    title: "Photography & Videography",
    detail: "Timeless stories, honestly told",
    icon: Camera,
    image: "photo-1537633552985-df8429e8048b",
  },
  {
    title: "Wedding Venues",
    detail: "Spaces made for your day",
    icon: Building2,
    image: "photo-1519167758481-83f550bb49b3",
  },
  {
    title: "Decoration & Florist",
    detail: "The finishing touches",
    icon: Flower2,
    image: "photo-1490750967868-88aa4486c946",
  },
  {
    title: "Catering Services",
    detail: "A table worth gathering around",
    icon: Utensils,
    image: "photo-1511795409834-ef04bbd61622",
  },
  {
    title: "Makeup & Styling",
    detail: "Feel like the best you",
    icon: Sparkles,
    image: "photo-1522335789203-aabd1fc54bc9",
  },
  {
    title: "Wedding Fashion",
    detail: "Find the one you love",
    icon: Shirt,
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
    const response = await fetch(`${apiBase}/services?sort=newest&limit=3`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    const payload = await response.json()
    return Array.isArray(payload.services) ? payload.services.slice(0, 3) : []
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

      <section className="featured-section content-wrap">
        <div className="section-row">
          <SectionHeading
            eyebrow="A GOOD PLACE TO START"
            title="A few lovely finds"
            description="Meet some of the talented people making celebrations unforgettable."
          />
          <Link href="/services" className="text-link">
            View all services <ArrowRight size={16} />
          </Link>
        </div>
        {featured.length ? (
          <div className="service-grid">
            {featured.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            New wedding services are coming soon. Browse all services to explore
            the marketplace.
          </p>
        )}
      </section>

      <section className="category-section">
        <div className="content-wrap">
          <SectionHeading
            eyebrow="EXPLORE BY SPECIALTY"
            title="Wedding service categories"
            description="Find the right kind of wonderful for every chapter of your wedding weekend."
          />
          <div className="category-grid">
            {categories.map(({ title, detail, icon: Icon, image }) => (
              <Link
                href={`/services?category=${encodeURIComponent(title)}`}
                className="category-card"
                key={title}
                style={{
                  backgroundImage: `linear-gradient(0deg,rgba(31,18,21,.74),rgba(31,18,21,.08) 76%),url(${imageUrl(image, 700)})`,
                }}
              >
                <span className="category-icon">
                  <Icon size={17} />
                </span>
                <span className="category-text">
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
                <ArrowUpRight className="category-arrow" size={19} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="promise-section content-wrap">
        <div className="promise-copy">
          <span className="eyebrow">THE WEDPLAN PROMISE</span>
          <h2>
            Good planning
            <br />
            makes room for <em>good memories.</em>
          </h2>
          <p>
            Less spreadsheet juggling. More feeling excited. WedPlan brings the
            details and the people you trust into one calm, clear place.
          </p>
          <Link href="/services" className="button button-primary">
            Find your people <ArrowRight size={16} />
          </Link>
        </div>
        <div className="promise-list">
          <div>
            <span>
              <Check size={18} />
            </span>
            <section>
              <strong>Thoughtfully vetted</strong>
              <p>
                Every service is reviewed by our team before couples can find
                it.
              </p>
            </section>
          </div>
          <div>
            <span>
              <Check size={18} />
            </span>
            <section>
              <strong>Clear from the start</strong>
              <p>
                Compare starting prices, locations, and service details upfront.
              </p>
            </section>
          </div>
          <div>
            <span>
              <Check size={18} />
            </span>
            <section>
              <strong>Your plans, in one place</strong>
              <p>
                Send a request and follow every update right from your
                dashboard.
              </p>
            </section>
          </div>
        </div>
        <div
          className="promise-photo"
          style={{
            backgroundImage: `url(${imageUrl("photo-1529636798458-92182e662485", 1100)})`,
          }}
        >
          <span>
            <Heart size={16} fill="currentColor" /> here's to the good stuff
          </span>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="content-wrap">
          <SectionHeading
            eyebrow="LOVE NOTES"
            title="Stories from happy couples"
          />
          <div className="testimonial-grid">
            <blockquote>
              <span>“</span>
              <p>
                WedPlan helped us find our dream garden estate, floral designer,
                and photographer without losing our weekends to research.
              </p>
              <footer>
                <strong>Sophia & Liam Harrison</strong>
                <small>Napa Valley, CA · Married October 2025</small>
              </footer>
            </blockquote>
            <blockquote>
              <span>“</span>
              <p>
                We could compare vendors and pricing in one place. The whole
                process felt thoughtful, clear, and surprisingly fun.
              </p>
              <footer>
                <strong>Amara & Daniel Vance</strong>
                <small>Austin, TX · Married May 2026</small>
              </footer>
            </blockquote>
            <blockquote>
              <span>“</span>
              <p>
                From the first request to the final details, WedPlan made it
                easy to find people who understood our vision.
              </p>
              <footer>
                <strong>Clara & Ethan Brooks</strong>
                <small>Charleston, SC · Married August 2026</small>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="closing-cta">
        <div className="closing-inner">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>
            Let’s make this feel like <em>you.</em>
          </h2>
          <p>The right people make all the difference. Let’s find yours.</p>
          <Link href="/services" className="button button-gold">
            Browse wedding services <ArrowRight size={16} />
          </Link>
          <span className="closing-heart">
            <Heart size={32} strokeWidth={1} />
          </span>
        </div>
      </section>
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
    </main>
  )
}
