"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Upload, Play } from "lucide-react"

export default function HeroSectionPage() {
  const [heroData, setHeroData] = useState({
    title: "Hệ thống Quản lý Nhật ký Thi công Chuyên nghiệp",
    subtitle:
      "Giải pháp số hóa toàn diện cho việc quản lý dự án xây dựng, từ lập báo cáo đến theo dõi tiến độ thi công theo chuẩn Việt Nam.",
    primaryButton: "Bắt đầu miễn phí",
    secondaryButton: "Xem demo",
    videoUrl: "",
    videoTitle: "Video giới thiệu hệ thống",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load saved data from localStorage
    const saved = localStorage.getItem("homepage_hero")
    if (saved) {
      setHeroData(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("homepage_hero", JSON.stringify(heroData))
      // Dispatch event to update homepage
      window.dispatchEvent(new CustomEvent("heroUpdate", { detail: heroData }))
      setTimeout(() => setIsSaving(false), 1000)
    } catch (error) {
      console.error("Error saving hero data:", error)
      setIsSaving(false)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setHeroData((prev) => ({ ...prev, videoUrl: url }))
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Quản lý Hero Section</h1>
        <p className="text-slate-400">Chỉnh sửa nội dung phần giới thiệu chính của trang chủ</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Hero Section Content</CardTitle>
          <CardDescription className="text-slate-400">
            Quản lý tiêu đề, mô tả, nút CTA và video giới thiệu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Tiêu đề chính
            </Label>
            <Input
              id="title"
              value={heroData.title}
              onChange={(e) => setHeroData((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Nhập tiêu đề chính..."
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-white">
              Mô tả
            </Label>
            <Textarea
              id="subtitle"
              value={heroData.subtitle}
              onChange={(e) => setHeroData((prev) => ({ ...prev, subtitle: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              placeholder="Nhập mô tả..."
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryButton" className="text-white">
                Nút chính
              </Label>
              <Input
                id="primaryButton"
                value={heroData.primaryButton}
                onChange={(e) => setHeroData((prev) => ({ ...prev, primaryButton: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Text nút chính..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryButton" className="text-white">
                Nút phụ
              </Label>
              <Input
                id="secondaryButton"
                value={heroData.secondaryButton}
                onChange={(e) => setHeroData((prev) => ({ ...prev, secondaryButton: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Text nút phụ..."
              />
            </div>
          </div>

          {/* Video Section */}
          <div className="space-y-4 border-t border-slate-600 pt-6">
            <h3 className="text-lg font-semibold text-white">Video giới thiệu</h3>

            <div className="space-y-2">
              <Label htmlFor="videoTitle" className="text-white">
                Tiêu đề video
              </Label>
              <Input
                id="videoTitle"
                value={heroData.videoTitle}
                onChange={(e) => setHeroData((prev) => ({ ...prev, videoTitle: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Tiêu đề video..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl" className="text-white">
                URL Video
              </Label>
              <Input
                id="videoUrl"
                value={heroData.videoUrl}
                onChange={(e) => setHeroData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Hoặc tải video lên</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  onClick={() => document.getElementById("videoFile")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn file video
                </Button>
                <input id="videoFile" type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </div>
            </div>

            {/* Video Preview */}
            {heroData.videoUrl && (
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="h-4 w-4 text-cyan-400" />
                  <span className="text-white text-sm">Preview</span>
                </div>
                <div className="aspect-video bg-slate-600 rounded flex items-center justify-center">
                  <span className="text-slate-400">{heroData.videoTitle}</span>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-slate-600">
            <Button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
