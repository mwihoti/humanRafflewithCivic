"use client"

import { motion } from "framer-motion"
import { Ticket, Gift, Trophy, Star } from "lucide-react"

export default function FloatingElements() {
  const elements = [
    { icon: Ticket, x: "10%", y: "20%", size: 24, delay: 0 },
    { icon: Gift, x: "80%", y: "15%", size: 28, delay: 0.5 },
    { icon: Trophy, x: "15%", y: "75%", size: 32, delay: 1 },
    { icon: Star, x: "70%", y: "80%", size: 20, delay: 1.5 },
    { icon: Ticket, x: "40%", y: "10%", size: 20, delay: 2 },
    { icon: Star, x: "90%", y: "40%", size: 16, delay: 2.5 },
    { icon: Gift, x: "5%", y: "50%", size: 24, delay: 3 },
    { icon: Trophy, x: "60%", y: "90%", size: 28, delay: 3.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((el, index) => {
        const Icon = el.icon

        return (
          <motion.div
            key={index}
            className="absolute text-white/20"
            style={{
              left: el.x,
              top: el.y,
              width: el.size,
              height: el.size,
            }}
            animate={{
              y: ["0%", "10%", "0%"],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5,
              delay: el.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Icon size={el.size} />
          </motion.div>
        )
      })}
    </div>
  )
}
