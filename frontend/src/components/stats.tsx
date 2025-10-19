'use client'

import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

const stats = [
  { label: 'Ideas Submitted', value: '2,847', change: '+12%' },
  { label: 'IP-NFTs Minted', value: '1,923', change: '+8%' },
  { label: 'Total Royalties Paid', value: '$127K', change: '+23%' },
  { label: 'Active Creators', value: '1,456', change: '+15%' },
]

export function Stats() {
  const { isConnected } = useAccount()

  return (
    <section className="py-16 bg-white border-b">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Platform Statistics
          </h2>
          <p className="text-gray-600">
            Real-time metrics showing the growth and success of our community
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-green-600 font-medium">
                {stat.change} this month
              </div>
            </motion.div>
          ))}
        </div>

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 text-forge-600 font-medium">
              <span>Your stats will appear here once you start creating</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
