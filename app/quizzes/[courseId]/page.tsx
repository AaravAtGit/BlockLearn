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
          question: "What is the primary purpose of blockchain technology?",
          options: [
            { id: "a", text: "To create cryptocurrencies" },
            { id: "b", text: "To provide a secure, decentralized ledger" },
            { id: "c", text: "To replace traditional banking systems" },
            { id: "d", text: "To speed up database operations" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "Which of the following is NOT a characteristic of blockchain?",
          options: [
            { id: "a", text: "Decentralization" },
            { id: "b", text: "Immutability" },
            { id: "c", text: "Centralized control" },
            { id: "d", text: "Transparency" },
          ],
          correctAnswer: "c",
        },
        {
          id: 3,
          question: "What is a block in a blockchain?",
          options: [
            { id: "a", text: "A single transaction" },
            { id: "b", text: "A collection of transactions grouped together" },
            { id: "c", text: "A computer in the network" },
            { id: "d", text: "A security feature" },
          ],
          correctAnswer: "b",
        },
        {
          id: 4,
          question: "What cryptographic technique is commonly used in blockchain to secure transactions?",
          options: [
            { id: "a", text: "Symmetric encryption" },
            { id: "b", text: "Hashing" },
            { id: "c", text: "Steganography" },
            { id: "d", text: "Quantum cryptography" },
          ],
          correctAnswer: "b",
        },
        {
          id: 5,
          question: "What is the consensus mechanism used by Bitcoin?",
          options: [
            { id: "a", text: "Proof of Stake" },
            { id: "b", text: "Proof of Work" },
            { id: "c", text: "Proof of Authority" },
            { id: "d", text: "Delegated Proof of Stake" },
          ],
          correctAnswer: "b",
        },
      ],
    },
    bitcoin: {
      title: "Bitcoin Knowledge Quiz",
      description: "Test your understanding of Bitcoin",
      questions: [
        {
          id: 1,
          question: "Who created Bitcoin?",
          options: [
            { id: "a", text: "Vitalik Buterin" },
            { id: "b", text: "Satoshi Nakamoto" },
            { id: "c", text: "Hal Finney" },
            { id: "d", text: "Nick Szabo" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "What is the maximum supply of Bitcoin?",
          options: [
            { id: "a", text: "1 million" },
            { id: "b", text: "21 million" },
            { id: "c", text: "100 million" },
            { id: "d", text: "Unlimited" },
          ],
          correctAnswer: "b",
        },
        {
          id: 3,
          question: "Approximately how often does a new Bitcoin block get mined?",
          options: [
            { id: "a", text: "Every minute" },
            { id: "b", text: "Every 10 minutes" },
            { id: "c", text: "Every hour" },
            { id: "d", text: "Every day" },
          ],
          correctAnswer: "b",
        },
        {
          id: 4,
          question: "What happens to the Bitcoin block reward approximately every four years?",
          options: [
            { id: "a", text: "It doubles" },
            { id: "b", text: "It halves" },
            { id: "c", text: "It remains the same" },
            { id: "d", text: "It increases by 10%" },
          ],
          correctAnswer: "b",
        },
        {
          id: 5,
          question: "Which of these is NOT a property that makes Bitcoin similar to gold?",
          options: [
            { id: "a", text: "Scarcity" },
            { id: "b", text: "Durability" },
            { id: "c", text: "Centralized issuance" },
            { id: "d", text: "Fungibility" },
          ],
          correctAnswer: "c",
        },
      ],
    },
    ethereum: {
      title: "Ethereum & Smart Contracts Quiz",
      description: "Test your knowledge of Ethereum and smart contracts",
      questions: [
        {
          id: 1,
          question: "Who proposed Ethereum?",
          options: [
            { id: "a", text: "Satoshi Nakamoto" },
            { id: "b", text: "Vitalik Buterin" },
            { id: "c", text: "Charles Hoskinson" },
            { id: "d", text: "Gavin Wood" },
          ],
          correctAnswer: "b",
        },
        {
          id: 2,
          question: "What is the native cryptocurrency of Ethereum?",
          options: [
            { id: "a", text: "Bitcoin" },
            { id: "b", text: "Ether (ETH)" },
            { id: "c", text: "ERC-20" },
            { id: "d", text: "Gas" },
          ],
          correctAnswer: "b",
        },
        {
          id: 3,
          question: "What is the primary programming language used for Ethereum smart contracts?",
          options: [
            { id: "a", text: "JavaScript" },
            { id: "b", text: "Python" },
            { id: "c", text: "Solidity" },
            { id: "d", text: "C++" },
          ],
          correctAnswer: "c",
        },
        {
          id: 4,
          question: "What is 'gas' in Ethereum?",
          options: [
            { id: "a", text: "A type of cryptocurrency" },
            { id: "b", text: "A measure of computational effort" },
            { id: "c", text: "A smart contract standard" },
            { id: "d", text: "A type of blockchain" },
          ],
          correctAnswer: "b",
        },
        {
          id: 5,
          question: "What major upgrade did Ethereum complete in 2022?",
          options: [
            { id: "a", text: "The Merge (transition to Proof of Stake)" },
            { id: "b", text: "The Surge" },
            { id: "c", text: "The Verge" },
            { id: "d", text: "The Purge" },
          ],
          correctAnswer: "a",
        },
      ],
    },
  }

  return quizzes[courseId] || quizzes["blockchain-fundamentals"]
}
