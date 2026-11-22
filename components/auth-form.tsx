"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { EyeIcon, EyeOffIcon, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CheckboxRow, controlClasses, FormField } from "@/components/ui/field"
import { PillRadioGroup } from "@/components/ui/pill-radio-group"
import { authClient } from "@/lib/auth-client"
import { uploadProfileImage } from "@/lib/image-upload"
import { addWelcomeQuery, dashboardPath } from "@/lib/auth-redirect"
import { isValidSignupPassword } from "@/lib/password"

export type AuthMode = "sign-in" | "sign-up"

const COPY = {
  "sign-in": {
    title: "Welcome Back to WedPlan",
    subtitle:
      "Sign in to explore service details, manage bookings, or grow your wedding studio.",
    submit: "Sign In",
    switchText: "Don't have an account?",
    switchLink: { href: "/sign-up", label: "Sign Up" },
  },
  "sign-up": {
    title: "Create Your WedPlan Account",
    subtitle:
      "Join as a couple planning your wedding or as a vendor offering curated services.",
    submit: "Create Account",
    switchText: "Already have an account?",
    switchLink: { href: "/sign-in", label: "Sign In" },
  },
} satisfies Record<
  AuthMode,
  {
    title: string
    subtitle: string
    submit: string
    switchText: string
    switchLink: { href: string; label: string }
  }
>

const fieldClasses = controlClasses

// Auth labels use the Manrope font and a lighter weight than the dashboard forms.
const labelClasses = "text-sm text-[#5e5551]"

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer", description: "Plan & book services" },
  { value: "vendor", label: "Vendor", description: "Publish wedding services" },
] as const

export function AuthForm({
  mode,
  redirectTo = "/",
}: {
  mode: AuthMode
  redirectTo?: string
}) {
  const router = useRouter()
  const copy = COPY[mode]
  const isSignUp = mode === "sign-up"
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState("customer")

  function handlePasswordToggle() {
    setShowPassword((prev) => !prev)
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    if (!file) return

    if (!file.type.startsWith("image/")) {
      event.target.value = ""
      setImageError("Choose an image file.")
      return
    }

    setImagePreview(URL.createObjectURL(file))
    setProfileImageUrl(null)
    setImageError(null)
    setIsUploadingImage(true)

    try {
      const imageUrl = await uploadProfileImage(file)
      setProfileImageUrl(imageUrl)
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again."
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  function clearProfileImage() {
    setImagePreview(null)
    setProfileImageUrl(null)
    setImageError(null)

    const input = document.getElementById(
      "profileImage"
    ) as HTMLInputElement | null
    if (input) input.value = ""
  }

  // Free the blob URL when the preview is replaced or the form unmounts.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (isSignUp && !isValidSignupPassword(password)) {
      setSubmitError(
        "Password must be 6–128 characters and include an uppercase and a lowercase letter."
      )
      return
    }

    if (isSignUp && imagePreview && !profileImageUrl) {
      setSubmitError(
        "Wait for the profile image upload to finish, or remove the image."
      )
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name: String(formData.get("name") ?? "").trim(),
            email,
            password,
            // Custom role declared in Better Auth's user.additionalFields.
            role: formData.get("role") === "vendor" ? "vendor" : "customer",
            callbackURL: "/",
            image: profileImageUrl ?? undefined,
          })
        : await authClient.signIn.email({
            email,
            password,
            rememberMe: formData.get("remember") === "on",
            callbackURL: redirectTo,
          })

      if (result.error) {
        setSubmitError(
          result.error.message || "Authentication failed. Please try again."
        )
      } else {
        const role = isSignUp
          ? String(formData.get("role") ?? "customer")
          : (result.data as { user?: { role?: string } } | null)?.user?.role
        const destination =
          redirectTo === "/" ? dashboardPath(role) : redirectTo
        router.push(isSignUp ? addWelcomeQuery(destination) : destination)
      }
    } catch {
      setSubmitError(
        "Unable to connect. Please check your connection and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: isSignUp
          ? addWelcomeQuery(
              redirectTo === "/" ? dashboardPath(selectedRole) : redirectTo
            )
          : redirectTo === "/"
            ? "/auth/continue"
            : redirectTo,
        additionalData: isSignUp ? { role: selectedRole } : undefined,
      })
      if (result.error)
        setSubmitError(
          result.error.message || "Google sign in failed. Please try again."
        )
    } catch {
      setSubmitError("Unable to connect to Google. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-card w-full max-w-md rounded-2xl p-6 md:p-8">
      <div className="auth-heading">
        <span className="auth-heart">
          <Heart size={21} fill="currentColor" />
        </span>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        noValidate={false}
      >
        {isSignUp && (
          <PillRadioGroup
            name="role"
            label="Account Role"
            options={ROLE_OPTIONS}
            defaultValue="customer"
            value={selectedRole}
            onValueChange={setSelectedRole}
            gridClassName="grid-cols-2 gap-2"
          />
        )}

        {isSignUp && (
          <FormField
            id="profileImage"
            label="Profile photo"
            labelClassName={labelClasses}
            hint={<span className="text-xs text-white/40">Optional</span>}
          >
            <div className="auth-image-picker">
              <span className="auth-image-preview">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local file preview
                  <img src={imagePreview} alt="Selected profile preview" />
                ) : (
                  <span>WP</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <label htmlFor="profileImage" className="auth-upload-button">
                  Upload Profile Photo (Optional)
                </label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                  aria-describedby={
                    imageError ? "profileImage-error" : "profileImage-status"
                  }
                  className="auth-file-input"
                />
                <p
                  id="profileImage-status"
                  className="mt-1 text-xs text-white/50"
                  aria-live="polite"
                >
                  {isUploadingImage
                    ? "Uploading image..."
                    : profileImageUrl
                      ? "Image uploaded and ready for your profile."
                      : "Hosted on ImgBB (PNG, JPG, WebP, max 5 MB)."}
                </p>
                {imageError && (
                  <p
                    id="profileImage-error"
                    role="alert"
                    className="mt-1 text-xs text-red-300"
                  >
                    {imageError}
                  </p>
                )}
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearProfileImage}
                  disabled={isUploadingImage}
                  className="auth-remove-image"
                >
                  Remove
                </button>
              )}
            </div>
          </FormField>
        )}

        {isSignUp && (
          <FormField
            id="name"
            label="Full Name"
            required
            labelClassName={labelClasses}
          >
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Emma Watson"
              className={fieldClasses}
            />
          </FormField>
        )}

        <FormField
          id="email"
          label="Email"
          required
          labelClassName={labelClasses}
        >
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClasses}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          required
          labelClassName={labelClasses}
          hint={
            isSignUp ? (
              <span className="auth-password-hint">
                Must be at least 6 characters with 1 uppercase and 1 lowercase
                letter.
              </span>
            ) : (
              null
            )
          }
        >
          <div className="auth-password-control">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={isSignUp ? 6 : undefined}
              maxLength={isSignUp ? 128 : undefined}
              pattern={
                isSignUp ? "(?=.*[a-z])(?=.*[A-Z]).{6,128}" : undefined
              }
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder={
                isSignUp
                  ? "Min 6 chars, 1 uppercase & 1 lowercase"
                  : "Enter your password"
              }
              className={cn(fieldClasses, "pr-12")}
            />
            <button
              type="button"
              onClick={handlePasswordToggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="auth-password-toggle"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </FormField>

        {!isSignUp && <CheckboxRow name="remember">Remember me</CheckboxRow>}

        {submitError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200"
          >
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
          className="font-instrument-sans bg-brand shadow-brand-glow hover:bg-brand-hover mt-1 h-10 w-full rounded-[10px] text-sm font-medium text-white md:h-11"
        >
          {isUploadingImage
            ? "Uploading image..."
            : isSubmitting
              ? "Please wait..."
              : copy.submit}
        </Button>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>
        <button
          type="button"
          className="auth-google-button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isUploadingImage}
        >
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
            />
            <path
              fill="#34A853"
              d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z"
            />
            <path
              fill="#FBBC05"
              d="M12.8 27.8a12 12 0 0 1 0-7.6V15H5.9a20 20 0 0 0 0 17.9l6.9-5.1Z"
            />
            <path
              fill="#EA4335"
              d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.9 15l6.9 5.2c1.6-4.7 6-8.2 11.2-8.2Z"
            />
          </svg>
          {isSubmitting
            ? "Connecting..."
            : isSignUp
              ? `Sign up with Google (${selectedRole === "vendor" ? "Vendor" : "Customer"})`
              : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-white/60">
          {copy.switchText}{" "}
          <Link
            href={
              !isSignUp && redirectTo !== "/"
                ? `${copy.switchLink.href}?callbackURL=${encodeURIComponent(redirectTo)}`
                : copy.switchLink.href
            }
            className="text-[#958eff] transition-colors outline-none hover:text-[#b1a8ff] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {copy.switchLink.label}
          </Link>
        </p>
      </form>
    </div>
  )
}
