"use client"

import { useState } from "react"
import { useAgentAuth } from "../../contexts/agent-auth-context"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import AgentLayout from "../../components/agent-layout"
import { User, CreditCard, Lock, Save, Edit, Eye, EyeOff } from "lucide-react"

export default function AccountPage() {
  const { agent, updateProfile } = useAgentAuth()
  const { t } = useAgentLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: agent?.name || "",
    email: agent?.email || "",
    phone: agent?.phone || "",
  })

  // Payment info form state
  const [paymentData, setPaymentData] = useState({
    bankName: agent?.bankInfo?.bankName || "",
    accountNumber: agent?.bankInfo?.accountNumber || "",
    accountHolder: agent?.bankInfo?.accountHolder || "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile(profileData)
      setIsEditing(false)
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({
        bankInfo: paymentData,
      })
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Show error message
      return
    }

    setIsLoading(true)
    try {
      // Mock password change API call
      console.log("Changing password...")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("sidebar.myAccount")}</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản và cài đặt bảo mật</p>
        </div>

        {/* Account Status */}
        <div className="agent-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xl font-medium">
                {agent?.name?.charAt(0) || "A"}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{agent?.name}</h3>
                <p className="text-sm text-gray-600">{agent?.email}</p>
                <div className="flex items-center mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      agent?.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : agent?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {agent?.status === "approved"
                      ? "Đã duyệt"
                      : agent?.status === "pending"
                        ? "Chờ duyệt"
                        : "Tạm ngưng"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="agent-card">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "profile", label: "Thông tin cá nhân", icon: User },
                { id: "payment", label: "Thông tin thanh toán", icon: CreditCard },
                { id: "password", label: "Đổi mật khẩu", icon: Lock },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-slate-500 text-slate-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Thông tin cá nhân</h4>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{isEditing ? "Hủy" : "Chỉnh sửa"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="agent-input disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="agent-input disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="agent-input disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => setIsEditing(false)} className="agent-button-secondary">
                      Hủy
                    </button>
                    <button
                      onClick={handleProfileSave}
                      disabled={isLoading}
                      className="agent-button-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin thanh toán</h4>
                  <p className="text-sm text-gray-600">
                    Thông tin tài khoản ngân hàng để nhận hoa hồng và thưởng. Việc thay đổi sẽ có hiệu lực sau 24 giờ.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Lưu ý bảo mật</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Việc thay đổi thông tin thanh toán cần xác minh qua email và có thời gian chờ 24 giờ để đảm
                          bảo bảo mật.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên ngân hàng</label>
                    <input
                      type="text"
                      value={paymentData.bankName}
                      onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                      className="agent-input"
                      placeholder="Vietcombank"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số tài khoản</label>
                    <input
                      type="text"
                      value={paymentData.accountNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                      className="agent-input"
                      placeholder="1234567890"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chủ tài khoản</label>
                    <input
                      type="text"
                      value={paymentData.accountHolder}
                      onChange={(e) => setPaymentData({ ...paymentData, accountHolder: e.target.value })}
                      className="agent-input"
                      placeholder="NGUYEN VAN A"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handlePaymentSave}
                    disabled={isLoading}
                    className="agent-button-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isLoading ? "Đang lưu..." : "Cập nhật thông tin"}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Đổi mật khẩu</h4>
                  <p className="text-sm text-gray-600">Đảm bảo tài khoản của bạn được bảo mật bằng mật khẩu mạnh.</p>
                </div>

                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="agent-input pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="agent-input pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="agent-input pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={
                      isLoading ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="agent-button-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  )
}
