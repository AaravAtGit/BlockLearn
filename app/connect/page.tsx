"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWalletContext } from "@/context/wallet-context"
import { Wallet, ShieldCheck } from "lucide-react"

export default function ConnectPage() {
  const { isConnected, connect, isConnecting, address } = useWalletContext()
  const router = useRouter()

  // Redirect to courses if already connected
  useEffect(() => {
    if (isConnected) {
      router.push("/courses")
    }
  }, [isConnected, router])

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your Web3 wallet to access courses, track progress, and earn rewards on Monad chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Secure Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your wallet provides secure, passwordless authentication
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-1">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Earn Real Tokens</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete quizzes to earn tokens on Monad chain
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={connect} disabled={isConnecting} className="w-full">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have a wallet?{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Get MetaMask
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
