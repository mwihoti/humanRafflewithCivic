"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import FloatingElements from "@/components/floating-elements"
import CivicOnboarding from "@/components/civic-onboarding"

export default function OnboardingPage() {
  const router = useRouter()
  const userContext = useUser()
  const { isLoading } = userContext

  // If user is already authenticated and has a wallet, redirect to profile
  useEffect(() => {
    if (!isLoading && userHasWallet(userContext)) {
      router.push("/profile")
    }
  }, [isLoading, router, userContext])

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <FloatingElements />

      <div className="container max-w-6xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">Welcome to HumanRaffle</h1>
          <p className="text-xl text-white/90">Let's get you set up with verification and your embedded wallet</p>
        </motion.div>

        <CivicOnboarding />
      </div>
    </div>
  )
}
