"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import FloatingElements from "@/components/floating-elements"
import ConfettiEffect from "@/components/confetti-effect"
import WinnerCard from "@/components/winner-card"
import { getTopWinners } from "@/lib/winners-service"
import type { Winner } from "@/lib/types"
import "./winners-board.css"

export default function WinnersBoardPage() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const data = await getTopWinners()
        setWinners(data)
      } catch (error) {
        console.error("Error fetching winners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWinners()

    // Show confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Sort winners by rank
  const sortedWinners = [...winners].sort((a, b) => a.rank - b.rank)

  // Get top 3 for podium and 4th place
  const podiumWinners = sortedWinners.slice(0, 3)
  const fourthPlace = sortedWinners.find((w) => w.rank === 4)

  return (
    <div className="relative min-h-screen">
      <FloatingElements />
      {showConfetti && <ConfettiEffect />}

      <div className="container max-w-6xl mx-auto py-12 px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
            <div className="flex gap-6">
          <Link href="/raffles">
            <Button
              variant="outline"
              size="sm"
              className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              ← Back to Raffles
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              Home
            </Button>
          </Link>
          </div>

          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">Winners Board</h1>
          <p className="text-xl text-white/90">Celebrating our top raffle winners!</p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-12 bg-purple-100 rounded-t-lg"></div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-6 bg-purple-100 rounded w-32"></div>
                          <div className="h-4 bg-purple-100 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-purple-100 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <>
            {/* Desktop Podium View (hidden on mobile) */}
            <div className="hidden md:block mb-12">
              <div className="podium">
                {podiumWinners.map((winner) => (
                  <div key={winner.rank} className={`podium-${winner.rank}`}>
                    <WinnerCard winner={winner} delay={winner.rank} />

                    {winner.rank === 1 && (
                      <motion.div
                        className="flex justify-center mt-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                      >
                        <Trophy className="h-12 w-12 text-amber-500 trophy-icon-1" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* 4th Place - Honorable Mention */}
              {fourthPlace && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4 text-center">Honorable Mention</h2>
                  <div className="max-w-md mx-auto">
                    <WinnerCard winner={fourthPlace} delay={4} />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View (grid layout) */}
            <div className="md:hidden grid gap-6">
              {sortedWinners.map((winner, index) => (
                <WinnerCard key={winner.rank} winner={winner} delay={index} />
              ))}
            </div>

            {/* Standard Grid View (desktop) */}
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4 text-center">All Winners</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {sortedWinners.map((winner, index) => (
                  <WinnerCard key={winner.rank} winner={winner} delay={index} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
