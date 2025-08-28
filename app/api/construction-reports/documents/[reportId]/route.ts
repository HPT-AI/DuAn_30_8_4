import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params

    // In a real application, you would fetch the document from your storage
    // For now, we'll serve a template document
    const templatePath = path.join(process.cwd(), "public", "templates", "construction-report-template.docx")

    try {
      const fileBuffer = await fs.readFile(templatePath)

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="report-${reportId}.docx"`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      })
    } catch (error) {
      // If template doesn't exist, create a basic document
      return NextResponse.json({ error: "Document template not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error serving document:", error)
    return NextResponse.json({ error: "Failed to serve document" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params
    const body = await request.json()

    // Handle document updates
    // In a real application, you would save the document to your storage
    console.log(`Updating document for report ${reportId}:`, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}
