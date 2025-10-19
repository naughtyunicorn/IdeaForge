import { create as createIPFSClient, Options as IPFSClientOptions, IPFSHTTPClient } from 'ipfs-http-client'
import PinataSDK from '@pinata/sdk'
import { config } from '@/config'
import { logger } from '@/utils/logger'
import { IPFSUploadResult, FileUpload } from '@/types'

export class IPFSService {
  private pinata: any
  private ipfs: any

  constructor() {
    this.pinata = new (PinataSDK as any)({
      pinataApiKey: config.PINATA_API_KEY,
      pinataSecretApiKey: config.PINATA_SECRET_KEY,
    })

    this.ipfs = createIPFSClient({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    })
  }

  async uploadFile(
    file: Buffer,
    filename: string,
    contentType: string
  ): Promise<IPFSUploadResult> {
    try {
      // Upload to Pinata for reliable pinning
      const pinataResult = await this.pinata.upload.fileToIPFS({
        file: file,
        pinataMetadata: {
          name: filename,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      })

      const hash = pinataResult.IpfsHash
      const url = `${config.IPFS_GATEWAY_URL}${hash}`

      logger.info('File uploaded to IPFS', {
        filename,
        hash,
        size: file.length
      })

      return {
        hash,
        size: file.length,
        url,
        pinSize: pinataResult.PinSize,
        timestamp: Date.now()
      }
    } catch (error) {
      logger.error('IPFS upload failed:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  async uploadJSON(metadata: any): Promise<IPFSUploadResult> {
    try {
      const jsonString = JSON.stringify(metadata, null, 2)
      const buffer = Buffer.from(jsonString, 'utf-8')

      const pinataResult = await this.pinata.upload.jsonToIPFS({
        pinataContent: metadata,
        pinataMetadata: {
          name: `metadata-${Date.now()}.json`,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      })

      const hash = pinataResult.IpfsHash
      const url = `${config.IPFS_GATEWAY_URL}${hash}`

      logger.info('JSON metadata uploaded to IPFS', {
        hash,
        size: buffer.length
      })

      return {
        hash,
        size: buffer.length,
        url,
        pinSize: pinataResult.PinSize,
        timestamp: Date.now()
      }
    } catch (error) {
      logger.error('IPFS JSON upload failed:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  async uploadMultipleFiles(files: { name: string; type: string; content: string }[]): Promise<IPFSUploadResult[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const buffer = Buffer.from(file.content, 'base64')
        return this.uploadFile(buffer, file.name, file.type)
      })

      const results = await Promise.all(uploadPromises)
      
      logger.info('Multiple files uploaded to IPFS', {
        count: files.length,
        hashes: results.map(r => r.hash)
      })

      return results
    } catch (error) {
      logger.error('Multiple file upload failed:', error)
      throw new Error('Failed to upload multiple files to IPFS')
    }
  }

  async pinHash(hash: string): Promise<boolean> {
    try {
      await this.pinata.pin.hashToIPFS({
        hashToPin: hash,
        pinataMetadata: {
          name: `pinned-${hash}`,
        },
      })

      logger.info('Hash pinned to IPFS', { hash })
      return true
    } catch (error) {
      logger.error('IPFS pin failed:', error)
      return false
    }
  }

  async unpinHash(hash: string): Promise<boolean> {
    try {
      await this.pinata.unpin.hashFromIPFS({
        hashToUnpin: hash,
      })

      logger.info('Hash unpinned from IPFS', { hash })
      return true
    } catch (error) {
      logger.error('IPFS unpin failed:', error)
      return false
    }
  }

  async getFileInfo(hash: string): Promise<{
    size: number
    type: string
    pinned: boolean
  }> {
    try {
      const response = await fetch(`${config.IPFS_GATEWAY_URL}${hash}`)
      
      if (!response.ok) {
        throw new Error('File not found')
      }

      const contentLength = response.headers.get('content-length')
      const contentType = response.headers.get('content-type') || 'unknown'

      return {
        size: contentLength ? parseInt(contentLength) : 0,
        type: contentType,
        pinned: true // Assume pinned if accessible
      }
    } catch (error) {
      logger.error('Failed to get file info:', error)
      throw new Error('Failed to retrieve file information')
    }
  }

  async verifyHash(hash: string): Promise<boolean> {
    try {
      const response = await fetch(`${config.IPFS_GATEWAY_URL}${hash}`, {
        method: 'HEAD'
      })
      
      return response.ok
    } catch (error) {
      logger.error('Hash verification failed:', error)
      return false
    }
  }

  async createDirectory(files: { name: string; content: Buffer; type: string }[]): Promise<string> {
    try {
      // Create a directory structure in IPFS
      const directory = files.map(file => ({
        path: file.name,
        content: file.content
      }))

      const result = await this.ipfs.add(directory, {
        wrapWithDirectory: true
      })

      const hash = result.cid.toString()
      const url = `${config.IPFS_GATEWAY_URL}${hash}`

      logger.info('Directory created in IPFS', {
        hash,
        fileCount: files.length
      })

      return hash
    } catch (error) {
      logger.error('Directory creation failed:', error)
      throw new Error('Failed to create directory in IPFS')
    }
  }

  async getGatewayURL(hash: string): Promise<string> {
    return `${config.IPFS_GATEWAY_URL}${hash}`
  }

  async isPinned(hash: string): Promise<boolean> {
    try {
      const response = await this.pinata.data.pinList({
        hashContains: hash,
        status: 'pinned'
      })

      return response.rows.length > 0
    } catch (error) {
      logger.error('Pin status check failed:', error)
      return false
    }
  }
}

export const ipfsService = new IPFSService()
