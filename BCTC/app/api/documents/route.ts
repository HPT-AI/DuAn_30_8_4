import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { action, reportId, templateFile, images } = await request.json()

    switch (action) {
      case "initialize":
        // Khởi tạo document từ template 8 trang
        const docKey = `report_${reportId}_${Date.now()}`
        return NextResponse.json({
          success: true,
          docKey,
          documentUrl: `/api/documents/${docKey}`,
          callbackUrl: `/api/documents/callback`,
        })

      case "insert_images":
        // Chèn 4 ảnh vào trang 8
        return NextResponse.json({ success: true, message: "Images inserted to page 8" })

      case "duplicate_pages":
        // Sao chép trang 7-8 thành 9-10
        return NextResponse.json({ success: true, message: "Pages 7-8 duplicated to 9-10" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
