# IdeaForge Deployment Guide

This guide will walk you through deploying the complete IdeaForge platform to production.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Blockchain    │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Polygon)     │
│   Vercel        │    │   Railway       │    │   Mumbai/Main   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IPFS Storage  │    │   Database      │    │   AI Services   │
│   (Pinata)      │    │   (Supabase)    │    │   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

### Required Accounts & Services

- [Vercel](https://vercel.com) - Frontend hosting
- [Railway](https://railway.app) - Backend hosting
- [Supabase](https://supabase.com) - Database
- [Alchemy](https://alchemy.com) - Blockchain RPC
- [Pinata](https://pinata.cloud) - IPFS storage
- [OpenAI](https://openai.com) - AI services
- [Stripe](https://stripe.com) - Payment processing
- [Polygon](https://polygon.technology) - Blockchain network

### Required Tools

- Node.js 18+
- Git
- MetaMask or compatible wallet
- Polygon Mumbai testnet MATIC

## 🚀 Step-by-Step Deployment

### 1. Smart Contracts Deployment

#### 1.1 Setup Environment

```bash
cd contracts
npm install
cp ../env.example .env
```

#### 1.2 Configure Environment Variables

Edit `contracts/.env`:

```env
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### 1.3 Deploy Contracts

```bash
# Deploy to Mumbai testnet
npm run deploy:mumbai

# Verify contracts
npm run verify
```

#### 1.4 Update Contract Addresses

After deployment, update the contract addresses in:

- `frontend/src/config/contracts.ts`
- `backend/src/config/index.ts`

### 2. Backend API Deployment

#### 2.1 Setup Railway Project

1. Connect your GitHub repository to Railway
2. Select the `backend` folder as the root directory
3. Set the build command: `npm run build`
4. Set the start command: `npm start`

#### 2.2 Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
# Server
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Blockchain
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Contract Addresses
FORGE_TOKEN_ADDRESS=0x...
IP_NFT_ADDRESS=0x...
IDEA_FORGE_CORE_ADDRESS=0x...
DAO_ADDRESS=0x...
REVENUE_SPLITTER_ADDRESS=0x...

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_ORG_ID=org-your_organization_id_here

# IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

#### 2.3 Deploy

Railway will automatically deploy when you push to the main branch.

### 3. Frontend Deployment

#### 3.1 Setup Vercel Project

1. Connect your GitHub repository to Vercel
2. Select the `frontend` folder as the root directory
3. Set the build command: `npm run build`
4. Set the output directory: `.next`

#### 3.2 Configure Environment Variables

In Vercel dashboard, add these environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CHAIN_NAME=Polygon Mumbai
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Contract Addresses
NEXT_PUBLIC_FORGE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_IP_NFT_ADDRESS=0x...
NEXT_PUBLIC_IDEA_FORGE_CORE_ADDRESS=0x...
NEXT_PUBLIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_REVENUE_SPLITTER_ADDRESS=0x...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### 3.3 Deploy

Vercel will automatically deploy when you push to the main branch.

### 4. Database Setup

#### 4.1 Create Supabase Project

1. Create a new project in Supabase
2. Note down the project URL and API keys
3. Run the database migrations (if any)

#### 4.2 Database Schema

The following tables should be created in Supabase:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar TEXT,
  bio TEXT,
  website TEXT,
  twitter TEXT,
  joined_at TIMESTAMP DEFAULT NOW(),
  total_ideas INTEGER DEFAULT 0,
  total_ipnfts INTEGER DEFAULT 0,
  total_earnings TEXT DEFAULT '0',
  reputation INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  metadata_hash TEXT NOT NULL,
  submitter TEXT NOT NULL,
  submission_time TIMESTAMP NOT NULL,
  ai_credibility_score INTEGER,
  is_approved BOOLEAN DEFAULT FALSE,
  is_minted BOOLEAN DEFAULT FALSE,
  validator TEXT,
  validation_notes TEXT,
  minted_token_id INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- IP-NFTs table
CREATE TABLE ipnfts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id INTEGER UNIQUE NOT NULL,
  creator TEXT NOT NULL,
  owner TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  ai_credibility_score INTEGER NOT NULL,
  creation_time TIMESTAMP NOT NULL,
  is_licensed BOOLEAN DEFAULT FALSE,
  license_price TEXT,
  royalty_fee INTEGER NOT NULL,
  token_uri TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- DAO Proposals table
CREATE TABLE dao_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id INTEGER UNIQUE NOT NULL,
  proposer TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  external_link TEXT,
  proposal_type TEXT NOT NULL,
  targets TEXT[] NOT NULL,
  values TEXT[] NOT NULL,
  calldatas TEXT[] NOT NULL,
  created_at TIMESTAMP NOT NULL,
  voting_start TIMESTAMP,
  voting_end TIMESTAMP,
  status TEXT DEFAULT 'pending',
  for_votes TEXT DEFAULT '0',
  against_votes TEXT DEFAULT '0',
  abstain_votes TEXT DEFAULT '0',
  quorum TEXT,
  execution_time TIMESTAMP,
  created_at_db TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Revenue table
CREATE TABLE revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator TEXT NOT NULL,
  amount TEXT NOT NULL,
  token TEXT DEFAULT 'ETH',
  source TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  transaction_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. IPFS Setup

#### 5.1 Pinata Configuration

1. Create a Pinata account
2. Generate API keys
3. Configure the IPFS gateway URL

#### 5.2 File Upload Limits

- Maximum file size: 10MB
- Allowed file types: Images, PDFs, Documents, Text files
- Content is automatically pinned to IPFS

### 6. AI Services Setup

#### 6.1 OpenAI Configuration

1. Create an OpenAI account
2. Generate API keys
3. Set up usage limits and billing

#### 6.2 AI Validation Settings

- Minimum AI score: 50/100
- Maximum AI score: 100/100
- Confidence threshold: 0.7

### 7. Payment Integration

#### 7.1 Stripe Setup

1. Create a Stripe account
2. Generate API keys
3. Set up webhook endpoints
4. Configure payment methods

#### 7.2 On-chain Royalties

- ERC-2981 standard implementation
- Automatic royalty distribution
- Configurable royalty percentages

### 8. Domain & SSL Setup

#### 8.1 Custom Domain

1. Purchase a domain name
2. Configure DNS settings
3. Set up SSL certificates

#### 8.2 Environment Updates

Update the following environment variables with your custom domain:

- `NEXT_PUBLIC_APP_URL`
- `API_HOST`
- `ALLOWED_ORIGINS`

## 🔧 Post-Deployment Configuration

### 1. Contract Verification

Verify all contracts on PolygonScan:

```bash
cd contracts
npm run verify
```

### 2. Initial Token Distribution

Deploy and distribute initial $FORGE tokens:

```bash
# This would be done through the admin interface
# or by calling contract functions directly
```

### 3. DAO Setup

1. Create initial DAO proposals
2. Set up governance parameters
3. Configure treasury management

### 4. Monitoring Setup

1. Set up error tracking (Sentry)
2. Configure analytics (Google Analytics)
3. Set up uptime monitoring
4. Configure log aggregation

## 🧪 Testing

### 1. Smart Contract Tests

```bash
cd contracts
npm test
```

### 2. API Tests

```bash
cd backend
npm test
```

### 3. Frontend Tests

```bash
cd frontend
npm test
```

### 4. Integration Tests

Test the complete flow:

1. Submit an idea
2. AI validation
3. Approval process
4. IP-NFT minting
5. Marketplace listing
6. Licensing and royalties

## 🚨 Troubleshooting

### Common Issues

#### 1. Contract Deployment Fails

- Check RPC URL and private key
- Ensure sufficient MATIC balance
- Verify gas limits

#### 2. API Connection Issues

- Check CORS settings
- Verify environment variables
- Check Railway logs

#### 3. Frontend Build Fails

- Check Node.js version
- Verify environment variables
- Check Vercel build logs

#### 4. IPFS Upload Issues

- Check Pinata API keys
- Verify file size limits
- Check network connectivity

### Debug Commands

```bash
# Check contract deployment
cd contracts
npx hardhat verify --network mumbai CONTRACT_ADDRESS

# Check API health
curl https://your-railway-app.railway.app/health

# Check frontend build
cd frontend
npm run build
```

## 📊 Monitoring & Maintenance

### 1. Health Checks

- API: `GET /health`
- Database: Check Supabase dashboard
- Blockchain: Monitor transaction success rates

### 2. Performance Monitoring

- Response times
- Error rates
- Resource usage
- User activity

### 3. Security Monitoring

- Failed authentication attempts
- Suspicious transactions
- Unusual API usage patterns

### 4. Regular Maintenance

- Update dependencies
- Monitor gas prices
- Backup database
- Review logs

## 🔄 Updates & Scaling

### 1. Smart Contract Updates

- Deploy new contracts
- Migrate data if needed
- Update frontend/backend

### 2. API Scaling

- Increase Railway resources
- Add load balancing
- Implement caching

### 3. Frontend Scaling

- Enable Vercel edge functions
- Implement CDN
- Optimize bundle size

## 📞 Support

For deployment issues or questions:

- Check the logs in Railway/Vercel dashboards
- Review the troubleshooting section
- Contact the development team

---

**Note**: This deployment guide assumes you have basic knowledge of blockchain development, web development, and cloud services. Always test in a staging environment before deploying to production.
