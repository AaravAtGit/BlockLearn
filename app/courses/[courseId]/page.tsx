"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, BookOpen, Video, FileText, CheckCircle, Lock } from "lucide-react"
import { useWalletContext } from "@/context/wallet-context"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Lesson {
  title: string;
  content: string;
  resources: string[];
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  description: string;
  modules: Module[];
}

interface CourseData {
  [key: string]: Course;
}

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
  const totalLessons = courseData.modules.reduce((acc: number, module: Module) => acc + module.lessons.length, 0)
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
              {courseData.modules.map((module: Module, moduleIndex: number) => (
                <div key={moduleIndex} className="space-y-1">
                  <h3 className="font-medium">{module.title}</h3>
                  <ul className="space-y-1 pl-4">
                    {module.lessons.map((lesson: Lesson, lessonIndex: number) => {
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
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentLessonData.content}
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
                      {currentLessonData.resources.map((resource: string, index: number) => (
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
                  <ArrowRight className="ml-2 h-4 w-4" />{/*  */}
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

function isLastLesson(courseData: Course, currentModule: number, currentLesson: number) {
  return (
    currentModule === courseData.modules.length - 1 &&
    currentLesson === courseData.modules[currentModule].lessons.length - 1
  )
}

function getCourseData(courseId: string): Course {
  const courses: CourseData = {
    "defi-fundamentals": {
      title: "DeFi Ecosystem",
      description: "Understand the revolutionary world of Decentralized Finance and its applications",
      modules: [
        {
          title: "DeFi Fundamentals",
          lessons: [
            {
              title: "Introduction to DeFi",
              content: `
# Exploring the DeFi Revolution

Decentralized Finance (DeFi) is transforming traditional financial services through blockchain technology, creating an open and accessible financial system for everyone.

## The Evolution of Finance

### Traditional Finance (TradFi)
- Centralized control
- Limited accessibility
- Regular business hours
- High fees and intermediaries

### Decentralized Finance (DeFi)
- Community governance
- Global accessibility
- 24/7 operation
- Reduced costs through automation

## Key DeFi Sectors

### 1. Decentralized Exchanges (DEX)
- Order book vs AMM models
- Liquidity provision
- Token swaps
- Examples: Uniswap, Curve, Balancer

### 2. Lending and Borrowing
- Overcollateralized loans
- Flash loans
- Interest rate dynamics
- Examples: Aave, Compound

### 3. Yield Aggregators
- Auto-compounding
- Strategy vaults
- Risk assessment
- Examples: Yearn Finance, Convex

### 4. Synthetic Assets
- Asset tokenization
- Price oracles
- Derivatives
- Examples: Synthetix, Mirror Protocol

## DeFi Advantages

1. **Transparency**
   - Open-source code
   - Verifiable transactions
   - Public ledger
   - Auditable protocols

2. **Composability**
   - Money legos concept
   - Protocol integration
   - Cross-platform compatibility
   - Innovative combinations

3. **Accessibility**
   - No KYC requirements
   - Self-custody
   - Global participation
   - Low minimum amounts

## DeFi Ecosystem Metrics

\`\`\`
Total Value Locked (TVL) Growth:
2020: $1B
2021: $100B+
2022: Market adjustments
2023: Sustainable growth
\`\`\`

## Future Developments

1. **Layer 2 Integration**
   - Scaling solutions
   - Lower fees
   - Faster transactions
   - Improved UX

2. **Real-World Assets**
   - Tokenized securities
   - Property investments
   - Supply chain finance
   - Traditional asset bridging

3. **Institutional Adoption**
   - Regulatory frameworks
   - Professional trading
   - Portfolio integration
   - Risk management
`,
              resources: [
                "DeFi Pulse - Real-time DeFi Stats",
                "DeFi Risk Framework Assessment",
                "Understanding DeFi Composability",
                "Layer 2 Scaling Solutions in DeFi"
              ]
            },
            {
              title: "Automated Market Makers",
              content: `
# Automated Market Makers (AMMs)

## Understanding AMMs

AMMs represent a revolutionary approach to market making in decentralized exchanges (DEXs). Unlike traditional order book systems, AMMs use mathematical formulas to determine asset prices.

### Core Concepts

1. **Liquidity Pools**
   - Paired assets
   - Constant product formula
   - Slippage and price impact

2. **Price Discovery**
   - Supply and demand dynamics
   - Arbitrage opportunities
   - Oracle integration

3. **LP Tokens**
   - Representation of pool share
   - Impermanent loss
   - Fee distribution

## Popular AMM Models

### 1. Constant Product
\`\`\`
x * y = k
\`\`\`
Where:
- x and y are token amounts
- k is a constant

### 2. Stable Swaps
Designed for assets that should trade at close to 1:1 ratios

### 3. Weighted Pools
Allow for different proportions of assets

## Risk Considerations

- Impermanent Loss
- Smart Contract Risk
- Oracle Dependencies
- Market Manipulation
              `,
              resources: [
                "Uniswap Whitepaper",
                "AMM Mathematics Explained",
                "Liquidity Provider Best Practices"
              ]
            }
          ]
        },
        {
          title: "Lending Protocols",
          lessons: [
            {
              title: "DeFi Lending Fundamentals",
              content: `
# DeFi Lending Protocols

## Understanding DeFi Lending

DeFi lending protocols enable permissionless borrowing and lending of crypto assets through smart contracts.

### Key Concepts

1. **Overcollateralization**
   - Collateral requirements
   - Liquidation thresholds
   - Risk parameters

2. **Interest Rate Models**
   - Utilization-based rates
   - Supply and borrow APY
   - Rate stability mechanisms

3. **Protocol Tokens**
   - aTokens (Aave)
   - cTokens (Compound)
   - Interest-bearing tokens

## Market Dynamics

### 1. Flash Loans
- Uncollateralized lending
- Atomic transactions
- Arbitrage opportunities

### 2. Liquidations
- Health factor monitoring
- Liquidation incentives
- Price oracle dependencies

### 3. Risk Management
- Protocol safety modules
- Insurance options
- Emergency procedures

## Advanced Features

1. **Interest Rate Strategies**
\`\`\`solidity
rate = baseRate + utilizationRate * multiplier
\`\`\`

2. **Governance Participation**
- Protocol improvements
- Risk parameter adjustments
- Fee structure updates
              `,
              resources: [
                "Aave Protocol Documentation",
                "Compound Finance Whitepaper",
                "DeFi Risk Management Guide"
              ]
            }
          ]
        }
      ]
    },
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
# Introduction to Blockchain Technology

A blockchain is a distributed database or ledger shared among computer network nodes. As a database, a blockchain stores information electronically in digital format.

Blockchains are best known for their crucial role in cryptocurrency systems, such as Bitcoin, for maintaining a secure and decentralized record of transactions. The innovation with a blockchain is that it guarantees the fidelity and security of a record of data and generates trust without the need for a trusted third party.

## Key Characteristics of Blockchain:

- **Decentralization:** No single entity has control over the entire network
- **Transparency:** All transactions are visible to anyone on the network
- **Immutability:** Once data is recorded, it cannot be altered
- **Security:** Cryptographic principles ensure data integrity

### Advanced Concepts

1. **Distributed Consensus**
   - Network participants agree on the state of the system
   - Multiple copies ensure data integrity
   - Byzantine fault tolerance

2. **Cryptographic Foundations**
   - Hash functions for data integrity
   - Digital signatures for authentication
   - Public-key cryptography for secure transactions

3. **Network Architecture**
   - Peer-to-peer communication
   - Decentralized node structure
   - Propagation of transactions and blocks

In the next lesson, we'll explore how blocks are created and linked together to form the blockchain.
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
# Blockchain Architecture

At its core, a blockchain is a chain of blocks that contain data. The architecture of blockchain consists of several key components working together to create a secure, decentralized system.

## Blocks

Each block in the blockchain contains:

- **Data:** The information stored in the block (e.g., transaction details)
- **Hash:** A unique identifier (like a fingerprint) for the block
- **Previous Hash:** The hash of the previous block, creating the chain
- **Timestamp:** When the block was created
- **Nonce:** A number used in mining to find a valid hash

### Block Structure Example:
\`\`\`
{
  "header": {
    "version": "1.0",
    "previousHash": "0x...",
    "merkleRoot": "0x...",
    "timestamp": 1650000000,
    "nonce": 123456
  },
  "transactions": [
    // Array of transactions
  ]
}
\`\`\`

## Distributed Ledger

The blockchain is stored across a peer-to-peer network, with each node maintaining a complete copy of the ledger. This distribution ensures:

1. **Redundancy**
   - No single point of failure
   - Data availability across the network
   - Automatic backup and synchronization

2. **Verification**
   - Each node validates new blocks
   - Consensus-based confirmation
   - Automatic conflict resolution

## Consensus Mechanisms

For a block to be added to the chain, network participants must agree on its validity through consensus mechanisms:

### 1. Proof of Work (PoW)
- Miners solve complex mathematical puzzles
- High energy consumption
- Bitcoin's choice of consensus

### 2. Proof of Stake (PoS)
- Validators stake cryptocurrency
- Energy efficient
- Used by Ethereum 2.0

### 3. Delegated Proof of Stake (DPoS)
- Token holders vote for validators
- Higher throughput
- Used by EOS and similar platforms

## Security Features

1. **Cryptographic Linking**
   - Each block references the previous block
   - Creates an immutable chain
   - Any tampering is easily detected

2. **Decentralized Validation**
   - Multiple nodes verify transactions
   - Majority consensus required
   - Protection against bad actors

This architecture creates a system that is secure, transparent, and resistant to tampering or revision.
              `,
              resources: [
                "Detailed Blockchain Architecture Guide",
                "Consensus Mechanisms Compared",
                "Building Blocks of Blockchain",
              ],
            }
          ],
        },
        {
          title: "Cryptography in Blockchain",
          lessons: [
            {
              title: "Cryptographic Hash Functions",
              content: `
# Cryptographic Hash Functions in Blockchain

Cryptographic hash functions are the backbone of blockchain security. They transform input data of any size into a fixed-size output (hash) that appears random but is deterministic.

## Properties of Cryptographic Hash Functions

1. **Deterministic**
   - Same input always produces same output
   - Essential for blockchain verification

2. **Quick Computation**
   - Calculating hash is computationally efficient
   - Important for real-time transaction processing

3. **Pre-image Resistance**
   - Infeasible to reverse-engineer input from hash
   - Ensures one-way function security

4. **Avalanche Effect**
   - Small input changes create vastly different hashes
   - Helps detect any data tampering

5. **Collision Resistance**
   - Extremely difficult to find two inputs with same hash
   - Critical for blockchain security

## Common Hash Functions in Blockchain

### SHA-256 (Bitcoin)
\`\`\`
Input: "Hello World"
Output: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
\`\`\`

### Keccak-256 (Ethereum)
- Modified version of SHA-3
- Used for contract addresses
- Different implementation from SHA-256

### RIPEMD-160
- Used in Bitcoin addresses
- Combined with SHA-256 for address generation
- Provides shorter output length

## Applications in Blockchain

### 1. Block Identification
\`\`\`javascript
blockHash = hash(
  version +
  previousBlockHash +
  merkleRoot +
  timestamp +
  difficulty +
  nonce
)
\`\`\`

### 2. Mining Process
1. Collect pending transactions
2. Create block header
3. Increment nonce
4. Calculate hash
5. Check if hash meets difficulty target
6. Repeat until valid hash found

### 3. Data Integrity
- Transaction hashing
- Merkle tree construction
- State root computation

### 4. Address Generation
\`\`\`
publicKeyHash = RIPEMD160(SHA256(publicKey))
address = base58check(publicKeyHash)
\`\`\`
              `,
              resources: [
                "Cryptographic Hash Functions Explained",
                "SHA-256 in Detail",
                "Hash Functions in Modern Cryptography"
              ]
            },
            {
              title: "Public Key Cryptography",
              content: `
# Public Key Cryptography in Blockchain

## Key Concepts

Public key cryptography (asymmetric cryptography) is fundamental to blockchain security, enabling secure transactions and digital signatures without sharing secret keys.

### Key Pairs
1. **Private Key**
   - Random number (256 bits in Bitcoin/Ethereum)
   - Must remain secret
   - Used to sign transactions
   - Generated using cryptographically secure random number generator

2. **Public Key**
   - Derived from private key using elliptic curve multiplication
   - Can be shared freely 
   - Used to verify signatures
   - Forms basis of blockchain addresses

## Digital Signatures

### Signing Process
\`\`\`typescript
const signature = sign(privateKey, hash(message))
const isValid = verify(publicKey, message, signature)
\`\`\`

### Steps in Detail
1. **Transaction Creation**
   - Construct transaction data
   - Calculate transaction hash
   - Sign hash with private key
   - Attach signature to transaction

2. **Signature Verification**
   - Extract signature and public key
   - Verify signature matches transaction data
   - Confirm signer owns address

## Elliptic Curve Cryptography (ECC)

### secp256k1 Curve
\`\`\`
y² = x³ + 7
Field: Prime field with p = 2²⁵⁶ - 2³² - 977
\`\`\`

### Key Features
- Used by both Bitcoin and Ethereum
- Provides strong security with shorter keys
- Efficient computation
- Industry-standard implementation

## Address Generation

### Bitcoin Address Generation
\`\`\`
1. Private Key: Random 256-bit number
2. Public Key = Private Key × G (Generator Point)
3. Hash = RIPEMD160(SHA256(Public Key))
4. Add version byte
5. Generate checksum
6. Base58Check encoding
\`\`\`

### Ethereum Address Generation
\`\`\`
1. Private Key: Random 256-bit number
2. Public Key = Private Key × G
3. Address = keccak256(Public Key)[-20:]
4. Add '0x' prefix
\`\`\`

## Security Considerations

### Private Key Security
1. **Secure Generation**
   - Use cryptographically secure RNG
   - Never reuse keys
   - Proper entropy sources

2. **Storage**
   - Cold storage for large amounts
   - Hardware wallets
   - Encrypted backups

### Best Practices
1. **Key Management**
   - Hierarchical Deterministic (HD) wallets
   - Multi-signature schemes
   - Key rotation policies

2. **Implementation**
   - Use tested libraries
   - Regular security audits
   - Hardware security modules
              `,
              resources: [
                "Elliptic Curve Cryptography Explained",
                "Digital Signatures in Blockchain",
                "Private and Public Keys: A Deep Dive"
              ]
            }
          ],
        },
      ],
    },
    bitcoin: {
      title: "Bitcoin: Digital Gold",
      description: "Deep dive into Bitcoin's protocol, economics, and mining",
      modules: [
        {
          title: "Bitcoin Protocol",
          lessons: [
            {
              title: "Bitcoin Network Architecture",
              content: `
# Bitcoin Network Architecture

## Network Participants

### 1. Full Nodes
- Complete blockchain validation
- Transaction verification
- Network security maintenance
- P2P message relay

### 2. Mining Nodes
- Block creation
- Transaction selection
- Proof of Work computation
- Block propagation

### 3. Light Clients (SPV)
- Header-only verification
- Merkle proof validation
- Mobile wallet support
- Resource efficiency

## Transaction Flow

### 1. Transaction Creation
\`\`\`
Transaction {
    version: 2,
    inputs: [
        {prevTxId, index, scriptSig},
        ...
    ],
    outputs: [
        {amount, scriptPubKey},
        ...
    ],
    locktime: 0
}
\`\`\`

### 2. Transaction Propagation
- Initial broadcast to peers
- Memory pool management
- Fee-based prioritization
- Replace-by-fee rules

### 3. Block Inclusion
- Transaction selection criteria
- Fee market dynamics
- Block size limits
- Child-pays-for-parent

## Network Rules

### 1. Consensus Rules
- Block validation requirements
- Transaction validity checks
- Difficulty adjustments
- Reward calculations

### 2. P2P Protocol
- Node discovery (DNS seeds)
- Connection management
- Message types
- Data synchronization
              `,
              resources: [
                "Bitcoin P2P Network Protocol",
                "Full Node Implementation Guide",
                "SPV Node Security Considerations"
              ]
            },
            {
              title: "Mining and Consensus",
              content: `
# Bitcoin Mining and Consensus

## Mining Process

### 1. Block Template Creation
\`\`\`
BlockHeader {
    version: 0x20000000,
    prevBlockHash: "...",
    merkleRoot: "...",
    timestamp: 1650000000,
    bits: 386863986,
    nonce: 0
}
\`\`\`

### 2. Mining Algorithm
- SHA-256d implementation
- Nonce iteration
- Extra nonce handling
- Version rolling
- ASICs optimization

### 3. Stratum Protocol
- Pool communication
- Work distribution
- Share submission
- Payment calculation

## Difficulty Adjustment

### 1. Retargeting Algorithm
\`\`\`python
new_target = current_target * (actual_timespan / expected_timespan)
if actual_timespan < expected_timespan / 4:
    actual_timespan = expected_timespan / 4
if actual_timespan > expected_timespan * 4:
    actual_timespan = expected_timespan * 4
\`\`\`

### 2. Block Time Targeting
- 2016 block adjustment period
- 10-minute target spacing
- Difficulty bounds
- Hash rate implications

## Mining Economics

### 1. Reward Structure
- Block subsidy calculation
- Transaction fee market
- Halving schedule
- Long-term sustainability

### 2. Mining Hardware
- ASIC evolution
- Efficiency metrics
- Power consumption
- Heat management

### 3. Pool Operations
- Payout methods (PPLNS, PPS)
- Fee structures
- Variance reduction
- Decentralization concerns
              `,
              resources: [
                "Bitcoin Mining Equipment Guide",
                "Pool Operation Mechanics",
                "Mining Profitability Analysis"
              ]
            }
          ]
        },
        {
          title: "Bitcoin Economics",
          lessons: [
            {
              title: "Monetary Policy",
              content: `
# Bitcoin Monetary Policy

## Supply Schedule

### 1. Block Reward
- Initial 50 BTC reward
- Halving events every 210,000 blocks
- Final supply of 21 million
- Stock-to-flow implications

### 2. Issuance Rate
\`\`\`
Current Block Reward = 50 * (1/2)^(floor(block_height/210000))
\`\`\`

### 3. Scarcity Mechanism
- Predictable supply curve
- Deflationary nature
- Lost coins impact
- UTXO set growth

## Network Security

### 1. Game Theory
- Rational actor model
- Nash equilibrium
- Attack cost analysis
- Incentive alignment

### 2. Economic Finality
- Confirmation depth
- Reorganization cost
- Miner revenue security
- Fee market development

## Market Dynamics

### 1. Price Discovery
- Exchange mechanisms
- Arbitrage opportunities
- Liquidity dynamics
- Market depth analysis

### 2. Network Value
- Market capitalization
- Realized value metrics
- NVT ratio analysis
- MVRV implications

### 3. Adoption Metrics
- Active addresses
- Transaction volume
- Fee levels
- Lightning Network growth
              `,
              resources: [
                "Bitcoin Economics Fundamentals",
                "Network Metrics Analysis",
                "Security Economics Research"
              ]
            }
          ]
        }
      ]
    },
    "ethereum-development": {
      title: "Ethereum Development",
      description: "Learn to build decentralized applications on Ethereum",
      modules: [
        {
          title: "Smart Contract Development",
          lessons: [
            {
              title: "Solidity Programming",
              content: `
# Solidity Programming Fundamentals

## Smart Contract Basics

### Contract Structure
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // State Variables
    // Events
    // Constructor
    // Functions
    // Modifiers
}
\`\`\`

### Variable Types
1. **Value Types**
   - \`bool\`
   - \`uint\`, \`int\`
   - \`address\`
   - \`bytes\`
   - \`enum\`

2. **Reference Types**
   - \`string\`
   - \`array\`
   - \`struct\`
   - \`mapping\`

## Advanced Concepts

### Gas Optimization
1. **Storage vs Memory**
   - Storage: Persistent, expensive
   - Memory: Temporary, cheaper
   - Calldata: Read-only, cheapest

2. **Loop Optimization**
   - Avoid unbounded loops
   - Use events for logs
   - Batch operations

### Security Best Practices
1. **Reentrancy Protection**
\`\`\`solidity
modifier nonReentrant() {
    require(!locked, "Reentrant call");
    locked = true;
    _;
    locked = false;
}
\`\`\`

2. **Access Control**
\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
\`\`\`

## Design Patterns

### Factory Pattern
\`\`\`solidity
contract Factory {
    function createContract() public returns (address) {
        return address(new ChildContract());
    }
}
\`\`\`

### Proxy Pattern
1. **Implementation Contract**
2. **Proxy Contract**
3. **Storage Layout**

## Testing & Deployment

### Testing Framework
\`\`\`javascript
describe("Contract", function() {
    it("Should deploy correctly", async function() {
        // Test setup
        // Test execution
        // Assertions
    });
});
\`\`\`

### Deployment Process
1. Compile contract
2. Deploy to testnet
3. Verify on block explorer
4. Deploy to mainnet
              `,
              resources: [
                "Solidity Documentation",
                "OpenZeppelin Contracts",
                "Hardhat Testing Guide"
              ]
            },
            {
              title: "Web3 Integration",
              content: `
# Web3 Integration with Frontend

## Web3 Libraries

### ethers.js
\`\`\`typescript
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Get signer
const signer = provider.getSigner();

// Contract interaction
const contract = new ethers.Contract(address, abi, signer);
\`\`\`

### Web3 Modal
1. **Connection Setup**
2. **Provider Management**
3. **Network Switching**

## Frontend Integration

### React Hooks
\`\`\`typescript
function useContract(address: string, abi: any) {
    const { provider } = useWeb3React();
    return useMemo(() => 
        new Contract(address, abi, provider.getSigner()),
        [address, abi, provider]
    );
}
\`\`\`

### State Management
1. **Transaction State**
   - Pending
   - Confirmed
   - Failed

2. **Account State**
   - Connection
   - Network
   - Balance

## Event Handling

### Contract Events
\`\`\`typescript
contract.on("Transfer", (from, to, amount) => {
    console.log(\`\${from} sent \${amount} to \${to}\`);
});
\`\`\`

### Transaction Monitoring
1. **Wait for Confirmation**
2. **Handle Errors**
3. **Update UI**

## Security Considerations

### User Authentication
1. **Message Signing**
2. **Address Verification**
3. **Session Management**

### Error Handling
\`\`\`typescript
try {
    await contract.transfer(to, amount);
} catch (error) {
    if (error.code === 4001) {
        // User rejected
    } else if (error.code === -32603) {
        // Internal error
    }
}
\`\`\`
              `,
              resources: [
                "ethers.js Documentation",
                "Web3Modal Guide",
                "React-Web3 Best Practices"
              ]
            }
          ]
        }
      ]
    }
  }

  return courses[courseId] || courses["blockchain-fundamentals"]
}
