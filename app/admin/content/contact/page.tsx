"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye } from "lucide-react"

export default function ContactContentPage() {
  const [content, setContent] = useState({
    hero: {
      title: "Liên hệ với chúng tôi",
      subtitle: "Chúng tôi luôn sẵn sàng hỗ trợ bạn",
    },
    contact: {
      address: "123 Đường ABC, Quận 1, TP.HCM",
      phone: "+84 123 456 789",
      email: "contact@constructvn.com",
      workingHours: "Thứ 2 - Thứ 6: 8:00 - 17:00",
    },
    form: {
      title: "Gửi tin nhắn cho chúng tôi",
      description: "Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất",
    },
    social: {
      facebook: "https://facebook.com/constructvn",
      linkedin: "https://linkedin.com/company/constructvn",
      twitter: "https://twitter.com/constructvn",
    },
  })

  const handleSave = () => {
    console.log("Saving contact content:", content)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung - Liên hệ</h1>
          <p className="text-slate-400">Chỉnh sửa thông tin liên hệ</p>
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
            <CardDescription className="text-slate-400">Phần giới thiệu trang liên hệ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="contact-title"
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="contact-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Input
                id="contact-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Thông tin liên hệ</CardTitle>
            <CardDescription className="text-slate-400">Địa chỉ, điện thoại, email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-slate-300">
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={content.contact.address}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-300">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={content.contact.phone}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                value={content.contact.email}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="hours" className="text-slate-300">
                Giờ làm việc
              </Label>
              <Input
                id="hours"
                value={content.contact.workingHours}
                onChange={(e) =>
                  setContent({ ...content, contact: { ...content.contact, workingHours: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Form liên hệ</CardTitle>
            <CardDescription className="text-slate-400">Cài đặt form gửi tin nhắn</CardDescription>
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
              <Textarea
                id="form-desc"
                value={content.form.description}
                onChange={(e) => setContent({ ...content, form: { ...content.form, description: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Mạng xã hội</CardTitle>
            <CardDescription className="text-slate-400">Liên kết mạng xã hội</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook" className="text-slate-300">
                Facebook
              </Label>
              <Input
                id="facebook"
                value={content.social.facebook}
                onChange={(e) => setContent({ ...content, social: { ...content.social, facebook: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-slate-300">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={content.social.linkedin}
                onChange={(e) => setContent({ ...content, social: { ...content.social, linkedin: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="twitter" className="text-slate-300">
                Twitter
              </Label>
              <Input
                id="twitter"
                value={content.social.twitter}
                onChange={(e) => setContent({ ...content, social: { ...content.social, twitter: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
