import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Navbar from "./navbar"

export async function SiteNavbar() {
  const initialSession = await auth.api.getSession({ headers: await headers() })

  return <Navbar initialSession={initialSession} />
}
