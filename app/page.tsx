"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { Clock, Users, Gift, Trophy, Share2, Ticket, Wallet, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast" // Make sure to import toast

import RaffleDrum from "@/components/raffle-drum"
import FloatingElements from "@/components/floating-elements"
import { Shield } from "lucide-react"
import { UserButton } from "@civic/auth-web3/react"

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false)
  const [balance, setBalance] = useState(null)
  const userContext = useUser()
  const { user, signIn, isLoading } = userContext

  useEffect(() => {
    // Show animation after a short delay
    const timer = setTimeout(() => {
      setShowAnimation(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Add effect to fetch wallet balance when user connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (userHasWallet(userContext)) {
        try {
          // You'll need to implement this function based on your web3 provider
          // This is a placeholder - you should use the appropriate method for your setup
          const ethBalance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [userContext.ethereum.address, 'latest']
          })
          
          // Convert from wei to ETH
          const balanceInEth = parseInt(ethBalance, 16) / 1e18
          
          setBalance({
            data: {
              value: ethBalance,
              symbol: 'ETH',
              formatted: balanceInEth.toFixed(4)
            }
          })
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    }
    
    fetchBalance()
  }, [userContext])

  const doSignIn = useCallback(() => {
    console.log("Starting sign-in process")
    signIn()
      .then(() => {
        console.log("Sign-in completed successfully")
      })
      .catch((error) => {
        console.error("Sign-in failed:", error)
      })
  }, [signIn])

  // Create a component to display wallet info
  const WalletDetails = () => {
    if (!userHasWallet(userContext)) {
      return (
        <div className="p-4 rounded-lg border bg-card shadow-md mb-6">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">No Wallet Connected</span>
          </div>
          <Button 
            onClick={doSignIn}
            className="mt-2 w-full"
            variant="outline"
          >
            Connect Wallet
          </Button>
        </div>
      )
    }

    return (
      <div className="p-4 rounded-lg border bg-card shadow-md mb-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-primary mr-2" />
            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
              <Check className="h-3 w-3 text-green-500" />
            </div>
            <span className="text-sm font-medium">Wallet Connected</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                {userContext.ethereum.address.substring(0, 6)}...{userContext.ethereum.address.substring(userContext.ethereum.address.length - 4)}
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => {
                  navigator.clipboard.writeText(userContext.ethereum.address)
                  toast({
                    title: "Success",
                    description: "Address copied to clipboard"
                  })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {balance?.data
                  ? `${balance.data.formatted} ${balance.data.symbol}`
                  : "Loading..."}
              </span>
              {(balance?.data && BigInt(balance.data.value) === BigInt(0)) && (
                <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Low balance
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <FloatingElements />

      <div className="absolute flex gap-4 justify-items-center top-4 right-4 z-10">
        <Link href="/profile">
          <Button
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            My Profile
          </Button>
        </Link>
        
        <UserButton 
          className="bg-white/55 border-white/30 text-white hover:bg-white/30"
        />
      </div>
      
      {/* Wallet details panel - now conditionally rendered */}
      <div className="absolute top-20 right-4 z-10 w-64">
        <WalletDetails />
      </div>
      
      <div className="container max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 z-10">
        {/* Rest of your component remains the same */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-2">HumanRaffle</h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">Fun raffles for real humans, not bots!</p>


        </motion.div>
  <p className="text-xl text-white/80 max-w-md mx-auto">
            Verify your identity with Civic Auth to participate in exclusive raffles and win amazing prizes!
          </p>
        <div className="relative w-full max-w-md aspect-square">
          <RaffleDrum animate={showAnimation} />
          
        </div>
        

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md mb-6">Only Humans May Win 🧍‍♂️🎟️</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/raffles">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-white/90 shadow-lg">
                Browse Raffles
              </Button>
            </Link>

            {!userHasWallet(userContext) ? (
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-purple-600/30 backdrop-blur-sm border-white/30 text-white hover:bg-purple-600/50 shadow-lg"
                onClick={doSignIn}
              >
                <Shield className="h-5 w-5 mr-2" />
                Verify & Join
              </Button>
            ) : (
              <Link href="/winners-board">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 bg-purple-600/30 backdrop-blur-sm border-white/30 text-white hover:bg-purple-600/50 shadow-lg"
                >
                  <Ticket className="h-5 w-5 mr-2" />
                  Winners-Board
                </Button>
              </Link>
            )}
          </div>

        
        </motion.div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-white/60 text-sm">
        © {new Date().getFullYear()} HumanRaffle • Powered by Civic Auth
      </footer>
    </main>
  )
}