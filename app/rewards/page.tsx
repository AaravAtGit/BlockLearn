"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Wallet, Gift, Trophy, ArrowRight, BookOpen } from "lucide-react"
import { useWalletContext } from "@/context/wallet-context"

export default function RewardsPage() {
  const { isConnected, address } = useWalletContext()
  const [tokens, setTokens] = useState(50)

  // Mock data for rewards
  const rewards = [
    {
      id: 1,
      title: "Advanced Blockchain Course",
      description: "Unlock the advanced blockchain development course",
      cost: 100,
      image: "/placeholder.svg?height=100&width=100",
      category: "courses",
    },
    {
      id: 2,
      title: "NFT Creation Guide",
      description: "Step-by-step guide to creating your first NFT",
      cost: 75,
      image: "/placeholder.svg?height=100&width=100",
      category: "courses",
    },
    {
      id: 3,
      title: "Blockchain Developer Certificate",
      description: "Digital certificate to showcase your blockchain knowledge",
      cost: 200,
      image: "/placeholder.svg?height=100&width=100",
      category: "digital",
    },
    {
      id: 4,
      title: "Limited Edition NFT",
      description: "Exclusive NFT for BlockLearn members",
      cost: 150,
      image: "/placeholder.svg?height=100&width=100",
      category: "digital",
    },
    {
      id: 5,
      title: "BlockLearn T-Shirt",
      description: "Show off your blockchain enthusiasm",
      cost: 120,
      image: "/placeholder.svg?height=100&width=100",
      category: "physical",
    },
    {
      id: 6,
      title: "Hardware Wallet Discount",
      description: "25% off a leading hardware wallet",
      cost: 80,
      image: "/placeholder.svg?height=100&width=100",
      category: "physical",
    },
  ]

  // Filter rewards by category
  const filterRewards = (category: string) => {
    if (category === "all") return rewards
    return rewards.filter((reward) => reward.category === category)
  }

  const handleClaimReward = (rewardId: number, cost: number) => {
    if (tokens >= cost) {
      setTokens(tokens - cost)
      // In a real app, you would update the user's claimed rewards in a database
      alert(`You've successfully claimed this reward!`)
    } else {
      alert("You don't have enough tokens to claim this reward.")
    }
  }

  // Calculate progress to next tier
  const nextTierThreshold = 100
  const progress = (tokens / nextTierThreshold) * 100

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to connect your wallet to access rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Connect your Web3 wallet on Monad chain to view and claim rewards with your earned tokens.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/connect" className="w-full">
              <Button className="w-full">Connect Wallet</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Your Rewards</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Earn tokens by completing quizzes and redeem them for rewards on Monad chain
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              <CardTitle>Token Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">{tokens}</div>
              <p className="text-sm text-gray-500">BlockTokens</p>
              {address && (
                <p className="mt-2 truncate text-xs text-gray-500">
                  Wallet: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/courses" className="w-full">
              <Button variant="outline" className="w-full">
                Earn More Tokens
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              <CardTitle>Reward Tier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">Bronze</div>
              <p className="text-sm text-gray-500">{nextTierThreshold - tokens} more tokens to Silver</p>
              <Progress value={progress} className="mt-2 h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/quizzes/blockchain-fundamentals" className="w-full">
              <Button variant="outline" className="w-full">
                Take a Quiz
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              <CardTitle>Claimed Rewards</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">0</div>
              <p className="text-sm text-gray-500">Rewards Claimed</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              View Claimed Rewards
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Available Rewards</h2>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Rewards</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="digital">Digital Items</TabsTrigger>
            <TabsTrigger value="physical">Physical Items</TabsTrigger>
          </TabsList>

          {["all", "courses", "digital", "physical"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterRewards(category).map((reward) => (
                  <Card key={reward.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{reward.title}</CardTitle>
                        <div className="flex items-center text-amber-600 dark:text-amber-500">
                          <span className="font-bold">{reward.cost}</span>
                          <Wallet className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <img
                          src={reward.image || "/placeholder.svg"}
                          alt={reward.title}
                          className="h-32 w-32 rounded-lg object-cover"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleClaimReward(reward.id, reward.cost)}
                        disabled={tokens < reward.cost}
                        className="w-full"
                        variant={tokens >= reward.cost ? "default" : "outline"}
                      >
                        {tokens >= reward.cost ? "Claim Reward" : "Not Enough Tokens"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="mt-16 rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to earn more rewards?</h2>
          <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
            Continue your blockchain learning journey and earn tokens by completing quizzes.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/courses">
              <Button className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Continue Learning
              </Button>
            </Link>
            <Link href="/quizzes/blockchain-fundamentals">
              <Button variant="outline" className="flex items-center gap-2">
                Take a Quiz
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
