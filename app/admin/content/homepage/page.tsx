"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Save,
  Eye,
  Upload,
  Play,
  Plus,
  Trash2,
  FileText,
  Package,
  Users,
  Building2Icon as BuildingOffice,
  LucideConstruction as BuildingConstruction,
  Bolt,
  Headphones,
} from "lucide-react"

export default function HomepageContentPage() {
  const [content, setContent] = useState({
    hero: {
      title: "Giải pháp Quản lý Xây dựng Thông minh",
      subtitle: "Nền tảng toàn diện cho quản lý dự án xây dựng, báo cáo tiến độ và hợp tác nhóm hiệu quả",
      ctaText: "Bắt đầu miễn phí",
      ctaSecondary: "Xem demo",
      videoUrl: "",
      videoTitle: "Video giới thiệu hệ thống",
      videoDescription: "Tìm hiểu cách sử dụng hệ thống quản lý thi công",
    },
    features: {
      title: "Tính năng nổi bật",
      subtitle: "Hệ thống quản lý dự án xây dựng toàn diện với các công cụ chuyên nghiệp",
      items: [
        {
          title: "Quản lý Dự án",
          description:
            "Tạo và quản lý nhiều dự án xây dựng, phân chia công việc và theo dõi tiến độ một cách khoa học.",
          icon: "FileText",
          link: "#",
        },
        {
          title: "Nhật ký Thi công",
          description: "Tạo báo cáo nhật ký thi công theo mẫu chuẩn Việt Nam với tính năng tự động hóa thông minh.",
          icon: "Package",
          link: "#",
        },
        {
          title: "Quản lý Nhóm",
          description: "Phân quyền người dùng theo vai trò Admin, Manager, User với các chức năng phù hợp.",
          icon: "Users",
          link: "#",
        },
      ],
    },
    whyChooseUs: {
      title: "Tại sao chọn chúng tôi",
      subtitle: "Những lý do khiến hàng nghìn doanh nghiệp tin tưởng sử dụng hệ thống của chúng tôi",
      stats: [
        { number: "1000+", label: "Doanh nghiệp xây dựng", icon: "🏢" },
        { number: "50K+", label: "Dự án hoàn thành", icon: "🏗️" },
        { number: "99.9%", label: "Thời gian hoạt động", icon: "⚡" },
        { number: "24/7", label: "Hỗ trợ khách hàng", icon: "🎧" },
      ],
    },
    aboutUs: {
      title: "Về chúng tôi",
      subtitle: "Đội ngũ chuyên gia với nhiều năm kinh nghiệm trong lĩnh vực xây dựng và công nghệ",
      description:
        "ConstructVN được thành lập với sứ mệnh số hóa ngành xây dựng Việt Nam, mang đến những giải pháp công nghệ tiên tiến nhất.",
      // image: "/construction-team.png",
    },
    services: {
      title: "Dịch vụ",
      subtitle: "Các gói dịch vụ phù hợp với mọi quy mô doanh nghiệp",
      items: [
        {
          name: "Gói Cơ bản",
          price: "299,000đ/tháng",
          features: ["5 dự án", "Báo cáo cơ bản", "Hỗ trợ email"],
          popular: false,
        },
        {
          name: "Gói Chuyên nghiệp",
          price: "599,000đ/tháng",
          features: ["20 dự án", "Báo cáo nâng cao", "Hỗ trợ 24/7", "API tích hợp"],
          popular: true,
        },
        {
          name: "Gói Doanh nghiệp",
          price: "Liên hệ",
          features: ["Không giới hạn dự án", "Tùy chỉnh theo yêu cầu", "Đào tạo chuyên sâu"],
          popular: false,
        },
      ],
    },
    contact: {
      title: "Liên hệ",
      subtitle: "Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất",
      phone: "1900 1234",
      email: "contact@constructvn.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
    },
    pricing: {
      title: "Bảng giá",
      subtitle: "Chọn gói phù hợp với nhu cầu của bạn",
    },
    testimonials: {
      title: "Khách hàng nói gì về chúng tôi",
      subtitle: "Những phản hồi tích cực từ khách hàng đã sử dụng dịch vụ",
      items: [
        {
          name: "Nguyễn Văn A",
          position: "Giám đốc dự án",
          company: "Công ty TNHH ABC",
          content: "Hệ thống giúp chúng tôi quản lý dự án hiệu quả hơn rất nhiều. Giao diện thân thiện và dễ sử dụng.",
          rating: 5,
        },
        {
          name: "Trần Thị B",
          position: "Kỹ sư xây dựng",
          company: "Tập đoàn XYZ",
          content: "Tính năng báo cáo tự động giúp tiết kiệm rất nhiều thời gian. Rất hài lòng với dịch vụ.",
          rating: 5,
        },
      ],
    },
    faq: {
      title: "Câu hỏi thường gặp",
      subtitle: "Những thắc mắc phổ biến về hệ thống và dịch vụ",
      items: [
        {
          question: "Hệ thống có hỗ trợ tiếng Việt không?",
          answer: "Có, hệ thống được thiết kế hoàn toàn bằng tiếng Việt và tuân thủ các quy định của Việt Nam.",
        },
        {
          question: "Có thể dùng thử miễn phí không?",
          answer: "Có, chúng tôi cung cấp gói dùng thử miễn phí 14 ngày với đầy đủ tính năng.",
        },
        {
          question: "Dữ liệu có được bảo mật không?",
          answer: "Tất cả dữ liệu được mã hóa và lưu trữ trên server tại Việt Nam, tuân thủ luật bảo vệ dữ liệu.",
        },
      ],
    },
    cta: {
      title: "Sẵn sàng bắt đầu?",
      subtitle: "Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng sử dụng ConstructVN",
      placeholder: "Bắt đầu miễn phí ngay",
      button: "Đăng ký"
    },
    newsletter: {
      title: "Đăng ký nhận tin tức",
      subtitle: "Nhận thông tin mới nhất về sản phẩm và ngành xây dựng",
      placeholder: "Nhập email của bạn",
      buttonText: "Đăng ký",
    },
    footer: {
      companyName: "ConstructVN",
      description: "Giải pháp quản lý xây dựng thông minh hàng đầu Việt Nam",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      phone: "1900 1234",
      email: "contact@constructvn.com",
      socialLinks: {
        facebook: "https://facebook.com/constructvn",
        linkedin: "https://linkedin.com/company/constructvn",
        youtube: "https://youtube.com/constructvn",
      },
      quickLinks: [
        { name: "Về chúng tôi", url: "/about" },
        { name: "Dịch vụ", url: "/services" },
        { name: "Liên hệ", url: "/contact" },
        { name: "Hỗ trợ", url: "/support" },
      ],
      legalLinks: [
        { name: "Điều khoản sử dụng", url: "/terms" },
        { name: "Chính sách bảo mật", url: "/privacy" },
        { name: "Chính sách cookie", url: "/cookies" },
      ],
      copyright: "© 2024 ConstructVN. Tất cả quyền được bảo lưu.",
    },
  })


  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash) {
      // slight delay to ensure DOM is ready
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [])

  const getIconComponent = (iconName: string) => {
    const icons = {
      FileText: FileText,
      Package: Package,
      Users: Users,
      BuildingOffice: BuildingOffice,
      BuildingConstruction: BuildingConstruction,
      Bolt: Bolt,
      Headphones: Headphones,
    }
    const IconComponent = icons[iconName as keyof typeof icons] || FileText
    return <IconComponent className="h-6 w-6" />
  }

  const addFeatureItem = () => {
    const newItem = {
      title: "Tính năng mới",
      description: "Mô tả tính năng mới",
      icon: "FileText",
      link: "#",
    }
    setContent({
      ...content,
      features: {
        ...content.features,
        items: [...content.features.items, newItem],
      },
    })
  }

  const removeFeatureItem = (index: number) => {
    const newItems = content.features.items.filter((_, i) => i !== index)
    setContent({
      ...content,
      features: {
        ...content.features,
        items: newItems,
      },
    })
  }

  const handleSave = () => {
    localStorage.setItem("homepage_content", JSON.stringify(content))
    window.dispatchEvent(new CustomEvent("homepage-content-updated", { detail: content }))
    console.log("Saving homepage content:", content)
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const videoUrl = URL.createObjectURL(file)
      setContent({ ...content, hero: { ...content.hero, videoUrl } })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung - Trang chủ</h1>
          <p className="text-slate-400">Chỉnh sửa nội dung trang chủ website</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Phần Giới thiệu Chính (Hero Section)</CardTitle>
            <CardDescription className="text-slate-400">
              Quản lý nội dung và video phần banner chính của trang chủ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Nội dung văn bản</h3>
                <div>
                  <Label htmlFor="hero-title" className="text-slate-300">
                    Tiêu đề chính
                  </Label>
                  <Textarea
                    id="hero-title"
                    value={content.hero.title}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle" className="text-slate-300">
                    Mô tả chi tiết
                  </Label>
                  <Textarea
                    id="hero-subtitle"
                    value={content.hero.subtitle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hero-cta" className="text-slate-300">
                      Nút chính
                    </Label>
                    <Input
                      id="hero-cta"
                      value={content.hero.ctaText}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta-secondary" className="text-slate-300">
                      Nút phụ
                    </Label>
                    <Input
                      id="hero-cta-secondary"
                      value={content.hero.ctaSecondary}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, ctaSecondary: e.target.value } })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Video Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Quản lý Video</h3>
                <div>
                  <Label htmlFor="video-title" className="text-slate-300">
                    Tiêu đề video
                  </Label>
                  <Input
                    id="video-title"
                    value={content.hero.videoTitle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, videoTitle: e.target.value } })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="video-description" className="text-slate-300">
                    Mô tả video
                  </Label>
                  <Input
                    id="video-description"
                    value={content.hero.videoDescription}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, videoDescription: e.target.value } })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="video-url" className="text-slate-300">
                    URL Video (YouTube, Vimeo, hoặc link trực tiếp)
                  </Label>
                  <Input
                    id="video-url"
                    value={content.hero.videoUrl}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, videoUrl: e.target.value } })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Hoặc tải video lên</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent w-full"
                      onClick={() => document.getElementById("video-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Tải video lên
                    </Button>
                  </div>
                </div>
                {content.hero.videoUrl && (
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-400">
                      <Play className="h-4 w-4" />
                      <span className="text-sm">Video đã được thiết lập</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">{content.hero.videoUrl}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Tính năng nổi bật</CardTitle>
            <CardDescription className="text-slate-400">
              Quản lý các tính năng chính được hiển thị trên trang chủ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title and Subtitle Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="features-title" className="text-slate-300">
                  Tiêu đề chính
                </Label>
                <Input
                  id="features-title"
                  value={content.features.title}
                  onChange={(e) => setContent({ ...content, features: { ...content.features, title: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="features-subtitle" className="text-slate-300">
                  Mô tả phụ
                </Label>
                <Input
                  id="features-subtitle"
                  value={content.features.subtitle}
                  onChange={(e) =>
                    setContent({ ...content, features: { ...content.features, subtitle: e.target.value } })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Enhanced Feature Items Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Danh sách tính năng</h3>
                <Button onClick={addFeatureItem} size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm tính năng
                </Button>
              </div>

              {content.features.items.map((item, index) => (
                <div key={index} className="space-y-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getIconComponent(item.icon)}
                      <span className="text-white font-medium">Tính năng {index + 1}</span>
                    </div>
                    <Button
                      onClick={() => removeFeatureItem(index)}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Tên tính năng</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...content.features.items]
                          newItems[index].title = e.target.value
                          setContent({ ...content, features: { ...content.features, items: newItems } })
                        }}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Icon</Label>
                      <select
                        value={item.icon}
                        onChange={(e) => {
                          const newItems = [...content.features.items]
                          newItems[index].icon = e.target.value
                          setContent({ ...content, features: { ...content.features, items: newItems } })
                        }}
                        className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                      >
                        <option value="FileText">Tài liệu (FileText)</option>
                        <option value="Package">Gói (Package)</option>
                        <option value="Users">Người dùng (Users)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Mô tả chi tiết</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...content.features.items]
                        newItems[index].description = e.target.value
                        setContent({ ...content, features: { ...content.features, items: newItems } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Link "Tìm hiểu thêm"</Label>
                    <Input
                      value={item.link}
                      onChange={(e) => {
                        const newItems = [...content.features.items]
                        newItems[index].link = e.target.value
                        setContent({ ...content, features: { ...content.features, items: newItems } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="#"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us Section */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Tại sao chọn chúng tôi</CardTitle>
            <CardDescription className="text-slate-400">
              Quản lý thống kê và lý do khách hàng chọn dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="why-title" className="text-slate-300">
                  Tiêu đề chính
                </Label>
                <Input
                  id="why-title"
                  value={content.whyChooseUs.title}
                  onChange={(e) =>
                    setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, title: e.target.value } })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="why-subtitle" className="text-slate-300">
                  Mô tả phụ
                </Label>
                <Input
                  id="why-subtitle"
                  value={content.whyChooseUs.subtitle}
                  onChange={(e) =>
                    setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, subtitle: e.target.value } })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Thống kê</h3>
              {content.whyChooseUs.stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-slate-700 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Icon</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) => {
                        const newStats = [...content.whyChooseUs.stats]
                        newStats[index].icon = e.target.value
                        setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, stats: newStats } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Số liệu</Label>
                    <Input
                      value={stat.number}
                      onChange={(e) => {
                        const newStats = [...content.whyChooseUs.stats]
                        newStats[index].number = e.target.value
                        setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, stats: newStats } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-300">Mô tả</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...content.whyChooseUs.stats]
                        newStats[index].label = e.target.value
                        setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, stats: newStats } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About Us Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Về chúng tôi</CardTitle>
            <CardDescription className="text-slate-400">Thông tin giới thiệu về công ty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="about-title"
                value={content.aboutUs.title}
                onChange={(e) => setContent({ ...content, aboutUs: { ...content.aboutUs, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="about-subtitle" className="text-slate-300">
                Mô tả ngắn
              </Label>
              <Input
                id="about-subtitle"
                value={content.aboutUs.subtitle}
                onChange={(e) => setContent({ ...content, aboutUs: { ...content.aboutUs, subtitle: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="about-description" className="text-slate-300">
                Mô tả chi tiết
              </Label>
              <Textarea
                id="about-description"
                value={content.aboutUs.description}
                onChange={(e) =>
                  setContent({ ...content, aboutUs: { ...content.aboutUs, description: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Dịch vụ</CardTitle>
            <CardDescription className="text-slate-400">Quản lý các gói dịch vụ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="services-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="services-title"
                value={content.services.title}
                onChange={(e) => setContent({ ...content, services: { ...content.services, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="services-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input
                id="services-subtitle"
                value={content.services.subtitle}
                onChange={(e) =>
                  setContent({ ...content, services: { ...content.services, subtitle: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Liên hệ</CardTitle>
            <CardDescription className="text-slate-400">Thông tin liên hệ và form liên hệ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-title" className="text-slate-300">
                  Tiêu đề
                </Label>
                <Input
                  id="contact-title"
                  value={content.contact.title}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, title: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contact-subtitle" className="text-slate-300">
                  Mô tả
                </Label>
                <Input
                  id="contact-subtitle"
                  value={content.contact.subtitle}
                  onChange={(e) =>
                    setContent({ ...content, contact: { ...content.contact, subtitle: e.target.value } })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact-phone" className="text-slate-300">
                  Số điện thoại
                </Label>
                <Input
                  id="contact-phone"
                  value={content.contact.phone}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contact-email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  value={content.contact.email}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contact-address" className="text-slate-300">
                  Địa chỉ
                </Label>
                <Input
                  id="contact-address"
                  value={content.contact.address}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Bảng giá</CardTitle>
            <CardDescription className="text-slate-400">Thông tin về các gói dịch vụ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pricing-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="pricing-title"
                value={content.pricing.title}
                onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="pricing-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input
                id="pricing-subtitle"
                value={content.pricing.subtitle}
                onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, subtitle: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Testimonials - Khách hàng nói gì</CardTitle>
            <CardDescription className="text-slate-400">Quản lý phản hồi và đánh giá từ khách hàng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testimonials-title" className="text-slate-300">
                  Tiêu đề
                </Label>
                <Input
                  id="testimonials-title"
                  value={content.testimonials.title}
                  onChange={(e) =>
                    setContent({ ...content, testimonials: { ...content.testimonials, title: e.target.value } })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="testimonials-subtitle" className="text-slate-300">
                  Mô tả
                </Label>
                <Input
                  id="testimonials-subtitle"
                  value={content.testimonials.subtitle}
                  onChange={(e) =>
                    setContent({ ...content, testimonials: { ...content.testimonials, subtitle: e.target.value } })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Testimonials</h3>
              {content.testimonials.items.map((item, index) => (
                <div key={index} className="p-4 bg-slate-700 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Tên khách hàng</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...content.testimonials.items]
                          newItems[index].name = e.target.value
                          setContent({ ...content, testimonials: { ...content.testimonials, items: newItems } })
                        }}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Chức vụ</Label>
                      <Input
                        value={item.position}
                        onChange={(e) => {
                          const newItems = [...content.testimonials.items]
                          newItems[index].position = e.target.value
                          setContent({ ...content, testimonials: { ...content.testimonials, items: newItems } })
                        }}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Công ty</Label>
                      <Input
                        value={item.company}
                        onChange={(e) => {
                          const newItems = [...content.testimonials.items]
                          newItems[index].company = e.target.value
                          setContent({ ...content, testimonials: { ...content.testimonials, items: newItems } })
                        }}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Nội dung phản hồi</Label>
                    <Textarea
                      value={item.content}
                      onChange={(e) => {
                        const newItems = [...content.testimonials.items]
                        newItems[index].content = e.target.value
                        setContent({ ...content, testimonials: { ...content.testimonials, items: newItems } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">FAQ - Câu hỏi thường gặp</CardTitle>
            <CardDescription className="text-slate-400">Quản lý các câu hỏi và câu trả lời phổ biến</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faq-title" className="text-slate-300">
                  Tiêu đề
                </Label>
                <Input
                  id="faq-title"
                  value={content.faq.title}
                  onChange={(e) => setContent({ ...content, faq: { ...content.faq, title: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="faq-subtitle" className="text-slate-300">
                  Mô tả
                </Label>
                <Input
                  id="faq-subtitle"
                  value={content.faq.subtitle}
                  onChange={(e) => setContent({ ...content, faq: { ...content.faq, subtitle: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Câu hỏi & Trả lời</h3>
              {content.faq.items.map((item, index) => (
                <div key={index} className="p-4 bg-slate-700 rounded-lg space-y-4">
                  <div>
                    <Label className="text-slate-300">Câu hỏi</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => {
                        const newItems = [...content.faq.items]
                        newItems[index].question = e.target.value
                        setContent({ ...content, faq: { ...content.faq, items: newItems } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Câu trả lời</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => {
                        const newItems = [...content.faq.items]
                        newItems[index].answer = e.target.value
                        setContent({ ...content, faq: { ...content.faq, items: newItems } })
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Section */}
        <Card id="newsletter" className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Newsletter - Đăng ký nhận tin</CardTitle>
            <CardDescription className="text-slate-400">Quản lý phần đăng ký nhận tin tức</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newsletter-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="newsletter-title"
                value={content.newsletter.title}
                onChange={(e) =>
                  setContent({ ...content, newsletter: { ...content.newsletter, title: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="newsletter-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input
                id="newsletter-subtitle"
                value={content.newsletter.subtitle}
                onChange={(e) =>
                  setContent({ ...content, newsletter: { ...content.newsletter, subtitle: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="newsletter-placeholder" className="text-slate-300">
                Placeholder text
              </Label>
              <Input
                id="newsletter-placeholder"
                value={content.newsletter.placeholder}
                onChange={(e) =>
                  setContent({ ...content, newsletter: { ...content.newsletter, placeholder: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="newsletter-button" className="text-slate-300">
                Text nút đăng ký
              </Label>
              <Input
                id="newsletter-button"
                value={content.newsletter.buttonText}
                onChange={(e) =>
                  setContent({ ...content, newsletter: { ...content.newsletter, buttonText: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>





      </div>
    </div>
  )
}
