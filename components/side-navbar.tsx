import { headers } from "next/headers"
import { getAuthSession } from "@/lib/auth"
import Navbar from "./navbar"

export async function SiteNavbar() {
  const initialSession = await getAuthSession(await headers())

  return <Navbar initialSession={initialSession} />
}
