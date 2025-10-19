export interface AIValidationResult {
  originality: number
  quality: number
  feasibility: number
  marketPotential: number
  overallScore: number
  suggestions: string[]
  risks: string[]
  category: string
  confidence: number
}

export interface IdeaSubmission {
  title: string
  description: string
  category: string
  files?: File[]
}

class AIService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  }

  async validateIdea(idea: IdeaSubmission): Promise<AIValidationResult> {
    try {
      const response = await fetch(`${this.apiUrl}/api/ai/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          category: idea.category,
        }),
      })

      if (!response.ok) {
        throw new Error('AI validation failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('AI validation error:', error)
      throw new Error('Failed to validate idea with AI')
    }
  }

  async generateIdeaMetadata(idea: IdeaSubmission): Promise<{
    tags: string[]
    summary: string
    keyFeatures: string[]
    targetAudience: string[]
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/ai/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          category: idea.category,
        }),
      })

      if (!response.ok) {
        throw new Error('Metadata generation failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Metadata generation error:', error)
      throw new Error('Failed to generate idea metadata')
    }
  }

  async analyzeFile(file: File): Promise<{
    type: string
    size: number
    content: string
    extractedText?: string
    metadata?: any
  }> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.apiUrl}/api/ai/analyze-file`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('File analysis failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('File analysis error:', error)
      throw new Error('Failed to analyze file')
    }
  }

  async getSimilarIdeas(idea: IdeaSubmission): Promise<{
    similar: Array<{
      id: string
      title: string
      similarity: number
      category: string
    }>
    uniqueness: number
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/ai/similar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          category: idea.category,
        }),
      })

      if (!response.ok) {
        throw new Error('Similarity check failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Similarity check error:', error)
      throw new Error('Failed to check for similar ideas')
    }
  }

  async generateIdeaPrompt(idea: IdeaSubmission): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/api/ai/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          category: idea.category,
        }),
      })

      if (!response.ok) {
        throw new Error('Prompt generation failed')
      }

      const result = await response.json()
      return result.prompt
    } catch (error) {
      console.error('Prompt generation error:', error)
      throw new Error('Failed to generate idea prompt')
    }
  }

  async getValidationStatus(ideaId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    result?: AIValidationResult
    error?: string
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/ai/status/${ideaId}`)

      if (!response.ok) {
        throw new Error('Status check failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Status check error:', error)
      throw new Error('Failed to check validation status')
    }
  }
}

export const aiService = new AIService()
