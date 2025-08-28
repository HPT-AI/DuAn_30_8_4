"use client"

import { useState } from "react"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import AgentLayout from "../../components/agent-layout"
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Calendar } from "lucide-react"

export default function CommissionPage() {
  const { t } = useAgentLanguage()
  const [activeTab, setActiveTab] = useState("overview")

  const commissionData = {
    totalEarned: 12450000,
    pendingCommission: 485000,
    paidCommission: 11965000,
    thisMonthEarning: 2850000,
  }

  const commissionHistory = [
    {
      id: 1,
      customerName: "Nguyễn Thị B",
      service: "Gói Cơ bản",
      transactionAmount: 2500000,
      commissionRate: 5,
      commissionAmount: 125000,
      date: "2024-01-20",
      status: "paid",
    },
    {
      id: 2,
      customerName: "Trần Văn C",
      service: "Gói Nâng cao",
      transactionAmount: 5000000,
      commissionRate: 5,
      commissionAmount: 250000,
      date: "2024-01-18",
      status: "pending",
    },
    {
      id: 3,
      customerName: "Lê Thị D",
      service: "Gói Chuyên nghiệp",
      transactionAmount: 8500000,
      commissionRate: 5,
      commissionAmount: 425000,
      date: "2024-01-15",
      status: "paid",
    },
  ]

  const bonusHistory = [
    {
      id: 1,
      type: "Thưởng tháng",
      amount: 1000000,
      reason: "Đạt mục tiêu doanh thu 20 triệu",
      date: "2024-01-01",
      status: "paid",
    },
    {
      id: 2,
      type: "Thưởng quý",
      amount: 2500000,
      reason: "Top 10 đại lý xuất sắc Q4/2023",
      date: "2023-12-31",
      status: "paid",
    },
  ]

  const paymentHistory = [
    {
      id: 1,
      amount: 5500000,
      type: "Hoa hồng + Thưởng",
      method: "Chuyển khoản",
      date: "2024-01-01",
      status: "completed",
      transactionId: "TXN001234567",
    },
    {
      id: 2,
      amount: 3200000,
      type: "Hoa hồng",
      method: "Chuyển khoản",
      date: "2023-12-01",
      status: "completed",
      transactionId: "TXN001234566",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
      pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      completed: { label: "Hoàn thành", className: "bg-blue-100 text-blue-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>{config.label}</span>
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("sidebar.commission")}</h1>
          <p className="text-gray-600">Theo dõi hoa hồng và lịch sử thanh toán của bạn</p>
        </div>

        {/* Commission Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng hoa hồng</p>
                <p className="text-2xl font-bold text-gray-900">{commissionData.totalEarned.toLocaleString()}₫</p>
              </div>
            </div>
          </div>

          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{commissionData.pendingCommission.toLocaleString()}₫</p>
              </div>
            </div>
          </div>

          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đã thanh toán</p>
                <p className="text-2xl font-bold text-gray-900">{commissionData.paidCommission.toLocaleString()}₫</p>
              </div>
            </div>
          </div>

          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tháng này</p>
                <p className="text-2xl font-bold text-gray-900">{commissionData.thisMonthEarning.toLocaleString()}₫</p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Request */}
        <div className="agent-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Yêu cầu thanh toán</h3>
              <p className="text-sm text-gray-600">
                Số dư khả dụng: <strong>{commissionData.pendingCommission.toLocaleString()}₫</strong>
              </p>
            </div>
            <button
              disabled={commissionData.pendingCommission < 500000}
              className="agent-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yêu cầu rút tiền
            </button>
          </div>
          {commissionData.pendingCommission < 500000 && (
            <p className="text-sm text-orange-600 mt-2">Số tiền tối thiểu để rút là 500,000₫</p>
          )}
        </div>

        {/* Tabs */}
        <div className="agent-card">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Tổng quan" },
                { id: "commission", label: "Lịch sử hoa hồng" },
                { id: "bonus", label: "Lịch sử thưởng" },
                { id: "payment", label: "Lịch sử thanh toán" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-slate-500 text-slate-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Biểu đồ xu hướng hoa hồng theo thời gian</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "commission" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Lịch sử giao dịch hoa hồng</h4>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Download className="h-4 w-4" />
                    <span>Xuất Excel</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="agent-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th>Khách hàng</th>
                        <th>Dịch vụ</th>
                        <th>Số tiền giao dịch</th>
                        <th>Tỷ lệ hoa hồng</th>
                        <th>Hoa hồng</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionHistory.map((item) => (
                        <tr key={item.id}>
                          <td className="font-medium">{item.customerName}</td>
                          <td>{item.service}</td>
                          <td>{item.transactionAmount.toLocaleString()}₫</td>
                          <td>{item.commissionRate}%</td>
                          <td className="font-medium text-green-600">{item.commissionAmount.toLocaleString()}₫</td>
                          <td>{item.date}</td>
                          <td>{getStatusBadge(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "bonus" && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Lịch sử thưởng</h4>
                <div className="space-y-3">
                  {bonusHistory.map((bonus) => (
                    <div key={bonus.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{bonus.type}</h5>
                          <p className="text-sm text-gray-600">{bonus.reason}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {bonus.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">+{bonus.amount.toLocaleString()}₫</div>
                          {getStatusBadge(bonus.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Lịch sử thanh toán</h4>
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{payment.type}</h5>
                          <p className="text-sm text-gray-600">Phương thức: {payment.method}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Mã GD: {payment.transactionId} • {payment.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{payment.amount.toLocaleString()}₫</div>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  )
}
