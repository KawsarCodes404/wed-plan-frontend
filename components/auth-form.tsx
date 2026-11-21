"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CheckboxRow, controlClasses, FormField } from "@/components/ui/field"
import { PillRadioGroup } from "@/components/ui/pill-radio-group"
import { authClient } from "@/lib/auth-client"
import { uploadProfileImage } from "@/lib/image-upload"

export type AuthMode = "sign-in" | "sign-up"

const COPY = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to pick up where you left off.",
    submit: "Sign In",
    switchText: "Don't have an account?",
    switchLink: { href: "/sign-up", label: "Sign Up" },
    extraHref: "/forgot-password",
    extraLabel: "Forgot password?",
  },
  "sign-up": {
    title: "Create your account",
    subtitle: "Build a profile in minutes. The matches start tomorrow.",
    submit: "Create Account",
    switchText: "Already have an account?",
    switchLink: { href: "/sign-in", label: "Sign In" },
    extraHref: "/sign-up",
    extraLabel: null as string | null,
  },
} satisfies Record<
  AuthMode,
  {
    title: string
    subtitle: string
    submit: string
    switchText: string
    switchLink: { href: string; label: string }
    extraHref: string
    extraLabel: string | null
  }
>

const fieldClasses = controlClasses

// Auth labels use the Manrope font and a lighter weight than the dashboard forms.
const labelClasses = "text-sm text-[#5e5551]"

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
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
        const roleHome =
          role === "admin"
            ? "/dashboard/admin"
            : role === "vendor"
              ? "/dashboard/vendor"
              : "/dashboard/customer"
        router.push(
          isSignUp ? roleHome : redirectTo === "/" ? roleHome : redirectTo
        )
      }
    } catch {
      setSubmitError(
        "Unable to connect. Please check your connection and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-card w-full max-w-md rounded-2xl p-6 md:p-8">
      {/* Toggle between the two pages */}
      <nav
        aria-label="Authentication"
        className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-[#161618] p-1"
      >
        <Link
          href="/sign-in"
          aria-current={mode === "sign-in" ? "page" : undefined}
          className={cn(
            "rounded-full py-2 text-center text-sm transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50",
            mode === "sign-in"
              ? "bg-brand shadow-brand-glow font-medium text-white"
              : "text-white/60 hover:text-white"
          )}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          aria-current={mode === "sign-up" ? "page" : undefined}
          className={cn(
            "rounded-full py-2 text-center text-sm transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50",
            mode === "sign-up"
              ? "bg-brand shadow-brand-glow font-medium text-white"
              : "text-white/60 hover:text-white"
          )}
        >
          Sign Up
        </Link>
      </nav>

      <h1 className="font-manrope mt-6 text-2xl font-bold text-white md:text-3xl">
        {copy.title}
      </h1>
      <p className="font-manrope mt-1 text-sm text-white/60">{copy.subtitle}</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        noValidate={false}
      >
        {isSignUp && (
          <FormField
            id="name"
            label="Full name"
            required
            labelClassName={labelClasses}
          >
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Alex Sterling"
              className={fieldClasses}
            />
          </FormField>
        )}

        {isSignUp && (
          <FormField
            id="profileImage"
            label="Profile image"
            labelClassName={labelClasses}
            hint={<span className="text-xs text-white/40">Optional</span>}
          >
            <div className="flex items-center gap-3">
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element -- blob: preview URL from the local file picker
                <img
                  src={imagePreview}
                  alt="Selected profile preview"
                  className="size-11 shrink-0 rounded-full border border-white/10 object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                  aria-describedby={
                    imageError ? "profileImage-error" : "profileImage-status"
                  }
                  className={cn(
                    fieldClasses,
                    "cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white/70 hover:file:bg-white/15"
                  )}
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
                      : "PNG, JPG, or GIF. Maximum 5 MB."}
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearProfileImage}
                  disabled={isUploadingImage}
                >
                  Remove
                </Button>
              )}
            </div>
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
            !isSignUp && (
              <Link
                href={copy.extraHref}
                className="text-sm text-[#958eff] transition-colors outline-none hover:text-[#b1a8ff] focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {copy.extraLabel}
              </Link>
            )
          }
        >
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="At least 8 characters"
              className={cn(fieldClasses, "pr-10")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handlePasswordToggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-1 -translate-y-1/2 text-white/60 hover:bg-white/5 hover:text-white"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </FormField>

        {isSignUp && (
          <PillRadioGroup
            name="role"
            label="I am joining as"
            options={ROLE_OPTIONS}
            defaultValue="customer"
            variant="solid"
            gridClassName="grid-cols-2 gap-1.5"
          />
        )}

        {isSignUp ? (
          <CheckboxRow name="agreeTerms" required>
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[#958eff] hover:text-[#b1a8ff]"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#958eff] hover:text-[#b1a8ff]"
              >
                Privacy Policy
              </Link>
            </span>
          </CheckboxRow>
        ) : (
          <CheckboxRow name="remember">Remember me</CheckboxRow>
        )}

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

        <p className="text-center text-sm text-white/60">
          {copy.switchText}{" "}
          <Link
            href={copy.switchLink.href}
            className="text-[#958eff] transition-colors outline-none hover:text-[#b1a8ff] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {copy.switchLink.label}
          </Link>
        </p>
      </form>
    </div>
  )
}
