"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Gift, Trophy, Share2, Ticket } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@civic/auth-web3/react"
import FloatingElements from "@/components/floating-elements"
import ConfettiEffect from "@/components/confetti-effect"
import CountdownTimer from "@/components/countdown-timer"
import NFTTicket from "@/components/nft-ticket"
import { getRaffleById, enterRaffle, checkIfEntered } from "@/lib/raffle-service"
import type { Raffle } from "@/lib/types"


export default function RafflePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const {  user } = useUser()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const data = await getRaffleById(params.id)
        setRaffle(data)

        if ( user?.walletAddress && data) {
          const entered = await checkIfEntered(data.id, user.walletAddress)
          setHasEntered(entered)
        }
      } catch (error) {
        console.error("Error fetching raffle:", error)
        router.push("/raffles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRaffle()
  }, [params.id, router, user])

  const handleEnterRaffle = async () => {
    if (  !user?.walletAddress || !raffle) return

    setIsSubmitting(true)

    try {
      // In a real implementation, this would call a smart contract method
      // Example with ethers.js:
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(RAFFLE_CONTRACT_ADDRESS, RAFFLE_ABI, signer);
      // const tx = await contract.enterRaffle(raffle.id);
      // await tx.wait();

      // For now, we'll use our mock implementation
      await enterRaffle(raffle.id, user.walletAddress)

      setHasEntered(true)
      setShowConfetti(true)

      toast({
        title: "🎉 You're In!",
        description: "You've successfully entered the raffle. Good luck!",
      })
    } catch (error) {
      console.error("Error entering raffle:", error)
      toast({
        title: "Error",
        description: "Failed to enter raffle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShareRaffle = () => {
    if (navigator.share) {
      navigator.share({
        title: raffle?.title || "HumanRaffle",
        text: `Check out this exclusive raffle for verified humans: ${raffle?.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Raffle link copied to clipboard",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl max-w-md w-full">
          <CardContent className="pt-6 pb-6 text-center">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Raffle Not Found</h2>
            <p className="text-gray-600 mb-6">The raffle you're looking for doesn't exist or has been removed.</p>
            <Link href="/raffles">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Browse Raffles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isActive = raffle.status === "active"
  const isPast = raffle.status === "completed"
  const hasWinner = !!raffle.winner

  return (
    <div className="relative min-h-screen">
      <FloatingElements />
      {showConfetti && <ConfettiEffect />}

      <div className="container max-w-6xl mx-auto py-12 px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/raffles">
            <Button
              variant="outline"
              size="sm"
              className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              ← Back to Raffles
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{raffle.title}</h1>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}
            >
              {isActive ? "Active" : "Ended"}
            </span>

            <span className="flex items-center gap-1 text-white/90 text-sm">
              <Clock className="h-4 w-4" />
              {isActive
                ? `Ends ${new Date(raffle.endDate).toLocaleDateString()}`
                : `Ended ${new Date(raffle.endDate).toLocaleDateString()}`}
            </span>

            <span className="flex items-center gap-1 text-white/90 text-sm">
              <Users className="h-4 w-4" />
              {raffle.participants.length} participants
            </span>

            <Button
              variant="outline"
              size="sm"
              className="ml-auto bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              onClick={handleShareRaffle}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                  {raffle.imageUrl ? (
                    <img
                      src={raffle.imageUrl || "/placeholder.svg"}
                      alt={raffle.title}
                      className={`w-full h-full object-cover ${isPast ? "grayscale" : ""}`}
                    />
                  ) : (
                    <Gift className="h-20 w-20 text-white/80" />
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-purple-600 mb-2">About this Raffle</h2>
                    <p className="text-gray-600">{raffle.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-bold text-purple-600 mb-2">Prize</h3>
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-purple-500" />
                        <span className="font-bold text-purple-700">{raffle.prize}</span>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-bold text-purple-600 mb-2">Participants</h3>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <span className="font-bold text-purple-700">{raffle.participants.length}</span>
                      </div>
                    </div>
                  </div>

                  {hasWinner && (
                    <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-purple-500" />
                        <h3 className="font-bold text-purple-700">Winner Announced!</h3>
                      </div>
                      <p className="text-sm text-purple-600 mb-2">Congratulations to the lucky winner:</p>
                      <p className="text-xs font-mono bg-white p-2 rounded-md overflow-hidden text-ellipsis break-all text-purple-700">
                        {raffle.winner}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2"
          >
            {!user ? (
              <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 mb-4">
                    <Ticket className="h-10 w-10 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">Authentication Required</h2>
                  <p className="text-gray-600 mb-6 text-center">
                    You need to verify your identity with Civic Auth to enter this raffle.
                  </p>
                  <Link href="/auth">
                    <Button
                      size="lg"
                      className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Verify Identity
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : isActive ? (
              <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-purple-600 mb-2">Raffle Countdown</h2>
                    <CountdownTimer endDate={raffle.endDate} />
                  </div>

                  {hasEntered ? (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-bold text-green-600 flex items-center gap-2 mb-2">
                          <Ticket className="h-5 w-5" />
                          You're In!
                        </h3>
                        <p className="text-sm text-green-600">
                          Your entry has been recorded. A commemorative NFT ticket has been sent to your wallet.
                        </p>
                      </div>

                      <div className="relative">
                        <NFTTicket raffle={raffle} walletAddress={user?.walletAddress || ""} />
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={handleShareRaffle}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share with Friends
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-md bg-purple-50 p-4">
                        <p className="text-sm font-medium text-purple-600 mb-2">Your Wallet Address</p>
                        <p className="text-xs font-mono break-all text-purple-700">
                          {user?.walletAddress || "No wallet connected"}
                        </p>
                      </div>

                      <Button
                        onClick={handleEnterRaffle}
                        disabled={isSubmitting || !user?.walletAddress}
                        className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          "Enter Raffle"
                        )}
                      </Button>

                      <p className="text-xs text-center text-gray-500">
                        By entering, you confirm you are a real person and agree to the raffle terms.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-purple-600 mb-4">Raffle Ended</h2>

                  {hasWinner ? (
                    <div className="space-y-6">
                      <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="h-5 w-5 text-purple-500" />
                          <h3 className="font-bold text-purple-700">Winner Announced!</h3>
                        </div>
                        <p className="text-sm text-purple-600 mb-2">The lucky winner is:</p>
                        <p className="text-xs font-mono bg-white p-2 rounded-md overflow-hidden text-ellipsis break-all text-purple-700">
                          {raffle.winner}
                        </p>
                      </div>

                      <Link href="/raffles">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                          Browse More Raffles
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-gray-600">
                        This raffle has ended and is no longer accepting entries. The winner will be announced soon.
                      </p>

                      <Link href="/raffles">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                          Browse More Raffles
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6"
              >
                <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-purple-600 mb-4">Recent Participants</h3>

                    {raffle.participants.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No participants yet. Be the first to enter!</p>
                    ) : (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {raffle.participants.slice(0, 5).map((address, index) => (
                          <div
                            key={index}
                            className="text-xs font-mono bg-purple-50 p-2 rounded-md overflow-hidden text-ellipsis text-purple-700"
                          >
                            {address}
                          </div>
                        ))}
                        {raffle.participants.length > 5 && (
                          <p className="text-center text-sm text-purple-600 font-medium">
                            +{raffle.participants.length - 5} more participants
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
