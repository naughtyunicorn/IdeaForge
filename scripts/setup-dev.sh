#!/bin/bash

# IdeaForge Development Environment Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up IdeaForge Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Setup contracts
print_status "Setting up smart contracts..."
cd contracts
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating contracts/.env file..."
    cp ../env.example .env
    print_warning "Please update contracts/.env with your actual values"
fi

cd ..

# Setup backend
print_status "Setting up backend API..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating backend/.env file..."
    cat > .env << EOF
# Server
NODE_ENV=development
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

# Contract Addresses (will be filled after deployment)
FORGE_TOKEN_ADDRESS=
IP_NFT_ADDRESS=
IDEA_FORGE_CORE_ADDRESS=
DAO_ADDRESS=
REVENUE_SPLITTER_ADDRESS=

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
EOF
    print_warning "Please update backend/.env with your actual values"
fi

cd ..

# Setup frontend
print_status "Setting up frontend..."
cd frontend
npm install

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating frontend/.env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CHAIN_NAME=Polygon Mumbai
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Contract Addresses (will be filled after deployment)
NEXT_PUBLIC_FORGE_TOKEN_ADDRESS=
NEXT_PUBLIC_IP_NFT_ADDRESS=
NEXT_PUBLIC_IDEA_FORGE_CORE_ADDRESS=
NEXT_PUBLIC_DAO_ADDRESS=
NEXT_PUBLIC_REVENUE_SPLITTER_ADDRESS=

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
EOF
    print_warning "Please update frontend/.env.local with your actual values"
fi

cd ..

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Create deployment directory
print_status "Creating deployment directory..."
mkdir -p contracts/deployments

print_success "Development environment setup completed!"

print_status "Next steps:"
echo "1. Update environment variables in:"
echo "   - contracts/.env"
echo "   - backend/.env"
echo "   - frontend/.env.local"
echo ""
echo "2. Deploy smart contracts:"
echo "   ./scripts/deploy-contracts.sh"
echo ""
echo "3. Start development servers:"
echo "   npm run dev"
echo ""
echo "4. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001"
echo "   - API Documentation: http://localhost:3001/docs"

print_success "🎉 IdeaForge development environment is ready!"
