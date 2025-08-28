import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params
    const { pages } = await request.json()

    console.log(`Locking pages ${pages.join(", ")} for report ${reportId}`)

    // Example Document Builder script for locking pages
    const builderScript = `
      builder.CreateFile("docx");
      var oDocument = Api.GetDocument();
      
      ${pages
        .map(
          (page: number) => `
        // Lock page ${page}
        var oRange${page} = oDocument.GetRange(${page - 1}, ${page - 1});
        oRange${page}.Select();
        
        // Create content control with lock
        var oContentControl = Api.CreateContentControl(1, {
          "lock": 3, // Cannot delete or edit content
          "tag": "locked-page-${page}"
        });
        
        // Wrap selected content in content control
        oContentControl.AddElement(oRange${page});
      `,
        )
        .join("\n")}
      
      builder.SaveFile("docx", "report-locked.docx");
      builder.CloseFile();
    `

    // In a real implementation, send this to ONLYOFFICE Document Builder

    return NextResponse.json({
      success: true,
      lockedPages: pages,
      message: `Pages ${pages.join(", ")} have been locked`,
    })
  } catch (error) {
    console.error("Error locking pages:", error)
    return NextResponse.json({ error: "Failed to lock pages" }, { status: 500 })
  }
}
