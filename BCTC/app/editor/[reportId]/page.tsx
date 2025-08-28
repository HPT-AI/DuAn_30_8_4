"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OnlyOfficeEditor from "@/components/onlyoffice-editor"
import { ArrowLeft, Save, Plus, Lock } from "lucide-react"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string

  const [docKey, setDocKey] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDocumentReady, setIsDocumentReady] = useState(false)

  useEffect(() => {
    initializeDocument()
  }, [reportId])

  const initializeDocument = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initialize",
          reportId,
          templateFile: "template-8-pages.docx",
        }),
      })

      const result = await response.json()
      if (result.success) {
        setDocKey(result.docKey)
        console.log("[v0] Document initialized with key:", result.docKey)
      }
    } catch (error) {
      console.error("[v0] Failed to initialize document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsertImages = async () => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "insert_images",
          reportId,
          images: ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"],
        }),
      })

      const result = await response.json()
      if (result.success) {
        console.log("[v0] Images inserted successfully")
      }
    } catch (error) {
      console.error("[v0] Failed to insert images:", error)
    }
  }

  const handleDuplicatePages = async () => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "duplicate_pages",
          reportId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        console.log("[v0] Pages duplicated successfully")
      }
    } catch (error) {
      console.error("[v0] Failed to duplicate pages:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Đang khởi tạo báo cáo...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold text-white">Soạn thảo báo cáo #{reportId}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleInsertImages}
              disabled={!isDocumentReady}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Chèn ảnh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicatePages}
              disabled={!isDocumentReady}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm báo cáo
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!isDocumentReady}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Lock className="w-4 h-4 mr-2" />
              Khóa trang
            </Button>
            <Button size="sm" disabled={!isDocumentReady} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
          </div>
        </div>

        {/* Editor */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Trình soạn thảo ONLYOFFICE</CardTitle>
          </CardHeader>
          <CardContent>
            {docKey ? (
              <OnlyOfficeEditor
                docKey={docKey}
                onDocumentReady={() => {
                  setIsDocumentReady(true)
                  console.log("[v0] Document ready for editing")
                }}
                onError={(error) => {
                  console.error("[v0] Editor error:", error)
                }}
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-slate-400">
                Đang tải trình soạn thảo...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
