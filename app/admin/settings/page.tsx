"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Mail, Database, Globe, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AdminSettingsPage() {
  const { t, isHydrated } = useLanguage()
  const [settings, setSettings] = useState({
    siteName: "ConstructVN",
    siteDescription: "Nền tảng quản lý thi công xây dựng",
    adminEmail: "admin@constructvn.com",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    autoBackup: true,
    maxFileSize: "10",
    sessionTimeout: "30",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // Save settings logic here
    alert("Cài đặt đã được lưu thành công!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isHydrated ? t("admin.settings.title") : "Cài đặt Hệ thống"}
          </h1>
          <p className="text-slate-400 mt-2">
            {isHydrated ? t("admin.settings.subtitle") : "Quản lý cấu hình và thiết lập hệ thống"}
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
          Lưu tất cả cài đặt
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-red-600">
            <Globe className="w-4 h-4 mr-2" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600">
            <Shield className="w-4 h-4 mr-2" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-red-600">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-red-600">
            <Database className="w-4 h-4 mr-2" />
            Hệ thống
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Thông tin Website</CardTitle>
                <CardDescription className="text-slate-400">Cấu hình thông tin cơ bản của website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Tên website</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Mô tả website</Label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Email quản trị</Label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange("adminEmail", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cài đặt Chức năng</CardTitle>
                <CardDescription className="text-slate-400">Bật/tắt các tính năng của hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Chế độ bảo trì</Label>
                    <p className="text-sm text-slate-400">Tạm thời tắt website để bảo trì</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Cho phép đăng ký</Label>
                    <p className="text-sm text-slate-400">Người dùng có thể tự đăng ký tài khoản</p>
                  </div>
                  <Switch
                    checked={settings.userRegistration}
                    onCheckedChange={(checked) => handleSettingChange("userRegistration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Thông báo email</Label>
                    <p className="text-sm text-slate-400">Gửi email thông báo tự động</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cài đặt Bảo mật</CardTitle>
                <CardDescription className="text-slate-400">Cấu hình các tùy chọn bảo mật hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Thời gian hết hạn phiên (phút)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Kích thước file tối đa (MB)</Label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange("maxFileSize", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Mức độ bảo mật mật khẩu</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sao lưu & Khôi phục</CardTitle>
                <CardDescription className="text-slate-400">Quản lý sao lưu dữ liệu hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Tự động sao lưu</Label>
                    <p className="text-sm text-slate-400">Sao lưu dữ liệu hàng ngày</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Tạo bản sao lưu ngay</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Khôi phục từ bản sao lưu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Cấu hình Email</CardTitle>
              <CardDescription className="text-slate-400">Thiết lập máy chủ email và template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">SMTP Server</Label>
                    <Input placeholder="smtp.gmail.com" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">SMTP Port</Label>
                    <Input placeholder="587" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Username</Label>
                    <Input placeholder="your-email@gmail.com" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-slate-700 border-slate-600 text-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Email gửi từ</Label>
                    <Input placeholder="noreply@constructvn.com" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Tên hiển thị</Label>
                    <Input placeholder="ConstructVN System" className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Kiểm tra kết nối</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Thông tin Hệ thống</CardTitle>
                <CardDescription className="text-slate-400">
                  Thông tin về phiên bản và cấu hình hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Phiên bản:</span>
                  <span className="text-white">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Database:</span>
                  <span className="text-white">PostgreSQL 14.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Server:</span>
                  <span className="text-white">Node.js 18.17.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Uptime:</span>
                  <span className="text-white">15 ngày 4 giờ</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Bảo trì Hệ thống</CardTitle>
                <CardDescription className="text-slate-400">Các công cụ bảo trì và tối ưu hóa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  Xóa cache hệ thống
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Tối ưu hóa database
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Kiểm tra tính toàn vẹn dữ liệu
                </Button>
                <Button variant="destructive" className="w-full">
                  Khởi động lại hệ thống
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
