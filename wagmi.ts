import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { embeddedWallet } from "@civic/auth-web3/wagmi";

export const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        embeddedWallet(),
        injected(),
        coinbaseWallet(),
        walletConnect({ projectId: (import.meta as any).env.NEXT_PUBLIC_CIVIC_CLIENT_ID })
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http()
    }
})

interface ImportMeta {
    env: {
        NEXT_PUBLIC_CIVIC_CLIENT_ID: string;
    };
}

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}