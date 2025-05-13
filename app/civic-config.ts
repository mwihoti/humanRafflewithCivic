// Configuration for Civic Auth
// This file should be imported in your app/layout.tsx

import { CivicAuth } from "@civic/auth-web3"

// Initialize Civic Auth with your client ID
export const civicAuth = new CivicAuth({
  clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || "civic-client-id-placeholder",
  redirectUrl: typeof window !== "undefined" ? window.location.origin : undefined,
})

// Enable WalletConnect with your project ID
civicAuth.configure({
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  appName: "HumanRaffle",
  // You can customize the appearance of the Civic Auth modal
  appearance: {
    theme: "dark", // or "light"
    accentColor: "#8b5cf6", // Purple to match your app's theme
    logo: "/logo.png", // Optional: Add your logo
  },
})
