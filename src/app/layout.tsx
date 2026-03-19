import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SUNSETX",
  description:
    "SUNSETX predicts and ranks the best sunset experiences using weather, timing, location, and environmental signals.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
