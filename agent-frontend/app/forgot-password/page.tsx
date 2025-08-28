"use client"

import type React from "react"

import { useState } from "react"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import { Globe, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function AgentForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const { language, setLanguage, t } = useAgentLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email đã được gửi!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư
              đến và làm theo hướng dẫn.
            </p>
            <Link
              href="/agent-frontend/login"
              className="agent-button-primary inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
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
        <h2 className="text-center text-3xl font-bold text-gray-900">Quên mật khẩu</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Nhập email đăng ký để nhận hướng dẫn đặt lại mật khẩu</p>

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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("auth.email")}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="agent-input"
                  placeholder="agent@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="agent-button-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link
              href="/agent-frontend/login"
              className="flex items-center justify-center space-x-2 text-sm text-slate-600 hover:text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
