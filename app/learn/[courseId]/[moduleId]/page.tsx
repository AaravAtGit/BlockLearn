import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, BookOpen, Video, FileText } from "lucide-react"

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  // This would come from a database in a real application
  const moduleContent = {
    title: "Blockchain Fundamentals",
    description: "Understanding the core concepts of blockchain technology",
    currentLesson: 1,
    totalLessons: 5,
    lessons: [
      {
        id: 1,
        title: "What is Blockchain?",
        content: `
          <h2>Introduction to Blockchain Technology</h2>
          <p>A blockchain is a distributed database or ledger that is shared among the nodes of a computer network. As a database, a blockchain stores information electronically in digital format.</p>
          
          <p>Blockchains are best known for their crucial role in cryptocurrency systems, such as Bitcoin, for maintaining a secure and decentralized record of transactions. The innovation with a blockchain is that it guarantees the fidelity and security of a record of data and generates trust without the need for a trusted third party.</p>
          
          <h3>Key Characteristics of Blockchain:</h3>
          <ul>
            <li><strong>Decentralization:</strong> No single entity has control over the entire network</li>
            <li><strong>Transparency:</strong> All transactions are visible to anyone on the network</li>
            <li><strong>Immutability:</strong> Once data is recorded, it cannot be altered</li>
            <li><strong>Security:</strong> Cryptographic principles ensure data integrity</li>
          </ul>
          
          <p>In the next lesson, we'll explore how blocks are created and linked together to form the blockchain.</p>
        `,
      },
    ],
  }

  const currentLesson = moduleContent.lessons[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/learn">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Modules
          </Button>
        </Link>
        <div className="text-sm text-gray-500">
          Lesson {moduleContent.currentLesson} of {moduleContent.totalLessons}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{moduleContent.title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{moduleContent.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentLesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="read">
            <TabsList className="mb-4">
              <TabsTrigger value="read" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Read
              </TabsTrigger>
              <TabsTrigger value="watch" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                Watch
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>
            <TabsContent value="read">
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            </TabsContent>
            <TabsContent value="watch">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">Video content would be displayed here</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="resources">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Blockchain Technology Whitepaper
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      History of Blockchain Development
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Blockchain Use Cases Beyond Cryptocurrency
                    </a>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Lesson
        </Button>
        <Link href="/quizzes/1">
          <Button>
            Next Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
