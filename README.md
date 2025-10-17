# IdeaForge 🧩

A hybrid IP-NFT creation, submission, and monetization platform that enables creators to tokenize their intellectual property, participate in DAO governance, and earn royalties through blockchain technology.

## 🌟 Features

- **💡 Idea Submission**: Secure upload and AI-powered validation of creative ideas
- **🎨 IP-NFT Minting**: Automatic conversion of ideas to tradeable NFTs with embedded metadata
- **💰 Revenue Engine**: ERC-2981 royalty standard with flexible compensation options
- **🗳️ DAO Governance**: Community-driven decision making with $FORGE token voting
- **🤖 AI Validation**: OpenAI-powered content verification and originality scoring
- **🔒 Legal Framework**: On-chain legal agreements and licensing rights
- **📊 Analytics**: Real-time platform statistics and user performance metrics

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 + React 19
- **Styling**: TailwindCSS + Shadcn UI
- **Web3**: Wagmi + RainbowKit + Ethers.js
- **State Management**: TanStack Query
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js + Fastify
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Ethers.js + Alchemy SDK
- **AI**: OpenAI API + LangChain
- **Storage**: IPFS + Pinata
- **Payments**: Stripe + On-chain royalties

### Smart Contracts
- **Language**: Solidity ^0.8.19
- **Framework**: Hardhat
- **Network**: Polygon (Mumbai testnet → Mainnet)
- **Standards**: ERC-721A, ERC-2981, ERC-20
- **Governance**: OpenZeppelin Governor

## 🏗️ Project Structure

```
IdeaForge/
├── contracts/              # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   └── hardhat.config.js  # Hardhat configuration
├── frontend/              # Next.js React application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── config/        # Configuration files
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript types
│   └── package.json
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── types/         # TypeScript types
│   └── package.json
├── scripts/               # Deployment scripts
├── docs/                  # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Git
- MetaMask or compatible wallet
- Polygon Mumbai testnet MATIC
- API keys for required services

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ideaforge.git
cd ideaforge
```

### 2. Setup Development Environment

```bash
# Run the setup script
./scripts/setup-dev.sh

# Or manually install dependencies
npm install
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Copy the example environment files and fill in your API keys:

```bash
# Smart contracts
cp env.example contracts/.env

# Backend API
cp env.example backend/.env

# Frontend
cp env.example frontend/.env.local
```

### 4. Deploy Smart Contracts

```bash
# Deploy to Mumbai testnet
./scripts/deploy-contracts.sh

# Or manually
cd contracts
npm run deploy:mumbai
```

### 5. Start Development Servers

```bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

## 📋 Required API Keys

### Blockchain & Web3
- **Alchemy**: Polygon RPC endpoint
- **PolygonScan**: Contract verification
- **WalletConnect**: Wallet connection

### AI Services
- **OpenAI**: Content validation and analysis

### Database & Storage
- **Supabase**: PostgreSQL database
- **Pinata**: IPFS file storage

### Payments
- **Stripe**: Fiat payment processing

### Optional
- **Firebase**: Additional authentication
- **Sentry**: Error tracking
- **Google Analytics**: User analytics

## 🧩 Smart Contracts

### Core Contracts

1. **ForgeToken.sol** - ERC-20 utility and governance token
2. **IPNFT.sol** - ERC-721A NFT with royalty support
3. **IdeaForgeCore.sol** - Main platform logic
4. **IdeaForgeDAO.sol** - Governance and voting
5. **RevenueSplitter.sol** - Royalty distribution

### Key Features

- **ERC-2981 Royalty Standard**: Automatic royalty distribution
- **Governance Voting**: $FORGE token-based decision making
- **IP Protection**: Immutable ownership and licensing records
- **Revenue Sharing**: Configurable creator, DAO, and platform splits

## 🎯 Core Workflows

### 1. Idea Submission
1. User uploads idea with description and files
2. Content is stored on IPFS
3. AI validates originality and quality
4. Idea is submitted to blockchain
5. Validators review and approve/reject

### 2. IP-NFT Creation
1. Approved ideas are automatically minted as NFTs
2. Metadata includes AI scores and licensing terms
3. Creators receive $FORGE token rewards
4. NFTs are listed on marketplace

### 3. Licensing & Royalties
1. Users can license IP-NFTs for commercial use
2. Royalties are automatically distributed
3. Revenue is split between creators, DAO, and platform
4. All transactions are recorded on-chain

### 4. DAO Governance
1. $FORGE token holders can create proposals
2. Community votes on platform decisions
3. Proposals are executed automatically
4. Treasury is managed through multi-sig

## 📊 API Documentation

The backend API is fully documented with Swagger/OpenAPI:

- **Development**: http://localhost:3001/docs
- **Production**: https://your-api-domain.com/docs

### Key Endpoints

- `POST /api/ideas/submit` - Submit new idea
- `POST /api/ai/validate-idea` - AI validation
- `GET /api/nfts/:tokenId` - Get IP-NFT data
- `POST /api/dao/proposals` - Create DAO proposal
- `POST /api/payments/claim-earnings` - Claim royalties

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm test
```

### Backend API
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Integration Tests
```bash
# Test complete workflow
npm run test:integration
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Deploy smart contracts
./scripts/deploy-contracts.sh

# Deploy backend to Railway
cd backend && npm run deploy

# Deploy frontend to Vercel
cd frontend && npm run deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

See individual `.env.example` files in each directory for required configuration.

### Network Configuration

- **Development**: Local Hardhat network
- **Testnet**: Polygon Mumbai
- **Production**: Polygon Mainnet

### Gas Optimization

- Contracts use Solidity 0.8.19 with optimizations
- Gas-efficient patterns (packed structs, events)
- Batch operations where possible

## 📈 Tokenomics

### $FORGE Token Distribution
- **40%** - Community rewards and staking
- **25%** - DAO treasury
- **15%** - Team and advisors
- **10%** - Liquidity pool
- **10%** - Marketing and partnerships

### Revenue Sharing
- **70%** - Creator
- **15%** - DAO treasury
- **10%** - Platform
- **5%** - Validators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.ideaforge.io](https://docs.ideaforge.io)
- **Discord**: [discord.gg/ideaforge](https://discord.gg/ideaforge)
- **Twitter**: [@IdeaForgeDAO](https://twitter.com/IdeaForgeDAO)
- **Email**: support@ideaforge.io

## 🙏 Acknowledgments

- **OpenZeppelin** - Smart contract libraries
- **Hardhat** - Development framework
- **Next.js** - React framework
- **TailwindCSS** - Styling
- **Supabase** - Backend services
- **Polygon** - Blockchain network

---

**Built with ❤️ by TRTSKCS**

*Transform your ideas into tokenized intellectual property with IdeaForge - the future of creative monetization.*# IdeaForge
