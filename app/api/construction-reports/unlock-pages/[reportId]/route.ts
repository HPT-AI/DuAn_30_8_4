import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const { reportId } = params
    const { pages } = await request.json()

    console.log(`Unlocking pages ${pages.join(", ")} for report ${reportId}`)

    // Example Document Builder script for unlocking pages
    const builderScript = `
      builder.CreateFile("docx");
      var oDocument = Api.GetDocument();
      
      ${pages
        .map(
          (page: number) => `
        // Find and remove content control for page ${page}
        var aContentControls = oDocument.GetAllContentControls();
        for (var i = 0; i < aContentControls.length; i++) {
          var oCC = aContentControls[i];
          if (oCC.GetTag() === "locked-page-${page}") {
            // Remove content control but keep content
            oCC.SetLock(0); // Unlock
            oCC.Delete(false); // Delete control but keep content
            break;
          }
        }
      `,
        )
        .join("\n")}
      
      builder.SaveFile("docx", "report-unlocked.docx");
      builder.CloseFile();
    `

    // In a real implementation, send this to ONLYOFFICE Document Builder

    return NextResponse.json({
      success: true,
      unlockedPages: pages,
      message: `Pages ${pages.join(", ")} have been unlocked`,
    })
  } catch (error) {
    console.error("Error unlocking pages:", error)
    return NextResponse.json({ error: "Failed to unlock pages" }, { status: 500 })
  }
}
