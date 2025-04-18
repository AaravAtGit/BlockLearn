import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, BarChart3, Bitcoin, Cpu } from "lucide-react"
import { CourseCard } from "@/components/course-card"

export default function Home() {
  const courses = [
    {
      id: "blockchain-fundamentals",
      title: "Blockchain Fundamentals",
      description: "Learn the core concepts and technology behind blockchain",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 12,
      duration: "4 hours",
      level: "Beginner",
      icon: <BookOpen className="h-8 w-8" />,
    },
    {
      id: "bitcoin",
      title: "Bitcoin: Digital Gold",
      description: "Understand Bitcoin's technology, economics, and impact",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 10,
      duration: "3.5 hours",
      level: "Intermediate",
      icon: <Bitcoin className="h-8 w-8" />,
    },
    {
      id: "ethereum",
      title: "Ethereum & Smart Contracts",
      description: "Master Ethereum, smart contracts, and decentralized applications",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 15,
      duration: "5 hours",
      level: "Advanced",
      icon: <Cpu className="h-8 w-8" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">BlockLearn</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Master blockchain technology and earn rewards by testing your knowledge
        </p>
      </div>

      <div className="mb-16 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 p-8 text-white">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="mb-4 text-3xl font-bold">Connect Your Web3 Wallet</h2>
            <p className="mb-6">
              Authenticate with your Web3 wallet on Monad chain to track your progress, earn tokens, and claim rewards.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/connect">
                <Button variant="secondary" size="lg">
                  Connect Wallet
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20" size="lg">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-lg bg-white/10 p-6">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Web3 Wallet"
                className="mx-auto h-48 w-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">Featured Courses</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive courses to master blockchain technology from beginner to expert
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="mb-16 grid gap-8 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <BookOpen className="mb-2 h-8 w-8 text-gray-900 dark:text-gray-100" />
            <CardTitle>Learn</CardTitle>
            <CardDescription>Comprehensive blockchain learning modules</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Start with blockchain fundamentals and progress to advanced concepts like Bitcoin's consensus mechanism,
              Ethereum's smart contracts, and decentralized applications.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/learn" className="w-full">
              <Button className="w-full">Start Learning</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <BarChart3 className="mb-2 h-8 w-8 text-gray-900 dark:text-gray-100" />
            <CardTitle>Test</CardTitle>
            <CardDescription>Verify your knowledge with interactive quizzes</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Take quizzes after each learning module to test your understanding. Our adaptive quizzes adjust to your
              knowledge level for optimal learning and token rewards.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/quizzes" className="w-full">
              <Button className="w-full" variant="outline">
                View Quizzes
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <Award className="mb-2 h-8 w-8 text-gray-900 dark:text-gray-100" />
            <CardTitle>Earn</CardTitle>
            <CardDescription>Get rewarded for your blockchain knowledge</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Earn BlockLearn tokens on Monad chain for completing quizzes successfully. Use your tokens to unlock
              advanced courses or exchange them for real-world rewards.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/rewards" className="w-full">
              <Button className="w-full" variant="outline">
                View Rewards
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to become a blockchain expert?</h2>
          <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
            Join thousands of learners who have enhanced their blockchain knowledge and earned rewards on Monad chain.
          </p>
          <Link href="/connect">
            <Button size="lg">Connect Wallet & Start Learning</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
