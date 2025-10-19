#!/bin/bash

# IdeaForge Launch Script
echo "🚀 Launching IdeaForge DApp..."

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

print_header "Starting IdeaForge DApp Launch Process..."

# Check if .env files exist
if [ ! -f "frontend/.env.local" ]; then
    print_warning "Frontend .env.local not found. Creating from template..."
    cp production.env frontend/.env.local
    print_warning "Please update frontend/.env.local with your actual API keys"
fi

if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env not found. Creating from template..."
    cp production.env backend/.env
    print_warning "Please update backend/.env with your actual API keys"
fi

# Build the application
print_status "Building application for production..."
if ./scripts/build-production.sh; then
    print_success "Build completed successfully"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Start the application
print_status "Starting IdeaForge DApp..."

# Start backend in background
print_status "Starting backend API..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

# Start frontend
print_status "Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

print_success "🎉 IdeaForge DApp is now running!"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:3001"
print_status "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    print_status "Stopping IdeaForge DApp..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "IdeaForge DApp stopped successfully"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
