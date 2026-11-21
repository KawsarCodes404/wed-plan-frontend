import { SiteNavbar } from "@/components/side-navbar"

export default function ServicesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  )
}
