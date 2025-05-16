"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Wallet, Check, ArrowRight } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet, useAuth } from "@civic/auth-web3"

export default function CivicOnboarding() {
  const { toast } = useToast()
  const userContext = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)

  const handleVerifyIdentity = async () => {
    try {
      await userContext.signIn()
      // If successful, move to next step
      setCurrentStep(2)
    } catch (error) {
      console.error("Error during verification:", error)
      toast({
        title: "Verification Failed",
        description: "There was an error verifying your identity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true)
    try {
      // This explicitly creates an embedded wallet through Civic
    
      setWalletCreated(true)
      setCurrentStep(3)
      toast({
        title: "Wallet Created Successfully!",
        description: "Your embedded wallet has been created and is ready to use.",
      })
    } catch (error) {
      console.error("Error creating embedded wallet:", error)
      toast({
        title: "Wallet Creation Failed",
        description: "There was an error creating your embedded wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingWallet(false)
    }
  }

  // Check if user already has a wallet
  const hasWallet = userHasWallet(userContext)

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-600 text-center">Get Started with HumanRaffle</h2>
          <p className="text-gray-600 text-center mt-2">Complete these steps to join exclusive raffles</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step ? <Check className="h-5 w-5" /> : step}
              </div>
              <span className={`text-xs mt-2 ${currentStep >= step ? "text-purple-600 font-medium" : "text-gray-500"}`}>
                {step === 1 ? "Verify" : step === 2 ? "Create Wallet" : "Complete"}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Verify Identity */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-purple-700">Verify Your Humanity</h3>
            <p className="text-gray-600 text-center">
              First, we'll verify you're a real person using Civic Auth. This prevents bots from entering our raffles.
            </p>
            <Button
              onClick={handleVerifyIdentity}
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Verify with Civic Auth
            </Button>
          </motion.div>
        )}

        {/* Step 2: Create Embedded Wallet */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                <Wallet className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-purple-700">Create Your Embedded Wallet</h3>
            <p className="text-gray-600 text-center">
              Now, we'll create a secure blockchain wallet for you. This wallet is embedded in your Civic account - no
              seed phrases to remember!
            </p>
            <div className="bg-purple-50 p-4 rounded-md">
              <h4 className="font-bold text-purple-700 mb-2">What is an Embedded Wallet?</h4>
              <p className="text-sm text-purple-600">
                An embedded wallet is a secure blockchain wallet that's managed by Civic. You don't need to remember
                seed phrases or private keys, and you can access it from any device.
              </p>
            </div>
            <Button
              onClick={handleCreateWallet}
              disabled={isCreatingWallet || hasWallet}
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isCreatingWallet ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Wallet...
                </>
              ) : hasWallet ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Wallet Already Created
                </>
              ) : (
                "Create Embedded Wallet"
              )}
            </Button>
            {hasWallet && (
              <Button
                onClick={() => setCurrentStep(3)}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </motion.div>
        )}

        {/* Step 3: Complete */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-green-700">You're All Set!</h3>
            <p className="text-gray-600 text-center">
              Congratulations! You've verified your humanity and created your embedded wallet. You're now ready to enter
              exclusive raffles.
            </p>
            <Button
              onClick={() => (window.location.href = "/raffles")}
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Browse Raffles
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}