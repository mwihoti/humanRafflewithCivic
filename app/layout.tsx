import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CivicAuthProvider } from "@civic/auth-web3/react";

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HumanRaffle - Only Humans May Win!",
  description: "Fun raffles exclusively for verified humans using Civic Auth",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <CivicAuthProvider clientId={process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID ?? "default-client-id"}>
            <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
              {children}
              <Toaster />
            </div>
          </CivicAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
