"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAgentAuth } from "@/contexts/agent-auth-context"
import AgentLayout from "@/components/agent/agent-layout"
import { useAgentLanguage } from "@/contexts/agent-language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, TrendingUp, Eye, ArrowUpRight, Target, Award } from "lucide-react"

export default function AgentDashboard() {
  const { user, loading } = useAgentAuth()
  const { t } = useAgentLanguage()
  const router = useRouter()

  // Removed authentication requirement for demo purposes
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/agent-frontend/login")
  //   }
  // }, [user, loading, router])

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
  //     </div>
  //   )
  // }

  // Allow access without authentication for demo
  // if (!user) {
  //   return null
  // }

  const stats = [
    {
      title: t("dashboard.totalCustomers"),
      value: "156",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: t("dashboard.totalCommission"),
      value: "₫45,230,000",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: t("dashboard.monthlyEarnings"),
      value: "₫8,450,000",
      change: "+15.3%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: t("dashboard.linkViews"),
      value: "2,847",
      change: "+23.1%",
      icon: Eye,
      color: "text-orange-600",
    },
  ]

  const recentCustomers = [
    { name: "Nguyễn Văn A", email: "nguyenvana@email.com", date: "2024-01-15", status: "active" },
    { name: "Trần Thị B", email: "tranthib@email.com", date: "2024-01-14", status: "pending" },
    { name: "Lê Văn C", email: "levanc@email.com", date: "2024-01-13", status: "active" },
    { name: "Phạm Thị D", email: "phamthid@email.com", date: "2024-01-12", status: "active" },
  ]

  return (
    <AgentLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            {t("dashboard.welcome")}, Agent User!
          </h1>
          <p className="text-slate-300">{t("dashboard.welcomeMessage")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t("dashboard.recentCustomers")}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/agent-frontend/customers")}>
                {t("common.viewAll")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{customer.name}</p>
                        <p className="text-sm text-slate-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status === "active" ? t("common.active") : t("common.pending")}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">{customer.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => router.push("/agent-frontend/referral-links")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  {t("dashboard.createReferralLink")}
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => router.push("/agent-frontend/commission")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {t("dashboard.viewCommission")}
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => router.push("/agent-frontend/customers")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t("dashboard.manageCustomers")}
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => router.push("/agent-frontend/account")}
                >
                  <Award className="h-4 w-4 mr-2" />
                  {t("dashboard.updateProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgentLayout>
  )
}
