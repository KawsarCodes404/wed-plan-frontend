import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { RouteToast } from "@/components/route-toast"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WedPlan | Wedding services, thoughtfully found",
  description:
    "Find trusted wedding photographers, venues, florists, caterers, and stylists in one place.",
  applicationName: "WedPlan",
  openGraph: {
    title: "WedPlan | Wedding services, thoughtfully found",
    description:
      "Discover admin-vetted wedding professionals and keep every booking request together.",
    siteName: "WedPlan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WedPlan | Wedding services, thoughtfully found",
    description:
      "Discover trusted wedding photographers, venues, florists, caterers, and stylists.",
  },
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Toaster>
            <RouteToast />
            {children}
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  )
}
