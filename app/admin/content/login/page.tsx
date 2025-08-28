"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Eye } from "lucide-react"

export default function LoginContentPage() {
  const [content, setContent] = useState({
    hero: {
      title: "Đăng nhập",
      subtitle: "Chào mừng bạn quay trở lại",
    },
    form: {
      title: "Đăng nhập vào tài khoản",
      description: "Nhập thông tin đăng nhập của bạn",
      forgotPassword: "Quên mật khẩu?",
      rememberMe: "Ghi nhớ đăng nhập",
    },
    register: {
      text: "Chưa có tài khoản?",
      linkText: "Đăng ký ngay",
    },
    social: {
      title: "Hoặc đăng nhập bằng",
      enableGoogle: true,
      enableFacebook: true,
    },
    security: {
      title: "Bảo mật",
      description: "Thông tin đăng nhập của bạn được mã hóa và bảo mật tuyệt đối",
    },
  })

  const handleSave = () => {
    console.log("Saving login content:", content)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung - Đăng nhập</h1>
          <p className="text-slate-400">Chỉnh sửa nội dung trang đăng nhập</p>
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
            <CardDescription className="text-slate-400">Phần giới thiệu trang đăng nhập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="login-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="login-title"
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="login-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input
                id="login-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Form đăng nhập</CardTitle>
            <CardDescription className="text-slate-400">Cài đặt form đăng nhập</CardDescription>
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
              <Label htmlFor="forgot-password" className="text-slate-300">
                Text quên mật khẩu
              </Label>
              <Input
                id="forgot-password"
                value={content.form.forgotPassword}
                onChange={(e) => setContent({ ...content, form: { ...content.form, forgotPassword: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="remember-me" className="text-slate-300">
                Text ghi nhớ
              </Label>
              <Input
                id="remember-me"
                value={content.form.rememberMe}
                onChange={(e) => setContent({ ...content, form: { ...content.form, rememberMe: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Liên kết đăng ký</CardTitle>
            <CardDescription className="text-slate-400">Liên kết đến trang đăng ký</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="register-text" className="text-slate-300">
                Text dẫn
              </Label>
              <Input
                id="register-text"
                value={content.register.text}
                onChange={(e) => setContent({ ...content, register: { ...content.register, text: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="register-link" className="text-slate-300">
                Text link
              </Label>
              <Input
                id="register-link"
                value={content.register.linkText}
                onChange={(e) =>
                  setContent({ ...content, register: { ...content.register, linkText: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Đăng nhập mạng xã hội</CardTitle>
            <CardDescription className="text-slate-400">Cài đặt đăng nhập qua mạng xã hội</CardDescription>
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
                <span>Bật đăng nhập Google</span>
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
                <span>Bật đăng nhập Facebook</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
