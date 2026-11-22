import { SiteNavbar } from "@/components/side-navbar"
import { SiteFooter } from "@/app/components/SiteFooter"

export default function ServicesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNavbar />
      {children}
      <SiteFooter />
    </>
  )
}
