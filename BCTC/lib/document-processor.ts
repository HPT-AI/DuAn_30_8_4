// Document processing utilities for BCTC report system
import { Document, Packer, Paragraph, ImageRun, PageBreak, TextRun } from "docx"

export interface ProcessedDocument {
  buffer: ArrayBuffer
  url: string
  key: string
}

export interface DocumentProcessingOptions {
  wordFile: File
  images: File[]
  documentKey: string
}

export class DocumentProcessor {
  private static instance: DocumentProcessor
  private documents: Map<string, ArrayBuffer> = new Map()

  static getInstance(): DocumentProcessor {
    if (!DocumentProcessor.instance) {
      DocumentProcessor.instance = new DocumentProcessor()
    }
    return DocumentProcessor.instance
  }

  /**
   * Main processing function that handles the complete document workflow
   */
  async processDocument(options: DocumentProcessingOptions): Promise<ProcessedDocument> {
    const { wordFile, images, documentKey } = options

    try {
      console.log("[DocumentProcessor] Starting document processing...")

      // Step 1: Read the original Word file (8 pages)
      const originalDocument = await this.readWordFile(wordFile)

      // Step 2: Extract pages 1-6 (keep unchanged)
      const pages1to6 = await this.extractPages(originalDocument, 1, 6)

      // Step 3: Extract page 7 (original)
      const page7Original = await this.extractPages(originalDocument, 7, 7)

      // Step 4: Extract page 8 and insert images
      const page8WithImages = await this.insertImagesIntoPage8(originalDocument, images)

      // Step 5: Create copies of page 7 and 8 for pages 9 and 10
      const page9Copy = await this.copyPage(page7Original)
      const page10Copy = await this.copyPage(originalDocument, 8)

      // Step 6: Combine all pages into final 10-page document
      const finalDocument = await this.combinePages([pages1to6, page7Original, page8WithImages, page9Copy, page10Copy])

      // Step 7: Generate document buffer and URL
      const buffer = await Packer.toBuffer(finalDocument)
      const url = await this.storeDocument(documentKey, buffer)

      console.log("[DocumentProcessor] Document processing completed successfully")

      return {
        buffer,
        url,
        key: documentKey,
      }
    } catch (error) {
      console.error("[DocumentProcessor] Error processing document:", error)
      throw new Error(`Document processing failed: ${error.message}`)
    }
  }

  /**
   * Read and parse Word file
   */
  private async readWordFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          // In a real implementation, you would use a library like mammoth.js
          // to properly parse the Word document structure
          resolve(arrayBuffer)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Extract specific pages from document
   */
  private async extractPages(document: any, startPage: number, endPage: number): Promise<any> {
    // This is a simplified implementation
    // In reality, you would need to parse the document structure
    // and extract the specific pages with their content and formatting
    console.log(`[DocumentProcessor] Extracting pages ${startPage}-${endPage}`)

    // Mock implementation - return placeholder content
    return this.createMockPages(startPage, endPage)
  }

  /**
   * Insert images into page 8 at predefined positions
   */
  private async insertImagesIntoPage8(document: any, images: File[]): Promise<any> {
    console.log("[DocumentProcessor] Inserting images into page 8")

    try {
      // Convert images to base64 for insertion
      const imageBuffers = await Promise.all(
        images.map(async (image) => {
          const buffer = await image.arrayBuffer()
          return {
            buffer: new Uint8Array(buffer),
            type: image.type,
            name: image.name,
          }
        }),
      )

      // Create page 8 with images inserted at predefined positions
      const page8 = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "TRANG 8 - BÁO CÁO THI CÔNG VỚI HÌNH ẢNH",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
              new Paragraph({ children: [] }), // Empty line

              // Insert images in a 2x2 grid layout
              new Paragraph({
                children: [new TextRun({ text: "Hình ảnh 1:", bold: true })],
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers[0]?.buffer || new Uint8Array(),
                    transformation: {
                      width: 300,
                      height: 200,
                    },
                  }),
                ],
              }),

              new Paragraph({
                children: [new TextRun({ text: "Hình ảnh 2:", bold: true })],
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers[1]?.buffer || new Uint8Array(),
                    transformation: {
                      width: 300,
                      height: 200,
                    },
                  }),
                ],
              }),

              new Paragraph({
                children: [new TextRun({ text: "Hình ảnh 3:", bold: true })],
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers[2]?.buffer || new Uint8Array(),
                    transformation: {
                      width: 300,
                      height: 200,
                    },
                  }),
                ],
              }),

              new Paragraph({
                children: [new TextRun({ text: "Hình ảnh 4:", bold: true })],
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers[3]?.buffer || new Uint8Array(),
                    transformation: {
                      width: 300,
                      height: 200,
                    },
                  }),
                ],
              }),
            ],
          },
        ],
      })

      return page8
    } catch (error) {
      console.error("[DocumentProcessor] Error inserting images:", error)
      throw error
    }
  }

  /**
   * Create a copy of a specific page
   */
  private async copyPage(document: any, pageNumber?: number): Promise<any> {
    console.log(`[DocumentProcessor] Creating copy of page ${pageNumber || "unknown"}`)

    // In a real implementation, this would deep copy the page structure
    // including all formatting, styles, and content
    return this.createMockPage(pageNumber || 9)
  }

  /**
   * Combine multiple pages into a single document
   */
  private async combinePages(pages: any[]): Promise<Document> {
    console.log("[DocumentProcessor] Combining pages into final document")

    // Create a new document with all pages
    const sections = pages.map((page, index) => ({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `TRANG ${index + 1}`,
              bold: true,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [] }), // Empty line
        new Paragraph({
          children: [
            new TextRun({
              text: `Nội dung trang ${index + 1} - Đây là nội dung mẫu cho báo cáo thi công.`,
              size: 22,
            }),
          ],
        }),
        ...(index < pages.length - 1 ? [new Paragraph({ children: [new PageBreak()] })] : []),
      ],
    }))

    return new Document({
      sections: sections,
    })
  }

  /**
   * Store document and return URL
   */
  private async storeDocument(key: string, buffer: ArrayBuffer): Promise<string> {
    // Store in memory (in production, use proper storage)
    this.documents.set(key, buffer)

    // Return URL for ONLYOFFICE to access
    return `/api/documents/${key}`
  }

  /**
   * Retrieve stored document
   */
  getDocument(key: string): ArrayBuffer | undefined {
    return this.documents.get(key)
  }

  /**
   * Helper method to create mock pages for demonstration
   */
  private createMockPages(startPage: number, endPage: number): any {
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(this.createMockPage(i))
    }
    return pages
  }

  /**
   * Helper method to create a mock page
   */
  private createMockPage(pageNumber: number): any {
    return {
      pageNumber,
      content: `Mock content for page ${pageNumber}`,
      formatting: "default",
    }
  }
}

// Export singleton instance
export const documentProcessor = DocumentProcessor.getInstance()

// Utility functions for document processing
export async function processReportDocument(
  wordFile: File,
  images: File[],
  documentKey: string,
): Promise<ProcessedDocument> {
  return documentProcessor.processDocument({
    wordFile,
    images,
    documentKey,
  })
}

export function getProcessedDocument(key: string): ArrayBuffer | undefined {
  return documentProcessor.getDocument(key)
}
