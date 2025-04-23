import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, BarChart3, Bitcoin, Cpu } from "lucide-react"
import { CourseCard } from "@/components/course-card"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const courses = [
    {
      id: "blockchain-fundamentals",
      title: "Blockchain Fundamentals",
      description: "**Core Concepts:**\n- Distributed Ledger Technology\n- Cryptography Basics\n- Consensus Mechanisms\n- Blockchain Architecture\n\nStart your journey into blockchain technology with fundamental concepts and hands-on examples.",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 12,
      duration: "4 hours",
      level: "Beginner",
      icon: <BookOpen className="h-8 w-8" />,
    },
    {
      id: "defi-fundamentals",
      title: "DeFi Ecosystem",
      description: "**Explore DeFi:**\n- Automated Market Makers\n- Lending Protocols\n- Yield Farming\n- Liquidity Mining\n\nUnderstand the revolutionary world of Decentralized Finance and its applications.",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 8,
      duration: "3 hours",
      level: "Intermediate",
      icon: <Bitcoin className="h-8 w-8" />,
    },
    {
      id: "smart-contracts-development",
      title: "Smart Contract Development",
      description: "**Learn Development:**\n- Solidity Programming\n- Smart Contract Security\n- Testing & Deployment\n- Best Practices\n\nMaster the art of writing secure and efficient smart contracts.",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 15,
      duration: "6 hours",
      level: "Advanced",
      icon: <Cpu className="h-8 w-8" />,
    },
    {
      id: "web3-dapp-development",
      title: "Web3 dApp Development",
      description: "**Build dApps:**\n- Frontend Integration\n- Web3.js & ethers.js\n- IPFS Implementation\n- State Management\n\nCreate full-stack decentralized applications with modern tools and frameworks.",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 14,
      duration: "5 hours",
      level: "Advanced",
      icon: <Cpu className="h-8 w-8" />,
    },
    {
      id: "nft-tokenomics",
      title: "NFTs & Tokenomics",
      description: "**Explore Digital Assets:**\n- NFT Standards\n- Token Economics\n- Market Dynamics\n- NFT Marketplaces\n\nUnderstand the technology behind NFTs and token economics.",
      image: "/placeholder.svg?height=200&width=400",
      lessons: 10,
      duration: "4 hours",
      level: "Intermediate",
      icon: <Award className="h-8 w-8" />,
    }
  ]

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">BlockLearn</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Master blockchain technology and earn rewards by testing your knowledge
          </p>
        </div>

        <div className="mb-16">
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
                Earn BlockLearn NFT on Monad chain for completing quizzes successfully. Use your tokens to unlock
                advanced courses or exchange them for real-world rewards.
              </p>
            </CardContent>
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
    </div>
  )
}
