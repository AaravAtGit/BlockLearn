import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { WalletProvider } from "@/context/wallet-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlockLearn - Blockchain Learning Platform",
  description: "Learn blockchain technology and earn rewards on Monad chain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <Navigation />
            <main>{children}</main>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'