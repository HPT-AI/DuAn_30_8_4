import { type NextRequest, NextResponse } from "next/server"
import { getProcessedDocument } from "../../../../lib/document-processor"

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  const { key } = params

  try {
    // Retrieve the processed document from storage
    const documentBuffer = getProcessedDocument(key)

    if (!documentBuffer) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return new NextResponse(documentBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="bao_cao_thi_cong_${key}.docx"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error serving document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
