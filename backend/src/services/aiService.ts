import OpenAI from 'openai'
import { config } from '@/config'
import { logger } from '@/utils/logger'
import { AIValidationResult } from '@/types'

export class AIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      organization: config.OPENAI_ORG_ID,
    })
  }

  async validateIdea(
    title: string,
    description: string,
    category: string,
    content?: string
  ): Promise<AIValidationResult> {
    try {
      const prompt = this.buildValidationPrompt(title, description, category, content)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI validator for intellectual property. Analyze ideas for originality, quality, market potential, and provide detailed scoring with reasoning.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })

      const result = this.parseAIResponse(response.choices[0]?.message?.content || '')
      
      logger.info('AI validation completed', {
        title,
        category,
        score: result.score,
        confidence: result.confidence
      })

      return result
    } catch (error) {
      logger.error('AI validation failed:', error)
      throw new Error('Failed to validate idea with AI')
    }
  }

  async generateMetadata(
    title: string,
    description: string,
    category: string,
    aiScore: number
  ): Promise<string> {
    try {
      const prompt = `Generate comprehensive metadata for an IP-NFT with the following details:
Title: ${title}
Description: ${description}
Category: ${category}
AI Score: ${aiScore}

Include relevant attributes, properties, and traits that would be valuable for an NFT marketplace.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at generating NFT metadata. Create detailed, accurate, and valuable metadata for intellectual property NFTs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      logger.error('Metadata generation failed:', error)
      throw new Error('Failed to generate metadata')
    }
  }

  async analyzeContent(content: string, contentType: string): Promise<{
    summary: string
    keywords: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    topics: string[]
  }> {
    try {
      const prompt = `Analyze the following ${contentType} content and provide:
1. A brief summary
2. Key keywords and phrases
3. Sentiment analysis (positive/neutral/negative)
4. Main topics and themes

Content: ${content}`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content analyst. Provide accurate analysis of text content including summary, keywords, sentiment, and topics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      })

      return this.parseContentAnalysis(response.choices[0]?.message?.content || '')
    } catch (error) {
      logger.error('Content analysis failed:', error)
      throw new Error('Failed to analyze content')
    }
  }

  private buildValidationPrompt(
    title: string,
    description: string,
    category: string,
    content?: string
  ): string {
    return `Please analyze this intellectual property submission and provide a comprehensive evaluation:

Title: ${title}
Description: ${description}
Category: ${category}
${content ? `Content: ${content}` : ''}

Please evaluate on the following criteria (0-100 scale):
1. Originality: How unique and novel is this idea?
2. Quality: How well-developed and thought-out is the concept?
3. Market Potential: How viable and commercially valuable is this idea?
4. Overall Score: Weighted average of the above factors

Provide your analysis in the following JSON format:
{
  "score": 85,
  "originality": 90,
  "quality": 80,
  "marketPotential": 85,
  "category": "${category}",
  "suggestions": ["suggestion1", "suggestion2"],
  "risks": ["risk1", "risk2"],
  "confidence": 0.9,
  "reasoning": "Detailed explanation of the scoring and analysis"
}`
  }

  private parseAIResponse(response: string): AIValidationResult {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        originality: Math.max(0, Math.min(100, parsed.originality || 0)),
        quality: Math.max(0, Math.min(100, parsed.quality || 0)),
        marketPotential: Math.max(0, Math.min(100, parsed.marketPotential || 0)),
        category: parsed.category || 'Unknown',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        reasoning: parsed.reasoning || 'No reasoning provided'
      }
    } catch (error) {
      logger.error('Failed to parse AI response:', error)
      
      // Fallback response
      return {
        score: 50,
        originality: 50,
        quality: 50,
        marketPotential: 50,
        category: 'Unknown',
        suggestions: ['Unable to analyze - manual review required'],
        risks: ['Analysis failed - requires human validation'],
        confidence: 0.1,
        reasoning: 'AI analysis failed, manual review required'
      }
    }
  }

  private parseContentAnalysis(response: string): {
    summary: string
    keywords: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    topics: string[]
  } {
    try {
      const lines = response.split('\n').filter(line => line.trim())
      
      const summary = lines.find(line => line.toLowerCase().includes('summary'))?.split(':')[1]?.trim() || 'No summary available'
      const keywords = lines.find(line => line.toLowerCase().includes('keyword'))?.split(':')[1]?.split(',').map(k => k.trim()) || []
      const sentiment = lines.find(line => line.toLowerCase().includes('sentiment'))?.split(':')[1]?.trim().toLowerCase() || 'neutral'
      const topics = lines.find(line => line.toLowerCase().includes('topic'))?.split(':')[1]?.split(',').map(t => t.trim()) || []

      return {
        summary,
        keywords,
        sentiment: ['positive', 'neutral', 'negative'].includes(sentiment) ? sentiment as any : 'neutral',
        topics
      }
    } catch (error) {
      logger.error('Failed to parse content analysis:', error)
      return {
        summary: 'Analysis failed',
        keywords: [],
        sentiment: 'neutral',
        topics: []
      }
    }
  }
}

export const aiService = new AIService()
