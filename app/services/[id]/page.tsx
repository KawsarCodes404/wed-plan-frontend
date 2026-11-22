import Link from "next/link"
import { ArrowLeft, BadgeCheck, MapPin } from "lucide-react"
import { BookingForm } from "./booking-form"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ServiceGallery } from "./service-gallery"
import { getSession } from "@/lib/core/server"
import { redirect } from "next/navigation"

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
    id?: string
    name?: string
    businessName?: string
    image?: string | null
    location?: string
    bio?: string
    isPremium?: boolean
  }
}

export const metadata: Metadata = {
  title: "Wedding Service Details | WedPlan",
  description: "View wedding service details and send a booking request.",
}

async function getService(id: string): Promise<Service | null> {
  const response = await fetch(
    `${apiBase}/services/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  )

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("We couldn’t load this service. Please try again.")
  }

  try {
    return (await response.json()) as Service
  } catch {
    throw new Error("We couldn’t read this service right now. Please try again.")
  }
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session) {
    redirect(`/sign-in?callbackURL=${encodeURIComponent(`/services/${id}`)}`)
  }
  if (session.user.isBlocked) redirect("/unauthorized")

  const service = await getService(id)
  if (!service) notFound()

  return (
    <>
      <main className="service-detail-page">
        <div className="content-wrap">
          <>
            <Link href="/services" className="back-link">
              <ArrowLeft size={16} /> Back to browse services
            </Link>
            <div className="detail-layout">
              <div className="detail-main">
                <ServiceGallery
                  images={service.images || []}
                  category={service.category}
                  premium={service.vendor?.isPremium}
                />
                <article className="detail-information">
                  <h1>{service.serviceName}</h1>
                  <p className="service-location">
                    <MapPin size={16} />
                    {service.location}
                  </p>
                  <div className="starting-price">
                    <small>Starting Package</small>
                    <strong>${Number(service.price).toLocaleString()}</strong>
                  </div>
                  <hr />
                  <h2>About This Service</h2>
                  <p className="detail-description">{service.description}</p>
                  <hr />
                  <h2>Vendor Information</h2>
                  <div className="vendor-profile">
                    {service.vendor?.image ? (
                      <img src={service.vendor.image} alt="" />
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
                      <div className="vendor-profile-name">
                        {service.vendor?.businessName ||
                          service.vendor?.name ||
                          "Wedding professional"}
                        {service.vendor?.isPremium && (
                          <span>
                            <BadgeCheck size={13} /> Premium
                          </span>
                        )}
                      </div>
                      <small>
                        Based in {service.vendor?.location || service.location}
                      </small>
                      <p>
                        {service.vendor?.bio ||
                          "A trusted wedding professional ready to help bring your celebration to life."}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
              <BookingForm serviceId={service._id} />
            </div>
          </>
        </div>
      </main>
    </>
  )
}
