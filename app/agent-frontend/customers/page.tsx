"use client"

import { useState } from "react"
import AgentLayout from "@/components/agent/agent-layout"
import { useAgentLanguage } from "@/contexts/agent-language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Eye, Mail, Phone } from "lucide-react"

export default function CustomersPage() {
  const { t } = useAgentLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      registeredDate: "2024-01-15",
      status: "active",
      totalSpent: "₫25,000,000",
      projects: 2,
      source: "Facebook",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0912345678",
      registeredDate: "2024-01-14",
      status: "pending",
      totalSpent: "₫0",
      projects: 0,
      source: "Website",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0923456789",
      registeredDate: "2024-01-13",
      status: "active",
      totalSpent: "₫45,000,000",
      projects: 3,
      source: "Email",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0934567890",
      registeredDate: "2024-01-12",
      status: "active",
      totalSpent: "₫18,500,000",
      projects: 1,
      source: "Facebook",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("customers.title")}</h1>
            <p className="text-slate-600 mt-1">{t("customers.description")}</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("customers.export")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">156</p>
                <p className="text-sm text-slate-600">{t("customers.totalCustomers")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">142</p>
                <p className="text-sm text-slate-600">{t("customers.activeCustomers")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">14</p>
                <p className="text-sm text-slate-600">{t("customers.pendingCustomers")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₫88.5M</p>
                <p className="text-sm text-slate-600">{t("customers.totalRevenue")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={t("customers.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t("customers.filter")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("customers.customersList")} ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-slate-600">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status === "active" ? t("common.active") : t("common.pending")}
                          </Badge>
                          <span className="text-slate-500">từ {customer.source}</span>
                        </div>
                        <div className="text-slate-600">
                          <span className="font-medium">{customer.totalSpent}</span> • {customer.projects} dự án
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Đăng ký: {customer.registeredDate}</div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {t("customers.viewDetails")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  )
}
