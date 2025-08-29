"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Save, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function BrandingPage() {
  const { t, isHydrated } = useLanguage()
  const [logoUrl, setLogoUrl] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thi%E1%BA%BFt%20k%E1%BA%BF%20ch%C6%B0a%20c%C3%B3%20t%C3%AAn-2hrKzlEBNUsowunq4hgLzKZdV6sHWg.png",
  )
  const [brandText, setBrandText] = useState("HDT AI")
  const [previewLogo, setPreviewLogo] = useState("")
  const [previewText, setPreviewText] = useState("")

  useEffect(() => {
    // Load saved branding from localStorage
    const savedLogo = localStorage.getItem("admin_logo_url")
    const savedText = localStorage.getItem("admin_brand_text")

    if (savedLogo) {
      setLogoUrl(savedLogo)
      setPreviewLogo(savedLogo)
    }
    if (savedText) {
      setBrandText(savedText)
      setPreviewText(savedText)
    }
  }, [])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewLogo(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Save to localStorage
    if (previewLogo) {
      localStorage.setItem("admin_logo_url", previewLogo)
      setLogoUrl(previewLogo)
    }
    if (previewText) {
      localStorage.setItem("admin_brand_text", previewText)
      setBrandText(previewText)
    }

    // Dispatch event to update homepage
    window.dispatchEvent(
      new CustomEvent("brandingUpdated", {
        detail: { logoUrl: previewLogo || logoUrl, brandText: previewText || brandText },
      }),
    )

    alert("Branding đã được cập nhật thành công!")
  }

  const handleReset = () => {
    localStorage.removeItem("admin_logo_url")
    localStorage.removeItem("admin_brand_text")
    setLogoUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thi%E1%BA%BFt%20k%E1%BA%BF%20ch%C6%B0a%20c%C3%B3%20t%C3%AAn-2hrKzlEBNUsowunq4hgLzKZdV6sHWg.png",
    )
    setBrandText("HDT AI")
    setPreviewLogo("")
    setPreviewText("")

    window.dispatchEvent(
      new CustomEvent("brandingUpdated", {
        detail: {
          logoUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thi%E1%BA%BFt%20k%E1%BA%BF%20ch%C6%B0a%20c%C3%B3%20t%C3%AAn-2hrKzlEBNUsowunq4hgLzKZdV6sHWg.png",
          brandText: "HDT AI",
        },
      }),
    )

    alert("Branding đã được reset về mặc định!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {isHydrated ? t("admin.branding.title") : "Quản lý Thương hiệu"}
        </h1>
        <p className="text-slate-400 mt-2">
          {isHydrated ? t("admin.branding.subtitle") : "Thay đổi logo và tên thương hiệu của website"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Management */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Logo Website</CardTitle>
            <CardDescription className="text-slate-400">
              Upload logo mới cho website (khuyến nghị: 200x200px, PNG/JPG)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Logo Preview */}
            <div className="text-center">
              <div className="inline-block p-4 bg-slate-700 rounded-lg">
                <img src={previewLogo || logoUrl} alt="Logo Preview" className="w-16 h-16 rounded-full shadow-lg" />
              </div>
              <p className="text-sm text-slate-400 mt-2">Logo hiện tại</p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo-upload" className="text-white">
                Chọn logo mới
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-slate-700 border-slate-600 text-white file:bg-orange-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                />
                <Upload className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Text Management */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tên Thương hiệu</CardTitle>
            <CardDescription className="text-slate-400">Thay đổi tên thương hiệu hiển thị trên website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Brand Preview */}
            <div className="text-center">
              <div className="inline-block p-4 bg-slate-700 rounded-lg">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {previewText || brandText}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2">Tên thương hiệu hiện tại</p>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="brand-text" className="text-white">
                Tên thương hiệu mới
              </Label>
              <Input
                id="brand-text"
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder={brandText}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Lưu thay đổi
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset về mặc định
        </Button>
      </div>

      {/* Preview Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Xem trước</CardTitle>
          <CardDescription className="text-slate-400">
            Xem trước logo và tên thương hiệu sẽ hiển thị như thế nào
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg">
            <img src={previewLogo || logoUrl} alt="Preview Logo" className="w-12 h-12 rounded-full shadow-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {previewText || brandText}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
