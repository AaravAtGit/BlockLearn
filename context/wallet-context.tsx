"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Web3Provider } from "@ethersproject/providers"
import { parseEther, formatEther } from "@ethersproject/units"

interface WalletContextType {
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  address: null,
  balance: "0",
  connect: async () => {},
  disconnect: () => {},
})

export const useWalletContext = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [provider, setProvider] = useState<Web3Provider | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== "undefined" && window.ethereum) {
          const provider = new Web3Provider(window.ethereum)
          const accounts = await provider.listAccounts()
          
          if (accounts && accounts.length > 0) {
            setProvider(provider)
            setAddress(accounts[0])
            setIsConnected(true)
            
            const balance = await provider.getBalance(accounts[0])
            setBalance(formatEther(balance))
          }
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error)
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      return
    }

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsConnected(false)
        setAddress(null)
        setBalance("0")
        setProvider(null)
      } else {
        const provider = new Web3Provider(window.ethereum)
        setProvider(provider)
        setAddress(accounts[0])
        setIsConnected(true)
        
        const balance = await provider.getBalance(accounts[0])
        setBalance(formatEther(balance))
      }
    }

    window.ethereum?.on("accountsChanged", handleAccountsChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
    }
  }, [])

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install a Web3 wallet like MetaMask to connect")
      return
    }

    setIsConnecting(true)

    try {
      const provider = new Web3Provider(window.ethereum)
      // Request accounts using the provider's way
      await provider.send("eth_requestAccounts", [])
      const accounts = await provider.listAccounts()

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet")
      }

      // Add Monad chain
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x279f",
            chainName: "Monad Testnet",
            nativeCurrency: {
              name: "Monad",
              symbol: "MON",
              decimals: 18,
            },
            rpcUrls: ["https://testnet-rpc.monad.xyz/"],
            blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
          }]
        })
      } catch (addError) {
        console.log("Chain may already exist:", addError)
      }

      // Switch to Monad chain
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x279f" }]
        })
      } catch (switchError) {
        console.error("Failed to switch chain:", switchError)
        setIsConnecting(false)
        return
      }

      setProvider(provider)
      setAddress(accounts[0])
      setIsConnected(true)

      const balance = await provider.getBalance(accounts[0])
      setBalance(formatEther(balance))
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setIsConnected(false)
      setAddress(null)
      setBalance("0")
      setProvider(null)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0")
    setProvider(null)
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        address,
        balance,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
