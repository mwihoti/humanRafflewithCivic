"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ticket, Clock, Users, Trophy } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import FloatingElements from "@/components/floating-elements"
import { getRaffles } from "@/lib/raffle-service"
import type { Raffle } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function RafflesPage() {
  const { user } = useUser()
  const [activeRaffles, setActiveRaffles] = useState<Raffle[]>([])
  const [pastRaffles, setPastRaffles] = useState<Raffle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const active = await getRaffles("active")
        const past = await getRaffles("past")
        setActiveRaffles(active)
        setPastRaffles(past)
      } catch (error) {
        console.error("Error fetching raffles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRaffles()
  }, [])

  return (
    <div className="relative min-h-screen">
      <FloatingElements />

      <div className="container max-w-6xl mx-auto py-12 px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">Exciting Raffles</h1>
          <p className="text-xl text-white/90">Join these exclusive raffles for verified humans only!</p>
        </motion.div>

        {!user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="pt-6 pb-6 text-center">
                <div className="flex flex-col items-center max-w-md mx-auto">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 mb-4">
                    <Ticket className="h-10 w-10 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">Authentication Required</h2>
                  <p className="text-gray-600 mb-6">
                    You need to verify your identity with Civic Auth to view and enter these exclusive raffles.
                  </p>
                  <Link href="/auth">
                    <Button
                      size="lg"
                      className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Verify Identity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
    
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-sm">
                <TabsTrigger
                  value="active"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md"
                >
                  Active Raffles
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md"
                >
                  Past Raffles
                </TabsTrigger>
              </TabsList>
              <div className="pt-5">
            <h3 className="text-xl text-white/90"> Hello {user?.name || 'Guest'}</h3>
</div>

              <TabsContent value="active" className="mt-6">
                {isLoading ? (
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
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-sm text-purple-500">
                                  <Users className="h-4 w-4" />
                                  <span>{raffle.participants.length}</span>
                                </div>
                                <div className="text-sm font-bold text-purple-600">Prize: {raffle.prize}</div>
                              </div>
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

              <TabsContent value="past" className="mt-6">
                {isLoading ? (
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
                ) : pastRaffles.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                    <CardContent className="pt-6 pb-6 text-center">
                      <p className="text-gray-600">No past raffles to display.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pastRaffles.map((raffle, index) => (
                      <motion.div
                        key={raffle.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
                          <CardContent className="p-0">
                            <div className="relative h-48 bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                              {raffle.imageUrl ? (
                                <img
                                  src={raffle.imageUrl || "/placeholder.svg"}
                                  alt={raffle.title}
                                  className="w-full h-full object-cover grayscale"
                                />
                              ) : (
                                <Ticket className="h-16 w-16 text-white/80" />
                              )}
                              <div className="absolute top-2 right-2 bg-white/90 text-gray-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Ended {new Date(raffle.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="p-6 space-y-4">
                              <h3 className="text-xl font-bold text-gray-600 line-clamp-1">{raffle.title}</h3>
                              <p className="text-gray-500 text-sm line-clamp-2">{raffle.description}</p>

                              {raffle.winner && (
                                <div className="p-3 bg-purple-50 rounded-md">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Trophy className="h-4 w-4 text-purple-500" />
                                    <span className="font-bold text-purple-600">Winner</span>
                                  </div>
                                  <p className="text-xs font-mono text-purple-700 break-all">{raffle.winner}</p>
                                </div>
                              )}

                              <Link href={`/raffles/${raffle.id}`}>
                                <Button
                                  variant="outline"
                                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                  View Results
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
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              
              onClick={() => router.push('/')}>
                                  Back
                                </Button>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  )
}
