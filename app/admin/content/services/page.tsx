"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye, Plus, Trash2 } from "lucide-react"

export default function ServicesContentPage() {
  const [content, setContent] = useState({
    hero: {
      title: "Dịch vụ của chúng tôi",
      subtitle: "Giải pháp toàn diện cho quản lý dự án xây dựng",
    },
    services: [
      {
        title: "Quản lý dự án",
        description: "Theo dõi tiến độ, quản lý tài nguyên và nhân sự hiệu quả",
        features: ["Lập kế hoạch chi tiết", "Theo dõi tiến độ", "Quản lý ngân sách"],
      },
      {
        title: "Báo cáo thông minh",
        description: "Tạo báo cáo chi tiết với biểu đồ và phân tích dữ liệu",
        features: ["Báo cáo tự động", "Biểu đồ trực quan", "Xuất file PDF/Excel"],
      },
      {
        title: "Hợp tác nhóm",
        description: "Công cụ chia sẻ và làm việc nhóm hiệu quả",
        features: ["Chat nhóm", "Chia sẻ file", "Thông báo real-time"],
      },
    ],
  })

  const handleSave = () => {
    console.log("Saving services content:", content)
  }

  const addService = () => {
    setContent({
      ...content,
      services: [...content.services, { title: "", description: "", features: [""] }],
    })
  }

  const removeService = (index: number) => {
    const newServices = content.services.filter((_, i) => i !== index)
    setContent({ ...content, services: newServices })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung - Dịch vụ</h1>
          <p className="text-slate-400">Chỉnh sửa nội dung trang dịch vụ</p>
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
          <CardTitle className="text-white">Hero Section</CardTitle>
          <CardDescription className="text-slate-400">Phần giới thiệu chính về dịch vụ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="services-title" className="text-slate-300">
              Tiêu đề
            </Label>
            <Input
              id="services-title"
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="services-subtitle" className="text-slate-300">
              Mô tả
            </Label>
            <Textarea
              id="services-subtitle"
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              className="bg-slate-700 border-slate-600 text-white"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Danh sách dịch vụ</h2>
        <Button
          onClick={addService}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm dịch vụ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {content.services.map((service, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Dịch vụ {index + 1}</CardTitle>
                <CardDescription className="text-slate-400">Thông tin chi tiết dịch vụ</CardDescription>
              </div>
              <Button
                onClick={() => removeService(index)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Tên dịch vụ</Label>
                <Input
                  value={service.title}
                  onChange={(e) => {
                    const newServices = [...content.services]
                    newServices[index].title = e.target.value
                    setContent({ ...content, services: newServices })
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Mô tả</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...content.services]
                    newServices[index].description = e.target.value
                    setContent({ ...content, services: newServices })
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-slate-300">Tính năng (mỗi dòng một tính năng)</Label>
                <Textarea
                  value={service.features.join("\n")}
                  onChange={(e) => {
                    const newServices = [...content.services]
                    newServices[index].features = e.target.value.split("\n").filter((f) => f.trim())
                    setContent({ ...content, services: newServices })
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
