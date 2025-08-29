"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Eye, Facebook, Linkedin, Youtube } from "lucide-react"

export default function FooterAdminPage() {
  const [content, setContent] = useState({
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
    }
  })

  useEffect(() => {
    // Load existing content from localStorage if available
    const savedContent = localStorage.getItem("homepage_content")
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        if (parsedContent.footer) {
          setContent({ footer: parsedContent.footer })
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

    // Update only the Footer section
    const updatedContent = {
      ...fullContent,
      footer: content.footer
    }

    localStorage.setItem("homepage_content", JSON.stringify(updatedContent))
    window.dispatchEvent(new CustomEvent("homepage-content-updated", { detail: updatedContent }))
    console.log("Saving Footer content:", content.footer)
    
    // Show success message (you can implement a toast notification here)
    alert("Đã lưu thay đổi Footer thành công!")
  }

  const updateQuickLink = (index: number, field: 'name' | 'url', value: string) => {
    const newQuickLinks = [...content.footer.quickLinks]
    newQuickLinks[index] = { ...newQuickLinks[index], [field]: value }
    setContent({
      ...content,
      footer: { ...content.footer, quickLinks: newQuickLinks }
    })
  }

  const updateLegalLink = (index: number, field: 'name' | 'url', value: string) => {
    const newLegalLinks = [...content.footer.legalLinks]
    newLegalLinks[index] = { ...newLegalLinks[index], [field]: value }
    setContent({
      ...content,
      footer: { ...content.footer, legalLinks: newLegalLinks }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Footer - Chân trang</h1>
          <p className="text-slate-400">Chỉnh sửa thông tin chân trang website</p>
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
          <CardTitle className="text-white">Footer - Chân trang</CardTitle>
          <CardDescription className="text-slate-400">
            Quản lý thông tin chân trang website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="footer-company" className="text-slate-300">
                Tên công ty
              </Label>
              <Input
                id="footer-company"
                value={content.footer.companyName}
                onChange={(e) =>
                  setContent({ ...content, footer: { ...content.footer, companyName: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="footer-description" className="text-slate-300">
                Mô tả công ty
              </Label>
              <Input
                id="footer-description"
                value={content.footer.description}
                onChange={(e) =>
                  setContent({ ...content, footer: { ...content.footer, description: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="footer-address" className="text-slate-300">
                Địa chỉ
              </Label>
              <Input
                id="footer-address"
                value={content.footer.address}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, address: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="footer-phone" className="text-slate-300">
                Số điện thoại
              </Label>
              <Input
                id="footer-phone"
                value={content.footer.phone}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, phone: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="footer-email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="footer-email"
                value={content.footer.email}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Social Media Links</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="footer-facebook" className="text-slate-300">
                  Facebook
                </Label>
                <Input
                  id="footer-facebook"
                  value={content.footer.socialLinks.facebook}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: {
                        ...content.footer,
                        socialLinks: { ...content.footer.socialLinks, facebook: e.target.value },
                      },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="footer-linkedin" className="text-slate-300">
                  LinkedIn
                </Label>
                <Input
                  id="footer-linkedin"
                  value={content.footer.socialLinks.linkedin}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: {
                        ...content.footer,
                        socialLinks: { ...content.footer.socialLinks, linkedin: e.target.value },
                      },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="footer-youtube" className="text-slate-300">
                  YouTube
                </Label>
                <Input
                  id="footer-youtube"
                  value={content.footer.socialLinks.youtube}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: {
                        ...content.footer,
                        socialLinks: { ...content.footer.socialLinks, youtube: e.target.value },
                      },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {content.footer.quickLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Tên link"
                    value={link.name}
                    onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal Links</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {content.footer.legalLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Tên link"
                    value={link.name}
                    onChange={(e) => updateLegalLink(index, 'name', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateLegalLink(index, 'url', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div>
            <Label htmlFor="footer-copyright" className="text-slate-300">
              Copyright text
            </Label>
            <Input
              id="footer-copyright"
              value={content.footer.copyright}
              onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Preview Section */}
          <div className="mt-8 p-6 bg-slate-700 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">Xem trước</h3>
            <div className="bg-slate-900 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4">{content.footer.companyName}</h3>
                  <p className="text-slate-300 mb-4">{content.footer.description}</p>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>📍 {content.footer.address}</p>
                    <p>📞 {content.footer.phone}</p>
                    <p>✉️ {content.footer.email}</p>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Công ty</h4>
                  <ul className="space-y-2">
                    {content.footer.quickLinks.map((link, index) => (
                      <li key={index}>
                        <a href={link.url} className="text-slate-400 hover:text-white text-sm">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Pháp lý</h4>
                  <ul className="space-y-2">
                    {content.footer.legalLinks.map((link, index) => (
                      <li key={index}>
                        <a href={link.url} className="text-slate-400 hover:text-white text-sm">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-slate-400 text-sm">{content.footer.copyright}</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <a href={content.footer.socialLinks.facebook} className="text-slate-400 hover:text-white">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={content.footer.socialLinks.linkedin} className="text-slate-400 hover:text-white">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={content.footer.socialLinks.youtube} className="text-slate-400 hover:text-white">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}