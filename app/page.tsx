import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, BarChart3, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="container relative mx-auto flex flex-col items-center px-4 py-20 text-center lg:py-32">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-6xl">
          Master Blockchain Technology
          <br />
          <span className="text-primary">Have Fun While You Learn</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Join BlockLearn to master blockchain development through interactive courses,
          earn rewards on Monad chain, and become part of the next generation of blockchain experts. Learn in a fun and gamified way! 
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/connect">
            <Button size="lg" className="font-semibold">
              Start Learning Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="lg" className="font-semibold">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <BookOpen className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Interactive Learning</CardTitle>
              <CardDescription>Master blockchain at your pace</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>
                Comprehensive courses covering everything from blockchain basics to advanced DeFi concepts.
                Learn through practical examples and real-world applications.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Verify your knowledge</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>
                Test your understanding with adaptive quizzes that match your skill level.
                Watch your progress grow as you complete each module.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <Award className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Earn Rewards</CardTitle>
              <CardDescription>Get rewarded for learning</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>
                Earn exclusive BlockLearn NFTs on Monad chain as you complete courses.
                Unlock advanced content and earn real-world rewards.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Blockchain Journey?</h2>
            <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
              Join thousands of learners who are already building the future of Web3.
              Connect your wallet and start earning while you learn!
            </p>
            <Link href="/connect">
              <Button size="lg" className="font-semibold">
                Connect Wallet & Start Learning
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
