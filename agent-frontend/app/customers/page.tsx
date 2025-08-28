"use client"

import { useState } from "react"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import AgentLayout from "../../components/agent-layout"
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Mail, Phone } from "lucide-react"

export default function CustomersPage() {
  const { t } = useAgentLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const customers = [
    {
      id: 1,
      email: "nguyen.thi.b@email.com",
      name: "Nguyễn Thị B",
      phone: "0123456789",
      registrationDate: "2024-01-15",
      packageStatus: "active",
      packageName: "Gói Cơ bản",
      revenue: 2500000,
      lastActivity: "2024-01-20",
    },
    {
      id: 2,
      email: "tran.van.c@email.com",
      name: "Trần Văn C",
      phone: "0987654321",
      registrationDate: "2024-01-10",
      packageStatus: "expired",
      packageName: "Gói Nâng cao",
      revenue: 5000000,
      lastActivity: "2024-01-18",
    },
    {
      id: 3,
      email: "le.thi.d@email.com",
      name: "Lê Thị D",
      phone: "0456789123",
      registrationDate: "2024-01-08",
      packageStatus: "active",
      packageName: "Gói Chuyên nghiệp",
      revenue: 8500000,
      lastActivity: "2024-01-22",
    },
    // Add more mock data...
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Đang hoạt động", className: "bg-green-100 text-green-800" },
      expired: { label: "Hết hạn", className: "bg-red-100 text-red-800" },
      pending: { label: "Chờ kích hoạt", className: "bg-yellow-100 text-yellow-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>{config.label}</span>
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.packageStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("sidebar.myCustomers")}</h1>
          <p className="text-gray-600">Danh sách khách hàng đã đăng ký qua link giới thiệu của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="agent-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
              <div className="text-sm text-gray-600">Tổng khách hàng</div>
            </div>
          </div>
          <div className="agent-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {customers.filter((c) => c.packageStatus === "active").length}
              </div>
              <div className="text-sm text-gray-600">Đang hoạt động</div>
            </div>
          </div>
          <div className="agent-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {customers.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}₫
              </div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
            </div>
          </div>
          <div className="agent-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(customers.reduce((sum, c) => sum + c.revenue, 0) * 0.05).toLocaleString()}₫
              </div>
              <div className="text-sm text-gray-600">Hoa hồng tích lũy</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="agent-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 agent-input w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="agent-input w-40"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="expired">Hết hạn</option>
                  <option value="pending">Chờ kích hoạt</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCustomers.length)} trong{" "}
              {filteredCustomers.length} khách hàng
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="agent-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="agent-table">
              <thead className="bg-gray-50">
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Ngày đăng ký</th>
                  <th>Gói cước</th>
                  <th>Trạng thái</th>
                  <th>Doanh thu</th>
                  <th>Hoạt động cuối</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-800">
                          <Mail className="h-4 w-4" />
                        </a>
                        <a href={`tel:${customer.phone}`} className="text-green-600 hover:text-green-800">
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                    <td className="text-sm text-gray-900">{customer.registrationDate}</td>
                    <td className="text-sm text-gray-900">{customer.packageName}</td>
                    <td>{getStatusBadge(customer.packageStatus)}</td>
                    <td className="text-sm font-medium text-gray-900">{customer.revenue.toLocaleString()}₫</td>
                    <td className="text-sm text-gray-500">{customer.lastActivity}</td>
                    <td>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Trước</span>
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? "bg-slate-900 text-white"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Sau</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AgentLayout>
  )
}
