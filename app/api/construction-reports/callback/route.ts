import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { status, key, url, users } = body

    console.log("ONLYOFFICE callback received:", { status, key, url, users })

    // Handle different callback statuses
    switch (status) {
      case 1: // Document is being edited
        console.log("Document is being edited")
        break
      case 2: // Document is ready for saving
        console.log("Document is ready for saving")
        if (url) {
          // Download and save the document
          await saveDocument(key, url)
        }
        break
      case 3: // Document saving error
        console.log("Document saving error")
        break
      case 4: // Document closed with no changes
        console.log("Document closed with no changes")
        break
      case 6: // Document is being edited, but the current document state is saved
        console.log("Document state saved")
        if (url) {
          await saveDocument(key, url)
        }
        break
      case 7: // Error has occurred while force saving the document
        console.log("Force save error")
        break
    }

    return NextResponse.json({ error: 0 })
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ error: 1 })
  }
}

async function saveDocument(key: string, url: string) {
  try {
    // Download the document from ONLYOFFICE
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    // In a real application, save to your storage system
    console.log(`Saving document with key: ${key}, size: ${buffer.byteLength} bytes`)

    // You could save to file system, database, or cloud storage here
    // For example:
    // await fs.writeFile(`./documents/${key}.docx`, Buffer.from(buffer))
  } catch (error) {
    console.error("Error saving document:", error)
    throw error
  }
}
