import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { docKey: string } }) {
  const { docKey } = params

  const config = {
    document: {
      fileType: "docx",
      key: docKey,
      title: `Báo cáo thi công - ${docKey}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/documents/${docKey}/download`,
    },
    documentType: "word",
    editorConfig: {
      mode: "edit",
      lang: "vi",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/documents/callback`,
      user: {
        id: "user1",
        name: "Construction Manager",
      },
    },
    width: "100%",
    height: "600px",
  }

  return NextResponse.json(config)
}
