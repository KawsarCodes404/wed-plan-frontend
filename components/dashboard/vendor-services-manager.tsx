"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ArrowRight, ImagePlus, Pencil, Trash2 } from "lucide-react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"
import { uploadProfileImage } from "@/lib/image-upload"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]
type Service = {
  _id: string
  serviceName: string
  category: string
  location: string
  price: number
  status: string
  isActive: boolean
  description: string
  images: string[]
}

export function VendorServicesManager() {
  const { data: session } = useSession()
  const [rows, setRows] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState("")
  const load = useCallback(async () => {
    const token = await getApiToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const response = await fetch(`${apiBase}/vendor/services`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Unable to load your services.")
      setRows((await response.json()) as Service[])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load services.")
    } finally {
      setLoading(false)
    }
  }, [session])
  useEffect(() => {
    void load()
  }, [load])
  async function update(service: Service, action: "availability" | "delete") {
    const token = await getApiToken()
    if (!token) return
    setBusy(service._id)
    setError("")
    try {
      const response = await fetch(
        `${apiBase}/vendor/services/${service._id}${action === "availability" ? "/availability" : ""}`,
        {
          method: action === "availability" ? "PATCH" : "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body:
            action === "availability"
              ? JSON.stringify({ isActive: !service.isActive })
              : undefined,
        }
      )
      const result = await response.json().catch(() => ({}))
      if (!response.ok)
        throw new Error(result.message || "Unable to update service.")
      setNotice(
        action === "delete"
          ? "Service removed."
          : `Service ${service.isActive ? "paused" : "activated"}.`
      )
      toast.add({
        title:
          action === "delete" ? "Service removed." : "Availability updated.",
        type: "success",
      })
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update service.")
    } finally {
      setBusy("")
    }
  }
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <span className="eyebrow">YOUR LISTINGS</span>
          <h2>My wedding services</h2>
        </div>
        <Link
          className="button button-primary"
          href="/dashboard/vendor/add-service"
        >
          Add service <ArrowRight size={15} />
        </Link>
      </div>
      {notice && <p className="dashboard-notice">{notice}</p>}
      {error && (
        <div className="dashboard-error" role="alert">
          <p>{error}</p>
          {error.includes("Free plan includes") && (
            <Link
              className="button button-primary"
              href="/dashboard/vendor/subscription"
            >
              Upgrade to Premium <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}
      {loading ? (
        <p className="dashboard-muted">Loading your services…</p>
      ) : rows.length === 0 ? (
        <div className="dashboard-empty">
          <h3>Your next great listing starts here</h3>
          <p>
            Add a service to introduce your work to couples planning their day.
          </p>
          <Link
            className="button button-primary"
            href="/dashboard/vendor/add-service"
          >
            Add your first service
          </Link>
        </div>
      ) : (
        <div className="managed-service-list">
          {rows.map((service) => (
            <article className="managed-service-row" key={service._id}>
              <div className="managed-service-symbol">
                <ImagePlus size={18} />
              </div>
              <div className="managed-service-info">
                <strong>{service.serviceName}</strong>
                <span>
                  {service.category} · ${Number(service.price).toLocaleString()}
                </span>
                <small>{service.location}</small>
              </div>
              <span
                className={`status-chip status-${service.status.toLowerCase()}`}
              >
                {service.status}
              </span>
              <label className="availability-control">
                <input
                  type="checkbox"
                  checked={service.isActive}
                  disabled={
                    busy === service._id || service.status !== "Approved"
                  }
                  onChange={() => void update(service, "availability")}
                />
                <span>{service.isActive ? "Active" : "Paused"}</span>
              </label>
              <Link
                className="icon-action"
                aria-label={`Edit ${service.serviceName}`}
                href={`/dashboard/vendor/services/${service._id}/edit`}
              >
                <Pencil size={15} />
              </Link>
              <button
                className="icon-action danger-action"
                disabled={busy === service._id}
                aria-label={`Delete ${service.serviceName}`}
                onClick={() => void update(service, "delete")}
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function VendorServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [name, setName] = useState(service?.serviceName || "")
  const [category, setCategory] = useState(service?.category || categories[0])
  const [price, setPrice] = useState(service ? String(service.price) : "")
  const [location, setLocation] = useState(service?.location || "")
  const [description, setDescription] = useState(service?.description || "")
  const [images, setImages] = useState<string[]>(service?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  async function selectImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    if (files.length + images.length > 6) {
      setError("Choose up to 6 images.")
      return
    }
    setUploading(true)
    setError("")
    try {
      const uploaded = await Promise.all(files.map(uploadProfileImage))
      setImages((current) => [...current, ...uploaded].slice(0, 6))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const token = await getApiToken()
    if (!token) {
      setError("Your sign-in session expired. Sign in again.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const response = await fetch(
        `${apiBase}/vendor/services${service ? `/${service._id}` : ""}`,
        {
          method: service ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceName: name,
            category,
            price: Number(price),
            location,
            description,
            images,
          }),
        }
      )
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.message || "Service could not be submitted.")
      toast.add({
        title: result.message || "Service submitted for review.",
        type: "success",
      })
      router.push("/dashboard/vendor/services")
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Service could not be submitted."
      )
    } finally {
      setSaving(false)
    }
  }
  return (
    <form className="vendor-service-form" onSubmit={submit}>
      <div className="vendor-form-grid">
        <label>
          Service name
          <input
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Full-day wedding photography"
          />
        </label>
        <label>
          Service category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Starting price (USD)
          <input
            required
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="2500"
          />
        </label>
        <label>
          Location / coverage area
          <input
            required
            maxLength={160}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Napa Valley, CA"
          />
        </label>
        <label className="wide-field">
          Service description
          <textarea
            required
            maxLength={2000}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your service, what couples can expect, and what makes it special…"
          />
        </label>
      </div>
      <div className="vendor-upload">
        <label>
          Service images{" "}
          <small>(up to 6 images; first image is the cover)</small>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={selectImages}
          />
        </label>
        <div className="upload-previews">
          {images.map((src, index) => (
            <div key={src} style={{ backgroundImage: `url(${src})` }}>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      {error && (
        <div role="alert" className="dashboard-error">
          <p>{error}</p>
          {error.includes("Free plan includes") && (
            <Link
              className="button button-primary"
              href="/dashboard/vendor/subscription"
            >
              Upgrade to Premium <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}
      <button className="button button-primary" disabled={saving || uploading}>
        {uploading
          ? "Uploading images…"
          : saving
            ? "Submitting…"
            : "Publish service for review"}
      </button>
    </form>
  )
}
