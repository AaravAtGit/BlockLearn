"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Web3Provider } from "@ethersproject/providers"
import { formatEther } from "@ethersproject/units"

// Constants for Monad chain configuration
const MONAD_CHAIN_CONFIG = {
  chainId: "0x279f",
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz/"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
}

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
      if (typeof window === "undefined" || !window.ethereum) return;
      
      try {
        const provider = new Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts && accounts.length > 0) {
          setProvider(provider)
          setAddress(accounts[0])
          setIsConnected(true)
          
          const balance = await provider.getBalance(accounts[0])
          setBalance(formatEther(balance))
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error)
      }
    }
    
    checkConnection()
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setIsConnected(false)
        setAddress(null)
        setBalance("0")
        setProvider(null)
      } else {
        // Account changed
        try {
          const provider = new Web3Provider(window.ethereum)
          setProvider(provider)
          setAddress(accounts[0])
          setIsConnected(true)
          
          const balance = await provider.getBalance(accounts[0])
          setBalance(formatEther(balance))
        } catch (error) {
          console.error("Error handling account change:", error)
        }
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

  // Function to update balance
  const updateBalance = async (userAddress: string) => {
    if (!provider) return;
    
    try {
      const balance = await provider.getBalance(userAddress)
      setBalance(formatEther(balance))
    } catch (error) {
      console.error("Failed to fetch balance:", error)
      setBalance("0")
    }
  }

  // Function to switch to or add Monad network
  const setupMonadNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) return;
    
    try {
      // Try to switch to Monad chain first
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_CHAIN_CONFIG.chainId }]
      })
    } catch (switchError: any) {
      // Chain hasn't been added yet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_CHAIN_CONFIG]
          })
        } catch (addError) {
          console.error("Failed to add Monad chain:", addError)
          throw new Error("Failed to add Monad chain to your wallet")
        }
      } else {
        throw switchError
      }
    }
  }

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install a Web3 wallet like MetaMask to connect")
      return
    }

    setIsConnecting(true)

    try {
      // Request account access - using the modern method only
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      }) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet")
      }

      // Initialize provider after we have account access
      const provider = new Web3Provider(window.ethereum)
      setProvider(provider)
      setAddress(accounts[0])
      setIsConnected(true)
      
      // After connecting, try to switch to the Monad network
      try {
        await setupMonadNetwork()
      } catch (networkError) {
        console.error("Network setup error:", networkError)
        // Don't throw here - we want to continue even if network switch fails
      }
      
      // Update the user's balance
      await updateBalance(accounts[0])
      
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      
      if (error.code === 4001) {
        alert("User rejected the connection request")
      } else {
        alert(error.message || "Failed to connect wallet. Please try again.")
      }
      
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