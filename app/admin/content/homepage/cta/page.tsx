"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Eye } from "lucide-react"

export default function CTAAdminPage() {
  const [content, setContent] = useState({
    cta: {
      title: "Sẵn sàng bắt đầu?",
      subtitle: "Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng sử dụng ConstructVN",
      placeholder: "Bắt đầu miễn phí ngay",
      button: "Đăng ký"
    }
  })

  useEffect(() => {
    // Load existing content from localStorage if available
    const savedContent = localStorage.getItem("homepage_content")
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        if (parsedContent.cta) {
          setContent({ cta: parsedContent.cta })
        }
      } catch (error) {
        console.error("Error loading saved content:", error)
      }
    }
  }, [])

  const handleSave = () => {
    // Get existing homepage content
    const existingContent = localStorage.getItem("homepage_content")
    let fullContent = {}
    
    if (existingContent) {
      try {
        fullContent = JSON.parse(existingContent)
      } catch (error) {
        console.error("Error parsing existing content:", error)
      }
    }

    // Update only the CTA section
    const updatedContent = {
      ...fullContent,
      cta: content.cta
    }

    localStorage.setItem("homepage_content", JSON.stringify(updatedContent))
    window.dispatchEvent(new CustomEvent("homepage-content-updated", { detail: updatedContent }))
    console.log("Saving CTA content:", content.cta)
    
    // Show success message (you can implement a toast notification here)
    alert("Đã lưu thay đổi CTA thành công!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý CTA - Sẵn sàng bắt đầu</h1>
          <p className="text-slate-400">Chỉnh sửa nội dung kêu gọi hành động trên trang chủ</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">CTA - Sẵn sàng bắt đầu?</CardTitle>
          <CardDescription className="text-slate-400">
            Quản lý nội dung kêu gọi hành động trên trang chủ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input 
                id="cta-title" 
                value={content.cta?.title || ''}
                onChange={(e) => setContent({ 
                  ...content, 
                  cta: { ...(content.cta||{}), title: e.target.value } 
                })}
                className="bg-slate-700 border-slate-600 text-white" 
              />
            </div>
            <div>
              <Label htmlFor="cta-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input 
                id="cta-subtitle" 
                value={content.cta?.subtitle || ''}
                onChange={(e) => setContent({ 
                  ...content, 
                  cta: { ...(content.cta||{}), subtitle: e.target.value } 
                })}
                className="bg-slate-700 border-slate-600 text-white" 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta-placeholder" className="text-slate-300">
                Placeholder input
              </Label>
              <Input 
                id="cta-placeholder" 
                value={content.cta?.placeholder || ''}
                onChange={(e) => setContent({ 
                  ...content, 
                  cta: { ...(content.cta||{}), placeholder: e.target.value } 
                })}
                className="bg-slate-700 border-slate-600 text-white" 
              />
            </div>
            <div>
              <Label htmlFor="cta-button" className="text-slate-300">
                Text nút
              </Label>
              <Input 
                id="cta-button" 
                value={content.cta?.button || ''}
                onChange={(e) => setContent({ 
                  ...content, 
                  cta: { ...(content.cta||{}), button: e.target.value } 
                })}
                className="bg-slate-700 border-slate-600 text-white" 
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-8 p-6 bg-slate-700 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">Xem trước</h3>
            <div className="bg-slate-900 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                {content.cta?.title || "Tiêu đề CTA"}
              </h2>
              <p className="text-slate-300 mb-6">
                {content.cta?.subtitle || "Mô tả CTA"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <input
                  type="text"
                  placeholder={content.cta?.placeholder || "Placeholder"}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                  readOnly
                />
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  {content.cta?.button || "Button"}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}