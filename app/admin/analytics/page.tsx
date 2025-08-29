"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, UserCheck } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AdminAnalyticsPage() {
  const { t, isHydrated } = useLanguage()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isHydrated ? t("admin.analytics.title") : "Báo cáo & Thống kê"}
          </h1>
          <p className="text-slate-400 mt-2">
            {isHydrated ? t("admin.analytics.subtitle") : "Theo dõi hiệu suất và phân tích dữ liệu hệ thống"}
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">15.2M đ</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Người dùng hoạt động</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,847</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% so với tuần trước
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Báo cáo thi công</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,234</div>
            <div className="flex items-center text-xs text-red-400">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1% so với tuần trước
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Tỷ lệ chuyển đổi</CardTitle>
            <UserCheck className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24.8%</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3.1% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-red-600">
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-red-600">
            Báo cáo
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-red-600">
            Hiệu suất
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Doanh thu theo tháng</CardTitle>
                <CardDescription className="text-slate-400">Biểu đồ doanh thu 12 tháng gần nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  [Biểu đồ doanh thu sẽ được hiển thị ở đây]
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Doanh thu theo gói dịch vụ</CardTitle>
                <CardDescription className="text-slate-400">
                  Phân tích doanh thu từ các gói subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Professional</Badge>
                    </div>
                    <div className="text-white font-medium">8.5M đ (56%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Basic</Badge>
                    </div>
                    <div className="text-white font-medium">4.2M đ (28%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Enterprise</Badge>
                    </div>
                    <div className="text-white font-medium">2.5M đ (16%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Người dùng mới</CardTitle>
                <CardDescription className="text-slate-400">
                  Số lượng người dùng đăng ký mới theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  [Biểu đồ người dùng mới sẽ được hiển thị ở đây]
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Phân bố người dùng</CardTitle>
                <CardDescription className="text-slate-400">Thống kê người dùng theo gói dịch vụ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Free</Badge>
                    </div>
                    <div className="text-white font-medium">1,245 (44%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Basic</Badge>
                    </div>
                    <div className="text-white font-medium">892 (31%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Professional</Badge>
                    </div>
                    <div className="text-white font-medium">567 (20%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Enterprise</Badge>
                    </div>
                    <div className="text-white font-medium">143 (5%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Thống kê Báo cáo Thi công</CardTitle>
              <CardDescription className="text-slate-400">Phân tích sử dụng tính năng báo cáo thi công</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">1,234</div>
                  <div className="text-slate-400">Tổng báo cáo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">987</div>
                  <div className="text-slate-400">Đã hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">247</div>
                  <div className="text-slate-400">Đang xử lý</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Hiệu suất hệ thống</CardTitle>
                <CardDescription className="text-slate-400">Thống kê hiệu suất và tài nguyên hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">CPU Usage</span>
                    <span className="text-white font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Memory Usage</span>
                    <span className="text-white font-medium">62%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Storage Usage</span>
                    <span className="text-white font-medium">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Response Time</span>
                    <span className="text-white font-medium">245ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Lưu lượng truy cập</CardTitle>
                <CardDescription className="text-slate-400">Thống kê lưu lượng truy cập website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Hôm nay</span>
                    <span className="text-white font-medium">2,847 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tuần này</span>
                    <span className="text-white font-medium">18,234 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tháng này</span>
                    <span className="text-white font-medium">76,891 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Bounce Rate</span>
                    <span className="text-white font-medium">34.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
