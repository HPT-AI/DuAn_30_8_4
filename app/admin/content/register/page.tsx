"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye } from "lucide-react"

export default function RegisterContentPage() {
  const [content, setContent] = useState({
    hero: {
      title: "Đăng ký tài khoản",
      subtitle: "Tạo tài khoản để trải nghiệm đầy đủ tính năng",
    },
    form: {
      title: "Thông tin đăng ký",
      description: "Vui lòng điền đầy đủ thông tin bên dưới",
      terms: "Bằng cách đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi",
    },
    benefits: {
      title: "Lợi ích khi đăng ký",
      items: ["Truy cập đầy đủ tính năng", "Hỗ trợ khách hàng 24/7", "Cập nhật tính năng mới", "Bảo mật thông tin cao"],
    },
    social: {
      title: "Hoặc đăng ký bằng",
      enableGoogle: true,
      enableFacebook: true,
    },
  })

  const handleSave = () => {
    console.log("Saving register content:", content)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung - Đăng ký</h1>
          <p className="text-slate-400">Chỉnh sửa nội dung trang đăng ký</p>
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
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Hero Section</CardTitle>
            <CardDescription className="text-slate-400">Phần giới thiệu trang đăng ký</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="register-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="register-title"
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="register-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input
                id="register-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Form đăng ký</CardTitle>
            <CardDescription className="text-slate-400">Cài đặt form đăng ký</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="form-title" className="text-slate-300">
                Tiêu đề form
              </Label>
              <Input
                id="form-title"
                value={content.form.title}
                onChange={(e) => setContent({ ...content, form: { ...content.form, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="form-desc" className="text-slate-300">
                Mô tả form
              </Label>
              <Input
                id="form-desc"
                value={content.form.description}
                onChange={(e) => setContent({ ...content, form: { ...content.form, description: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="terms" className="text-slate-300">
                Điều khoản
              </Label>
              <Textarea
                id="terms"
                value={content.form.terms}
                onChange={(e) => setContent({ ...content, form: { ...content.form, terms: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lợi ích đăng ký</CardTitle>
            <CardDescription className="text-slate-400">Các lợi ích khi người dùng đăng ký</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="benefits-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="benefits-title"
                value={content.benefits.title}
                onChange={(e) => setContent({ ...content, benefits: { ...content.benefits, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="benefits-items" className="text-slate-300">
                Danh sách lợi ích (mỗi dòng một lợi ích)
              </Label>
              <Textarea
                id="benefits-items"
                value={content.benefits.items.join("\n")}
                onChange={(e) =>
                  setContent({
                    ...content,
                    benefits: { ...content.benefits, items: e.target.value.split("\n").filter((item) => item.trim()) },
                  })
                }
                className="bg-slate-700 border-slate-600 text-white"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Đăng ký mạng xã hội</CardTitle>
            <CardDescription className="text-slate-400">Cài đặt đăng ký qua mạng xã hội</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="social-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="social-title"
                value={content.social.title}
                onChange={(e) => setContent({ ...content, social: { ...content.social, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={content.social.enableGoogle}
                  onChange={(e) =>
                    setContent({ ...content, social: { ...content.social, enableGoogle: e.target.checked } })
                  }
                  className="rounded"
                />
                <span>Bật đăng ký Google</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={content.social.enableFacebook}
                  onChange={(e) =>
                    setContent({ ...content, social: { ...content.social, enableFacebook: e.target.checked } })
                  }
                  className="rounded"
                />
                <span>Bật đăng ký Facebook</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
