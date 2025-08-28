"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "vi" | "en"

interface AgentLanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  vi: {
    // Header
    "header.notifications": "Thông báo",
    "header.contact": "Liên hệ",
    "header.news": "Tin tức đại lý",
    "header.account": "Tài khoản của tôi",
    "header.changePassword": "Đổi mật khẩu",
    "header.logout": "Đăng xuất",

    // Sidebar
    "sidebar.dashboard": "Trang chủ",
    "sidebar.referralLinks": "Link Giới thiệu",
    "sidebar.myCustomers": "Khách hàng của tôi",
    "sidebar.commission": "Hoa hồng",
    "sidebar.myAccount": "Tài khoản của tôi",
    "sidebar.support": "Hỗ trợ",

    // Auth
    "auth.login": "Đăng nhập",
    "auth.register": "Đăng ký",
    "auth.email": "Email",
    "auth.password": "Mật khẩu",
    "auth.confirmPassword": "Xác nhận mật khẩu",
    "auth.fullName": "Họ tên",
    "auth.phone": "Số điện thoại",
    "auth.forgotPassword": "Quên mật khẩu?",
    "auth.loginTitle": "Đăng nhập Đại lý",
    "auth.registerTitle": "Đăng ký Đại lý",

    // Dashboard
    "dashboard.welcome": "Chào mừng trở lại",
    "dashboard.totalCustomers": "Tổng khách hàng",
    "dashboard.totalRevenue": "Tổng doanh thu",
    "dashboard.totalCommission": "Tổng hoa hồng",
    "dashboard.pendingCommission": "Hoa hồng chờ duyệt",
    "dashboard.monthlyProgress": "Tiến độ đạt thưởng tháng này",
    "dashboard.recentActivity": "Hoạt động gần đây",
    "dashboard.currentRevenue": "Doanh thu hiện tại",
    "dashboard.targetRevenue": "Mục tiêu doanh thu",
    "dashboard.bonusTarget": "Mục tiêu thưởng",

    // Common
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.edit": "Chỉnh sửa",
    "common.delete": "Xóa",
    "common.search": "Tìm kiếm",
    "common.filter": "Lọc",
    "common.loading": "Đang tải...",
    "common.viewAll": "Xem tất cả",
  },
  en: {
    // Header
    "header.notifications": "Notifications",
    "header.contact": "Contact",
    "header.news": "Agent News",
    "header.account": "My Account",
    "header.changePassword": "Change Password",
    "header.logout": "Logout",

    // Sidebar
    "sidebar.dashboard": "Dashboard",
    "sidebar.referralLinks": "Referral Links",
    "sidebar.myCustomers": "My Customers",
    "sidebar.commission": "Commission",
    "sidebar.myAccount": "My Account",
    "sidebar.support": "Support",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.fullName": "Full Name",
    "auth.phone": "Phone Number",
    "auth.forgotPassword": "Forgot Password?",
    "auth.loginTitle": "Agent Login",
    "auth.registerTitle": "Agent Registration",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.totalCustomers": "Total Customers",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.totalCommission": "Total Commission",
    "dashboard.pendingCommission": "Pending Commission",
    "dashboard.monthlyProgress": "Monthly Bonus Progress",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.currentRevenue": "Current Revenue",
    "dashboard.targetRevenue": "Target Revenue",
    "dashboard.bonusTarget": "Bonus Target",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.loading": "Loading...",
    "common.viewAll": "View All",
  },
}

const AgentLanguageContext = createContext<AgentLanguageContextType | undefined>(undefined)

export function AgentLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("agent-language") as Language
    if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("agent-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <AgentLanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </AgentLanguageContext.Provider>
  )
}

export function useAgentLanguage() {
  const context = useContext(AgentLanguageContext)
  if (context === undefined) {
    throw new Error("useAgentLanguage must be used within an AgentLanguageProvider")
  }
  return context
}
