'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, Image, Video, Music, Code, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  { value: 'technology', label: 'Technology', icon: Code },
  { value: 'art', label: 'Art & Design', icon: Image },
  { value: 'music', label: 'Music & Audio', icon: Music },
  { value: 'video', label: 'Video & Media', icon: Video },
  { value: 'business', label: 'Business', icon: FileText },
  { value: 'science', label: 'Science', icon: Zap },
]

export default function SubmitPage() {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    files: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    setIsSubmitting(true)
    try {
      // TODO: Implement idea submission logic
      console.log('Submitting idea:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to submit an idea
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Submit Your Idea
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your creative ideas into tokenized intellectual property with AI validation and automated royalty distribution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
              <CardDescription>
                Provide detailed information about your idea for AI validation and potential minting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title for your idea"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your idea in detail. Include the problem it solves, how it works, and its potential impact."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-2">
                            <category.icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Supporting Files</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload files
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PDF, DOC, images, videos, or code files
                        </span>
                      </Label>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        title="Upload supporting files"
                        placeholder="Choose files to upload"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.js,.ts,.py,.java,.cpp,.c"
                      />
                    </div>
                  </div>
                  
                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Uploaded Files:</h4>
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">AI Validation Process</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your idea will be analyzed for originality and quality</li>
                    <li>• AI will assign a credibility score (0-100)</li>
                    <li>• Validators will review and approve/reject your submission</li>
                    <li>• Approved ideas will be automatically minted as IP-NFTs</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-forge"
                  disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Submit Idea</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
