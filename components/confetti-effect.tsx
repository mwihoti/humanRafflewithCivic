"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  angle: number
  rotation: number
  rotationSpeed: number
}

export default function ConfettiEffect() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const colors = [
      "#FF5252",
      "#FF4081",
      "#E040FB",
      "#7C4DFF",
      "#536DFE",
      "#448AFF",
      "#40C4FF",
      "#18FFFF",
      "#64FFDA",
      "#69F0AE",
      "#B2FF59",
      "#EEFF41",
      "#FFFF00",
      "#FFD740",
      "#FFAB40",
      "#FF6E40",
    ]

    // Create particles
    const particleCount = 100
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 2 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * 360,
        rotationSpeed: -1 + Math.random() * 2,
      })
    }

    setParticles(newParticles)

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles([])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall ${3 + Math.random() * 2}s ease-in-out forwards`,
          }}
        />
      ))}
    </div>
  )
}
