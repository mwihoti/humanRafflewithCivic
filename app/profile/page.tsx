"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Ticket, Clock, User, Wallet, Check } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { toast } from "@/components/ui/use-toast"
import FloatingElements from "@/components/floating-elements"
import NFTTicket from "@/components/nft-ticket"
import { getRaffles } from "@/lib/raffle-service"
import type { Raffle } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const userContext = useUser()
  const { isLoading, user, signOut } = userContext
  const [activeRaffles, setActiveRaffles] = useState<Raffle[]>([])
  const [enteredRaffles, setEnteredRaffles] = useState<Raffle[]>([])
  const [isLoadingRaffles, setIsLoadingRaffles] = useState(true)
  const [balance, setBalance] = useState<{
    data?: {
      value: string
      symbol: string
      formatted: string
    }
  } | null>(null)

  // Define the handleLogout function
  const handleLogout = useCallback(async () => {
    try {
      await signOut()
      // Redirect to homepage after logout
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [signOut, router])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  // Add effect to fetch wallet balance when user connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (userHasWallet(userContext)) {
        try {
          // You'll need to implement this function based on your web3 provider
          // This is a placeholder - you should use the appropriate method for your setup
          const ethBalance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [userContext.ethereum.address, "latest"],
          })

          // Convert from wei to ETH
          const balanceInEth = Number.parseInt(ethBalance, 16) / 1e18

          setBalance({
            data: {
              value: ethBalance,
              symbol: "ETH",
              formatted: balanceInEth.toFixed(4),
            },
          })
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    }

    fetchBalance()
  }, [userContext])

  useEffect(() => {
    const fetchRaffles = async () => {
      if (!user) return

      try {
        setIsLoadingRaffles(true)
        const active = await getRaffles("active")
        const entered = await getRaffles("entered")
        setActiveRaffles(active)
        setEnteredRaffles(entered)
      } catch (error) {
        console.error("Error fetching raffles:", error)
      } finally {
        setIsLoadingRaffles(false)
      }
    }

    fetchRaffles()
  }, [user])

  // Create a component to display wallet info
  const WalletDetails = () => {
    if (!userHasWallet(userContext)) {
      return (
        <div className="bg-purple-50 p-4 rounded-md">
          <p className="text-sm text-gray-500 mb-1">Wallet Status</p>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-purple-500" />
            <p className="text-sm font-medium text-purple-700">No Wallet Connected</p>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-purple-50 p-4 rounded-md">
        <div className="space-y-3">
          <div className="flex items-center">
            <Wallet className="h-4 w-4 text-purple-500 mr-2" />
            <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
              <Check className="h-3 w-3 text-green-500" />
            </div>
            <span className="text-sm font-medium text-purple-700">Wallet Connected</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="bg-white px-2 py-1 rounded text-xs font-mono text-purple-700 break-all">
                {userContext.ethereum.address}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  navigator.clipboard.writeText(userContext.ethereum.address)
                  toast({
                    title: "Success",
                    description: "Address copied to clipboard",
                  })
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Balance</p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700">
                {balance?.data ? `${balance.data.formatted} ${balance.data.symbol}` : "Loading..."}
              </span>
              {balance?.data && BigInt(balance.data.value) === BigInt(0) && (
                <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Low balance</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="relative min-h-screen">
      <FloatingElements />

      <div className="container max-w-6xl mx-auto py-12 px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-md">My Profile</h1>
              <p className="text-white/80">Manage your raffles and wallet</p>
            </div>

            <div className="flex gap-2">
              <Link href="/raffles">
                <Button
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  Browse Raffles
                </Button>
              </Link>
              <Link href="/">
              <Button
                variant="outline"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
             
              >
                 Home
              </Button>
              </Link>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100">
                  <User className="h-12 w-12 text-purple-500" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-purple-600 mb-4">Verified Human</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Verification Status</p>
                        <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-md">
                          <Shield className="h-4 w-4 text-purple-500" />
                          <p className="text-sm font-medium text-purple-700">
                            {user.isVerified ? "Verified ✓" : "Pending Verification"}
                          </p>
                        </div>
                      </div>

                      {/* Add any additional user info here */}
                    </div>

                    <div>
                      {/* Wallet details section */}
                      <WalletDetails />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Tabs defaultValue="entered" className="w-full">
            <TabsList className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-sm">
              <TabsTrigger
                value="entered"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md"
              >
                My Entries
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md"
              >
                Active Raffles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entered" className="mt-6">
              {isLoadingRaffles ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg animate-pulse">
                        <CardContent className="p-0">
                          <div className="h-48 bg-purple-100 rounded-t-lg"></div>
                          <div className="p-6 space-y-4">
                            <div className="h-6 bg-purple-100 rounded w-3/4"></div>
                            <div className="h-4 bg-purple-100 rounded w-full"></div>
                            <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                            <div className="h-10 bg-purple-100 rounded w-full"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : enteredRaffles.length === 0 ? (
                <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 mx-auto mb-4">
                      <Ticket className="h-10 w-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">No Entries Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't entered any raffles yet.</p>
                    <Link href="/raffles">
                      <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        Browse Raffles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enteredRaffles.map((raffle, index) => (
                    <motion.div
                      key={raffle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                            {raffle.imageUrl ? (
                              <img
                                src={raffle.imageUrl || "/placeholder.svg"}
                                alt={raffle.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Ticket className="h-16 w-16 text-white/80" />
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 text-purple-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(raffle.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold text-purple-600 line-clamp-1">{raffle.title}</h3>

                            <div className="bg-green-50 p-3 rounded-md">
                              <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                                <Ticket className="h-4 w-4" />
                                Entry Confirmed
                              </p>
                            </div>

                            <div className="relative">
                              <NFTTicket raffle={raffle} walletAddress={userContext.ethereum?.address} />
                            </div>

                            <Link href={`/raffles/${raffle.id}`}>
                              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                                View Raffle
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {isLoadingRaffles ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg animate-pulse">
                        <CardContent className="p-0">
                          <div className="h-48 bg-purple-100 rounded-t-lg"></div>
                          <div className="p-6 space-y-4">
                            <div className="h-6 bg-purple-100 rounded w-3/4"></div>
                            <div className="h-4 bg-purple-100 rounded w-full"></div>
                            <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                            <div className="h-10 bg-purple-100 rounded w-full"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : activeRaffles.length === 0 ? (
                <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-gray-600">No active raffles at the moment. Check back soon!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeRaffles.map((raffle, index) => (
                    <motion.div
                      key={raffle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                            {raffle.imageUrl ? (
                              <img
                                src={raffle.imageUrl || "/placeholder.svg"}
                                alt={raffle.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Ticket className="h-16 w-16 text-white/80" />
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 text-purple-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(raffle.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold text-purple-600 line-clamp-1">{raffle.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{raffle.description}</p>

                            <Link href={`/raffles/${raffle.id}`}>
                              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                                Enter Raffle
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
