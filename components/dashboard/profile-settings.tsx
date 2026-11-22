"use client"

import { useEffect, useState } from "react"
import { getApiToken } from "@/lib/api-token"
import { useSession } from "@/lib/auth-client"
import { uploadProfileImage } from "@/lib/image-upload"
import { toast } from "@/components/ui/toast"

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
        email?: string
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
      toast.add({
        title: result.message || "Profile saved.",
        type: "success",
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile could not be saved.")
    } finally {
      setSaving(false)
    }
  }
  return (
    <section className="dashboard-panel profile-settings-panel">
      <form className="profile-settings-form" onSubmit={save}>
        <header className="profile-settings-intro">
          <h2>Profile Settings</h2>
          <p>
            Update your personal details and profile photo. Role and
            subscription status are managed securely by the platform.
          </p>
          <span className="profile-role-badge">
            {user?.role === "admin"
              ? "Admin"
              : user?.role === "vendor"
                ? "Vendor"
                : "Customer"}
          </span>
        </header>
        <div className="profile-image-card">
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
          <label>
            Email address
            <input value={user?.email || ""} disabled />
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
          <label className="wide-field">
            {user?.role === "vendor" ? "About your business" : "Bio / About"}
            <textarea
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={
                user?.role === "vendor"
                  ? "A few words about your work and what couples can expect…"
                  : "Tell couples or vendors a little about yourself…"
              }
            />
          </label>
        </div>
        {message && <p className="dashboard-notice">{message}</p>}
        {error && (
          <p className="dashboard-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button button-primary profile-save-button"
          disabled={saving || uploading}
        >
          {saving ? "Saving profile…" : "Save profile"}
        </button>
      </form>
    </section>
  )
}
