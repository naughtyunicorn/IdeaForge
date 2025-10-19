# 🚀 IdeaForge DApp Launch Guide

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd IdeaForge
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
# Copy environment templates
cp production.env frontend/.env.local
cp production.env backend/.env

# Edit the files with your actual API keys
nano frontend/.env.local
nano backend/.env
```

### 3. Launch the DApp

```bash
# Option 1: Use the launch script (recommended)
./scripts/launch.sh

# Option 2: Manual launch
npm run dev
```

The DApp will be available at:
- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>

## 🌐 Production Deployment

### Frontend (Vercel - Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   cd frontend
   vercel login
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_RPC_URL`: Polygon RPC URL
   - `NEXT_PUBLIC_ALCHEMY_API_KEY`: Your Alchemy API key
   - `NEXT_PUBLIC_PINATA_API_KEY`: Your Pinata API key
   - `NEXT_PUBLIC_PINATA_SECRET_KEY`: Your Pinata secret key
   - Contract addresses (after deployment)

### Backend (Railway - Recommended)

1. **Deploy to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Set Environment Variables in Railway Dashboard**
   - `DATABASE_URL`: PostgreSQL connection string
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PINATA_API_KEY`: Your Pinata API key
   - `PINATA_SECRET_KEY`: Your Pinata secret key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key

### Smart Contracts (Polygon Mainnet)

1. **Deploy Contracts**
   ```bash
   cd contracts
   npm run deploy:mainnet
   ```

2. **Update Environment Variables**
   - Copy deployed contract addresses to frontend and backend
   - Verify contracts on Polygonscan

### Database (Supabase - Recommended)

1. **Create Supabase Project**
   - Go to <https://supabase.com>
   - Create new project
   - Get URL and API keys

2. **Run Database Migrations**
   ```sql
   -- Create tables (run in Supabase SQL editor)
   CREATE TABLE ideas (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT NOT NULL,
     creator_address VARCHAR(42) NOT NULL,
     ipfs_hash VARCHAR(255),
     ai_score INTEGER,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE TABLE ipnfts (
     id SERIAL PRIMARY KEY,
     token_id INTEGER UNIQUE,
     idea_id INTEGER REFERENCES ideas(id),
     metadata_uri VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## 🔧 Configuration

### Required API Keys

1. **Alchemy** (Blockchain RPC)
   - Sign up at <https://alchemy.com>
   - Create Polygon app
   - Get API key

2. **Pinata** (IPFS Storage)
   - Sign up at <https://pinata.cloud>
   - Get API key and secret

3. **OpenAI** (AI Validation)
   - Sign up at <https://openai.com>
   - Get API key

4. **Stripe** (Payments)
   - Sign up at <https://stripe.com>
   - Get secret key

5. **Supabase** (Database)
   - Sign up at <https://supabase.com>
   - Create project
   - Get URL and keys

### Contract Addresses

After deploying contracts, update these in your environment:
- `FORGE_TOKEN_ADDRESS`: ERC-20 token contract
- `IPNFT_ADDRESS`: ERC-721A NFT contract
- `IDEA_FORGE_CORE_ADDRESS`: Main platform contract
- `IDEA_FORGE_DAO_ADDRESS`: DAO governance contract
- `REVENUE_SPLITTER_ADDRESS`: Royalty distribution contract

## 🐳 Docker Deployment

For easy deployment with Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual services
docker build -t ideaforge-frontend ./frontend
docker build -t ideaforge-backend ./backend
```

## 📊 Monitoring

### Health Checks

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:3001/health>

### Logs

```bash
# View logs
docker-compose logs -f

# Or for individual services
docker-compose logs -f frontend
docker-compose logs -f backend
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Use `--legacy-peer-deps` flag

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify API keys are valid

3. **Database Connection**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Run migrations if needed

4. **Blockchain Connection**
   - Verify RPC_URL is correct
   - Check if contracts are deployed
   - Ensure wallet is connected

### Support

For issues and support:
- Check the logs for error messages
- Verify all environment variables
- Ensure all services are running
- Check network connectivity

## 🎉 Success!

Once everything is running, you'll have:
- ✅ Fully functional DApp
- ✅ Web3 wallet integration
- ✅ AI-powered idea validation
- ✅ IP-NFT minting and trading
- ✅ DAO governance system
- ✅ Automated royalty distribution

**IdeaForge is ready to revolutionize IP monetization!** 🚀
