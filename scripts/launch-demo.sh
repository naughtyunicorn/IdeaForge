#!/bin/bash

# IdeaForge Demo Launch Script
echo "🚀 Launching IdeaForge DApp Demo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

print_header() {
    echo -e "${PURPLE}[IDEAFORGE]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the IdeaForge root directory"
    exit 1
fi

print_header "Starting IdeaForge DApp Demo..."

# Create demo environment files
print_status "Setting up demo environment..."

# Frontend environment
cat > frontend/.env.local << 'EOF'
# Demo Environment Variables for IdeaForge Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/
NEXT_PUBLIC_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/demo
NEXT_PUBLIC_FORGE_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_IPNFT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_IDEA_FORGE_CORE_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_IDEA_FORGE_DAO_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_REVENUE_SPLITTER_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ALCHEMY_API_KEY=demo
NEXT_PUBLIC_PINATA_API_KEY=demo
NEXT_PUBLIC_PINATA_SECRET_KEY=demo
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_CHAIN_NAME=Polygon Mumbai
EOF

# Backend environment
cat > backend/.env << 'EOF'
# Demo Environment Variables for IdeaForge Backend
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
DATABASE_URL=postgresql://demo:demo@localhost:5432/ideaforge
SUPABASE_URL=https://demo.supabase.co
SUPABASE_ANON_KEY=demo
SUPABASE_SERVICE_ROLE_KEY=demo
OPENAI_API_KEY=demo
PINATA_API_KEY=demo
PINATA_SECRET_KEY=demo
STRIPE_SECRET_KEY=demo
STRIPE_WEBHOOK_SECRET=demo
FIREBASE_PROJECT_ID=demo
FIREBASE_PRIVATE_KEY=demo
FIREBASE_CLIENT_EMAIL=demo@demo.com
JWT_SECRET=demo-secret-key
RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/demo
FORGE_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
IPNFT_ADDRESS=0x0000000000000000000000000000000000000000
IDEA_FORGE_CORE_ADDRESS=0x0000000000000000000000000000000000000000
IDEA_FORGE_DAO_ADDRESS=0x0000000000000000000000000000000000000000
REVENUE_SPLITTER_ADDRESS=0x0000000000000000000000000000000000000000
EOF

print_success "Demo environment files created"

# Start the application
print_status "Starting IdeaForge DApp Demo..."

# Start backend in background
print_status "Starting backend API..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
print_status "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

print_success "🎉 IdeaForge DApp Demo is now running!"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:3001"
print_warning "Note: This is a demo with mock data. For full functionality, configure real API keys."
print_status "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    print_status "Stopping IdeaForge DApp Demo..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "IdeaForge DApp Demo stopped successfully"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
