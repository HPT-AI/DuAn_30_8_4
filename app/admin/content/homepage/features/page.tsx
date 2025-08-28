"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, Trash2, FileText, Package, Users } from "lucide-react"

export default function FeaturesPage() {
  const [featuresData, setFeaturesData] = useState({
    title: "Tính năng nổi bật",
    subtitle: "Hệ thống quản lý dự án xây dựng toàn diện với các công cụ chuyên nghiệp",
    features: [
      {
        id: 1,
        icon: "FileText",
        title: "Quản lý Dự án",
        description: "Tạo và quản lý nhiều dự án xây dựng, phân chia công việc và theo dõi tiến độ một cách khoa học.",
        link: "#",
      },
      {
        id: 2,
        icon: "Package",
        title: "Nhật ký Thi công",
        description: "Tạo báo cáo nhật ký thi công theo mẫu chuẩn Việt Nam với tính năng tự động hóa thông minh.",
        link: "#",
      },
      {
        id: 3,
        icon: "Users",
        title: "Quản lý Nhóm",
        description: "Phân quyền người dùng theo vai trò Admin, Manager, User với các chức năng phù hợp.",
        link: "#",
      },
    ],
  })

  const [isSaving, setIsSaving] = useState(false)

  const iconOptions = [
    { value: "FileText", label: "Tài liệu", icon: FileText },
    { value: "Package", label: "Gói", icon: Package },
    { value: "Users", label: "Người dùng", icon: Users },
  ]

  useEffect(() => {
    const saved = localStorage.getItem("homepage_features")
    if (saved) {
      setFeaturesData(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("homepage_features", JSON.stringify(featuresData))
      window.dispatchEvent(new CustomEvent("featuresUpdate", { detail: featuresData }))
      setTimeout(() => setIsSaving(false), 1000)
    } catch (error) {
      console.error("Error saving features data:", error)
      setIsSaving(false)
    }
  }

  const addFeature = () => {
    const newFeature = {
      id: Date.now(),
      icon: "FileText",
      title: "Tính năng mới",
      description: "Mô tả tính năng...",
      link: "#",
    }
    setFeaturesData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }))
  }

  const removeFeature = (id: number) => {
    setFeaturesData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }))
  }

  const updateFeature = (id: number, field: string, value: string) => {
    setFeaturesData((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Quản lý Tính năng nổi bật</h1>
        <p className="text-slate-400">Chỉnh sửa phần tính năng nổi bật của trang chủ</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Features Section</CardTitle>
          <CardDescription className="text-slate-400">Quản lý tiêu đề và danh sách tính năng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Title & Subtitle */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Tiêu đề chính
              </Label>
              <Input
                id="title"
                value={featuresData.title}
                onChange={(e) => setFeaturesData((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-white">
                Mô tả
              </Label>
              <Textarea
                id="subtitle"
                value={featuresData.subtitle}
                onChange={(e) => setFeaturesData((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 border-t border-slate-600 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Danh sách tính năng</h3>
              <Button
                onClick={addFeature}
                variant="outline"
                size="sm"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm tính năng
              </Button>
            </div>

            {featuresData.features.map((feature, index) => (
              <Card key={feature.id} className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">Tính năng {index + 1}</CardTitle>
                    <Button
                      onClick={() => removeFeature(feature.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Icon</Label>
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(feature.id, "icon", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Tiêu đề</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, "title", e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Mô tả</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, "description", e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Link</Label>
                    <Input
                      value={feature.link}
                      onChange={(e) => updateFeature(feature.id, "link", e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="URL hoặc #"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
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
