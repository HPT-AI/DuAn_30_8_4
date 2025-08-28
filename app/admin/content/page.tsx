"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Eye, Home, Info, DollarSign } from "lucide-react"

export default function ContentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("homepage")

  const contentSections = {
    homepage: {
      title: "Trang chủ",
      icon: Home,
      sections: [
        {
          id: "hero",
          name: "Hero Section",
          content: {
            title: "Giải pháp quản lý xây dựng toàn diện",
            subtitle: "Nền tảng số hóa tiên tiến cho ngành xây dựng Việt Nam",
            description:
              "ConstructVN cung cấp giải pháp quản lý dự án xây dựng từ A-Z với công nghệ hiện đại, giúp tối ưu hóa quy trình và nâng cao hiệu quả công việc.",
            ctaText: "Bắt đầu miễn phí",
            videoUrl: "https://example.com/demo-video",
          },
        },
        {
          id: "features",
          name: "Tính năng chính",
          content: {
            features: [
              {
                title: "Quản lý dự án",
                description: "Theo dõi tiến độ, phân công nhiệm vụ và quản lý tài nguyên hiệu quả",
                icon: "📊",
              },
              {
                title: "Nhật ký xây dựng",
                description: "Ghi chép chi tiết quá trình thi công với hình ảnh và báo cáo",
                icon: "📝",
              },
              {
                title: "Quản lý nhóm",
                description: "Phối hợp làm việc nhóm và giao tiếp hiệu quả",
                icon: "👥",
              },
            ],
          },
        },
        {
          id: "testimonials",
          name: "Đánh giá khách hàng",
          content: {
            testimonials: [
              {
                name: "Nguyễn Văn A",
                company: "Công ty TNHH Xây dựng ABC",
                content: "ConstructVN đã giúp chúng tôi tiết kiệm 30% thời gian quản lý dự án",
                rating: 5,
              },
              {
                name: "Trần Thị B",
                company: "Tập đoàn Xây dựng XYZ",
                content: "Giao diện thân thiện, dễ sử dụng và hỗ trợ khách hàng tuyệt vời",
                rating: 5,
              },
            ],
          },
        },
      ],
    },
    about: {
      title: "Giới thiệu",
      icon: Info,
      sections: [
        {
          id: "mission",
          name: "Sứ mệnh & Tầm nhìn",
          content: {
            mission: "Số hóa ngành xây dựng Việt Nam với công nghệ tiên tiến",
            vision: "Trở thành nền tảng quản lý xây dựng hàng đầu Đông Nam Á",
          },
        },
        {
          id: "values",
          name: "Giá trị cốt lõi",
          content: {
            values: [
              { title: "Chất lượng", description: "Cam kết chất lượng sản phẩm và dịch vụ" },
              { title: "Khách hàng", description: "Đặt khách hàng làm trung tâm" },
              { title: "Đổi mới", description: "Không ngừng cải tiến và sáng tạo" },
              { title: "Tin cậy", description: "Xây dựng lòng tin với khách hàng" },
            ],
          },
        },
      ],
    },
    pricing: {
      title: "Bảng giá",
      icon: DollarSign,
      sections: [
        {
          id: "plans",
          name: "Gói dịch vụ",
          content: {
            plans: [
              {
                name: "Free",
                price: 0,
                features: ["1 dự án", "Báo cáo cơ bản", "1GB lưu trữ"],
              },
              {
                name: "Basic",
                price: 299000,
                features: ["5 dự án", "Báo cáo chi tiết", "10GB lưu trữ", "Hỗ trợ email"],
              },
              {
                name: "Professional",
                price: 599000,
                features: ["Không giới hạn dự án", "Báo cáo cao cấp", "100GB lưu trữ", "Hỗ trợ 24/7"],
              },
              {
                name: "Enterprise",
                price: 1299000,
                features: ["Tất cả tính năng Pro", "API tùy chỉnh", "Đào tạo chuyên sâu", "Quản lý đa chi nhánh"],
              },
            ],
          },
        },
      ],
    },
  }

  const [editingContent, setEditingContent] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEdit = (sectionId, contentId) => {
    const section = contentSections[activeSection]
    const content = section.sections.find((s) => s.id === contentId)
    setEditingContent(`${sectionId}-${contentId}`)
    setEditForm(content.content)
  }

  const handleSave = () => {
    // Here you would save to backend/database
    console.log("[v0] Saving content:", editForm)
    setEditingContent(null)
    setEditForm({})
  }

  const renderContentEditor = (content, type) => {
    switch (type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Tiêu đề chính</Label>
              <Input
                value={editForm.title || ""}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Phụ đề</Label>
              <Input
                value={editForm.subtitle || ""}
                onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Mô tả</Label>
              <Textarea
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-white">Text nút CTA</Label>
              <Input
                value={editForm.ctaText || ""}
                onChange={(e) => setEditForm({ ...editForm, ctaText: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        )
      default:
        return (
          <div>
            <Label className="text-white">Nội dung JSON</Label>
            <Textarea
              value={JSON.stringify(editForm, null, 2)}
              onChange={(e) => {
                try {
                  setEditForm(JSON.parse(e.target.value))
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
              className="bg-slate-700 border-slate-600 text-white font-mono"
              rows={10}
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý nội dung</h1>
          <p className="text-slate-400 mt-1">Quản lý nội dung website theo từng trang</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nội dung
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Tổng sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Object.values(contentSections).reduce((acc, section) => acc + section.sections.length, 0)}
            </div>
            <p className="text-xs text-slate-400">Trên {Object.keys(contentSections).length} trang</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Đã cập nhật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">18</div>
            <p className="text-xs text-slate-400">Hôm nay</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cần xem lại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">4</div>
            <p className="text-xs text-slate-400">Sections</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Lượt xem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">12.5K</div>
            <p className="text-xs text-slate-400">+15% tuần này</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Management Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="bg-slate-800 border-slate-700">
          {Object.entries(contentSections).map(([key, section]) => {
            const IconComponent = section.icon
            return (
              <TabsTrigger key={key} value={key} className="data-[state=active]:bg-orange-500">
                <IconComponent className="h-4 w-4 mr-2" />
                {section.title}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(contentSections).map(([sectionKey, section]) => (
          <TabsContent key={sectionKey} value={sectionKey}>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <section.icon className="h-5 w-5 mr-2" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.sections.map((contentSection) => (
                    <div key={contentSection.id} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">{contentSection.name}</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(sectionKey, contentSection.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editingContent === `${sectionKey}-${contentSection.id}` ? (
                        <div className="space-y-4">
                          {renderContentEditor(contentSection.content, contentSection.id)}
                          <div className="flex space-x-2">
                            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                              Lưu
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingContent(null)}
                              className="border-slate-600 text-slate-400"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-300">
                          <pre className="text-sm bg-slate-800 p-3 rounded overflow-auto">
                            {JSON.stringify(contentSection.content, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
