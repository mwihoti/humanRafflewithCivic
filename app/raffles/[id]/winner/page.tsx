"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import FloatingElements from "@/components/floating-elements"
import ConfettiEffect from "@/components/confetti-effect"
import RaffleDrum from "@/components/raffle-drum"
import { getRaffleById, drawWinner } from "@/lib/raffle-service"
import type { Raffle } from "@/lib/types"

export default function WinnerRevealPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revealStage, setRevealStage] = useState<"initial" | "drawing" | "revealed">("initial")
  const [winner, setWinner] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const data = await getRaffleById(params.id)

        if (!data) {
          router.push("/raffles")
          return
        }

        setRaffle(data)

        // If raffle already has a winner, show it immediately
        if (data.winner) {
          setWinner(data.winner)
          setRevealStage("revealed")
          setShowConfetti(true)
        }
      } catch (error) {
        console.error("Error fetching raffle:", error)
        router.push("/raffles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRaffle()
  }, [params.id, router])

  const handleDrawWinner = async () => {
    if (!raffle) return

    setRevealStage("drawing")

    try {
      // Add a delay for dramatic effect
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const winnerAddress = await drawWinner(raffle.id)
      setWinner(winnerAddress)
      setRevealStage("revealed")
      setShowConfetti(true)

      // Play sound effect
      const audio = new Audio("/winner-sound.mp3")
      audio.play().catch((e) => console.error("Error playing sound:", e))
    } catch (error) {
      console.error("Error drawing winner:", error)
      setRevealStage("initial")
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

  if (!raffle) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl max-w-md w-full">
          <CardContent className="pt-6 pb-6 text-center">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Raffle Not Found</h2>
            <p className="text-gray-600 mb-6">The raffle you're looking for doesn't exist or has been removed.</p>
            <Link href="/raffles">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Browse Raffles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <FloatingElements />
      {showConfetti && <ConfettiEffect />}

      <div className="container max-w-4xl mx-auto py-12 px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">Winner Reveal</h1>
          <p className="text-xl text-white/90">{raffle.title}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-xs aspect-square">
              <RaffleDrum animate={revealStage === "drawing"} reveal={revealStage === "revealed"} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="p-6">
                {revealStage === "initial" && (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-purple-600">Ready to Draw?</h2>
                    <p className="text-gray-600">
                      {raffle.participants.length} verified humans have entered this raffle. Click the button to
                      randomly select a winner!
                    </p>
                    <Button
                      onClick={handleDrawWinner}
                      disabled={raffle.participants.length === 0}
                      className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Draw Winner
                    </Button>
                    {raffle.participants.length === 0 && (
                      <p className="text-sm text-red-500">This raffle has no participants yet.</p>
                    )}
                  </div>
                )}

                {revealStage === "drawing" && (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-purple-600">Drawing Winner...</h2>
                    <p className="text-gray-600">The raffle drum is spinning to randomly select a winner...</p>
                    <div className="flex justify-center">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}

                {revealStage === "revealed" && winner && (
                  <div className="text-center space-y-6">
                    <div className="flex justify-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                        <Trophy className="h-10 w-10 text-purple-500" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-purple-600">Winner Announced!</h2>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 mb-2">Congratulations to:</p>
                      <p className="text-xs font-mono break-all text-purple-700">{winner}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/raffles/${raffle.id}`}>
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                          Back to Raffle
                        </Button>
                      </Link>
                      <Link href="/raffles">
                        <Button
                          variant="outline"
                          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          Browse More Raffles
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
