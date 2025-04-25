"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Trophy, User, Hexagon } from "lucide-react"
import { useWalletContext } from "@/context/wallet-context"

export default function ProfilePage() {
  const { isConnected, address } = useWalletContext()

  // Mock data for earned NFTs
  const achievements = [
    {
      id: 1,
      title: "Blockchain Pioneer",
      description: "Completed the Blockchain Fundamentals course",
      image: "/certificate.png",
      category: "course",
      dateEarned: "2025-04-15",
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Achieved perfect score in 3 consecutive quizzes",
      image: "/certificate.png",
      category: "quiz",
      dateEarned: "2025-04-18",
    },
    {
      id: 3,
      title: "Early Adopter",
      description: "One of the first 100 users of BlockLearn",
      image: "/certificate.png",
      category: "special",
      dateEarned: "2025-04-10",
    },
  ]

  // Filter achievements by category
  const filterAchievements = (category: string) => {
    if (category === "all") return achievements
    return achievements.filter((achievement) => achievement.category === category)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Connect your wallet to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Connect your Web3 wallet on Monad chain to access your profile and view your achievements.
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
        <h1 className="mb-2 text-3xl font-bold">Your Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View your achievements and NFT collection
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              <CardTitle>Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {address && (
                <p className="truncate text-sm font-medium">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">Connected to Monad Chain</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              <CardTitle>Level</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">Bronze</div>
              <p className="text-sm text-gray-500">Complete more quizzes to level up</p>
              <Progress value={65} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Hexagon className="mr-2 h-5 w-5" />
              <CardTitle>NFTs Earned</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">{achievements.length}</div>
              <p className="text-sm text-gray-500">Achievement NFTs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Your Achievement NFTs</h2>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All NFTs</TabsTrigger>
            <TabsTrigger value="course">Course Completion</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Mastery</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>

          {["all", "course", "quiz", "special"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterAchievements(category).map((achievement) => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{achievement.title}</CardTitle>
                      </div>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="h-32 w-32 rounded-lg object-cover"
                        />
                      </div>
                      <p className="mt-4 text-center text-sm text-gray-500">
                        Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="mt-16 rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to earn more achievements?</h2>
          <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
            Complete courses and quizzes to earn unique NFTs that showcase your blockchain expertise.
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
                <Award className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}