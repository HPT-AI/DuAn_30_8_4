"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUpload {
  id: string
  file: File | null
  preview: string | null
  description: string
}

interface ImageUploadSectionProps {
  reportId: string
  onImagesUploaded: (images: { placeholderId: string; imageUrl: string }[]) => void
}

export function ImageUploadSection({ reportId, onImagesUploaded }: ImageUploadSectionProps) {
  const [images, setImages] = useState<ImageUpload[]>([
    { id: "img1", file: null, preview: null, description: "Ảnh hiện trạng công trình" },
    { id: "img2", file: null, preview: null, description: "Ảnh tiến độ thi công" },
    { id: "img3", file: null, preview: null, description: "Ảnh chất lượng công việc" },
    { id: "img4", file: null, preview: null, description: "Ảnh an toàn lao động" },
  ])
  const [isUploading, setIsUploading] = useState(false)

  const handleImageSelect = (index: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImages = [...images]
      newImages[index] = {
        ...newImages[index],
        file,
        preview: e.target?.result as string,
      }
      setImages(newImages)
    }
    reader.readAsDataURL(file)
  }

  const handleImageRemove = (index: number) => {
    const newImages = [...images]
    newImages[index] = {
      ...newImages[index],
      file: null,
      preview: null,
    }
    setImages(newImages)
  }

  const handleUploadImages = async () => {
    const imagesToUpload = images.filter((img) => img.file)
    if (imagesToUpload.length === 0) return

    setIsUploading(true)
    try {
      // Upload images and get URLs
      const uploadedImages = await Promise.all(
        imagesToUpload.map(async (img) => {
          // In a real implementation, upload to your storage service
          // For now, we'll use a placeholder URL
          const imageUrl = URL.createObjectURL(img.file!)
          return {
            placeholderId: img.id,
            imageUrl,
          }
        }),
      )

      // Call the document generation API to insert images
      const response = await fetch("/api/construction-reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          action: "insert-images",
          images: uploadedImages,
        }),
      })

      if (response.ok) {
        onImagesUploaded(uploadedImages)
      }
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Tải lên hình ảnh báo cáo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {images.map((image, index) => (
            <div key={image.id} className="border border-slate-600 rounded-lg p-4">
              <p className="text-sm text-slate-300 mb-2">{image.description}</p>
              {image.preview ? (
                <div className="relative">
                  <img
                    src={image.preview || "/placeholder.svg"}
                    alt={image.description}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1"
                    onClick={() => handleImageRemove(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded cursor-pointer hover:border-cyan-500 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-400">Chọn ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageSelect(index, file)
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleUploadImages}
          disabled={isUploading || images.every((img) => !img.file)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang chèn ảnh vào báo cáo...</span>
            </div>
          ) : (
            "Chèn ảnh vào báo cáo"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
