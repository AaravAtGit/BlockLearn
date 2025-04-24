"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { useWalletContext } from "@/context/wallet-context"

export default function QuizPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const { isConnected } = useWalletContext()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [hasPassedQuiz, setHasPassedQuiz] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

  // Get quiz data based on course ID
  const quiz = getQuizData(params.courseId)

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = value
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      window.scrollTo(0, 0)
    } else {
      // Calculate results
      const correctAnswers = selectedAnswers.filter(
        (answer, index) => answer === quiz.questions[index].correctAnswer,
      ).length

      // Calculate score percentage
      const scorePercentage = (correctAnswers / quiz.questions.length) * 100
      setHasPassedQuiz(scorePercentage >= 70)
      setShowResults(true)
    }
  }

  const handleClaimNFT = async () => {
    setIsClaiming(true)
    try {
      // Here you would integrate with your NFT minting contract
      // For now we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("NFT claimed successfully!")
      router.push("/")
    } catch (error) {
      console.error("Failed to claim NFT:", error)
      alert("Failed to claim NFT. Please try again.")
    } finally {
      setIsClaiming(false)
    }
  }

  const handleFinish = () => {
    router.push("/rewards")
  }

  const currentQuestionData = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to connect your wallet to access quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Connect your Web3 wallet on Monad chain to take quizzes and earn tokens for your knowledge.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/connect" className="w-full">
              <Button className="w-full">Connect Wallet</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/courses/${params.courseId}`}>
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Button>
        </Link>
        {!showResults && (
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        )}
      </div>

      {!showResults ? (
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
            <Progress value={progress} className="mt-2 h-2" />
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-medium">{currentQuestionData.question}</h3>
              <RadioGroup value={selectedAnswers[currentQuestion] || ""} onValueChange={handleAnswerSelect}>
                {currentQuestionData.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion]} className="w-full">
              {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Submit Quiz"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>You've completed the {quiz.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
                {hasPassedQuiz ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-amber-500" />
                )}
              </div>
              <h3 className="mb-2 text-2xl font-bold">
                {selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length} out
                of {quiz.questions.length} correct
              </h3>
              <p className="text-gray-500">
                {hasPassedQuiz
                  ? "Congratulations! You've passed the quiz and earned an NFT badge!"
                  : "You need 70% or higher to pass. Review the material and try again."}
              </p>
            </div>

            {hasPassedQuiz && (
              <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-4 text-center">
                  <h4 className="text-xl font-medium">Quiz Badge NFT</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Claim your NFT badge to showcase your knowledge achievement
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {hasPassedQuiz ? (
              <Button onClick={handleClaimNFT} className="w-full" disabled={isClaiming}>
                {isClaiming ? "Claiming..." : "Claim NFT Badge"}
              </Button>
            ) : (
              <Button onClick={() => router.push(`/courses/${params.courseId}`)} className="w-full">
                Review Course Material
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function getQuizData(courseId: string) {
  // This would come from a database in a real application
  const quizzes = {
    "blockchain-fundamentals": {
      title: "Blockchain Fundamentals Quiz",
      description: "Test your knowledge of blockchain basics",
      questions: [
        {
          id: 1,
          question: "What are the three main characteristics of blockchain technology?",
          options: [
            { id: "a", text: "Centralization, Speed, Cost" },
            { id: "b", text: "Decentralization, Transparency, Immutability" },
            { id: "c", text: "Privacy, Scalability, Efficiency" },
            { id: "d", text: "Security, Centralization, Speed" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "What is the purpose of a consensus mechanism in blockchain?",
          options: [
            { id: "a", text: "To encrypt data" },
            { id: "b", text: "To agree on the state of the network" },
            { id: "c", text: "To store transactions" },
            { id: "d", text: "To create new cryptocurrencies" },
          ],
          correctAnswer: "b",
        },
        {
          id: 3,
          question: "Which property of cryptographic hash functions ensures that any change in input produces a completely different hash?",
          options: [
            { id: "a", text: "Pre-image resistance" },
            { id: "b", text: "Collision resistance" },
            { id: "c", text: "Avalanche effect" },
            { id: "d", text: "Deterministic output" },
          ],
          correctAnswer: "c",
        },
        {
          id: 4,
          question: "What is the relationship between public and private keys in blockchain?",
          options: [
            { id: "a", text: "They are identical" },
            { id: "b", text: "Private key is derived from public key" },
            { id: "c", text: "Public key is derived from private key" },
            { id: "d", text: "They are randomly generated" },
          ],
          correctAnswer: "c",
        },
        {
          id: 5,
          question: "What is the primary purpose of a Merkle tree in blockchain?",
          options: [
            { id: "a", text: "To store private keys" },
            { id: "b", text: "To efficiently verify data integrity" },
            { id: "c", text: "To generate new blocks" },
            { id: "d", text: "To create wallet addresses" },
          ],
          correctAnswer: "b",
        },
      ],
    },
    bitcoin: {
      title: "Bitcoin Protocol Quiz",
      description: "Test your understanding of Bitcoin's protocol and network",
      questions: [
        {
          id: 1,
          question: "What is the role of a full node in the Bitcoin network?",
          options: [
            { id: "a", text: "Only mining new blocks" },
            { id: "b", text: "Complete blockchain validation and transaction verification" },
            { id: "c", text: "Only processing payments" },
            { id: "d", text: "Managing user wallets" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "How often does Bitcoin's mining difficulty adjust?",
          options: [
            { id: "a", text: "Every block" },
            { id: "b", text: "Every 2,016 blocks (~2 weeks)" },
            { id: "c", text: "Every month" },
            { id: "d", text: "Every year" },
          ],
          correctAnswer: "b",
        },
        {
          id: 3,
          question: "What is the purpose of the nonce in Bitcoin mining?",
          options: [
            { id: "a", text: "To sign transactions" },
            { id: "b", text: "To create new addresses" },
            { id: "c", text: "To find a valid block hash" },
            { id: "d", text: "To verify transactions" },
          ],
          correctAnswer: "c",
        },
        {
          id: 4,
          question: "What determines transaction priority in Bitcoin?",
          options: [
            { id: "a", text: "Transaction size only" },
            { id: "b", text: "Fee rate (satoshis per byte)" },
            { id: "c", text: "Time submitted" },
            { id: "d", text: "Sender's balance" },
          ],
          correctAnswer: "b",
        },
        {
          id: 5,
          question: "How is Bitcoin's total supply controlled?",
          options: [
            { id: "a", text: "Manual adjustment by developers" },
            { id: "b", text: "Halving events every 210,000 blocks" },
            { id: "c", text: "Annual inflation rate" },
            { id: "d", text: "Market demand" },
          ],
          correctAnswer: "b",
        },
      ],
    },
    "ethereum-development": {
      title: "Ethereum Development Quiz",
      description: "Test your knowledge of Ethereum and smart contract development",
      questions: [
        {
          id: 1,
          question: "What is the purpose of the 'pragma' directive in Solidity?",
          options: [
            { id: "a", text: "To import libraries" },
            { id: "b", text: "To specify compiler version" },
            { id: "c", text: "To declare variables" },
            { id: "d", text: "To define functions" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "Which storage location is most gas-efficient for function parameters?",
          options: [
            { id: "a", text: "Storage" },
            { id: "b", text: "Memory" },
            { id: "c", text: "Calldata" },
            { id: "d", text: "Stack" },
          ],
          correctAnswer: "c",
        },
        {
          id: 3,
          question: "What is the purpose of the 'nonReentrant' modifier?",
          options: [
            { id: "a", text: "To save gas" },
            { id: "b", text: "To prevent recursive calls" },
            { id: "c", text: "To check ownership" },
            { id: "d", text: "To handle errors" },
          ],
          correctAnswer: "b",
        },
        {
          id: 4,
          question: "Which Web3 library provides the most comprehensive Ethereum integration?",
          options: [
            { id: "a", text: "web3.js" },
            { id: "b", text: "ethers.js" },
            { id: "c", text: "web3modal" },
            { id: "d", text: "metamask" },
          ],
          correctAnswer: "b",
        },
        {
          id: 5,
          question: "What is the purpose of the 'payable' modifier in Solidity?",
          options: [
            { id: "a", text: "To make a function free to call" },
            { id: "b", text: "To allow a function to receive Ether" },
            { id: "c", text: "To restrict function access" },
            { id: "d", text: "To optimize gas usage" },
          ],
          correctAnswer: "b",
        },
      ],
    },
    "defi-fundamentals": {
      title: "DeFi Fundamentals Quiz",
      description: "Test your understanding of Decentralized Finance",
      questions: [
        {
          id: 1,
          question: "What is the main innovation of Automated Market Makers (AMMs)?",
          options: [
            { id: "a", text: "Centralized order matching" },
            { id: "b", text: "Mathematical price determination without orderbooks" },
            { id: "c", text: "Manual price setting" },
            { id: "d", text: "Instant fiat conversion" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "What is impermanent loss in DeFi?",
          options: [
            { id: "a", text: "Lost private keys" },
            { id: "b", text: "Value change compared to holding assets" },
            { id: "c", text: "Failed transactions" },
            { id: "d", text: "Network fees" },
          ],
          correctAnswer: "b",
        },
        {
          id: 3,
          question: "What is the purpose of flash loans?",
          options: [
            { id: "a", text: "Long-term borrowing" },
            { id: "b", text: "Instant uncollateralized loans within one block" },
            { id: "c", text: "Permanent lending" },
            { id: "d", text: "Savings accounts" },
          ],
          correctAnswer: "b",
        },
        {
          id: 4,
          question: "How do lending protocols determine interest rates?",
          options: [
            { id: "a", text: "Manual adjustment" },
            { id: "b", text: "Based on utilization rate" },
            { id: "c", text: "Fixed rates only" },
            { id: "d", text: "Market voting" },
          ],
          correctAnswer: "b",
        },
        {
          id: 5,
          question: "What is composability in DeFi?",
          options: [
            { id: "a", text: "Writing smart contracts" },
            { id: "b", text: "The ability to combine different protocols" },
            { id: "c", text: "Creating tokens" },
            { id: "d", text: "Managing wallets" },
          ],
          correctAnswer: "b",
        },
      ],
    },
  }

  return quizzes[courseId] || quizzes["blockchain-fundamentals"]
}
