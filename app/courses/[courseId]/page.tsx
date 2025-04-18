"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, BookOpen, Video, FileText, CheckCircle, Lock } from "lucide-react"
import { useWalletContext } from "@/context/wallet-context"

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const { isConnected } = useWalletContext()
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)

  // This would come from a database in a real application
  const courseData = getCourseData(params.courseId)

  const handleNextLesson = () => {
    if (currentLesson < courseData.modules[currentModule].lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      window.scrollTo(0, 0)
    } else if (currentModule < courseData.modules.length - 1) {
      setCurrentModule(currentModule + 1)
      setCurrentLesson(0)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      window.scrollTo(0, 0)
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1)
      setCurrentLesson(courseData.modules[currentModule - 1].lessons.length - 1)
      window.scrollTo(0, 0)
    }
  }

  const currentModuleData = courseData.modules[currentModule]
  const currentLessonData = currentModuleData.lessons[currentLesson]

  // Calculate progress
  const totalLessons = courseData.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = currentModule * currentModuleData.lessons.length + currentLesson
  const progress = (completedLessons / totalLessons) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/courses">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <div className="text-sm text-gray-500">
          {completedLessons} of {totalLessons} lessons completed
        </div>
      </div>

      <div className="mb-4">
        <h1 className="mb-2 text-3xl font-bold">{courseData.title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{courseData.description}</p>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-xl font-bold">Course Content</h2>
            <div className="space-y-2">
              {courseData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="space-y-1">
                  <h3 className="font-medium">{module.title}</h3>
                  <ul className="space-y-1 pl-4">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isActive = moduleIndex === currentModule && lessonIndex === currentLesson
                      const isCompleted =
                        moduleIndex < currentModule || (moduleIndex === currentModule && lessonIndex < currentLesson)
                      const isLocked = !isConnected && moduleIndex > 0

                      return (
                        <li key={lessonIndex}>
                          <button
                            onClick={() => {
                              if (!isLocked) {
                                setCurrentModule(moduleIndex)
                                setCurrentLesson(lessonIndex)
                                window.scrollTo(0, 0)
                              }
                            }}
                            disabled={isLocked}
                            className={`flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : isCompleted
                                  ? "text-green-600 dark:text-green-400"
                                  : isLocked
                                    ? "cursor-not-allowed text-gray-400"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-3 w-3 flex-shrink-0" />
                            ) : isLocked ? (
                              <Lock className="h-3 w-3 flex-shrink-0" />
                            ) : (
                              <div className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {!isConnected && (
              <Card className="bg-amber-50 dark:bg-amber-950">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Connect Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Connect your wallet to unlock all course content and track your progress
                  </p>
                  <Link href="/connect" className="mt-2 block">
                    <Button size="sm" className="w-full">
                      Connect Wallet
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{currentLessonData.title}</CardTitle>
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
                    dangerouslySetInnerHTML={{ __html: currentLessonData.content }}
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
                      {currentLessonData.resources.map((resource, index) => (
                        <li key={index}>
                          <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                            {resource}
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
            <Button
              variant="outline"
              onClick={handlePreviousLesson}
              disabled={currentModule === 0 && currentLesson === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </Button>

            {isLastLesson(courseData, currentModule, currentLesson) ? (
              <Link href={`/quizzes/${params.courseId}`}>
                <Button>
                  Take Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button onClick={handleNextLesson}>
                Next Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function isLastLesson(courseData: any, currentModule: number, currentLesson: number) {
  return (
    currentModule === courseData.modules.length - 1 &&
    currentLesson === courseData.modules[currentModule].lessons.length - 1
  )
}

function getCourseData(courseId: string) {
  // This would come from a database in a real application
  const courses = {
    "blockchain-fundamentals": {
      title: "Blockchain Fundamentals",
      description: "Learn the core concepts and technology behind blockchain",
      modules: [
        {
          title: "Introduction to Blockchain",
          lessons: [
            {
              title: "What is Blockchain?",
              content: `
                <h2>Introduction to Blockchain Technology</h2>
                <p>A blockchain is a distributed database or ledger shared among computer network nodes. As a database, a blockchain stores information electronically in digital format.</p>
                
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
              resources: [
                "Blockchain Technology Whitepaper",
                "History of Blockchain Development",
                "Blockchain Use Cases Beyond Cryptocurrency",
              ],
            },
            {
              title: "Blockchain Architecture",
              content: `
                <h2>Blockchain Architecture</h2>
                <p>At its core, a blockchain is a chain of blocks that contain data. The architecture of blockchain consists of several key components working together to create a secure, decentralized system.</p>
                
                <h3>Blocks</h3>
                <p>Each block in the blockchain contains:</p>
                <ul>
                  <li><strong>Data:</strong> The information stored in the block (e.g., transaction details)</li>
                  <li><strong>Hash:</strong> A unique identifier (like a fingerprint) for the block</li>
                  <li><strong>Previous Hash:</strong> The hash of the previous block, creating the chain</li>
                  <li><strong>Timestamp:</strong> When the block was created</li>
                  <li><strong>Nonce:</strong> A number used in mining to find a valid hash</li>
                </ul>
                
                <h3>Distributed Ledger</h3>
                <p>The blockchain is stored across a peer-to-peer network, with each node maintaining a complete copy of the ledger. This distribution ensures:</p>
                <ul>
                  <li>No single point of failure</li>
                  <li>Data redundancy and availability</li>
                  <li>Consensus-based verification</li>
                </ul>
                
                <h3>Consensus Mechanisms</h3>
                <p>For a block to be added to the chain, network participants must agree on its validity through consensus mechanisms such as:</p>
                <ul>
                  <li><strong>Proof of Work (PoW):</strong> Miners solve complex mathematical puzzles</li>
                  <li><strong>Proof of Stake (PoS):</strong> Validators are selected based on the amount of cryptocurrency they hold and are willing to "stake"</li>
                  <li><strong>Delegated Proof of Stake (DPoS):</strong> Token holders vote for representatives who validate transactions</li>
                </ul>
                
                <p>This architecture creates a system that is secure, transparent, and resistant to tampering or revision.</p>
              `,
              resources: [
                "Detailed Blockchain Architecture Guide",
                "Consensus Mechanisms Compared",
                "Building Blocks of Blockchain",
              ],
            },
          ],
        },
        {
          title: "Cryptography in Blockchain",
          lessons: [
            {
              title: "Cryptographic Hash Functions",
              content: `
                <h2>Cryptographic Hash Functions in Blockchain</h2>
                <p>Cryptographic hash functions are the backbone of blockchain security. They transform input data of any size into a fixed-size output (hash) that appears random but is deterministic.</p>
                
                <h3>Properties of Cryptographic Hash Functions</h3>
                <ul>
                  <li><strong>Deterministic:</strong> The same input always produces the same output</li>
                  <li><strong>Quick Computation:</strong> Calculating the hash is fast</li>
                  <li><strong>Pre-image Resistance:</strong> It's infeasible to reverse-engineer the input from the hash</li>
                  <li><strong>Small Changes, Big Differences:</strong> A slight change in input creates a completely different hash</li>
                  <li><strong>Collision Resistance:</strong> It's extremely difficult to find two different inputs that produce the same hash</li>
                </ul>
                
                <h3>Common Hash Functions in Blockchain</h3>
                <p>Several hash functions are used in blockchain technology:</p>
                <ul>
                  <li><strong>SHA-256:</strong> Used by Bitcoin, produces a 256-bit hash</li>
                  <li><strong>Keccak-256:</strong> Used by Ethereum, a variant of SHA-3</li>
                  <li><strong>RIPEMD-160:</strong> Used in Bitcoin addresses for shorter hashes</li>
                </ul>
                
                <h3>Applications in Blockchain</h3>
                <p>Hash functions serve multiple purposes in blockchain:</p>
                <ul>
                  <li>Creating block identifiers</li>
                  <li>Linking blocks together (each block contains the previous block's hash)</li>
                  <li>Generating wallet addresses</li>
                  <li>Mining through Proof of Work (finding a hash that meets specific criteria)</li>
                  <li>Verifying data integrity</li>
                </ul>
                
                <p>The security of blockchain relies heavily on the strength of these hash functions. If a hash function were to be compromised (e.g., if collisions became easy to find), it would undermine the security of the entire blockchain.</p>
              `,
              resources: [
                "Cryptographic Hash Functions Explained",
                "SHA-256 in Detail",
                "Hash Functions in Modern Cryptography",
              ],
            },
            {
              title: "Public Key Cryptography",
              content: `
                <h2>Public Key Cryptography in Blockchain</h2>
                <p>Public key cryptography (asymmetric cryptography) is a cryptographic system that uses pairs of keys: public keys and private keys. This system is fundamental to blockchain technology, enabling secure transactions and digital signatures.</p>
                
                <h3>Key Pairs</h3>
                <p>In public key cryptography:</p>
                <ul>
                  <li><strong>Private Key:</strong> A secret key known only to the owner</li>
                  <li><strong>Public Key:</strong> A key that can be shared with anyone</li>
                </ul>
                
                <p>These keys are mathematically related but it's computationally infeasible to derive the private key from the public key.</p>
                
                <h3>Digital Signatures</h3>
                <p>Digital signatures in blockchain work as follows:</p>
                <ol>
                  <li>A user creates a transaction</li>
                  <li>The transaction data is hashed</li>
                  <li>The hash is encrypted with the user's private key to create a signature</li>
                  <li>The transaction, along with the signature and public key, is broadcast to the network</li>
                  <li>Other nodes verify the signature by decrypting it with the sender's public key</li>
                  <li>If the decrypted signature matches the transaction hash, the signature is valid</li>
                </ol>
                
                <h3>Elliptic Curve Cryptography (ECC)</h3>
                <p>Most blockchain platforms use Elliptic Curve Cryptography for their public key systems:</p>
                <ul>
                  <li>Bitcoin uses secp256k1 curve</li>
                  <li>Ethereum also uses secp256k1</li>
                  <li>Some newer blockchains use Ed25519 for faster verification</li>
                </ul>
                
                <h3>Wallet Addresses</h3>
                <p>In blockchain, wallet addresses are typically derived from public keys:</p>
                <ol>
                  <li>Generate a private key (random number)</li>
                  <li>Derive the public key using elliptic curve multiplication</li>
                  <li>Hash the public key</li>
                  <li>Apply additional transformations (like Base58Check encoding in Bitcoin)</li>
                </ol>
                
                <p>This system ensures that only the owner of a private key can create valid signatures for transactions from their address, providing security and non-repudiation in blockchain networks.</p>
              `,
              resources: [
                "Elliptic Curve Cryptography Explained",
                "Digital Signatures in Blockchain",
                "Private and Public Keys: A Deep Dive",
              ],
            },
          ],
        },
      ],
    },
    bitcoin: {
      title: "Bitcoin: Digital Gold",
      description: "Understand Bitcoin's technology, economics, and impact",
      modules: [
        {
          title: "Bitcoin Basics",
          lessons: [
            {
              title: "The Origin of Bitcoin",
              content: `
                <h2>The Origin of Bitcoin</h2>
                <p>Bitcoin emerged in the aftermath of the 2008 global financial crisis, a time of significant distrust in traditional financial institutions. Its creation is attributed to an individual or group using the pseudonym Satoshi Nakamoto.</p>
                
                <h3>The Whitepaper</h3>
                <p>On October 31, 2008, Satoshi Nakamoto published the Bitcoin whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System." This nine-page document outlined a revolutionary digital currency that would:</p>
                <ul>
                  <li>Enable direct online payments without going through financial institutions</li>
                  <li>Solve the double-spending problem without requiring a trusted third party</li>
                  <li>Use a peer-to-peer network with proof-of-work to record a public history of transactions</li>
                  <li>Create a system where the longest chain serves as proof of the sequence of events</li>
                </ul>
                
                <h3>Genesis Block</h3>
                <p>On January 3, 2009, Satoshi mined the first block of the Bitcoin blockchain, known as the Genesis Block or Block 0. Embedded in this block was the text:</p>
                <blockquote>"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"</blockquote>
                <p>This was a headline from The Times newspaper, serving both as a timestamp and a commentary on the failing traditional banking system that Bitcoin was designed to challenge.</p>
                
                <h3>Early Development</h3>
                <p>The first Bitcoin transaction occurred on January 12, 2009, when Satoshi sent 10 BTC to Hal Finney, a cryptographer and early Bitcoin supporter. The first real-world transaction is often cited as the purchase of two pizzas for 10,000 BTC on May 22, 2010 (now celebrated as "Bitcoin Pizza Day").</p>
                
                <h3>Satoshi's Disappearance</h3>
                <p>Satoshi was actively involved in Bitcoin's development until mid-2010. In April 2011, Satoshi sent a final email stating they had "moved on to other things" and transferred control of the Bitcoin source code repository to Gavin Andresen. The true identity of Satoshi Nakamoto remains unknown to this day.</p>
                
                <p>Bitcoin's origin story is significant not just for the technology it introduced, but for the philosophical and economic principles it embodied: decentralization, limited supply, and freedom from central authority control.</p>
              `,
              resources: [
                "Bitcoin Whitepaper by Satoshi Nakamoto",
                "The Genesis Block Analysis",
                "Early Bitcoin History Timeline",
              ],
            },
            {
              title: "How Bitcoin Works",
              content: `
                <h2>How Bitcoin Works</h2>
                <p>Bitcoin operates as a decentralized digital currency without a central authority. Understanding its core mechanisms helps grasp how it maintains security and integrity.</p>
                
                <h3>Transactions</h3>
                <p>A Bitcoin transaction is a transfer of value between Bitcoin wallets. Each transaction:</p>
                <ul>
                  <li>Contains one or more inputs (sources of Bitcoin)</li>
                  <li>Contains one or more outputs (destinations)</li>
                  <li>Is signed with the sender's private key</li>
                  <li>Is broadcast to the Bitcoin network</li>
                </ul>
                
                <h3>The Blockchain</h3>
                <p>All confirmed transactions are included in the blockchain, a public ledger. New blocks are added approximately every 10 minutes, containing:</p>
                <ul>
                  <li>A set of transactions</li>
                  <li>A reference to the previous block (creating the chain)</li>
                  <li>A solution to a cryptographic puzzle (proof of work)</li>
                </ul>
                
                <h3>Mining</h3>
                <p>Mining is the process by which new bitcoins are created and transactions are added to the blockchain:</p>
                <ol>
                  <li>Miners collect pending transactions into a block</li>
                  <li>They compete to solve a difficult mathematical problem (finding a hash with specific properties)</li>
                  <li>The first miner to solve the problem broadcasts their block to the network</li>
                  <li>Other nodes verify the solution and add the block to their copy of the blockchain</li>
                  <li>The winning miner receives newly created bitcoins (the block reward) plus transaction fees</li>
                </ol>
                
                <h3>Difficulty Adjustment</h3>
                <p>To maintain the 10-minute block time, Bitcoin automatically adjusts the mining difficulty every 2,016 blocks (approximately two weeks). If blocks were mined too quickly in the previous period, difficulty increases; if too slowly, difficulty decreases.</p>
                
                <h3>Wallets</h3>
                <p>Bitcoin wallets don't actually store bitcoins; they store the private keys that give you the right to spend bitcoins associated with corresponding addresses. Wallets can be:</p>
                <ul>
                  <li><strong>Hot wallets:</strong> Connected to the internet (mobile, desktop, web)</li>
                  <li><strong>Cold wallets:</strong> Offline storage (hardware wallets, paper wallets)</li>
                </ul>
                
                <h3>Supply Limit</h3>
                <p>Bitcoin has a fixed supply cap of 21 million coins. The block reward halves approximately every four years (every 210,000 blocks) in an event called "the halving." This controlled supply schedule makes Bitcoin inherently deflationary.</p>
              `,
              resources: [
                "Bitcoin Transaction Anatomy",
                "Mining Process Explained",
                "Bitcoin Wallet Security Best Practices",
              ],
            },
          ],
        },
        {
          title: "Bitcoin Economics",
          lessons: [
            {
              title: "Bitcoin as Digital Gold",
              content: `
                <h2>Bitcoin as Digital Gold</h2>
                <p>Bitcoin is often referred to as "digital gold" due to several properties it shares with the precious metal. This comparison helps explain Bitcoin's value proposition and role in the financial ecosystem.</p>
                
                <h3>Scarcity</h3>
                <p>Like gold, Bitcoin is scarce:</p>
                <ul>
                  <li>Gold: Limited by physical supply in the Earth's crust</li>
                  <li>Bitcoin: Capped at 21 million coins by its protocol</li>
                </ul>
                <p>This built-in scarcity creates a supply constraint that contrasts with fiat currencies, which can be printed in unlimited quantities by central banks.</p>
                
                <h3>Durability</h3>
                <p>Both assets are highly durable:</p>
                <ul>
                  <li>Gold: Doesn't corrode or degrade over time</li>
                  <li>Bitcoin: Digital information doesn't degrade; the blockchain is designed to be permanent</li>
                </ul>
                
                <h3>Divisibility</h3>
                <p>Bitcoin exceeds gold in divisibility:</p>
                <ul>
                  <li>Gold: Can be divided into small pieces, but impractical below certain sizes</li>
                  <li>Bitcoin: Divisible to 8 decimal places (0.00000001 BTC, or 1 satoshi)</li>
                </ul>
                
                <h3>Portability</h3>
                <p>Bitcoin offers superior portability:</p>
                <ul>
                  <li>Gold: Heavy, requires physical transportation, storage, and security</li>
                  <li>Bitcoin: Can transfer any amount globally in minutes with just a private key</li>
                </ul>
                
                <h3>Store of Value</h3>
                <p>Both function as stores of value:</p>
                <ul>
                  <li>Gold: Historical store of value for thousands of years</li>
                  <li>Bitcoin: Emerging store of value, protected from inflation by its fixed supply</li>
                </ul>
                
                <h3>Differences</h3>
                <p>Key differences include:</p>
                <ul>
                  <li><strong>History:</strong> Gold has thousands of years of history; Bitcoin was created in 2009</li>
                  <li><strong>Physicality:</strong> Gold is tangible; Bitcoin is digital</li>
                  <li><strong>Utility:</strong> Gold has industrial and decorative uses; Bitcoin's utility is primarily as a payment system and financial network</li>
                  <li><strong>Verification:</strong> Gold requires assaying; Bitcoin can be verified mathematically</li>
                </ul>
                
                <h3>Investment Implications</h3>
                <p>As "digital gold," Bitcoin is increasingly viewed as:</p>
                <ul>
                  <li>A hedge against inflation and currency debasement</li>
                  <li>A non-correlated asset for portfolio diversification</li>
                  <li>A way to store wealth outside the traditional financial system</li>
                </ul>
                
                <p>While gold has stood the test of time, Bitcoin's properties as a digitally native store of value give it unique advantages in our increasingly digital world.</p>
              `,
              resources: [
                "Bitcoin vs. Gold: Comparative Analysis",
                "The Evolution of Money: From Gold to Bitcoin",
                "Bitcoin as an Inflation Hedge: Evidence and Theory",
              ],
            },
          ],
        },
      ],
    },
    ethereum: {
      title: "Ethereum & Smart Contracts",
      description: "Master Ethereum, smart contracts, and decentralized applications",
      modules: [
        {
          title: "Ethereum Fundamentals",
          lessons: [
            {
              title: "What is Ethereum?",
              content: `
                <h2>What is Ethereum?</h2>
                <p>Ethereum is a decentralized, open-source blockchain platform that enables the creation and execution of smart contracts and decentralized applications (dApps). Unlike Bitcoin, which was designed primarily as a digital currency, Ethereum was built as a programmable blockchain that can support a wide range of applications.</p>
                
                <h3>Origin and History</h3>
                <p>Ethereum was proposed in late 2013 by Vitalik Buterin, a programmer and co-founder of Bitcoin Magazine. Buterin argued that blockchain technology could be used for more than just currency. The Ethereum network officially launched on July 30, 2015, after a successful crowdfunding campaign in 2014.</p>
                
                <h3>The Ethereum Virtual Machine (EVM)</h3>
                <p>At the heart of Ethereum is the Ethereum Virtual Machine (EVM), a Turing-complete software that runs on the Ethereum network. The EVM enables developers to build and deploy smart contracts and decentralized applications. Key features of the EVM include:</p>
                <ul>
                  <li>Ability to execute code of arbitrary algorithmic complexity</li>
                  <li>Deterministic execution (same input always produces same output)</li>
                  <li>Isolated execution environment (smart contracts can't access the network, filesystem, or other processes)</li>
                  <li>Gas system to measure and limit computational resources</li>
                </ul>
                
                <h3>Ether (ETH)</h3>
                <p>Ether (ETH) is the native cryptocurrency of the Ethereum platform. It serves two main purposes:</p>
                <ul>
                  <li><strong>Currency:</strong> ETH can be transferred between accounts and used to compensate participant nodes for computations performed</li>
                  <li><strong>Gas:</strong> ETH is used to pay for transaction fees and computational services on the network</li>
                </ul>
                
                <h3>Key Innovations</h3>
                <p>Ethereum introduced several key innovations to blockchain technology:</p>
                <ul>
                  <li><strong>Smart Contracts:</strong> Self-executing contracts with the terms directly written into code</li>
                  <li><strong>Decentralized Applications (dApps):</strong> Applications that run on a peer-to-peer network rather than a single computer</li>
                  <li><strong>Tokens:</strong> Custom assets created on the Ethereum blockchain (ERC-20, ERC-721, etc.)</li>
                  <li><strong>Decentralized Autonomous Organizations (DAOs):</strong> Organizations represented by rules encoded as a computer program</li>
                </ul>
                
                <h3>Ethereum 2.0</h3>
                <p>Ethereum has undergone a major upgrade known as Ethereum 2.0 or "The Merge." This upgrade transitioned the network from a Proof of Work (PoW) consensus mechanism to Proof of Stake (PoS), significantly reducing energy consumption and laying the groundwork for future scalability improvements. Key aspects of Ethereum 2.0 include:</p>
                <ul>
                  <li><strong>Proof of Stake:</strong> Validators stake ETH to secure the network instead of using computational power</li>
                  <li><strong>Sharding:</strong> Splitting the network into multiple portions to increase throughput</li>
                  <li><strong>Reduced Energy Consumption:</strong> Approximately 99.95% reduction compared to PoW</li>
                  <li><strong>Improved Scalability:</strong> Foundation for higher transaction throughput</li>
                </ul>
                
                <h3>Use Cases</h3>
                <p>Ethereum has enabled a wide range of applications:</p>
                <ul>
                  <li>Decentralized Finance (DeFi) protocols</li>
                  <li>Non-Fungible Tokens (NFTs)</li>
                  <li>Decentralized Autonomous Organizations (DAOs)</li>
                  <li>Supply chain tracking</li>
                  <li>Digital identity solutions</li>
                  <li>Gaming and metaverse applications</li>
                </ul>
                
                <p>As a programmable blockchain, Ethereum continues to evolve and serve as the foundation for much of the innovation in the blockchain space.</p>
              `,
              resources: [
                "Ethereum Whitepaper",
                "The History of Ethereum",
                "Understanding the Ethereum Virtual Machine",
              ],
            },
            {
              title: "Introduction to Smart Contracts",
              content: `
                <h2>Introduction to Smart Contracts</h2>
                <p>Smart contracts are self-executing contracts with the terms directly written into code. They run on blockchain networks like Ethereum, automatically executing when predetermined conditions are met, without the need for intermediaries.</p>
                
                <h3>What Makes a Contract "Smart"?</h3>
                <p>Smart contracts combine several key features:</p>
                <ul>
                  <li><strong>Automation:</strong> Execute automatically when conditions are met</li>
                  <li><strong>Immutability:</strong> Once deployed, the code cannot be changed</li>
                  <li><strong>Transparency:</strong> All parties can verify the contract code</li>
                  <li><strong>Trustlessness:</strong> No need to trust a central authority or counterparty</li>
                  <li><strong>Determinism:</strong> Same inputs always produce the same outputs</li>
                </ul>
                
                <h3>Smart Contracts on Ethereum</h3>
                <p>On Ethereum, smart contracts are typically written in Solidity, a Turing-complete programming language designed specifically for Ethereum. The development process includes:</p>
                <ol>
                  <li>Writing the contract code in Solidity</li>
                  <li>Compiling the code to EVM bytecode</li>
                  <li>Deploying the bytecode to the Ethereum blockchain (requiring a transaction fee in ETH)</li>
                  <li>Interacting with the contract by sending transactions to its address</li>
                </ol>
                
                <h3>Basic Structure of a Solidity Smart Contract</h3>
                <pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // State variable to store a number
    uint public storedData;
    
    // Function to store a number
    function set(uint x) public {
        storedData = x;
    }
    
    // Function to retrieve the stored number
    function get() public view returns (uint) {
        return storedData;
    }
}</code></pre>
                
                <h3>Use Cases for Smart Contracts</h3>
                <p>Smart contracts enable a wide range of applications:</p>
                <ul>
                  <li><strong>Financial Services:</strong> Loans, insurance, derivatives, escrow</li>
                  <li><strong>Supply Chain:</strong> Tracking goods, verifying authenticity</li>
                  <li><strong>Digital Identity:</strong> Self-sovereign identity management</li>
                  <li><strong>Governance:</strong> Voting systems, DAOs</li>
                  <li><strong>Gaming:</strong> In-game assets, provably fair mechanics</li>
                  <li><strong>Real Estate:</strong> Property transfers, rental agreements</li>
                </ul>
                
                <h3>Limitations and Challenges</h3>
                <p>Despite their potential, smart contracts face several challenges:</p>
                <ul>
                  <li><strong>Security Vulnerabilities:</strong> Code bugs can lead to exploits and fund losses</li>
                  <li><strong>Scalability:</strong> Limited by blockchain throughput</li>
                  <li><strong>Oracle Problem:</strong> Difficulty in securely obtaining external data</li>
                  <li><strong>Legal Status:</strong> Uncertain regulatory framework in many jurisdictions</li>
                  <li><strong>Immutability:</strong> Difficult to fix bugs once deployed</li>
                </ul>
                
                <p>Smart contracts represent one of the most transformative applications of blockchain technology, enabling trustless automation of complex agreements and processes.</p>
              `,
              resources: [
                "Solidity Documentation",
                "Smart Contract Security Best Practices",
                "The Business Logic of Smart Contracts",
              ],
            },
          ],
        },
      ],
    },
  }

  return courses[courseId] || courses["blockchain-fundamentals"]
}
