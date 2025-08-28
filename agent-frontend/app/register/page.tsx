"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAgentAuth } from "../../contexts/agent-auth-context"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import { Eye, EyeOff, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AgentRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    companyName: "",
    taxCode: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1) // 1: Personal Info, 2: Payment Info, 3: Company Info (optional)

  const { register } = useAgentAuth()
  const { language, setLanguage, t } = useAgentLanguage()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return false
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.bankName || !formData.accountNumber || !formData.accountHolder) {
      setError("Thông tin thanh toán là bắt buộc để nhận hoa hồng")
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError("")
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bankInfo: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountHolder: formData.accountHolder,
        },
        companyInfo: formData.companyName
          ? {
              name: formData.companyName,
              taxCode: formData.taxCode,
            }
          : undefined,
      })

      if (success) {
        router.push("/agent-frontend/login?message=registration-success")
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.")
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 text-white p-3 rounded-lg">
            <span className="font-bold text-xl">C</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900">ConstructVN</h2>
        <p className="mt-2 text-center text-sm text-gray-600">{t("auth.registerTitle")}</p>

        {/* Language Switcher */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            className="flex items-center space-x-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm uppercase">{language}</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? "bg-slate-900" : "bg-gray-200"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div className={`w-8 h-1 ${step >= 3 ? "bg-slate-900" : "bg-gray-200"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            onSubmit={
              step === 3
                ? handleSubmit
                : (e) => {
                    e.preventDefault()
                    handleNextStep()
                  }
            }
          >
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                  <p className="text-sm text-gray-500">Điền thông tin cơ bản của bạn</p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t("auth.fullName")} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t("auth.email")} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="agent@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {t("auth.phone")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="0123456789"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t("auth.password")} *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="agent-input pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {t("auth.confirmPassword")} *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="agent-input pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin thanh toán</h3>
                  <p className="text-sm text-gray-500">Thông tin để nhận hoa hồng và thưởng</p>
                </div>

                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Tên ngân hàng *
                  </label>
                  <input
                    id="bankName"
                    name="bankName"
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="Vietcombank"
                  />
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                    Số tài khoản *
                  </label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700">
                    Chủ tài khoản *
                  </label>
                  <input
                    id="accountHolder"
                    name="accountHolder"
                    type="text"
                    required
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="NGUYEN VAN A"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Thông tin thanh toán là bắt buộc để hệ thống có thể thanh toán hoa hồng và
                    thưởng cho bạn.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Company Information (Optional) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin công ty</h3>
                  <p className="text-sm text-gray-500">Tùy chọn - dành cho đại lý doanh nghiệp</p>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Tên công ty
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="Công ty TNHH ABC"
                  />
                </div>

                <div>
                  <label htmlFor="taxCode" className="block text-sm font-medium text-gray-700">
                    Mã số thuế
                  </label>
                  <input
                    id="taxCode"
                    name="taxCode"
                    type="text"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    className="mt-1 agent-input"
                    placeholder="0123456789"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">Bạn có thể bỏ qua bước này nếu đăng ký với tư cách cá nhân.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="agent-button-primary ml-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xử lý..." : step === 3 ? "Hoàn tất đăng ký" : "Tiếp tục"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/agent-frontend/login" className="text-sm text-slate-600 hover:text-slate-500">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
