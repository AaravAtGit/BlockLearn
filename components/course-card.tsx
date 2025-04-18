import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, BarChart } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    image: string
    lessons: number
    duration: string
    level: string
    icon?: React.ReactNode
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img src={course.image || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-white p-2 shadow-md dark:bg-gray-800">
          {course.icon || <BookOpen className="h-6 w-6" />}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{course.level}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full">Start Course</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
