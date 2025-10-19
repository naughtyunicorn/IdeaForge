#!/bin/bash

# IdeaForge Smart Contracts Deployment Script
# This script deploys all smart contracts to Polygon Mumbai testnet

set -e

echo "🚀 Starting IdeaForge Smart Contracts Deployment..."

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

# Check if we're in the right directory
if [ ! -f "contracts/package.json" ]; then
    print_error "Please run this script from the IdeaForge root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f "contracts/.env" ]; then
    print_error "Environment file not found. Please create contracts/.env with required variables:"
    echo "POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
    echo "PRIVATE_KEY=your_private_key_here"
    echo "POLYGONSCAN_API_KEY=your_polygonscan_api_key"
    exit 1
fi

# Navigate to contracts directory
cd contracts

print_status "Installing dependencies..."
npm install

print_status "Compiling contracts..."
npm run compile

if [ $? -ne 0 ]; then
    print_error "Contract compilation failed"
    exit 1
fi

print_success "Contracts compiled successfully"

print_status "Deploying contracts to Polygon Mumbai..."

# Deploy contracts
npm run deploy:mumbai

if [ $? -ne 0 ]; then
    print_error "Contract deployment failed"
    exit 1
fi

print_success "Contracts deployed successfully"

print_status "Verifying contracts on PolygonScan..."

# Wait a bit for contracts to be indexed
sleep 30

# Verify contracts
npm run verify

if [ $? -ne 0 ]; then
    print_warning "Contract verification failed, but deployment was successful"
    print_warning "You can verify contracts manually on PolygonScan"
fi

print_success "Deployment completed!"

# Display contract addresses
print_status "Contract addresses:"
echo "=================================="

# Read deployment info
if [ -f "deployments/mumbai.json" ]; then
    echo "ForgeToken: $(jq -r '.contracts.ForgeToken' deployments/mumbai.json)"
    echo "IPNFT: $(jq -r '.contracts.IPNFT' deployments/mumbai.json)"
    echo "IdeaForgeCore: $(jq -r '.contracts.IdeaForgeCore' deployments/mumbai.json)"
    echo "IdeaForgeDAO: $(jq -r '.contracts.IdeaForgeDAO' deployments/mumbai.json)"
    echo "RevenueSplitter: $(jq -r '.contracts.RevenueSplitter' deployments/mumbai.json)"
    echo "TimelockController: $(jq -r '.contracts.TimelockController' deployments/mumbai.json)"
fi

echo "=================================="

print_status "Next steps:"
echo "1. Update contract addresses in frontend/src/config/contracts.ts"
echo "2. Update contract addresses in backend/src/config/index.ts"
echo "3. Deploy backend API to Railway"
echo "4. Deploy frontend to Vercel"
echo "5. Configure environment variables in production"

print_success "🎉 IdeaForge smart contracts deployment completed!"
