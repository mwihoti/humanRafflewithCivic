"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Calendar, Activity } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"

// Mock reputation data - in a real app, this would come from your backend
const mockReputationData = {
  score: 85,
  level: 3,
  badges: [
    { id: 1, name: "Early Adopter", icon: Calendar, date: "2023-05-15" },
    { id: 2, name: "Raffle Winner", icon: Trophy, date: "2023-06-22" },
    { id: 3, name: "Active Participant", icon: Activity, date: "2023-07-10" },
  ],
  rafflesEntered: 12,
  rafflesWon: 1,
  memberSince: "2023-05-15",
}

export default function HumanReputation() {
  const userContext = useUser()
  const [reputationData, setReputationData] = useState(mockReputationData)

  // In a real app, you would fetch the user's reputation data from your backend
  useEffect(() => {
    // Simulate API call
    const fetchReputationData = async () => {
      if (userContext.ethereum?.address) {
        // In a real app, you would fetch data from your API
        // const response = await fetch(`/api/reputation/${userContext.ethereum.address}`)
        // const data = await response.json()
        // setReputationData(data)

        // For demo purposes, we'll use mock data
        setReputationData({
          ...mockReputationData,
          // Add some randomness for demo purposes
          score: 70 + Math.floor(Math.random() * 30),
          rafflesEntered: 5 + Math.floor(Math.random() * 15),
        })
      }
    }

    fetchReputationData()
  }, [userContext.ethereum?.address])

  // Calculate the next level threshold
  const nextLevelThreshold = 100
  const progress = (reputationData.score / nextLevelThreshold) * 100

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-600">Human Reputation</h2>
          <p className="text-gray-600 mt-1">
            Your reputation score increases as you participate in raffles and win prizes.
          </p>
        </div>

        <div className="space-y-6">
          {/* Reputation Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-gray-700">Reputation Score</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{reputationData.score}</div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Level {reputationData.level}</span>
              <span>Level {reputationData.level + 1}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">Raffles Won</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{reputationData.rafflesWon}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">Raffles Entered</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{reputationData.rafflesEntered}</p>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Earned Badges</h3>
            <div className="flex flex-wrap gap-2">
              {reputationData.badges.map((badge) => {
                const BadgeIcon = badge.icon
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <Badge className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer">
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {badge.name}
                    </Badge>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Earned on {new Date(badge.date).toLocaleDateString()}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Member Since */}
          <div className="text-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 inline-block mr-1" />
            Member since {new Date(reputationData.memberSince).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
