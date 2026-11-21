"use client"

import { useEffect, useState } from "react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"
import { uploadProfileImage } from "@/lib/image-upload"

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "")
export function ProfileSettings() {
  const { data: session } = useSession()
  const user = session?.user as
    | {
        name?: string
        image?: string | null
        role?: string
        businessName?: string
        location?: string
        bio?: string
      }
    | undefined
  const [name, setName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [image, setImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    setName(user?.name || "")
    setBusinessName(user?.businessName || "")
    setLocation(user?.location || "")
    setBio(user?.bio || "")
    setImage(user?.image || "")
  }, [user?.name, user?.businessName, user?.location, user?.bio, user?.image])
  async function changeImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      setImage(await uploadProfileImage(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.")
    } finally {
      setUploading(false)
    }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const token = await getApiToken()
    if (!token) return
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const response = await fetch(`${apiBase}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, image, businessName, location, bio }),
      })
      const result = await response.json()
      if (!response.ok)
        throw new Error(result.message || "Profile could not be saved.")
      setMessage("Your profile is up to date.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile could not be saved.")
    } finally {
      setSaving(false)
    }
  }
  return (
    <section className="dashboard-panel">
      <form className="vendor-service-form" onSubmit={save}>
        <div className="profile-image-row">
          <div className="profile-image-preview">
            {image ? (
              <img src={image} alt="Profile preview" />
            ) : (
              <span>{name.slice(0, 1) || "W"}</span>
            )}
          </div>
          <label className="profile-file-label">
            {uploading ? "Uploading photo…" : "Upload profile photo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={changeImage}
            />
            <small>PNG, JPG, or WebP up to 5 MB</small>
          </label>
        </div>
        <div className="vendor-form-grid">
          <label>
            Full name
            <input
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {user?.role === "vendor" && (
            <label>
              Business name
              <input
                maxLength={100}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your studio or business"
              />
            </label>
          )}
          <label>
            Location
            <input
              maxLength={120}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or region"
            />
          </label>
          {user?.role === "vendor" && (
            <label className="wide-field">
              About your business
              <textarea
                rows={4}
                maxLength={500}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few words about your work and what couples can expect…"
              />
            </label>
          )}
        </div>
        {message && <p className="dashboard-notice">{message}</p>}
        {error && (
          <p className="dashboard-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button button-primary"
          disabled={saving || uploading}
        >
          {saving ? "Saving profile…" : "Save profile"}
        </button>
      </form>
    </section>
  )
}
