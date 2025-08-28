"use client"

import { useState } from "react"
import { useAgentAuth } from "../../contexts/agent-auth-context"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import AgentLayout from "../../components/agent-layout"
import { Copy, ExternalLink, Plus, BarChart3, Eye, Users } from "lucide-react"

export default function ReferralLinksPage() {
  const { agent } = useAgentAuth()
  const { t } = useAgentLanguage()
  const [copied, setCopied] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [customName, setCustomName] = useState("")

  const mainReferralLink = `https://constructvn.com/register?ref=${agent?.id || "AGENT123"}`

  const customLinks = [
    {
      id: 1,
      name: "Facebook Campaign",
      url: `https://constructvn.com/register?ref=${agent?.id}&campaign=facebook`,
      clicks: 156,
      registrations: 12,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "LinkedIn Outreach",
      url: `https://constructvn.com/register?ref=${agent?.id}&campaign=linkedin`,
      clicks: 89,
      registrations: 7,
      createdAt: "2024-01-10",
    },
  ]

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateCustomLink = () => {
    if (customName.trim()) {
      // Mock create custom link
      console.log("Creating custom link:", customName)
      setCustomName("")
      setShowCreateForm(false)
    }
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("sidebar.referralLinks")}</h1>
          <p className="text-gray-600">Quản lý và theo dõi hiệu quả các link giới thiệu của bạn</p>
        </div>

        {/* Main Referral Link */}
        <div className="agent-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Link giới thiệu chính</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>1,247 lượt xem</span>
              <Users className="h-4 w-4 ml-4" />
              <span>89 đăng ký</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 font-mono text-sm text-gray-700 break-all">{mainReferralLink}</div>
            <button
              onClick={() => handleCopyLink(mainReferralLink)}
              className="agent-button-secondary flex items-center space-x-2 whitespace-nowrap"
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? "Đã sao chép!" : "Sao chép"}</span>
            </button>
            <a
              href={mainReferralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-blue-800">Lượt click</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-green-800">Đăng ký thành công</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7.1%</div>
              <div className="text-sm text-purple-800">Tỷ lệ chuyển đổi</div>
            </div>
          </div>
        </div>

        {/* Custom Links */}
        <div className="agent-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Link tùy chỉnh</h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="agent-button-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo link mới</span>
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Tên chiến dịch (VD: Facebook Campaign)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 agent-input"
                />
                <button onClick={handleCreateCustomLink} className="agent-button-primary">
                  Tạo
                </button>
                <button onClick={() => setShowCreateForm(false)} className="agent-button-secondary">
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {customLinks.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{link.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleCopyLink(link.url)} className="p-1 text-gray-500 hover:text-gray-700">
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="font-mono text-sm text-gray-600 mb-3 break-all">{link.url}</div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">
                      <Eye className="inline h-4 w-4 mr-1" />
                      {link.clicks} clicks
                    </span>
                    <span className="text-gray-500">
                      <Users className="inline h-4 w-4 mr-1" />
                      {link.registrations} đăng ký
                    </span>
                    <span className="text-gray-500">
                      <BarChart3 className="inline h-4 w-4 mr-1" />
                      {((link.registrations / link.clicks) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-gray-400">Tạo: {link.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="agent-card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê hiệu suất</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Biểu đồ thống kê sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  )
}
