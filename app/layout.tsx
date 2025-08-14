import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "MARCLINK TECHNOLOGIES – Expert Tech Repair & IT Solutions | Mossel Bay",
  description:
    "Professional tech repair services in Mossel Bay, Western Cape. Expert cellphone, laptop, PC repairs, TV services, and IT solutions since 2016. CIPC registered business.",
  keywords:
    "tech repair Mossel Bay, cellphone repair Western Cape, laptop repair, PC repair, TV installation, IT solutions, MARCLINK TECHNOLOGIES",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
