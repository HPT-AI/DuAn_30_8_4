"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Save, FileText, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import OnlyOfficeEditor from "../../components/onlyoffice-editor"

export default function EditorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [documentReady, setDocumentReady] = useState(false)
  const [documentUrl, setDocumentUrl] = useState<string>("")
  const [documentKey, setDocumentKey] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Simulate document processing and preparation
    const prepareDocument = async () => {
      setIsLoading(true)

      try {
        // In a real implementation, this would:
        // 1. Process the uploaded Word file
        // 2. Insert the 4 images into page 8
        // 3. Duplicate pages 7-8 to create pages 9-10
        // 4. Generate a document URL for ONLYOFFICE

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Generate mock document URL and key
        const mockDocumentKey = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const mockDocumentUrl = `/api/documents/${mockDocumentKey}`

        setDocumentKey(mockDocumentKey)
        setDocumentUrl(mockDocumentUrl)
        setIsLoading(false)
      } catch (error) {
        console.error("Error preparing document:", error)
        setIsLoading(false)
      }
    }

    prepareDocument()
  }, [])

  const handleDocumentReady = () => {
    setDocumentReady(true)
  }

  const handleSaveDocument = () => {
    // Trigger save in ONLYOFFICE
    if (window.DocEditor && window.DocEditor.instances[documentKey]) {
      window.DocEditor.instances[documentKey].processSaveResult(true)
    }
  }

  const handleDownloadDocument = () => {
    // Trigger download in ONLYOFFICE
    if (window.DocEditor && window.DocEditor.instances[documentKey]) {
      window.DocEditor.instances[documentKey].downloadAs("Bao_cao_thi_cong.docx")
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              Đang xử lý báo cáo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">Đang thực hiện các bước:</p>
              <ul className="text-xs space-y-1 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Đọc file Word gốc (8 trang)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Chèn 4 ảnh vào trang 8
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  Sao chép trang 7-8 thành trang 9-10
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Khởi tạo trình soạn thảo
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h1 className="text-white font-semibold">Báo cáo Thi công (10 trang)</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSaveDocument}
              disabled={!documentReady}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
            <Button
              onClick={handleDownloadDocument}
              disabled={!documentReady}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto h-full">
          <Card className="h-full bg-white border-slate-300 shadow-2xl">
            <CardContent className="p-0 h-full">
              {documentUrl && documentKey ? (
                <OnlyOfficeEditor
                  documentUrl={documentUrl}
                  documentKey={documentKey}
                  onDocumentReady={handleDocumentReady}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Đang tải trình soạn thảo...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Trạng thái: {documentReady ? "Sẵn sàng" : "Đang tải..."}</span>
            <span>Trang: 10</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${documentReady ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`}
            ></div>
            <span>{documentReady ? "Đã kết nối" : "Đang kết nối..."}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
