"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Trophy, Users, Clock, AlertTriangle } from "lucide-react"
import { useCivicAuth } from "@/hooks/use-civic-auth"
import FloatingElements from "@/components/floating-elements"
import ConfettiEffect from "@/components/confetti-effect"
import { getRaffles, getRaffleEntries, drawWinner } from "@/lib/raffle-service"
import type { Raffle } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user, isLoading } = useCivicAuth()
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)
  const [entries, setEntries] = useState<{ address: string; timestamp: string }[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      })
    }
  }, [isAuthenticated, isLoading, router, toast, user])

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const data = await getRaffles("all")
        setRaffles(data)

        if (data.length > 0) {
          setSelectedRaffle(data[0])
          const entriesData = await getRaffleEntries(data[0].id)
          setEntries(entriesData)
        }
      } catch (error) {
        console.error("Error fetching raffles:", error)
      }
    }

    if (isAuthenticated && user?.role === "admin") {
      fetchRaffles()
    }
  }, [isAuthenticated, user])

  const handleSelectRaffle = async (raffle: Raffle) => {
    setSelectedRaffle(raffle)
    try {
      const entriesData = await getRaffleEntries(raffle.id)
      setEntries(entriesData)
      setWinner(raffle.winner || null)
    } catch (error) {
      console.error("Error fetching entries:", error)
    }
  }

  const handleDrawWinner = async () => {
    if (!selectedRaffle) return

    setIsDrawing(true)

    try {
      // Call smart contract to draw winner
      const winnerAddress = await drawWinner(selectedRaffle.id)

      setWinner(winnerAddress)
      setShowConfetti(true)

      // Update the raffle in the local state
      setRaffles(
        raffles.map((raffle) =>
          raffle.id === selectedRaffle.id ? { ...raffle, status: "completed", winner: winnerAddress } : raffle,
        ),
      )

      setSelectedRaffle({
        ...selectedRaffle,
        status: "completed",
        winner: winnerAddress,
      })

      toast({
        title: "Winner Selected!",
        description: "The raffle winner has been randomly selected.",
      })
    } catch (error) {
      console.error("Error drawing winner:", error)
      toast({
        title: "Error",
        description: "Failed to draw winner. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDrawing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="relative min-h-screen">
      <FloatingElements />
      {showConfetti && <ConfettiEffect />}

      <div className="container max-w-7xl mx-auto py-12 px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-md">Admin Dashboard</h1>
              <p className="text-white/80">Manage raffles and draw winners</p>
            </div>

            <div className="flex gap-2">
              <Link href="/">
                <Button
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  Back to Home
                </Button>
              </Link>
              <Link href="/raffles">
                <Button
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  View Raffles
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600">{entries.length}</h2>
                  <p className="text-sm text-gray-500">Total Participants</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600">{raffles.length}</h2>
                  <p className="text-sm text-gray-500">Total Raffles</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600">
                    {raffles.filter((r) => r.status === "active").length}
                  </h2>
                  <p className="text-sm text-gray-500">Active Raffles</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600">{raffles.filter((r) => r.winner).length}</h2>
                  <p className="text-sm text-gray-500">Completed Raffles</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl h-full">
              <CardHeader>
                <CardTitle>Raffles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {raffles.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No raffles found</p>
                  ) : (
                    raffles.map((raffle) => (
                      <Button
                        key={raffle.id}
                        variant={selectedRaffle?.id === raffle.id ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleSelectRaffle(raffle)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-bold">{raffle.title}</span>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-full ${
                                raffle.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {raffle.status === "active" ? "Active" : "Completed"}
                            </span>
                            <span>{raffle.participants.length} entries</span>
                          </div>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2"
          >
            {selectedRaffle ? (
              <Tabs defaultValue="participants" className="w-full">
                <TabsList className="w-full bg-white/20 backdrop-blur-sm">
                  <TabsTrigger
                    value="participants"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md"
                  >
                    Participants
                  </TabsTrigger>
                  <TabsTrigger
                    value="draw"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md"
                  >
                    Draw Winner
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="participants" className="mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                    <CardHeader>
                      <CardTitle>{selectedRaffle.title} - Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {entries.length === 0 ? (
                        <div className="text-center py-8">
                          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-gray-700 mb-2">No Participants Yet</h3>
                          <p className="text-gray-500">This raffle doesn't have any participants yet.</p>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Wallet Address</TableHead>
                                <TableHead>Entry Time</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {entries.map((entry, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-mono text-xs">{entry.address}</TableCell>
                                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="draw" className="mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                    <CardHeader>
                      <CardTitle>{selectedRaffle.title} - Draw Winner</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {winner ? (
                        <div className="bg-purple-100 p-6 rounded-lg border border-purple-200 text-center">
                          <div className="flex justify-center mb-4">
                            <div className="h-20 w-20 rounded-full bg-purple-200 flex items-center justify-center">
                              <Trophy className="h-10 w-10 text-purple-600" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-purple-700 mb-4">Winner Selected!</h3>
                          <div className="bg-white p-4 rounded-md mb-4">
                            <p className="text-sm text-gray-600 mb-2">Winning Wallet Address:</p>
                            <p className="font-mono text-xs break-all text-purple-700">{winner}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            The prize will be automatically transferred to the winner's wallet.
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <h3 className="text-lg font-bold text-gray-700 mb-4">Ready to Draw a Winner?</h3>

                          {entries.length === 0 ? (
                            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                              <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                              <p className="text-yellow-700">
                                This raffle doesn't have any participants yet. Cannot draw a winner.
                              </p>
                            </div>
                          ) : selectedRaffle.status === "completed" ? (
                            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                              <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                              <p className="text-yellow-700">
                                This raffle is already completed. Cannot draw a new winner.
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-600 mb-6">
                              Drawing a winner is final and cannot be undone. The smart contract will randomly select a
                              winner from {entries.length} participants.
                            </p>
                          )}

                          <Button
                            onClick={handleDrawWinner}
                            disabled={isDrawing || entries.length === 0 || selectedRaffle.status === "completed"}
                            className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          >
                            {isDrawing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Drawing Winner...
                              </>
                            ) : (
                              "Draw Winner"
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Select a raffle to view details</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
