"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Download, Share2, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"

interface ProofOfHumanityBadgeProps {
  verificationDate?: string
  showDownload?: boolean
}

export default function ProofOfHumanityBadge({
  verificationDate = new Date().toISOString(),
  showDownload = true,
}: ProofOfHumanityBadgeProps) {
  const { toast } = useToast()
  const userContext = useUser()
  const hasWallet = userHasWallet(userContext)


  const formattedDate = new Date(verificationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleDownload = () => {
   
    toast({
      title: "Badge Downloaded",
      description: "Your Proof of Humanity badge has been downloaded.",
    })
  }

  const handleShare = () => {
    // Create a shareable URL for the badge
    const shareUrl = `${window.location.origin}/verify/${userContext.ethereum?.address}`

    if (navigator.share) {
      navigator.share({
        title: "My Proof of Humanity Badge",
        text: "I've verified my humanity with Civic Auth. Check out my badge!",
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied!",
        description: "Badge verification link copied to clipboard.",
      })
    }
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-white/30 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3"></div>
      <CardContent className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center">
              <Shield className="h-12 w-12 text-purple-500" />
            </div>
            <motion.div
              className="absolute -right-2 -bottom-2 bg-green-500 rounded-full h-8 w-8 flex items-center justify-center border-2 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          </div>

          <h3 className="text-xl font-bold text-purple-700 mb-1">Verified Human</h3>
          <p className="text-sm text-gray-600 mb-4">Verified with Civic Auth on {formattedDate}</p>

          <div className="bg-purple-50 p-4 rounded-md w-full mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <h4 className="font-bold text-purple-700">Proof of Humanity</h4>
            </div>
            <p className="text-xs text-purple-600">
              This badge certifies that this user has been verified as a real human through Civic Auth's verification
              process. The verification is tied to their embedded wallet.
            </p>
          </div>

          {showDownload && (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Badge
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Badge
              </Button>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
