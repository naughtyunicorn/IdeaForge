import { create as createIPFSClient } from 'ipfs-http-client'

export interface IPFSUploadResult {
  hash: string
  size: number
  url: string
  pinSize: number
  timestamp: number
}

export interface FileUpload {
  name: string
  type: string
  content: string // base64 encoded
  size: number
}

class IPFSService {
  private ipfs: any
  private gatewayUrl: string

  constructor() {
    this.gatewayUrl = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/'
    
    // Initialize IPFS client
    this.ipfs = createIPFSClient({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    })
  }

  async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      // Upload to IPFS
      const result = await this.ipfs.add(buffer, {
        pin: true,
        progress: (prog: number) => console.log(`Upload progress: ${prog}%`)
      })

      const hash = result.cid.toString()
      const url = `${this.gatewayUrl}${hash}`

      return {
        hash,
        size: file.size,
        url,
        pinSize: result.size,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('IPFS upload failed:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  async uploadJSON(metadata: any): Promise<IPFSUploadResult> {
    try {
      const jsonString = JSON.stringify(metadata, null, 2)
      const buffer = new TextEncoder().encode(jsonString)

      const result = await this.ipfs.add(buffer, {
        pin: true
      })

      const hash = result.cid.toString()
      const url = `${this.gatewayUrl}${hash}`

      return {
        hash,
        size: buffer.length,
        url,
        pinSize: result.size,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('IPFS JSON upload failed:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  async uploadMultipleFiles(files: File[]): Promise<IPFSUploadResult[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file))
      const results = await Promise.all(uploadPromises)
      
      console.log(`Uploaded ${files.length} files to IPFS`)
      return results
    } catch (error) {
      console.error('Multiple file upload failed:', error)
      throw new Error('Failed to upload multiple files to IPFS')
    }
  }

  getGatewayURL(hash: string): string {
    return `${this.gatewayUrl}${hash}`
  }

  async verifyHash(hash: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.gatewayUrl}${hash}`, {
        method: 'HEAD'
      })
      return response.ok
    } catch (error) {
      console.error('Hash verification failed:', error)
      return false
    }
  }

  async getFileInfo(hash: string): Promise<{
    size: number
    type: string
    exists: boolean
  }> {
    try {
      const response = await fetch(`${this.gatewayUrl}${hash}`)
      
      if (!response.ok) {
        return {
          size: 0,
          type: 'unknown',
          exists: false
        }
      }

      const contentLength = response.headers.get('content-length')
      const contentType = response.headers.get('content-type') || 'unknown'

      return {
        size: contentLength ? parseInt(contentLength) : 0,
        type: contentType,
        exists: true
      }
    } catch (error) {
      console.error('Failed to get file info:', error)
      return {
        size: 0,
        type: 'unknown',
        exists: false
      }
    }
  }
}

export const ipfsService = new IPFSService()
