"use client"

import { useEffect, useRef } from "react"
import { Ticket } from "lucide-react"
import type { Raffle } from "@/lib/types"

interface NFTTicketProps {
  raffle: Raffle
  walletAddress: string
}

export default function NFTTicket({ raffle, walletAddress }: NFTTicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 300
    canvas.height = 150

    // Draw ticket background
    const drawTicket = () => {
      if (!ctx) return

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#8b5cf6")
      gradient.addColorStop(1, "#3b82f6")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Ticket border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 4
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

      // Ticket holes
      const holeCount = 8
      const holeRadius = 5
      const holeSpacing = canvas.width / (holeCount + 1)

      for (let i = 1; i <= holeCount; i++) {
        ctx.beginPath()
        ctx.arc(i * holeSpacing, 10, holeRadius, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(i * holeSpacing, canvas.height - 10, holeRadius, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()
      }

      // Ticket content
      ctx.fillStyle = "white"
      ctx.font = "bold 16px Nunito"
      ctx.textAlign = "center"
      ctx.fillText("HUMAN VERIFIED RAFFLE TICKET", canvas.width / 2, 40)

      ctx.font = "bold 14px Nunito"
      ctx.fillText(raffle.title, canvas.width / 2, 65)

      ctx.font = "10px Nunito"
      ctx.fillText(`Ends: ${new Date(raffle.endDate).toLocaleDateString()}`, canvas.width / 2, 85)

      // Wallet address (shortened)
      const shortAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
      ctx.fillText(shortAddress, canvas.width / 2, 105)

      // Ticket number
      ctx.font = "bold 12px Nunito"
      ctx.fillText(
        `TICKET #${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        canvas.width / 2,
        130,
      )
    }

    drawTicket()
  }, [raffle, walletAddress])

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <canvas ref={canvasRef} className="w-full h-auto" />
      <div className="ticket-shine"></div>
      <div className="absolute top-2 left-2">
        <Ticket className="h-5 w-5 text-white/80" />
      </div>
    </div>
  )
}
