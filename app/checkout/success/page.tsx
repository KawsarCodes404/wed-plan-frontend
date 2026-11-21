import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, CircleCheck } from "lucide-react"
import { SiteNavbar } from "@/components/side-navbar"
import { CheckoutStatus } from "./status"

export const metadata: Metadata = { title: "WedPlan Premium checkout" }

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  return (
    <>
      <SiteNavbar />
      <main className="checkout-result-page">
        <CheckoutStatus sessionId={sessionId || ""} />
      </main>
    </>
  )
}
