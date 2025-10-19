'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const tokenDistribution = [
  { name: 'Community Rewards', value: 40, color: '#0ea5e9' },
  { name: 'DAO Treasury', value: 25, color: '#22c55e' },
  { name: 'Team & Advisors', value: 15, color: '#d946ef' },
  { name: 'Liquidity Pool', value: 10, color: '#f59e0b' },
  { name: 'Marketing', value: 10, color: '#ef4444' },
]

const revenueData = [
  { month: 'Jan', revenue: 12000, royalties: 8000 },
  { month: 'Feb', revenue: 19000, royalties: 12000 },
  { month: 'Mar', revenue: 30000, royalties: 18000 },
  { month: 'Apr', revenue: 28000, royalties: 15000 },
  { month: 'May', revenue: 35000, royalties: 22000 },
  { month: 'Jun', revenue: 42000, royalties: 28000 },
]

const tokenFeatures = [
  {
    title: 'Governance Rights',
    description: 'Vote on platform proposals and influence development direction',
    icon: '🗳️',
  },
  {
    title: 'Staking Rewards',
    description: 'Earn passive income by staking $FORGE tokens',
    icon: '💰',
  },
  {
    title: 'Creator Bonuses',
    description: 'Receive additional rewards for high-quality submissions',
    icon: '⭐',
  },
  {
    title: 'Fee Discounts',
    description: 'Reduced platform fees based on token holdings',
    icon: '💸',
  },
]

export function Tokenomics() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            $FORGE Token Economics
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            A utility and governance token designed to align incentives and reward 
            active participation in the IdeaForge ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Token Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Token Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tokenDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {tokenDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Revenue Growth */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Revenue Growth
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#0ea5e9" name="Total Revenue" />
                  <Bar dataKey="royalties" fill="#22c55e" name="Creator Royalties" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Token Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Token Utility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
