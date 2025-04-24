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

// Add Ethereum interface to Window object
declare global {
  interface Window {
    ethereum?: any
  }
}

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
        // Use direct ethereum provider method instead of ethers.js
        const accounts = await window.ethereum.request({
          method: "eth_accounts"
        }) as string[]
        
        if (accounts && accounts.length > 0) {
          const provider = new Web3Provider(window.ethereum)
          setProvider(provider)
          setAddress(accounts[0])
          setIsConnected(true)
          
          // Get balance directly from ethereum provider
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"]
          }) as string
          
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
          
          // Get balance directly from ethereum provider
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"]
          }) as string
          
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
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  // Function to update balance
  const updateBalance = async (userAddress: string) => {
    if (typeof window === "undefined" || !window.ethereum) return;
    
    try {
      // Get balance directly from ethereum provider
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [userAddress, "latest"]
      }) as string
      
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
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.error("Not in browser environment")
      return
    }

    // More detailed check for ethereum provider
    if (!window.ethereum) {
      console.error("No ethereum provider found - do you have MetaMask installed?")
      alert("Please install MetaMask to connect your wallet")
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    setIsConnecting(true)
    console.log("Attempting to connect wallet...")

    try {
      console.log("Requesting accounts...")
      
      // Use direct ethereum provider methods instead of ethers.js
      let accounts
      
      try {
        // Main connection method - eth_requestAccounts
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts" 
        }) as string[]
      } catch (requestError: any) {
        console.error("First connection attempt failed:", requestError)
        
        if (requestError.code === -32002) {
          throw new Error("MetaMask is already processing a request. Please check your MetaMask extension.")
        }
        
        // Legacy fallback
        try {
          accounts = await window.ethereum.enable() as string[]
        } catch (enableError: any) {
          console.error("Legacy connection method failed:", enableError)
          throw enableError
        }
      }

      console.log("Received accounts:", accounts)

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet")
      }

      // Create provider after we have account access
      const provider = new Web3Provider(window.ethereum)
      setProvider(provider)
      setAddress(accounts[0])
      setIsConnected(true)
      
      // After connecting, try to switch to the Monad network
      try {
        console.log("Setting up Monad network...")
        await setupMonadNetwork()
      } catch (networkError) {
        console.error("Network setup error:", networkError)
        // Don't throw here - we want to continue even if network switch fails
      }
      
      // Update the user's balance
      console.log("Updating balance...")
      await updateBalance(accounts[0])
      
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      
      if (error.code === 4001) {
        alert("You rejected the connection request. Please try again and approve the connection in MetaMask.")
      } else {
        const errorMessage = error.message || "Failed to connect wallet. Please make sure MetaMask is unlocked and try again."
        console.error("Detailed error:", error)
        alert(errorMessage)
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