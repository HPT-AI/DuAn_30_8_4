"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, ImageIcon, CheckCircle } from "lucide-react"
import ImageUploadGrid from "../components/image-upload-grid"
import { useRouter } from "next/navigation"
import { processReportDocument } from "../lib/document-processor"

export default function BCTCHomePage() {
  const [wordFile, setWordFile] = useState<File | null>(null)
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null])
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleWordFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type.includes("word") || file.name.endsWith(".docx") || file.name.endsWith(".doc"))) {
      setWordFile(file)
    }
  }

  const handleImageUpload = (index: number, file: File) => {
    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)
  }

  const canCreateReport = wordFile && images.every((img) => img !== null)

  const handleCreateReport = async () => {
    if (!canCreateReport) return

    setIsProcessing(true)

    try {
      // Generate unique document key
      const documentKey = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Process the document with images
      const processedDoc = await processReportDocument(
        wordFile!,
        images.filter((img): img is File => img !== null),
        documentKey,
      )

      console.log("[BCTC] Document processed successfully:", processedDoc.key)

      // Store document key for editor page
      sessionStorage.setItem("currentDocumentKey", processedDoc.key)

      // Navigate to editor
      router.push("/editor")
    } catch (error) {
      console.error("[BCTC] Error creating report:", error)
      alert("Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Hệ thống Báo cáo Thi công</h1>
          <p className="text-gray-300 text-lg">Tải lên file Word mẫu và 4 ảnh để tạo báo cáo hoàn chỉnh</p>
        </div>

        {/* Word File Upload */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              File Word Mẫu (8 trang)
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tải lên file Word mẫu 8 trang làm cơ sở cho báo cáo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
              <input
                type="file"
                accept=".doc,.docx"
                onChange={handleWordFileUpload}
                className="hidden"
                id="word-upload"
              />
              <label htmlFor="word-upload" className="cursor-pointer">
                {wordFile ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="w-6 h-6" />
                    <span>{wordFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                    <Upload className="w-8 h-8" />
                    <span>Click để tải lên file Word</span>
                  </div>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Grid */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />4 Ảnh Báo Cáo
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tải lên 4 ảnh sẽ được chèn vào trang 8 của báo cáo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadGrid images={images} onImageUpload={handleImageUpload} />
          </CardContent>
        </Card>

        {/* Create Report Button */}
        <div className="text-center">
          <Button
            onClick={handleCreateReport}
            disabled={!canCreateReport || isProcessing}
            className={`px-8 py-4 text-lg font-semibold transition-all duration-300 ${
              canCreateReport
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                : "bg-slate-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              "Tạo Báo Cáo"
            )}
          </Button>
          {!canCreateReport && (
            <p className="text-gray-400 mt-2 text-sm">Vui lòng tải lên file Word và đủ 4 ảnh để tiếp tục</p>
          )}
        </div>
      </div>
    </div>
  )
}
