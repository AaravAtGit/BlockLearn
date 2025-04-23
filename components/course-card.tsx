import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, BarChart } from "lucide-react"
import ReactMarkdown from 'react-markdown'

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
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="prose-sm dark:prose-invert">
          <div className="line-clamp-4 max-h-24 overflow-hidden">
            <ReactMarkdown>
              {course.description}
            </ReactMarkdown>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1" title={`${course.lessons} lessons`}>
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1" title={course.duration}>
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1" title={`Level: ${course.level}`}>
            <BarChart className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{course.level}</span>
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
