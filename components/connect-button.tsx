"use client"

import { Button } from "@/components/ui/button"
import { useWalletContext } from "@/context/wallet-context"

export function ConnectButton() {
  const { connect, isConnecting } = useWalletContext()

  return (
    <Button onClick={connect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
