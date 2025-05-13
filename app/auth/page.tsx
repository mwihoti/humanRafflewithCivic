"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, CheckCircle } from "lucide-react"
import { useUser } from "@civic/auth-web3/react";
import FloatingElements from "@/components/floating-elements"
import ConfettiEffect from "@/components/confetti-effect"
import { toast } from "@/components/ui/use-toast"
import { useAutoConnect } from "@civic/auth-web3/wagmi";

export default function AuthPage() {
  const router = useRouter()
  const { user, signIn, isLoading } = useUser()
  const [authStep, setAuthStep] = useState<"initial" | "verifying" | "complete">("initial")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if ( user) {
      setAuthStep("complete")
      setShowConfetti(true)
    }
  }, [ user])

  const handleAuth = async () => {
    if (user) {
      // User is already authenticated
      setAuthStep("complete")
    } else {
      setAuthStep("verifying")
      try {
        // This will trigger the Civic Auth popup
        await signIn()
        
        // The auth state will be updated by the event listener in the useEffect above
        // No need to manually set these - they'll be triggered by the user state change
      } catch (error) {
        console.error("Authentication error:", error)
        setAuthStep("initial")
        toast({
          title: "Authentication Failed",
          description: "There was an error during the verification process. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleContinue = () => {
    router.push("/raffles")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <FloatingElements />
      {showConfetti && <ConfettiEffect />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h1 className="text-3xl font-bold text-purple-600">Identity Verification</h1>

              <div className="w-full max-w-xs">
                {authStep === "initial" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 mb-4">
                      <Shield className="h-12 w-12 text-purple-500" />
                    </div>
                    <p className="text-gray-600 mb-6">
                      Verify your identity with Civic Auth to join exclusive raffles for humans only!
                    </p>
                    <Button
                      onClick={handleAuth}
                      className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Verify with Civic Auth
                    </Button>
                  </motion.div>
                )}

                {authStep === "verifying" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 mb-4">
                      <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
                    </div>
                    <p className="text-gray-600 mb-6">
                      Please complete the verification process in the Civic Auth popup...
                    </p>
                    <div className="w-full h-12 bg-purple-100 rounded-md animate-pulse"></div>
                  </motion.div>
                )}

                {authStep === "complete" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-green-600 mb-2">Verification Complete!</h2>
                    <p className="text-gray-600 mb-4">
                      Your identity has been verified and your wallet is ready to use.
                    </p>
                    {user?.walletAddress && (
                      <div className="w-full bg-purple-50 p-3 rounded-md overflow-hidden text-ellipsis mb-2">
                        <p className="text-xs font-mono text-purple-700 break-all">{user.walletAddress}</p>
                      </div>
                    )}
                    <div className="w-full bg-purple-50 p-3 rounded-md overflow-hidden text-ellipsis mb-6">
                      <p className="text-sm text-purple-700 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Verification Status: {user?.isVerified ? "Verified ✓" : "Pending"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Button
                        onClick={handleContinue}
                        className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Continue to Raffles
                      </Button>
                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full py-6 text-lg border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Home
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
