'use client'
import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
//import { Providers } from "@/app/providers"
import { CivicAuthProvider } from "@civic/auth-web3/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config  } from "@/app/wagmi"

const nunito = Nunito({ subsets: ["latin"] })

const queryClient = new QueryClient();



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
  
}>) {
  const civicClientId1 = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID ?? "default-client-id";
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID!;

  return (
    <html lang="en">
      <body className={nunito.className}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
              <QueryClientProvider client={queryClient}>
         
      <WagmiProvider config={config}>

          
            <CivicAuthProvider clientId={clientId as string}>
        
              <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
                {children}
                <Toaster />
              </div>
              </CivicAuthProvider>
        </WagmiProvider>
        </QueryClientProvider>
             
           
        </ThemeProvider>
      </body>
    </html>
  )
}
