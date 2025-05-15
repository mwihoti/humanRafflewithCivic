"use client"

import { useEffect, useRef } from "react"
import { createIcon } from "@download/blockies"

interface WalletIdenticonProps {
  address: string
  size?: number
  className?: string
}

export default function WalletIdenticon({ address, size = 40, className = "" }: WalletIdenticonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    try {
      // Generate blockies icon
      const icon = createIcon({
        seed: address.toLowerCase(),
        size: 8,
        scale: Math.ceil(size / 8),
      })

      // Clear canvas and draw new icon
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(icon, 0, 0)
      }
    } catch (error) {
      console.error("Error generating identicon:", error)
    }
  }, [address, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      aria-label={`Identicon for ${address}`}
    />
  )
}
