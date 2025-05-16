"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Wallet, Check } from "lucide-react"
import { useUser, useAuth } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"

export default function TransactionDemo() {
  const { toast } = useToast()
  const userContext = useUser()
  //const { signTransaction } = useAuth()
  const [amount, setAmount] = useState("0.001")
  const [recipient, setRecipient] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F") // Example address
  const [isSigning, setIsSigning] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState("")

  const hasWallet = userHasWallet(userContext)

  const handleSignTransaction = async () => {
    if (!hasWallet) {
      toast({
        title: "No Wallet Found",
        description: "You need to create an embedded wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsSigning(true)
    try {
      // Create a transaction object
      const transaction = {
        to: recipient,
        value: (Number(amount) * 1e18).toString(), // Convert to wei
        data: "0x", // Empty data for a simple transfer
      }

      // Sign the transaction using the embedded wallet
      const signedTx = await signTransaction(transaction)

      // In a real app, you would broadcast this transaction
      // For demo purposes, we'll just show success
      setTxHash(
        "0x" +
          Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(""),
      )
      setIsSuccess(true)

      toast({
        title: "Transaction Signed Successfully!",
        description: "Your transaction has been signed with your embedded wallet.",
      })
    } catch (error) {
      console.error("Error signing transaction:", error)
      toast({
        title: "Transaction Signing Failed",
        description: "There was an error signing your transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-600">Embedded Wallet Transaction Demo</h2>
          <p className="text-gray-600 mt-2">
            This demonstrates how transactions are signed using your Civic embedded wallet.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Recipient Address</label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm"
              disabled={isSigning || isSuccess}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Amount (ETH)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.0001"
              step="0.0001"
              disabled={isSigning || isSuccess}
            />
          </div>

          {isSuccess ? (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-500" />
                <h3 className="font-bold text-green-700">Transaction Signed!</h3>
              </div>
              <p className="text-sm text-green-600 mb-2">Your transaction has been signed with your embedded wallet.</p>
              <div className="bg-white p-2 rounded-md">
                <p className="text-xs font-mono break-all text-purple-700">Transaction Hash: {txHash}</p>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleSignTransaction}
              disabled={isSigning || !hasWallet}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isSigning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing Transaction...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Sign Transaction with Embedded Wallet
                </>
              )}
            </Button>
          )}

          {!hasWallet && (
            <div className="bg-amber-50 p-4 rounded-md">
              <p className="text-sm text-amber-700">
                You need to create an embedded wallet first. Go to the onboarding page to create one.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
