"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface RaffleDrumProps {
  animate?: boolean
  reveal?: boolean
}

export default function RaffleDrum({ animate = false, reveal = false }: RaffleDrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const size = Math.min(parent.clientWidth, parent.clientHeight)
      canvas.width = size
      canvas.height = size
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw raffle drum
    const drawDrum = () => {
      if (!ctx || !canvas) return

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = canvas.width * 0.4

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw outer circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 4
      ctx.stroke()

      // Draw inner circle (drum face)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
      ctx.fill()

      // Draw tickets inside
      const ticketCount = 20

      for (let i = 0; i < ticketCount; i++) {
        const angle = ((Math.PI * 2) / ticketCount) * i
        const x = centerX + Math.cos(angle) * (radius * 0.6)
        const y = centerY + Math.sin(angle) * (radius * 0.6)

        ctx.beginPath()
        ctx.rect(x - 10, y - 5, 20, 10)
        ctx.fillStyle = `hsl(${(i * 20) % 360}, 80%, 70%)`
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw spokes
      const spokeCount = 8
      for (let i = 0; i < spokeCount; i++) {
        const angle = ((Math.PI * 2) / spokeCount) * i

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw handle
      ctx.beginPath()
      ctx.moveTo(centerX + radius, centerY)
      ctx.lineTo(centerX + radius * 1.5, centerY)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 6
      ctx.stroke()

      // Draw handle knob
      ctx.beginPath()
      ctx.arc(centerX + radius * 1.5, centerY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fill()
    }

    drawDrum()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{
          rotate: animate ? 360 : 0,
        }}
        transition={{
          duration: 2,
          repeat: animate ? Number.POSITIVE_INFINITY : 0,
          ease: "linear",
        }}
        className={reveal ? "drum-reveal" : ""}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-slow"></div>
      <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-float"></div>
      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
    </div>
  )
}
