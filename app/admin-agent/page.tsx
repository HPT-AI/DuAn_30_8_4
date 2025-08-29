"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  CreditCard,
  Settings,
  FileText,
} from "lucide-react"

export default function AdminAgentPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    setIsAuthenticated(authStatus === "true")
    setLoading(false)
  }, [])


  if (!isAuthenticated) {
    // Khi chưa đăng nhập, không render gì để tránh flicker; layout sẽ xử lý hiển thị login ở /admin
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const agents = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "agent1@example.com",
      phone: "0123456789",
      status: "active",
      sales: 15,
      commission: 45000000,
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "agent2@example.com",
      phone: "0987654321",
      status: "active",
      sales: 8,
      commission: 24000000,
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "agent3@example.com",
      phone: "0555666777",
      status: "inactive",
      sales: 3,
      commission: 9000000,
      joinDate: "2024-03-10",
    },
  ]

  const commissionPayments = [
    {
      id: 1,
      agentName: "Nguyễn Văn A",
      amount: 15000000,
      period: "2024-01",
      status: "paid",
      paymentDate: "2024-02-01",
      method: "Bank Transfer",
    },
    {
      id: 2,
      agentName: "Trần Thị B",
      amount: 8000000,
      period: "2024-01",
      status: "pending",
      paymentDate: null,
      method: "Bank Transfer",
    },
    {
      id: 3,
      agentName: "Lê Văn C",
      amount: 3000000,
      period: "2024-01",
      status: "processing",
      paymentDate: null,
      method: "E-wallet",
    },
  ]

  const navigationItems = [
    { id: "overview", label: t("agentManagement.overview"), icon: BarChart3 },
    { id: "commission", label: t("agentManagement.commission"), icon: CreditCard },
    { id: "reports", label: t("agentManagement.reports"), icon: FileText },
    { id: "settings", label: t("agentManagement.settings"), icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "commission":
        return (
          <div className="space-y-6">
            {/* Commission Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.monthlyCommission")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">240M đ</div>
                  <p className="text-xs text-green-400">{t("agentManagement.compareLastMonth").replace("{percent}", "15")}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.paidCommission")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">180M đ</div>
                  <p className="text-xs text-slate-300">{t("agentManagement.percentOfCommission").replace("{percent}", "75")}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.pendingCommission")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">60M đ</div>
                  <p className="text-xs text-yellow-400">{t("agentManagement.percentOfCommission").replace("{percent}", "25")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Commission Payments Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">{t("agentManagement.commissionHistory")}</CardTitle>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t("agentManagement.batchPayment")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.agent")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.amount")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.period")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.status")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.paymentDate")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.paymentMethod")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-700/50">
                          <td className="py-3 px-4 text-slate-200">{payment.agentName}</td>
                          <td className="py-3 px-4 text-slate-200">{payment.amount.toLocaleString("vi-VN")} đ</td>
                          <td className="py-3 px-4 text-slate-200">{payment.period}</td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                payment.status === "paid"
                                  ? "bg-green-500 text-white"
                                  : payment.status === "pending"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-blue-500 text-white"
                              }
                            >
                              {payment.status === "paid"
                                ? t("agentManagement.paid")
                                : payment.status === "pending"
                                  ? t("agentManagement.pending")
                                  : t("agentManagement.processing")}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-200">{payment.paymentDate || t("agentManagement.notPaid")}</td>
                          <td className="py-3 px-4 text-slate-200">{payment.method}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {payment.status === "pending" && (
                                <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.totalAgents")}</CardTitle>
                  <Users className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">156</div>
                  <p className="text-xs text-slate-300">{t("agentManagement.compareLastMonth").replace("{percent}", "12")}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.activeAgents")}</CardTitle>
                  <UserPlus className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">142</div>
                  <p className="text-xs text-slate-300">{t("agentManagement.percentOfTotal").replace("{percent}", "91")}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.monthlySales")}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">2.4B</div>
                  <p className="text-xs text-slate-300">{t("agentManagement.compareLastMonth").replace("{percent}", "18")}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-100">{t("agentManagement.commission")}</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">240M</div>
                  <p className="text-xs text-slate-300">{t("agentManagement.percentOfSales").replace("{percent}", "10")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Agent Management */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">{t("agentManagement.agentList")}</CardTitle>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("agentManagement.addAgent")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.agent")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.contact")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.status")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.sales")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.commissionAmount")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.joinDate")}</th>
                        <th className="text-left py-3 px-4 text-slate-100 font-medium">{t("agentManagement.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent) => (
                        <tr key={agent.id} className="border-b border-slate-700/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-slate-200">{agent.name}</div>
                              <div className="text-sm text-slate-400">ID: {agent.id}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm text-slate-200">{agent.email}</div>
                              <div className="text-sm text-slate-400">{agent.phone}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={agent.status === "active" ? "default" : "secondary"}
                              className={
                                agent.status === "active" ? "bg-green-500 text-white" : "bg-slate-600 text-slate-300"
                              }
                            >
                              {agent.status === "active" ? t("agentManagement.active") : t("agentManagement.inactive")}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-200">{agent.sales} {t("agentManagement.packages")}</td>
                          <td className="py-3 px-4 text-slate-200">{agent.commission.toLocaleString("vi-VN")} đ</td>
                          <td className="py-3 px-4 text-slate-300">{agent.joinDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
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
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  )
}
