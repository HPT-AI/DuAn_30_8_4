"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("register.errors.fullname_required")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("register.errors.email_required")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("register.errors.email_invalid")
    }

    if (!formData.password) {
      newErrors.password = t("register.errors.password_required")
    } else if (formData.password.length < 8) {
      newErrors.password = t("register.errors.password_length")
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.confirm_password_required")
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.password_mismatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Mock registration success
      login({
        id: "1",
        name: formData.fullName,
        email: formData.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=1e293b&color=fff`,
      })
      router.push("/")
    }
  }

  const handleSocialRegister = (provider: string) => {
    // Mock social registration
    const mockUser = {
      id: "1",
      name: provider === "google" ? "Google User" : "Facebook User",
      email: `user@${provider}.com`,
      avatar: `https://ui-avatars.com/api/?name=${provider}&background=1e293b&color=fff`,
    }
    login(mockUser)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-xl text-white">ConstructVN</span>
        </Link>

        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-cyan-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">{t("register.title")}</CardTitle>
            <p className="text-slate-300 mt-2">{t("register.subtitle")}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all duration-300"
                onClick={() => handleSocialRegister("google")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("register.google")}
              </Button>

              <Button
                variant="outline"
                className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all duration-300"
                onClick={() => handleSocialRegister("facebook")}
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {t("register.facebook")}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">{t("register.or")}</span>
              </div>
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-slate-200">
                  {t("register.fullname")}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 ${errors.fullName ? "border-red-500" : ""}`}
                  placeholder={t("register.fullname_placeholder")}
                />
                {errors.fullName && <p className="text-sm text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-200">
                  {t("register.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 ${errors.email ? "border-red-500" : ""}`}
                  placeholder={t("register.email_placeholder")}
                />
                {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-200">
                  {t("register.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    placeholder={t("register.password_placeholder")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
                <p className="text-xs text-slate-400 mt-1">{t("register.password_requirements")}</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  {t("register.confirm_password")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder={t("register.confirm_password_placeholder")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
              >
                {t("register.create_account")}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                {t("register.have_account")}{" "}
                <Link href="/" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  {t("register.sign_in")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("register.back_home")}
          </Link>
        </div>
      </div>
    </div>
  )
}
