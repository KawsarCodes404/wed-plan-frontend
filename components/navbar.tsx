"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type InitialSession = {
  user?: {
    id?: string
    name?: string
    email?: string
    image?: string | null
    role?: string
    subscriptionPlan?: string | null
  }
} | null

function Brand() {
  return (
    <Link href="/" aria-label="WedPlan home" className="brand-lockup">
      <span className="brand-mark">
        <Heart fill="currentColor" size={17} />
      </span>
      <span>
        <strong>WedPlan</strong>
        <small>WEDDING MARKETPLACE</small>
      </span>
    </Link>
  )
}

export default function Navbar({
  initialSession,
}: {
  initialSession: InitialSession
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data, isPending } = useSession()
  const session = isPending ? initialSession : data
  const role = session?.user?.role
  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : "/dashboard/customer"
  const settingsHref = `${dashboardHref}/settings`
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
    ...(role === "vendor"
      ? [{ href: dashboardHref, label: "Vendor Hub" }]
      : role === "customer"
        ? [{ href: dashboardHref, label: "My Bookings" }]
        : role === "admin"
          ? [{ href: dashboardHref, label: "Admin" }]
          : []),
  ]

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {session?.user ? (
            <details className="account-menu">
              <summary className="account-chip">
                {session.user.image ? (
                  <img src={session.user.image} alt="" />
                ) : (
                  <span className="account-placeholder">
                    <UserRound size={17} />
                  </span>
                )}
                <span>
                  <strong>{session.user.name || "Your account"}</strong>
                  <small>
                    {role === "vendor"
                      ? "Vendor"
                      : role === "admin"
                        ? "Administrator"
                        : "Customer"}
                  </small>
                </span>
              </summary>
              <div className="account-menu-panel">
                <div className="account-menu-details">
                  <strong>{session.user.name || "Your account"}</strong>
                  {session.user.email && <small>{session.user.email}</small>}
                  <span className="account-role-badges">
                    <span>
                      {role === "admin"
                        ? "Admin"
                        : role === "vendor"
                          ? "Vendor"
                          : "Customer"}
                    </span>
                    {role === "vendor" &&
                      session.user.subscriptionPlan === "Premium" && (
                        <span className="premium-role-badge">♛ Premium</span>
                      )}
                  </span>
                </div>
                <Link href={dashboardHref} className="account-menu-link">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link href={settingsHref} className="account-menu-link">
                  <Settings size={16} /> Profile Settings
                </Link>
                <button
                  className="account-menu-link account-menu-logout"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link href="/sign-in" className="sign-in-link">
                Sign in
              </Link>
              <Link href="/sign-up" className="signup-button">
                Sign up
              </Link>
            </>
          )}
        </div>
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="mobile-menu-trigger"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <Brand />
              </SheetTitle>
            </SheetHeader>
            <nav className="mobile-nav">
              {links.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} className="mobile-nav-link" />}
                >
                  {link.label}
                </SheetClose>
              ))}
              {session?.user ? (
                <button className="mobile-nav-link" onClick={handleSignOut}>
                  Sign out
                </button>
              ) : (
                <>
                  <SheetClose
                    render={
                      <Link href="/sign-in" className="mobile-nav-link" />
                    }
                  >
                    Sign in
                  </SheetClose>
                  <SheetClose
                    render={
                      <Link href="/sign-up" className="mobile-nav-link" />
                    }
                  >
                    Create account
                  </SheetClose>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
