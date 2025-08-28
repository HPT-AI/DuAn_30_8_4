"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import {
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserPlus,
  Activity,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"

export default function AdminDashboard() {
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for dashboard
  const stats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    monthlyRevenue: 45680000,
    supportTickets: 23,
  }

  const recentUsers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyen.van.a@example.com",
      plan: "Professional",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tran.thi.b@example.com",
      plan: "Basic",
      status: "active",
      joinDate: "2024-01-14",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "le.van.c@example.com",
      plan: "Enterprise",
      status: "pending",
      joinDate: "2024-01-13",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "pham.thi.d@example.com",
      plan: "Free",
      status: "active",
      joinDate: "2024-01-12",
    },
  ]

  const subscriptions = [
    { id: 1, user: "Nguyễn Văn A", plan: "Professional", amount: 599000, status: "active", nextBilling: "2024-02-15" },
    { id: 2, user: "Trần Thị B", plan: "Basic", amount: 299000, status: "active", nextBilling: "2024-02-14" },
    { id: 3, user: "Lê Văn C", plan: "Enterprise", amount: 1299000, status: "cancelled", nextBilling: "-" },
    { id: 4, user: "Phạm Thị D", plan: "Professional", amount: 599000, status: "active", nextBilling: "2024-02-13" },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center shadow-lg shadow-red-500/25">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ConstructVN Admin
              </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng, đơn hàng..."
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-red-500/50"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative text-slate-300 hover:text-red-400">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>{language === "vi" ? "🇻🇳 VN" : "🇺🇸 EN"}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    onClick={() => setLanguage("vi")}
                    className="flex items-center space-x-2 text-slate-300 hover:text-red-400 hover:bg-slate-700"
                  >
                    <span>🇻🇳</span>
                    <span>Tiếng Việt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className="flex items-center space-x-2 text-slate-300 hover:text-red-400 hover:bg-slate-700"
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-slate-300 hover:text-red-400">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                  <span className="text-sm">Admin User</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-red-400 hover:bg-slate-700">
                    <Settings className="w-4 h-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-red-400 hover:bg-slate-700">
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent mb-2">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-slate-400">Quản lý hệ thống ConstructVN</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-red-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-orange-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Gói đang hoạt động</CardTitle>
              <Package className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeSubscriptions.toLocaleString()}</div>
              <p className="text-xs text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Doanh thu tháng</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₫{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-yellow-500/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Tickets hỗ trợ</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.supportTickets}</div>
              <p className="text-xs text-red-400 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                -5% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              <Users className="w-4 h-4 mr-2" />
              Người dùng
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gói dịch vụ
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-400" />
                    Hoạt động gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Người dùng mới đăng ký: Nguyễn Văn A</span>
                    <span className="text-slate-500 text-xs">5 phút trước</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Thanh toán thành công: ₫599,000</span>
                    <span className="text-slate-500 text-xs">10 phút trước</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Ticket hỗ trợ mới: #1234</span>
                    <span className="text-slate-500 text-xs">15 phút trước</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Gói dịch vụ bị hủy: Enterprise</span>
                    <span className="text-slate-500 text-xs">30 phút trước</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                    Thống kê nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Tỷ lệ chuyển đổi</span>
                    <span className="text-emerald-400 font-semibold">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Thời gian phản hồi trung bình</span>
                    <span className="text-blue-400 font-semibold">2.3 giờ</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Độ hài lòng khách hàng</span>
                    <span className="text-yellow-400 font-semibold">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Uptime hệ thống</span>
                    <span className="text-emerald-400 font-semibold">99.9%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-red-400" />
                    Quản lý người dùng
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Lọc
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Xuất
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Thêm người dùng
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Người dùng</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Gói</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Ngày tham gia</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-sm text-slate-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                user.plan === "Enterprise"
                                  ? "default"
                                  : user.plan === "Professional"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={user.status === "active" ? "default" : "secondary"}
                              className={
                                user.status === "active"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }
                            >
                              {user.status === "active" ? "Hoạt động" : "Chờ xử lý"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{user.joinDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-blue-400">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-yellow-400">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-red-400" />
                    Quản lý gói dịch vụ
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Làm mới
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Xuất báo cáo
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Người dùng</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Gói</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Số tiền</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Gia hạn tiếp theo</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub) => (
                        <tr key={sub.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-3 px-4 text-white font-medium">{sub.user}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                sub.plan === "Enterprise"
                                  ? "default"
                                  : sub.plan === "Professional"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {sub.plan}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-white font-medium">₫{sub.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={sub.status === "active" ? "default" : "secondary"}
                              className={
                                sub.status === "active"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-red-500/20 text-red-400"
                              }
                            >
                              {sub.status === "active" ? "Hoạt động" : "Đã hủy"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{sub.nextBilling}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-blue-400">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-yellow-400">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-red-400" />
                    Cài đặt hệ thống
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tên hệ thống</label>
                    <Input defaultValue="ConstructVN" className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email hỗ trợ</label>
                    <Input
                      defaultValue="support@constructvn.com"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Múi giờ</label>
                    <Input defaultValue="Asia/Ho_Chi_Minh" className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-400" />
                    Bảo mật
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Xác thực 2 bước</div>
                      <div className="text-sm text-slate-400">Bảo vệ tài khoản admin</div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã bật
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Đăng nhập IP cố định</div>
                      <div className="text-sm text-slate-400">Chỉ cho phép IP được phê duyệt</div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Chờ cấu hình
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Mã hóa dữ liệu</div>
                      <div className="text-sm text-slate-400">AES-256 encryption</div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Hoạt động
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    Cấu hình bảo mật
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
