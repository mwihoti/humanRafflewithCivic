'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/app/wagmi'
import { CivicAuthProvider } from '@civic/auth-web3/nextjs'


// create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode; }) {
    const civicClientId1 = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID!;
    
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
           
                <CivicAuthProvider 
                    clientId={civicClientId1}
                    // Explicitly specify your redirect URL to match what's in the Civic dashboard
                    redirectUrl={typeof window !== 'undefined' ? window.location.origin : ''}
                    // Add any other required config options
                >
                    {children}
                </CivicAuthProvider>
            </WagmiProvider>
        </QueryClientProvider>
    )
}