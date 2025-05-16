// Configuration for Civic Auth

import { CivicAuth } from "@civic/auth-web3"


export const civicAuth = new CivicAuth({
  clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || "civic-client-id-placeholder",
  redirectUrl: typeof window !== "undefined" ? window.location.origin : undefined,
})

// Enable WalletConnect with your project ID
civicAuth.configure({
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  appName: "HumanRaffle",
  
  appearance: {
    theme: "dark", 
    accentColor: "#8b5cf6", 
    logo: "/logo.png", 
  },
})
