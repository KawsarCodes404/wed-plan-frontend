"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  BadgeCheck,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"
import { RevealGrid } from "@/components/reveal-grid"
import { FilterDropdown } from "@/components/ui/filter-dropdown"

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]
const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")

type Service = {
  _id: string
  serviceName: string
  category: string
  description: string
  location: string
  price: number
  images: string[]
  vendor?: {
    name?: string
    businessName?: string
    image?: string | null
    isPremium?: boolean
  }
}
type Result = {
  services: Service[]
  total: number
  pages: number
  page: number
}

function ServiceTile({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div
        className="service-image"
        style={{
          backgroundImage: `url(${service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"})`,
        }}
      >
        <span className="category-pill">{service.category}</span>
        {service.vendor?.isPremium && (
          <span className="partner-pill">
            <Sparkles size={13} /> Featured Partner
          </span>
        )}
        <span className="price-pill">
          ${Number(service.price).toLocaleString()}
        </span>
      </div>
      <div className="service-content">
        <h3>{service.serviceName}</h3>
        <p className="service-location">
          <MapPin size={15} />
          {service.location}
        </p>
        <p className="service-description">{service.description}</p>
        <div className="vendor-line">
          {service.vendor?.image ? (
            <img
              className="vendor-avatar-photo"
              src={service.vendor.image}
              alt=""
            />
          ) : (
            <span className="vendor-avatar">
              {(
                service.vendor?.businessName ||
                service.vendor?.name ||
                "W"
              ).slice(0, 1)}
            </span>
          )}
          <div>
            <strong>
              {service.vendor?.businessName ||
                service.vendor?.name ||
                "Wedding professional"}
            </strong>
            <small>
              {service.vendor?.isPremium ? "Premium Vendor" : "Verified Vendor"}
            </small>
          </div>
          <BadgeCheck className="verified-icon" size={18} />
        </div>
        <Link
          className="button button-primary card-link"
          href={`/services/${service._id}`}
        >
          View Details <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  )
}

export default function ServicesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [sort, setSort] = useState("newest")
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    sort: "newest",
    page: 1,
  })
  const [services, setServices] = useState<Service[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadServices = useCallback(async () => {
    setLoading(true)
    setError("")
    const query = new URLSearchParams()
    if (filters.search.trim()) query.set("search", filters.search.trim())
    if (filters.category) query.set("category", filters.category)
    if (filters.location.trim()) query.set("location", filters.location.trim())
    query.set("sort", filters.sort)
    query.set("page", String(filters.page))
    query.set("limit", "9")
    try {
      const response = await fetch(`${apiBase}/services?${query.toString()}`)
      if (!response.ok) throw new Error("We couldn't load services right now.")
      const result = (await response.json()) as Result
      setServices(result.services || [])
      setTotal(result.total || 0)
      setPageCount(Math.max(1, result.pages || 1))
    } catch (reason) {
      setServices([])
      setTotal(0)
      setPageCount(1)
      setError(
        reason instanceof Error
          ? reason.message
          : "We couldn't load services right now."
      )
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearch(params.get("search") || "")
    setCategory(params.get("category") || "")
    setLocation(params.get("location") || "")
    setSort(params.get("sort") || "newest")
    setFilters({
      search: params.get("search") || "",
      category: params.get("category") || "",
      location: params.get("location") || "",
      sort: params.get("sort") || "newest",
      page: 1,
    })
  }, [])
  useEffect(() => {
    void loadServices()
  }, [loadServices])

  const hasSearchFilters = Boolean(
    filters.search.trim() || filters.category || filters.location.trim()
  )

  return (
    <>
      <main className="services-page">
        <div className="content-wrap">
          <div className="services-intro">
            <span className="eyebrow">
              <Sparkles size={13} /> CURATED WEDDING MARKETPLACE
            </span>
            <h1>Browse Wedding Services</h1>
            <p>
              Search verified photographers, dream venues, florists, caterers,
              and stylists. Sign in to view full galleries and send booking
              requests.
            </p>
          </div>
          <form
            className="service-filters"
            onSubmit={(event) => {
              event.preventDefault()
              setFilters({ search, category, location, sort, page: 1 })
            }}
          >
            <label className="filter-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search service name or keyword…"
                aria-label="Search services"
              />
            </label>
            <FilterDropdown
              className="filter-category-dropdown"
              label="Filter by category"
              value={category}
              onChange={setCategory}
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((item) => ({ value: item, label: item })),
              ]}
            />
            <label className="filter-search location-filter">
              <MapPin size={17} />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Filter by city / location…"
                aria-label="Filter by location"
              />
            </label>
            <FilterDropdown
              className="filter-sort-dropdown"
              label="Sort services"
              value={sort}
              onChange={setSort}
              icon={SlidersHorizontal}
              options={[
                { value: "newest", label: "Featured & Newest" },
                { value: "priceAsc", label: "Price: Low to High" },
                { value: "priceDesc", label: "Price: High to Low" },
              ]}
            />
            <button
              className="button button-primary filter-submit"
              type="submit"
            >
              Search
            </button>
          </form>
          <div className="results-meta">
            {loading
              ? "Finding lovely services…"
              : `Showing ${total} approved wedding ${total === 1 ? "service" : "services"}`}
          </div>
          {error ? (
            <div className="services-empty">
              <h2>We couldn’t load services</h2>
              <p>{error}</p>
              <button
                className="button button-primary"
                onClick={() =>
                  setFilters({ ...filters, search, category, location, sort })
                }
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="service-grid">
              {[1, 2, 3].map((key) => (
                <div className="service-skeleton" key={key} />
              ))}
            </div>
          ) : services.length ? (
            <>
              <RevealGrid className="service-grid">
                {services.map((service) => (
                  <ServiceTile key={service._id} service={service} />
                ))}
              </RevealGrid>
              {pageCount > 1 && (
                <nav className="service-pagination" aria-label="Service pages">
                  <button
                    className="button button-outline"
                    disabled={filters.page <= 1}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {filters.page} of {pageCount}
                  </span>
                  <button
                    className="button button-outline"
                    disabled={filters.page >= pageCount}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="services-empty">
              <span className="empty-heart">
                <Search size={21} />
              </span>
              <h2>
                {hasSearchFilters
                  ? "No matching wedding services found"
                  : "No approved wedding services yet"}
              </h2>
              <p>
                {hasSearchFilters
                  ? "Try adjusting your search keywords, category, or location filters."
                  : "New vendor services appear here after an administrator reviews and approves them. Check the Service Reviews section in the admin dashboard."}
              </p>
              <button
                className="button button-outline"
                onClick={() => {
                  setSearch("")
                  setCategory("")
                  setLocation("")
                  setSort("newest")
                  setFilters({
                    search: "",
                    category: "",
                    location: "",
                    sort: "newest",
                    page: 1,
                  })
                }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
