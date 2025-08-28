"use client"
import AgentLayout from "@/components/agent/agent-layout"
import { useAgentLanguage } from "@/contexts/agent-language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Clock, CheckCircle, Download } from "lucide-react"

export default function CommissionPage() {
  const { t } = useAgentLanguage()

  const commissionData = {
    totalEarned: "₫45,230,000",
    thisMonth: "₫8,450,000",
    pending: "₫2,100,000",
    available: "₫6,350,000",
  }

  const transactions = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      project: "Xây dựng nhà phố",
      amount: "₫1,250,000",
      rate: "5%",
      date: "2024-01-15",
      status: "paid",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      project: "Sửa chữa văn phòng",
      amount: "₫750,000",
      rate: "5%",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      project: "Xây dựng biệt thự",
      amount: "₫2,250,000",
      rate: "5%",
      date: "2024-01-13",
      status: "paid",
    },
  ]

  const paymentHistory = [
    {
      id: 1,
      amount: "₫5,200,000",
      date: "2024-01-01",
      method: "Chuyển khoản",
      status: "completed",
    },
    {
      id: 2,
      amount: "₫3,800,000",
      date: "2023-12-01",
      method: "Chuyển khoản",
      status: "completed",
    },
  ]

  return (
    <AgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("commission.title")}</h1>
            <p className="text-slate-600 mt-1">{t("commission.description")}</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            {t("commission.requestPayment")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("commission.totalEarned")}</p>
                  <p className="text-2xl font-bold text-slate-900">{commissionData.totalEarned}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("commission.thisMonth")}</p>
                  <p className="text-2xl font-bold text-slate-900">{commissionData.thisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("commission.pending")}</p>
                  <p className="text-2xl font-bold text-slate-900">{commissionData.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("commission.available")}</p>
                  <p className="text-2xl font-bold text-slate-900">{commissionData.available}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">{t("commission.transactions")}</TabsTrigger>
            <TabsTrigger value="payments">{t("commission.paymentHistory")}</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>{t("commission.recentTransactions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">{transaction.customer}</h3>
                          <p className="text-slate-600 text-sm">{transaction.project}</p>
                          <p className="text-xs text-slate-500 mt-1">{transaction.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">{transaction.amount}</p>
                            <p className="text-sm text-slate-600">Tỷ lệ: {transaction.rate}</p>
                          </div>
                          <Badge variant={transaction.status === "paid" ? "default" : "secondary"}>
                            {transaction.status === "paid" ? t("commission.paid") : t("commission.pending")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>{t("commission.paymentHistory")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{payment.amount}</p>
                          <p className="text-slate-600 text-sm">{payment.method}</p>
                          <p className="text-xs text-slate-500 mt-1">{payment.date}</p>
                        </div>
                        <Badge variant="default">{t("commission.completed")}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AgentLayout>
  )
}
