"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, ExternalLink } from "lucide-react"
import WalletIdenticon from "./wallet-identicon"
import type { Winner } from "@/lib/types"

interface WinnerCardProps {
  winner: Winner
  delay?: number
}

export default function WinnerCard({ winner, delay = 0 }: WinnerCardProps) {
  // Determine rank styling
  const rankStyles = {
    1: {
      badge: "bg-amber-500",
      border: "border-amber-500",
      shadow: "shadow-amber-500/20",
      text: "text-amber-700",
      label: "1st Place",
      trophy: "text-amber-500",
    },
    2: {
      badge: "bg-gray-400",
      border: "border-gray-400",
      shadow: "shadow-gray-400/20",
      text: "text-gray-600",
      label: "2nd Place",
      trophy: "text-gray-400",
    },
    3: {
      badge: "bg-amber-700",
      border: "border-amber-700",
      shadow: "shadow-amber-700/20",
      text: "text-amber-800",
      label: "3rd Place",
      trophy: "text-amber-700",
    },
    4: {
      badge: "bg-purple-400",
      border: "border-purple-400",
      shadow: "shadow-purple-400/20",
      text: "text-purple-600",
      label: "4th Place",
      trophy: "text-purple-400",
    },
  }[winner.rank] || {
    badge: "bg-purple-400",
    border: "border-purple-400",
    shadow: "shadow-purple-400/20",
    text: "text-purple-600",
    label: `${winner.rank}th Place`,
    trophy: "text-purple-400",
  }

  // Shorten address for display
  const shortAddress = `${winner.address.substring(0, 6)}...${winner.address.substring(winner.address.length - 4)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.2, duration: 0.5 }}
      className="h-full"
    >
      <Card
        className={`overflow-hidden bg-white/90 backdrop-blur-sm ${rankStyles.border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full ${
          winner.rank === 1 ? "winner-card-shine" : ""
        }`}
      >
        <CardContent className="p-0">
          <div className={`relative p-4 ${rankStyles.badge} flex items-center justify-between text-white font-bold`}>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span>{rankStyles.label}</span>
            </div>
            {winner.date && <span className="text-xs opacity-80">{new Date(winner.date).toLocaleDateString()}</span>}
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              {winner.avatarUrl ? (
                <img
                  src={winner.avatarUrl || "/placeholder.svg"}
                  alt={winner.ensName || shortAddress}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <WalletIdenticon address={winner.address} size={64} className="border-2 border-white shadow-md" />
              )}

              <div>
                <h3 className={`text-xl font-bold ${rankStyles.text}`}>{winner.ensName || shortAddress}</h3>
                {winner.ensName && <p className="text-xs font-mono text-gray-500 mt-1 break-all">{shortAddress}</p>}
                <a
                  href={`https://etherscan.io/address/${winner.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on Etherscan
                </a>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Prize</p>
              <p className={`font-bold ${rankStyles.text}`}>{winner.prize}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
