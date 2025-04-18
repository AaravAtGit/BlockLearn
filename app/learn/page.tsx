import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Lock } from "lucide-react"

export default function LearnPage() {
  // Mock data for learning modules
  const modules = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      description: "Learn the basic concepts of blockchain technology",
      lessons: 5,
      completed: 5,
      unlocked: true,
      quizAvailable: true,
    },
    {
      id: 2,
      title: "Cryptocurrencies",
      description: "Understand how cryptocurrencies work on blockchain",
      lessons: 4,
      completed: 2,
      unlocked: true,
      quizAvailable: false,
    },
    {
      id: 3,
      title: "Smart Contracts",
      description: "Explore the world of programmable blockchain contracts",
      lessons: 6,
      completed: 0,
      unlocked: false,
      quizAvailable: false,
    },
    {
      id: 4,
      title: "Decentralized Applications",
      description: "Build applications on blockchain technology",
      lessons: 8,
      completed: 0,
      unlocked: false,
      quizAvailable: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Learning Modules</h1>
        <p className="text-gray-500 dark:text-gray-400">Complete all modules to become a blockchain expert</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <Card key={module.id} className={module.unlocked ? "" : "opacity-75"}>
            <CardHeader className="relative">
              {!module.unlocked && (
                <div className="absolute right-4 top-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span>
                  {module.completed} of {module.lessons} lessons completed
                </span>
                <span>{Math.round((module.completed / module.lessons) * 100)}%</span>
              </div>
              <Progress value={(module.completed / module.lessons) * 100} className="h-2" />

              <div className="mt-4">
                {module.completed === module.lessons ? (
                  <div className="flex items-center text-green-600 dark:text-green-500">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <span>Module completed</span>
                  </div>
                ) : module.unlocked ? (
                  <p className="text-sm text-gray-500">Continue where you left off</p>
                ) : (
                  <p className="text-sm text-gray-500">Complete previous modules to unlock</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={module.unlocked ? `/learn/${module.id}` : "#"} className="w-full">
                <Button
                  variant={module.unlocked ? "default" : "outline"}
                  className="w-full"
                  disabled={!module.unlocked}
                >
                  {module.completed === 0 ? "Start" : module.completed === module.lessons ? "Review" : "Continue"}
                </Button>
              </Link>
              {module.quizAvailable && (
                <Link href={`/quizzes/${module.id}`} className="ml-2 w-full">
                  <Button variant="outline" className="w-full">
                    Take Quiz
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
