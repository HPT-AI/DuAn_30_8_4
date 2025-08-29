"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CreditCard, TrendingUp, Users, DollarSign } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Subscription {
  id: string
  userId: string
  userName: string
  userEmail: string
  plan: string
  status: "active" | "expired" | "cancelled"
  startDate: string
  endDate: string
  amount: number
  paymentMethod: string
}

export default function AdminSubscriptionsPage() {
  const { t, isHydrated } = useLanguage()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      userId: "1",
      userName: "Nguyễn Văn A",
      userEmail: "nguyen.van.a@example.com",
      plan: "Professional",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      amount: 599000,
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      userId: "2",
      userName: "Trần Thị B",
      userEmail: "tran.thi.b@example.com",
      plan: "Basic",
      status: "active",
      startDate: "2024-02-20",
      endDate: "2025-02-20",
      amount: 299000,
      paymentMethod: "QR Transfer",
    },
    {
      id: "3",
      userId: "3",
      userName: "Lê Văn C",
      userEmail: "le.van.c@example.com",
      plan: "Professional",
      status: "expired",
      startDate: "2023-12-01",
      endDate: "2024-12-01",
      amount: 599000,
      paymentMethod: "Credit Card",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          {isHydrated ? t("admin.subscriptions.status_active") : "Đang hoạt động"}
        </Badge>
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          {isHydrated ? t("admin.subscriptions.status_expired") : "Hết hạn"}
        </Badge>
      case "cancelled":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          {isHydrated ? t("admin.subscriptions.status_cancelled") : "Đã hủy"}
        </Badge>
      default:
        return <Badge>{isHydrated ? t("admin.subscriptions.status_unknown") : "Không xác định"}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Professional":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Professional</Badge>
      case "Basic":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Basic</Badge>
      case "Enterprise":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Enterprise</Badge>
      default:
        return <Badge>Free</Badge>
    }
  }

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "active").length
  const expiredSubscriptions = subscriptions.filter((sub) => sub.status === "expired").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isHydrated ? t("admin.subscriptions.title") : "Quản lý Gói dịch vụ"}
          </h1>
          <p className="text-slate-400 mt-2">
            {isHydrated ? t("admin.subscriptions.subtitle") : "Theo dõi và quản lý subscription của người dùng"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {isHydrated ? t("admin.subscriptions.total_revenue") : "Tổng doanh thu"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalRevenue.toLocaleString("vi-VN")} đ</div>
            <p className="text-xs text-slate-400">
              {isHydrated ? "+15% " + t("admin.subscriptions.vs_last_month") : "+15% so với tháng trước"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {isHydrated ? t("admin.subscriptions.active_subscriptions") : "Subscription hoạt động"}
            </CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeSubscriptions}</div>
            <p className="text-xs text-slate-400">
              {isHydrated ? "+8% " + t("admin.subscriptions.vs_last_week") : "+8% so với tuần trước"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {isHydrated ? t("admin.subscriptions.expired_subscriptions") : "Subscription hết hạn"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{expiredSubscriptions}</div>
            <p className="text-xs text-slate-400">
              {isHydrated ? "-3% " + t("admin.subscriptions.vs_last_week") : "-3% so với tuần trước"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {isHydrated ? t("admin.subscriptions.renewal_rate") : "Tỷ lệ gia hạn"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">85%</div>
            <p className="text-xs text-slate-400">
              {isHydrated ? "+2% " + t("admin.subscriptions.vs_last_month") : "+2% so với tháng trước"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Management */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600">
            {isHydrated ? t("admin.subscriptions.all") : "Tất cả"}
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-red-600">
            {isHydrated ? t("admin.subscriptions.active") : "Đang hoạt động"}
          </TabsTrigger>
          <TabsTrigger value="expired" className="data-[state=active]:bg-red-600">
            {isHydrated ? t("admin.subscriptions.expired") : "Hết hạn"}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-600">
            {isHydrated ? t("admin.subscriptions.cancelled") : "Đã hủy"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {isHydrated ? t("admin.subscriptions.subscription_list") : "Danh sách Subscription"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {isHydrated ? t("admin.subscriptions.manage_all_subscriptions") : "Quản lý tất cả subscription của người dùng"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder={isHydrated ? t("admin.subscriptions.search_placeholder") : "Tìm kiếm theo tên, email hoặc gói..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.user") : "Người dùng"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.service_package") : "Gói dịch vụ"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.status") : "Trạng thái"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.start_date") : "Ngày bắt đầu"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.end_date") : "Ngày hết hạn"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.amount") : "Số tiền"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {isHydrated ? t("admin.subscriptions.payment") : "Thanh toán"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id} className="border-slate-700">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{subscription.userName}</div>
                          <div className="text-sm text-slate-400">{subscription.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell className="text-slate-300">{subscription.startDate}</TableCell>
                      <TableCell className="text-slate-300">{subscription.endDate}</TableCell>
                      <TableCell className="text-slate-300">{subscription.amount.toLocaleString("vi-VN")} đ</TableCell>
                      <TableCell className="text-slate-300">{subscription.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription Đang hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Người dùng</TableHead>
                    <TableHead className="text-slate-300">Gói dịch vụ</TableHead>
                    <TableHead className="text-slate-300">Ngày hết hạn</TableHead>
                    <TableHead className="text-slate-300">Số tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions
                    .filter((sub) => sub.status === "active")
                    .map((subscription) => (
                      <TableRow key={subscription.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{subscription.userName}</div>
                            <div className="text-sm text-slate-400">{subscription.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                        <TableCell className="text-slate-300">{subscription.endDate}</TableCell>
                        <TableCell className="text-slate-300">
                          {subscription.amount.toLocaleString("vi-VN")} đ
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription Hết hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Người dùng</TableHead>
                    <TableHead className="text-slate-300">Gói dịch vụ</TableHead>
                    <TableHead className="text-slate-300">Ngày hết hạn</TableHead>
                    <TableHead className="text-slate-300">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions
                    .filter((sub) => sub.status === "expired")
                    .map((subscription) => (
                      <TableRow key={subscription.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{subscription.userName}</div>
                            <div className="text-sm text-slate-400">{subscription.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                        <TableCell className="text-slate-300">{subscription.endDate}</TableCell>
                        <TableCell>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Gia hạn
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
