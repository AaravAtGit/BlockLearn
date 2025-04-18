import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, BookOpen, Video, FileText } from "lucide-react"

export default function ModulePage({ params }: { params: { courseId: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/learn">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Modules
          </Button>
        </Link>
      </div>
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Module Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">
                <BookOpen className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="mr-2 h-4 w-4" />
                Video
              </TabsTrigger>
              <TabsTrigger value="quiz">
                <FileText className="mr-2 h-4 w-4" />
                Quiz
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p>Overview content goes here...</p>
            </TabsContent>
            <TabsContent value="video">
              <p>Video content goes here...</p>
            </TabsContent>
            <TabsContent value="quiz">
              <p>Quiz content goes here...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}