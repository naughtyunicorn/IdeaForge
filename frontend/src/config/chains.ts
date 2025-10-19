import { polygon, polygonMumbai } from 'wagmi/chains'

export const chains = [polygonMumbai, polygon] as const

export const defaultChain = polygonMumbai

export const chainConfig = {
  [polygonMumbai.id]: {
    name: 'Polygon Mumbai',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  [polygon.id]: {
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
} as const
