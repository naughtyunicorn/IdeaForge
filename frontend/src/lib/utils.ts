import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatEther(value: bigint, decimals: number = 18) {
  return Number(value) / Math.pow(10, decimals)
}

export function parseEther(value: string, decimals: number = 18) {
  return BigInt(Math.floor(Number(value) * Math.pow(10, decimals)))
}

export function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString()
}

export function formatTimeAgo(timestamp: number) {
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(timestamp)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateRandomId() {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidHash(hash: string) {
  return /^Qm[a-zA-Z0-9]{44}$/.test(hash) || /^0x[a-fA-F0-9]{64}$/.test(hash)
}
