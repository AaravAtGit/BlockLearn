import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, BookOpen, Video, FileText } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Resource {
  title: string;
  url: string;
}

interface LessonContent {
  id: number;
  title: string;
  content: string;
  resources: Resource[];
}

interface ModuleData {
  title: string;
  description: string;
  currentLesson: number;
  totalLessons: number;
  lessons: LessonContent[];
}

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  // Mock data - in a real app this would come from an API or database
  const moduleContent: ModuleData = {
    title: "Blockchain Fundamentals",
    description: "Understanding the core concepts of blockchain technology",
    currentLesson: 1,
    totalLessons: 5,
    lessons: [
      {
        id: 1,
        title: "What is Blockchain?",
        content: `
# Introduction to Blockchain Technology

A blockchain is a distributed database or ledger shared among computer network nodes. As a database, a blockchain stores information electronically in digital format.

## Key Characteristics

- **Decentralized**: No central authority controls the network
- **Transparent**: All transactions are visible to participants
- **Immutable**: Once recorded, data cannot be changed
- **Secure**: Protected by cryptographic principles

## Technical Components

\`\`\`typescript
interface Block {
  index: number;
  timestamp: number;
  data: any[];
  previousHash: string;
  hash: string;
  nonce: number;
}
\`\`\`

### How Blocks Connect

1. Each block contains:
   - Transaction data
   - Timestamp
   - Hash of previous block
   - Own hash

2. Hash Calculation
\`\`\`typescript
calculateHash(block: Block): string {
  return sha256(
    block.index +
    block.timestamp +
    JSON.stringify(block.data) +
    block.previousHash +
    block.nonce
  );
}
\`\`\`

Learn more about blockchain architecture in the next section.
        `,
        resources: [
          {
            title: "Blockchain Whitepaper",
            url: "https://example.com/blockchain-whitepaper"
          },
          {
            title: "Technical Documentation",
            url: "https://example.com/docs"
          },
          {
            title: "Developer Guide",
            url: "https://example.com/guide"
          }
        ]
      }
    ]
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
              <div className="prose max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentLesson.content}
                </ReactMarkdown>
              </div>
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
                  {currentLesson.resources.map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.url}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
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
