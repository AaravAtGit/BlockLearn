"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Award, Menu, Home, BarChart3, Wallet, User } from "lucide-react"
import { useWalletContext } from "@/context/wallet-context"
import { ConnectButton } from "@/components/connect-button"

export function Navigation() {
  const [open, setOpen] = useState(false)
  const { isConnected, address } = useWalletContext()

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "BlockLearn AI",
      path: "/blocklearn-ai",
      icon: <BarChart3 className="h-5 w-5" />,
    }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">BlockLearn</span>
          </Link>
        </div>
        <nav className="hidden md:flex md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Link href="/profile">
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </header>
  )
}
