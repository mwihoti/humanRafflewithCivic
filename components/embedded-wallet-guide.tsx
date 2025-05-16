"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Key, Lock, Fingerprint, HelpCircle } from "lucide-react"

export default function EmbeddedWalletGuide() {
  const [activeTab, setActiveTab] = useState("what")

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-white/30 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-600">Understanding Embedded Wallets</h2>
          <p className="text-gray-600 mt-1">Learn about the secure blockchain wallet created for you by Civic Auth.</p>
        </div>

        <Tabs defaultValue="what" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="what">What Is It?</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="what" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Wallet className="h-8 w-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-700">Embedded Wallet</h3>
                  <p className="text-gray-600">
                    An embedded wallet is a blockchain wallet that's created and managed for you by Civic Auth.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-md">
                <h4 className="font-bold text-purple-700 mb-2">How It Works</h4>
                <p className="text-sm text-purple-600 mb-3">
                  Unlike traditional wallets where you need to manage private keys and seed phrases, embedded wallets
                  are:
                </p>
                <ul className="space-y-2 text-sm text-purple-600">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Secured by your Civic Auth identity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Private keys are managed securely by Civic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Protected by advanced encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Fingerprint className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Accessible only by you through your verified identity</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-purple-700">Benefits of Embedded Wallets</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    Enhanced Security
                  </h4>
                  <p className="text-sm text-purple-600">
                    No seed phrases to lose or have stolen. Your wallet is secured by Civic's enterprise-grade security.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Key className="h-4 w-4 text-purple-500" />
                    No Seed Phrases
                  </h4>
                  <p className="text-sm text-purple-600">
                    You don't need to write down or remember complex seed phrases. Your identity is your key.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-purple-500" />
                    Multi-Device Access
                  </h4>
                  <p className="text-sm text-purple-600">
                    Access your wallet from any device by simply verifying your identity with Civic Auth.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    Account Recovery
                  </h4>
                  <p className="text-sm text-purple-600">
                    If you lose access to your devices, you can recover your wallet through Civic's identity
                    verification.
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-purple-700">Frequently Asked Questions</h3>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-purple-500" />
                    Who controls my embedded wallet?
                  </h4>
                  <p className="text-sm text-purple-600">
                    You have full control over your wallet. Civic only provides the infrastructure to secure and access
                    it. Only you can initiate transactions from your wallet.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-purple-500" />
                    Can I export my private keys?
                  </h4>
                  <p className="text-sm text-purple-600">
                    For security reasons, private keys cannot be exported. This is a security feature that prevents your
                    keys from being compromised. Your wallet is always accessible through Civic Auth.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-purple-500" />
                    What happens if Civic shuts down?
                  </h4>
                  <p className="text-sm text-purple-600">
                    Civic has implemented safeguards to ensure you'll always have access to your funds, even in the
                    unlikely event of service disruption. This includes decentralized recovery mechanisms.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-purple-500" />
                    Is my embedded wallet compatible with other services?
                  </h4>
                  <p className="text-sm text-purple-600">
                    Yes! Your embedded wallet is a standard Ethereum wallet that can interact with any dApp or service
                    that supports Ethereum. You can use it anywhere you'd use a regular wallet.
                  </p>
                </div>
              </div>

              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.open("https://www.civic.com/products/civic-wallet/", "_blank")}
                >
                  Learn More About Civic Wallet
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
