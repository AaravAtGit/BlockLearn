# BlockLearn - Blockchain Learning Platform

BlockLearn is an innovative blockchain-based learning platform that combines educational content with Web3 technologies. Learn blockchain concepts, earn rewards, and receive NFT certificates for your achievements.

## 🚀 Features

- **Interactive Learning**: Engage with structured blockchain courses and modules
- **Web3 Integration**: Connect your wallet and interact with the blockchain
- **Quiz System**: Test your knowledge with course-specific quizzes
- **NFT Rewards**: Earn NFT certificates upon course completion
- **Progress Tracking**: Monitor your learning journey
- **Responsive Design**: Seamless experience across all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: Shadcn UI
- **Web3**: Ethereum, Smart Contracts (Solidity)
- **Authentication**: Web3 Wallet Connection
- **Styling**: Global CSS with TailwindCSS

## 📦 Project Structure

```
app/                  # Next.js app directory
├── blocklearn-ai/    # AI-powered learning features
├── courses/          # Course listing and details
├── learn/           # Learning modules and content
├── quizzes/         # Interactive quizzes
└── rewards/         # NFT rewards system

components/          # Reusable React components
contracts/          # Solidity smart contracts
context/            # React context providers
hooks/              # Custom React hooks
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/AaravAtGit/BlockLearn.git
cd nextjs_blockLearn
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Smart Contract Development

The project includes a BlockLearnNFT smart contract for issuing completion certificates:

1. Install blockchain development dependencies:
```bash
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built during HackHazards hackathon
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- NextJS App Router for modern React development