import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params

    console.log(`Adding report pages for report ${reportId}`)

    // Call the document generation API with duplicate action
    const generateResponse = await fetch(`${request.nextUrl.origin}/api/construction-reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId,
        action: "duplicate",
      }),
    })

    const generateResult = await generateResponse.json()

    if (!generateResponse.ok) {
      throw new Error(generateResult.error || "Failed to generate duplicate pages")
    }

    return NextResponse.json({
      success: true,
      message: "Pages 7-8 duplicated successfully",
      result: generateResult,
    })
  } catch (error) {
    console.error("Error adding pages:", error)
    return NextResponse.json({ error: "Failed to add pages" }, { status: 500 })
  }
}
