import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Bitcoin, Cpu } from "lucide-react"
import { CourseCard } from "@/components/course-card"

export default function CoursesPage() {
  const courses = [
    {
      id: "blockchain-fundamentals",
      title: "Blockchain Fundamentals",
      description: "Learn the core concepts and technology behind blockchain",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 12,
      duration: "4 hours",
      level: "Beginner",
      category: "fundamentals",
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
      category: "bitcoin",
      icon: <Bitcoin className="h-8 w-8" />,
    },
    {
      id: "bitcoin-mining",
      title: "Bitcoin Mining & Security",
      description: "Deep dive into Bitcoin's mining process and security model",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 8,
      duration: "3 hours",
      level: "Advanced",
      category: "bitcoin",
      icon: <Bitcoin className="h-8 w-8" />,
    },
    {
      id: "ethereum",
      title: "Ethereum & Smart Contracts",
      description: "Master Ethereum, smart contracts, and decentralized applications",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 15,
      duration: "5 hours",
      level: "Intermediate",
      category: "ethereum",
      icon: <Cpu className="h-8 w-8" />,
    },
    {
      id: "ethereum-development",
      title: "Ethereum Development",
      description: "Learn to build decentralized applications on Ethereum",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 12,
      duration: "6 hours",
      level: "Advanced",
      category: "ethereum",
      icon: <Cpu className="h-8 w-8" />,
    },
    {
      id: "blockchain-use-cases",
      title: "Blockchain Use Cases",
      description: "Explore real-world applications of blockchain technology",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 10,
      duration: "3 hours",
      level: "Beginner",
      category: "fundamentals",
      icon: <BookOpen className="h-8 w-8" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Courses</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Comprehensive courses to master blockchain technology from beginner to expert
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="fundamentals">Blockchain Fundamentals</TabsTrigger>
          <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fundamentals">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((course) => course.category === "fundamentals")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="bitcoin">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((course) => course.category === "bitcoin")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ethereum">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((course) => course.category === "ethereum")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Learning Path Recommendation</h2>
          <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
            Not sure where to start? Follow our recommended learning path for a structured journey.
          </p>
          <div className="mb-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <Card className="w-full max-w-xs">
              <CardHeader className="text-center">
                <CardTitle>Step 1</CardTitle>
                <CardDescription>Start with the basics</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <BookOpen className="mx-auto mb-2 h-12 w-12 text-primary" />
                <h3 className="font-medium">Blockchain Fundamentals</h3>
              </CardContent>
            </Card>
            <Card className="w-full max-w-xs">
              <CardHeader className="text-center">
                <CardTitle>Step 2</CardTitle>
                <CardDescription>Understand Bitcoin</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Bitcoin className="mx-auto mb-2 h-12 w-12 text-primary" />
                <h3 className="font-medium">Bitcoin: Digital Gold</h3>
              </CardContent>
            </Card>
            <Card className="w-full max-w-xs">
              <CardHeader className="text-center">
                <CardTitle>Step 3</CardTitle>
                <CardDescription>Master Ethereum</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Cpu className="mx-auto mb-2 h-12 w-12 text-primary" />
                <h3 className="font-medium">Ethereum & Smart Contracts</h3>
              </CardContent>
            </Card>
          </div>
          <Link href="/courses/blockchain-fundamentals">
            <Button size="lg">Start Learning Path</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
