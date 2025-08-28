"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAgentAuth } from "../contexts/agent-auth-context"
import AgentLayout from "../components/agent-layout"

export default function AgentDashboardPage() {
  const { agent, isLoading } = useAgentAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !agent) {
      router.push("/agent-frontend/login")
    }
  }, [agent, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return null
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chào mừng trở lại, {agent.name}!</h1>
          <p className="text-gray-600">Tổng quan về hiệu suất của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">48,500,000₫</p>
              </div>
            </div>
          </div>

          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng hoa hồng</p>
                <p className="text-2xl font-bold text-gray-900">2,425,000₫</p>
              </div>
            </div>
          </div>

          <div className="agent-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hoa hồng chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">485,000₫</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="agent-card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tiến độ đạt thưởng tháng này</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Doanh thu hiện tại</span>
              <span className="font-medium">12,500,000₫ / 20,000,000₫</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-slate-900 h-2 rounded-full" style={{ width: "62.5%" }}></div>
            </div>
            <p className="text-sm text-gray-600">
              Bạn cần thêm <strong>7,500,000₫</strong> để đạt mục tiêu và nhận thưởng <strong>1,000,000₫</strong>
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="agent-card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Khách hàng mới đăng ký</p>
                <p className="text-xs text-gray-500">Nguyễn Thị B - 2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Hoa hồng được ghi nhận</p>
                <p className="text-xs text-gray-500">125,000₫ - 4 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Khách hàng gia hạn gói</p>
                <p className="text-xs text-gray-500">Trần Văn C - 1 ngày trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  )
}
