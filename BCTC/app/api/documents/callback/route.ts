import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[ONLYOFFICE Callback]", body)

    // Handle different callback statuses
    switch (body.status) {
      case 1: // Document is being edited
        console.log("Document is being edited")
        break
      case 2: // Document is ready for saving
        console.log("Document is ready for saving")
        if (body.url) {
          // Download and save the document
          await saveDocument(body.url, body.key)
        }
        break
      case 3: // Document saving error
        console.error("Document saving error")
        break
      case 4: // Document closed with no changes
        console.log("Document closed with no changes")
        break
      case 6: // Document is being edited, but the current document state is saved
        console.log("Document state saved")
        break
      case 7: // Error has occurred while force saving the document
        console.error("Force save error")
        break
    }

    return NextResponse.json({ error: 0 })
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ error: 1 }, { status: 500 })
  }
}

async function saveDocument(url: string, key: string) {
  try {
    // Download the document from ONLYOFFICE
    const response = await fetch(url)
    const documentBuffer = await response.arrayBuffer()

    // Save to your storage system
    // This could be file system, cloud storage, database, etc.
    console.log(`Saving document ${key}, size: ${documentBuffer.byteLength} bytes`)

    // Store in mock storage
    mockDocuments.set(key, documentBuffer)
  } catch (error) {
    console.error("Error saving document:", error)
    throw error
  }
}

// Mock document storage
const mockDocuments = new Map<string, ArrayBuffer>()
