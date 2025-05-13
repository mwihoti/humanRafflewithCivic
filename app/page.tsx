"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

import RaffleDrum from "@/components/raffle-drum"
import FloatingElements from "@/components/floating-elements"
import { Shield } from "lucide-react"
import { UserButton } from "@civic/auth-web3/react";

export default function Home() {

  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Show animation after a short delay
    const timer = setTimeout(() => {
      setShowAnimation(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <FloatingElements />

      <div className="absolute top-4 right-4 z-10">
      
          <Link href="/profile">
            <Button
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              My Profile
            </Button>
          </Link>
   
          <Button
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            onClick={() => login()}
          >
            <Shield className="h-4 w-4 mr-2" />
            Verify with Civic
          </Button>

     
      <UserButton 
      className="bg-white/55  border-white/30 text-white hover:bg-white/30"
   
      />
     
      
       
      </div>
    

      <div className="container max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-2">HumanRaffle</h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">Fun raffles for real humans, not bots!</p>
        </motion.div>

        <div className="relative w-full max-w-md aspect-square">
          <RaffleDrum animate={showAnimation} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md mb-6">Only Humans May Win 🧍‍♂️🎟️</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/raffles">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-white/90 shadow-lg">
                Browse Raffles
              </Button>
            </Link>

            <Link href="/auth">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-purple-600/30 backdrop-blur-sm border-white/30 text-white hover:bg-purple-600/50 shadow-lg"
                onClick={() => login()}
              >
                <Shield className="h-5 w-5 mr-2" />
                Verify & Join
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-white/80 max-w-md mx-auto">
            Verify your identity with Civic Auth to participate in exclusive raffles and win amazing prizes!
          </p>
        </motion.div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-white/60 text-sm">
        © {new Date().getFullYear()} HumanRaffle • Powered by Civic Auth
      </footer>
    </main>
  )
}
