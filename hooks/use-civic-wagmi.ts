'use client'

import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { useUser } from '@civic/auth-web3/react'
import { userHasWallet } from '@civic/auth-web3'
import { embeddedWallet } from "@civic/auth-web3/wagmi"


export function useAutoConnect() {
    const { user } = useUser()
    const { isConnected } = useAccount()
    const { connect, connectors } = useConnect()


    useEffect(() => {
        if (user && userHasWallet(user) && !isConnected) {
            const connector = connectors.find((c) => c.id === 'civic')
            if (connector) {
                connect({connector})
            }
        }
    }, [user, isConnected, connect, connectors])
}

export function useCreateWallet() {
    const { connect, connectors} = useConnect()

    return () => {
        const connector = connectors.find((c) => c.id === 'civic')
        if (connector) {
            connect({ connector})
        }
    }
}

export function useConnectWallet() {
    const { connect, connectors} = useConnect()

    return () => {
        const connector = connectors.find((c) => c.id === 'civic')
        if (connector) {
            connect({ connector })
        }
    }
}