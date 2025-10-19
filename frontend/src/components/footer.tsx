import Link from 'next/link'
import { Zap, Twitter, Github, MessageCircle, Mail } from 'lucide-react'

const navigation = {
  main: [
    { name: 'Submit Idea', href: '/submit' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'DAO', href: '/dao' },
    { name: 'Market', href: '/market' },
    { name: 'Whitepaper', href: '/whitepaper' },
    { name: 'Legal', href: '/legal' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: Github,
    },
    {
      name: 'Discord',
      href: '#',
      icon: MessageCircle,
    },
    {
      name: 'Email',
      href: 'mailto:contact@ideaforge.io',
      icon: Mail,
    },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forge-600 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">IdeaForge</span>
            </Link>
            <p className="text-slate-300 mb-6 max-w-md">
              The premier platform for transforming creative ideas into tokenized intellectual property 
              with AI validation, DAO governance, and automated royalty distribution.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 IdeaForge. All rights reserved. Built by TRTSKCS.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm text-slate-400">
              <span>Powered by Polygon</span>
              <span>•</span>
              <span>Secured by IPFS</span>
              <span>•</span>
              <span>Validated by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
