"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

export default function WhyChooseUsPage() {
  const [sectionData, setSectionData] = useState({
    title: "Tại sao chọn chúng tôi?",
    features: [
      {
        id: 1,
        title: "Tuân thủ chuẩn Việt Nam",
        description: "Mẫu báo cáo được thiết kế theo đúng quy định pháp lý và chuẩn kỹ thuật Việt Nam.",
        iconColor: "bg-blue-500",
      },
      {
        id: 2,
        title: "Giao diện thân thiện",
        description: "Thiết kế đơn giản, dễ sử dụng phù hợp với mọi đối tượng người dùng trong ngành xây dựng.",
        iconColor: "bg-purple-500",
      },
      {
        id: 3,
        title: "Bảo mật cao",
        description: "Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế, đảm bảo an toàn thông tin dự án.",
        iconColor: "bg-cyan-500",
      },
      {
        id: 4,
        title: "Hỗ trợ 24/7",
        description: "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
        iconColor: "bg-purple-500",
      },
    ],
    statsCard: {
      title: "Được tin tưởng bởi",
      number: "1000+",
      subtitle: "Doanh nghiệp xây dựng",
      icon: "🏆",
    },
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // Save to localStorage or API
    localStorage.setItem("homepage_why_choose_us", JSON.stringify(sectionData))
    setIsEditing(false)

    // Dispatch event to update homepage
    window.dispatchEvent(
      new CustomEvent("homepageContentUpdate", {
        detail: { section: "whyChooseUs", data: sectionData },
      }),
    )
  }

  const addFeature = () => {
    const newFeature = {
      id: Date.now(),
      title: "Tính năng mới",
      description: "Mô tả tính năng mới",
      iconColor: "bg-blue-500",
    }
    setSectionData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }))
  }

  const removeFeature = (id: number) => {
    setSectionData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature.id !== id),
    }))
  }

  const updateFeature = (id: number, field: string, value: string) => {
    setSectionData((prev) => ({
      ...prev,
      features: prev.features.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)),
    }))
  }

  const colorOptions = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-cyan-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]

  const iconOptions = [
    "🏆", // Trophy
    "⭐", // Star
    "💎", // Diamond
    "🎯", // Target
    "🚀", // Rocket
    "💼", // Briefcase
    "🏗️", // Construction
    "📊", // Chart
    "✅", // Check mark
    "🔥", // Fire
    "💪", // Strong arm
    "🎖️", // Medal
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý "Tại sao chọn chúng tôi"</h1>
          <p className="text-slate-400 mt-1">Chỉnh sửa nội dung phần lý do chọn dịch vụ</p>
        </div>
        <div className="flex gap-2">
          <Button variant={isEditing ? "secondary" : "default"} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Content Management */}
        <div className="space-y-6">
          {/* Section Title */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Tiêu đề chính</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Input
                  value={sectionData.title}
                  onChange={(e) => setSectionData((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <p className="text-slate-300">{sectionData.title}</p>
              )}
            </CardContent>
          </Card>

          {/* Features Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Danh sách tính năng</CardTitle>
                {isEditing && (
                  <Button onClick={addFeature} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm tính năng
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectionData.features.map((feature) => (
                <div key={feature.id} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${feature.iconColor} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">{feature.title.charAt(0)}</span>
                      </div>
                      {isEditing ? (
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(feature.id, "title", e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      ) : (
                        <h4 className="text-white font-medium">{feature.title}</h4>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        onClick={() => removeFeature(feature.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mb-3">
                      <label className="text-sm text-slate-400 mb-2 block">Màu icon:</label>
                      <div className="flex gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => updateFeature(feature.id, "iconColor", color)}
                            className={`w-6 h-6 ${color} rounded-full border-2 ${
                              feature.iconColor === color ? "border-white" : "border-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {isEditing ? (
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, "description", e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                      rows={2}
                    />
                  ) : (
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats Card Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Thẻ thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Icon:</label>
                {isEditing ? (
                  <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() =>
                          setSectionData((prev) => ({
                            ...prev,
                            statsCard: { ...prev.statsCard, icon },
                          }))
                        }
                        className={`w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl border-2 ${
                          sectionData.statsCard.icon === icon ? "border-cyan-400" : "border-transparent"
                        } hover:border-slate-500 transition-colors`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl">
                    {sectionData.statsCard.icon}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Tiêu đề:</label>
                {isEditing ? (
                  <Input
                    value={sectionData.statsCard.title}
                    onChange={(e) =>
                      setSectionData((prev) => ({
                        ...prev,
                        statsCard: { ...prev.statsCard, title: e.target.value },
                      }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-slate-300">{sectionData.statsCard.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Số liệu:</label>
                {isEditing ? (
                  <Input
                    value={sectionData.statsCard.number}
                    onChange={(e) =>
                      setSectionData((prev) => ({
                        ...prev,
                        statsCard: { ...prev.statsCard, number: e.target.value },
                      }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-cyan-400 text-2xl font-bold">{sectionData.statsCard.number}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Mô tả:</label>
                {isEditing ? (
                  <Input
                    value={sectionData.statsCard.subtitle}
                    onChange={(e) =>
                      setSectionData((prev) => ({
                        ...prev,
                        statsCard: { ...prev.statsCard, subtitle: e.target.value },
                      }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                ) : (
                  <p className="text-slate-300">{sectionData.statsCard.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Xem trước</CardTitle>
              <CardDescription>Giao diện sẽ hiển thị như thế này trên website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">{sectionData.title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {sectionData.features.map((feature) => (
                      <div key={feature.id} className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 ${feature.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-white font-bold">{feature.title.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                          <p className="text-slate-400 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="bg-slate-800 p-6 rounded-lg text-center">
                      <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">{sectionData.statsCard.icon}</span>
                      </div>
                      <p className="text-slate-400 mb-2">{sectionData.statsCard.title}</p>
                      <p className="text-cyan-400 text-3xl font-bold mb-1">{sectionData.statsCard.number}</p>
                      <p className="text-slate-400 text-sm">{sectionData.statsCard.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
