import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IdeaForge - IP-NFT Creation & Monetization Platform',
  description: 'Transform your creative ideas into tokenized intellectual property with AI validation, DAO governance, and automated royalty distribution.',
  keywords: ['NFT', 'IP', 'DAO', 'Blockchain', 'Creativity', 'Royalties', 'Governance'],
  authors: [{ name: 'TRTSKCS' }],
  openGraph: {
    title: 'IdeaForge - IP-NFT Creation & Monetization Platform',
    description: 'Transform your creative ideas into tokenized intellectual property with AI validation, DAO governance, and automated royalty distribution.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaForge - IP-NFT Creation & Monetization Platform',
    description: 'Transform your creative ideas into tokenized intellectual property with AI validation, DAO governance, and automated royalty distribution.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
