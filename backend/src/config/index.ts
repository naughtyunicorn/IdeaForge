import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  HOST: process.env.HOST || '0.0.0.0',
  API_HOST: process.env.API_HOST || 'localhost:3001',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // Database
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  
  // Blockchain
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL!,
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
  
  // Contract Addresses
  FORGE_TOKEN_ADDRESS: process.env.FORGE_TOKEN_ADDRESS!,
  IP_NFT_ADDRESS: process.env.IP_NFT_ADDRESS!,
  IDEA_FORGE_CORE_ADDRESS: process.env.IDEA_FORGE_CORE_ADDRESS!,
  DAO_ADDRESS: process.env.DAO_ADDRESS!,
  REVENUE_SPLITTER_ADDRESS: process.env.REVENUE_SPLITTER_ADDRESS!,
  
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  OPENAI_ORG_ID: process.env.OPENAI_ORG_ID,
  
  // IPFS
  PINATA_API_KEY: process.env.PINATA_API_KEY!,
  PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY!,
  IPFS_GATEWAY_URL: process.env.IPFS_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/',
  
  // Payments
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Firebase
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  
  // AI Validation
  AI_MIN_SCORE: parseInt(process.env.AI_MIN_SCORE || '50'),
  AI_MAX_SCORE: parseInt(process.env.AI_MAX_SCORE || '100'),
  
  // Platform Fees
  PLATFORM_FEE_PERCENTAGE: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '2.5'),
  MIN_SUBMISSION_FEE: parseFloat(process.env.MIN_SUBMISSION_FEE || '0.001'),
  
  // DAO
  DAO_QUORUM_PERCENTAGE: parseInt(process.env.DAO_QUORUM_PERCENTAGE || '4'),
  DAO_VOTING_DELAY: parseInt(process.env.DAO_VOTING_DELAY || '1'),
  DAO_VOTING_PERIOD: parseInt(process.env.DAO_VOTING_PERIOD || '172800'), // 2 days
} as const

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'POLYGON_RPC_URL',
  'PRIVATE_KEY',
  'OPENAI_API_KEY',
  'PINATA_API_KEY',
  'PINATA_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'FORGE_TOKEN_ADDRESS',
  'IP_NFT_ADDRESS',
  'IDEA_FORGE_CORE_ADDRESS',
  'DAO_ADDRESS',
  'REVENUE_SPLITTER_ADDRESS',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}
