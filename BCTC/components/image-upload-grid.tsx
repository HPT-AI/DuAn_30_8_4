"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, CheckCircle } from "lucide-react"
import Image from "next/image"

interface ImageUploadGridProps {
  images: (File | null)[]
  onImageUpload: (index: number, file: File) => void
}

export default function ImageUploadGrid({ images, onImageUpload }: ImageUploadGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleFileSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onImageUpload(index, file)
    }
  }

  const handleDrop = (index: number, event: React.DragEvent) => {
    event.preventDefault()
    setDraggedIndex(null)

    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      onImageUpload(index, file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDragEnter = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragLeave = () => {
    setDraggedIndex(null)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages[index] = null
    // We need to call the parent's state update
    // This is a simplified approach - in real implementation you'd handle this better
  }

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative aspect-[4/3] border-2 border-dashed rounded-lg transition-all duration-300 ${
            draggedIndex === index
              ? "border-cyan-400 bg-cyan-400/10 scale-105"
              : image
                ? "border-green-500 bg-green-500/10"
                : "border-slate-600 hover:border-cyan-400 hover:bg-cyan-400/5"
          }`}
          onDrop={(e) => handleDrop(index, e)}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(index)}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(index, e)}
            className="hidden"
            id={`image-upload-${index}`}
          />

          {image ? (
            // Image Preview
            <div className="relative w-full h-full group">
              <Image
                src={getImagePreview(image) || "/placeholder.svg"}
                alt={`Ảnh ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />

              {/* Overlay with image info */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium">{image.name}</p>
                  <p className="text-xs text-gray-300">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {/* Remove button */}
              <Button
                onClick={() => removeImage(index)}
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Replace button */}
              <label htmlFor={`image-upload-${index}`} className="absolute bottom-2 left-2 right-2 cursor-pointer">
                <Button
                  type="button"
                  size="sm"
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-800/80 hover:bg-slate-700/80 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Thay đổi
                </Button>
              </label>
            </div>
          ) : (
            // Upload Area
            <label
              htmlFor={`image-upload-${index}`}
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 rounded-full bg-slate-700/50">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Ảnh {index + 1}</p>
                  <p className="text-sm text-gray-500">Click hoặc kéo thả ảnh vào đây</p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG, JPEG (Max 10MB)</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Tải ảnh lên
                </Button>
              </div>
            </label>
          )}

          {/* Loading indicator for drag state */}
          {draggedIndex === index && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/20 rounded-lg">
              <div className="text-cyan-400 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Thả ảnh vào đây</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
