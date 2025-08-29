"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function SecurityPage() {
  const { t, isHydrated } = useLanguage()
  const [showApiKey, setShowApiKey] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(true)

  // Mock security logs
  const securityLogs = [
    {
      id: 1,
      action: "Đăng nhập thành công",
      user: "admin@constructvn.com",
      ip: "192.168.1.100",
      time: "2024-01-15 14:30:25",
      status: "success",
    },
    {
      id: 2,
      action: "Thay đổi mật khẩu",
      user: "admin@constructvn.com",
      ip: "192.168.1.100",
      time: "2024-01-15 10:15:42",
      status: "success",
    },
    {
      id: 3,
      action: "Đăng nhập thất bại",
      user: "unknown@example.com",
      ip: "45.123.45.67",
      time: "2024-01-14 22:45:12",
      status: "failed",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {isHydrated ? t("admin.security.title") : "Bảo mật hệ thống"}
        </h1>
        <p className="text-slate-400 mt-1">
          {isHydrated ? t("admin.security.subtitle") : "Quản lý cài đặt bảo mật và giám sát hoạt động"}
        </p>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Trạng thái bảo mật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">An toàn</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Tất cả kiểm tra đều thành công</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Đăng nhập hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-slate-400">+3 so với hôm qua</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cảnh báo bảo mật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">2</div>
            <p className="text-xs text-slate-400">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Cài đặt bảo mật</CardTitle>
          <CardDescription className="text-slate-400">Cấu hình các tùy chọn bảo mật cho hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Xác thực hai yếu tố (2FA)</Label>
              <p className="text-sm text-slate-400">Bảo vệ tài khoản với lớp bảo mật bổ sung</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Thông báo đăng nhập</Label>
              <p className="text-sm text-slate-400">Nhận email khi có đăng nhập mới</p>
            </div>
            <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
          </div>

          <div className="space-y-2">
            <Label className="text-white">API Key</Label>
            <div className="flex items-center space-x-2">
              <Input
                type={showApiKey ? "text" : "password"}
                value="sk-1234567890abcdef1234567890abcdef"
                readOnly
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-slate-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-white bg-transparent">
                Tạo mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Logs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Nhật ký bảo mật</CardTitle>
          <CardDescription className="text-slate-400">Theo dõi các hoạt động bảo mật gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      log.status === "success" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    {log.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{log.action}</h3>
                    <p className="text-sm text-slate-400">
                      {log.user} • {log.ip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${log.status === "success" ? "bg-green-500" : "bg-red-500"} text-white text-xs`}>
                    {log.status === "success" ? "Thành công" : "Thất bại"}
                  </Badge>
                  <p className="text-sm text-slate-400 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
