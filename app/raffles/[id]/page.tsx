"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Gift, Trophy, Share2, Ticket, Wallet, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@civic/auth-web3/react"
import FloatingElements from "@/components/floating-elements"
import ConfettiEffect from "@/components/confetti-effect"
import CountdownTimer from "@/components/countdown-timer"
import NFTTicket from "@/components/nft-ticket"
import { getRaffleById, enterRaffle, checkIfEntered, getTreasuryAddress } from "@/lib/raffle-service"
import type { Raffle } from "@/lib/types"
import { useAutoConnect } from "@civic/auth-web3/wagmi"
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { use } from "react"
import { userHasWallet } from "@civic/auth-web3"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function RafflePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const userContext = useUser()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<string>("0.01")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const unwrappedParams = use(params)
  const id = unwrappedParams.id 

  useAutoConnect();

  // Get wallet account from wagmi
  const { address, isConnected } = useAccount()
  const balance = useBalance({ address })
  
  // Configure transaction
  const treasuryAddress = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_RAFFLE_TREASURY_ADDRESS || '0xD6B36798474ef5A90AaDb0A042CB7f7f1c25363A' : ''
  

  const { data: txHash, error: txError, isPending: isSendingTx, sendTransaction } = useSendTransaction()

    // Wait for transaction confirmation
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash: txHash,
    })

  
  

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const data = await getRaffleById(id)
        setRaffle(data)

        if (address && data) {
          const entered = await checkIfEntered(data.id, address)
          setHasEntered(entered)
        }
      } catch (error) {
        console.error("Error fetching raffle:", error)
        toast({
          title: "Error",
          description: "Failed to load raffle information",
          variant: "destructive",
        })
        router.push("/raffles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRaffle()
  }, [id, router, address, toast])

  //Update when wallet connect
  useEffect(() => {
    if (isConnected && address && raffle) {
      const checkEntry = async () => {
        const entered = await checkIfEntered(raffle.id, address)
        setHasEntered(entered)
      }
      checkEntry()
    }
  }, [isConnected, address, raffle])

    // Handle transaction confirmation and complete raffle entry
    useEffect(() => {
      if (isConfirmed && txHash && raffle && address) {
        const completeRaffleEntry = async () => {
          try {
            await enterRaffle(raffle.id, address);
            setHasEntered(true);
            setShowConfetti(true);
            setShowPaymentDialog(false);
            
            toast({
              title: "🎉 You're In!",
              description: "Payment successful! You've entered the raffle. Good luck!",
            });
          } catch (error) {
            console.error("Error entering raffle after payment:", error);
            toast({
              title: "Warning",
              description: "Payment successful, but there was an issue recording your entry. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setIsSubmitting(false);
            setIsProcessingPayment(false);
          }
        };
        
        completeRaffleEntry();
      }
    }, [isConfirmed, txHash, raffle, address, toast]);
  
    // Handle transaction errors
    useEffect(() => {
      if (txError) {
        console.error("Transaction error:", txError);
        toast({
          title: "Transaction Failed",
          description: "Your payment couldn't be processed. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setIsProcessingPayment(false);
      }
    }, [txError, toast]);
  

  const afterLogin = async () => {
    try {
      // Check if the user has a wallet, and create one if not
      if (userContext.user && !userHasWallet(userContext)) {
        await userContext.createWallet();
      }
      if (userContext.user) {
        toast({
          title: "Success",
          description: "Wallet created successfully!"
        });
        console.log('Wallet created successfully:', userContext.user);
      } else {
        toast({
          title: "Error",
          description: "Failed to create wallet",
          variant: "destructive"
        });
        console.log('Failed to create wallet');
      }
    } catch (error) {
      console.log('Error in afterLogin:', error);
      toast({
        title: "Error",
        description: `Error creating wallet, ${error}`,
        variant: "destructive"
      });
    }
  };

  // Only show component if user is logged in
  if (!userContext.user) return null;

  const handleEnterRaffle = async () => {
    if (!isConnected || !address || !raffle) return;
    setShowPaymentDialog(true);
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address || !raffle) return;

    setIsSubmitting(true);
    setIsProcessingPayment(true);

    try {
      const value = paymentAmount ? parseEther(paymentAmount) : undefined;

      // Send ETH transaction
      sendTransaction({ 
        to: treasuryAddress,
        value,
        account: address
      });
      
      toast({
        title: "Processing Payment",
        description: "Please wait while your transaction is being confirmed...",
      });
      
      // The transaction confirmation is handled by the useEffect hook that watches isConfirmed
    } catch (error) {
      console.error("Error initiating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to initiate transaction. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };
  const handleShareRaffle = () => {
    if (navigator.share) {
      navigator.share({
        title: raffle?.title || "HumanRaffle",
        text: `Check out this exclusive raffle for verified humans: ${raffle?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Raffle link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
    );
  }

  const isActive = raffle.status === "active";
  const isPast = raffle.status === "completed";
  const hasWinner = !!raffle.winner;

  return (
    <div className="relative min-h-screen">
      <FloatingElements />
      {showConfetti && <ConfettiEffect />}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Raffle</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitPayment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  To Address
                </Label>
                <Input 
                  id="address" 
                  value={treasuryAddress}
                  disabled
                  className="col-span-3 mb-2 text-gray-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount (ETH)
                </Label>
                <Input 
                  id="amount" 
                  value={paymentAmount}
                  placeholder="Enter amount in ETH" 
                  className="col-span-3" 
                  type="number" 
                  step="0.001" 
                  min="0.001"
                  required 
                  onChange={(e) => setPaymentAmount(e.target.value)} 
                />
              </div>
              <p className="text-xs text-gray-500 col-span-4 pl-4">
                Minimum entry: 0.001 ETH. Larger contributions increase your chances!
              </p>
            </div>
            <DialogFooter>
            <Button type="submit" disabled={isSubmitting || isSendingTx || isConfirming}>
                {isSubmitting ? 
                  (isConfirming ? 'Confirming...' : isSendingTx ? 'Sending...' : 'Processing...') : 
                  `Pay ${paymentAmount} ETH`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-600 mb-2">Prize Pool</h3>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                      </svg>
                      <span className="font-bold text-blue-700">
                        {raffle.prizePool ? `${raffle.prizePool} ETH` : "Growing!"}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      The more people enter, the bigger the prize gets!
                    </p>
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
            {!userContext.user ? (
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

                  {!userHasWallet(userContext) &&
                    <div className="p-4 rounded-lg border bg-card shadow-md mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                          </div>
                          <span className="text-sm font-medium">Wallet Setup</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">Create a blockchain wallet to enable payments and secure your health data.</p>
                        
                        <Button 
                          onClick={afterLogin} 
                          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                          Create Wallet
                        </Button>
                      </div>
                    </div>
                  }

                  {userHasWallet(userContext) && 
                    <div className="p-4 rounded-lg border bg-card shadow-md mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Wallet className="h-5 w-5 text-primary mr-2" />
                          <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                            <Check className="h-3 w-3 text-green-500" />
                          </div>
                          <span className="text-sm font-medium">Wallet Connected</span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Wallet Address</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                              {userContext.ethereum.address.substring(0, 6)}...{userContext.ethereum.address.substring(userContext.ethereum.address.length - 4)}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => {
                                navigator.clipboard.writeText(userContext.ethereum.address);
                                toast({
                                  title: "Success",
                                  description: "Address copied to clipboard"
                                });
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground">Balance</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {balance?.data
                                ? `${(BigInt(balance.data.value) / BigInt(1e18)).toString()} ${balance.data.symbol}`
                                : "Loading..."}
                            </span>
                            {(balance?.data && BigInt(balance.data.value) === BigInt(0)) && (
                              <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                Low balance
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  }

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
                        <NFTTicket raffle={raffle} walletAddress={userContext.ethereum?.address || ""} />
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
                      <Button
                        onClick={handleEnterRaffle}
                        disabled={isSubmitting || !address }
                        className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {isProcessingPayment ? "Processing Payment..." : "Processing..."}
                          </>
                        ) : (
                          `Enter Raffle (${paymentAmount} ETH)`
                        )}
                      </Button>

                      <p className="text-xs text-center text-gray-500">
                        By entering, you confirm you are a real person and agree to the raffle terms. 
                        Your ETH contribution goes toward the prize pool.
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
  );
}