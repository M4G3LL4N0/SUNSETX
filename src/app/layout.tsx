import "./globals.css"
import type { Metadata, Viewport } from "next"
import React from "react"

export const metadata: Metadata = {
  title: {
    default: "SUNSETX",
    template: "%s | SUNSETX",
  },
  description:
    "Predicts and ranks the best sunset experiences using weather, timing, and location data.",
  applicationName: "SUNSETX",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sunsetx.vercel.app"),
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  )
}
