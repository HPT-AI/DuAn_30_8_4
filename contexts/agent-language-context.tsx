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
    // Navigation
    "nav.dashboard": "Tổng quan",
    "nav.referralLinks": "Link giới thiệu",
    "nav.customers": "Khách hàng của tôi",
    "nav.commission": "Hoa hồng",
    "nav.account": "Tài khoản của tôi",
    "nav.support": "Hỗ trợ",

    // Login
    "login.title": "Đăng nhập Agent",
    "login.subtitle": "Truy cập vào hệ thống quản lý đại lý",
    "login.signIn": "Đăng nhập",
    "login.signInDescription": "Nhập thông tin đăng nhập của bạn",
    "login.email": "Email",
    "login.emailPlaceholder": "Nhập email của bạn",
    "login.password": "Mật khẩu",
    "login.passwordPlaceholder": "Nhập mật khẩu",
    "login.forgotPassword": "Quên mật khẩu?",
    "login.noAccount": "Chưa có tài khoản?",
    "login.signUp": "Đăng ký ngay",
    "login.invalidCredentials": "Email hoặc mật khẩu không đúng",
    "login.loginFailed": "Đăng nhập thất bại. Vui lòng thử lại.",

    // Dashboard
    "dashboard.welcome": "Chào mừng",
    "dashboard.welcomeMessage": "Quản lý hoạt động đại lý của bạn một cách hiệu quả",
    "dashboard.totalCustomers": "Tổng khách hàng",
    "dashboard.totalCommission": "Tổng hoa hồng",
    "dashboard.monthlyEarnings": "Thu nhập tháng",
    "dashboard.linkViews": "Lượt xem link",
    "dashboard.recentCustomers": "Khách hàng gần đây",
    "dashboard.quickActions": "Thao tác nhanh",
    "dashboard.createReferralLink": "Tạo link giới thiệu",
    "dashboard.viewCommission": "Xem hoa hồng",
    "dashboard.manageCustomers": "Quản lý khách hàng",
    "dashboard.updateProfile": "Cập nhật hồ sơ",

    // Notifications
    "notifications.title": "Thông báo",
    "notifications.viewAll": "Xem tất cả",
    "notifications.newCustomer": "Khách hàng mới",
    "notifications.newCustomerMessage": "Bạn có 1 khách hàng mới đăng ký",
    "notifications.commissionPaid": "Hoa hồng đã thanh toán",
    "notifications.commissionPaidMessage": "Hoa hồng tháng này đã được chuyển khoản",
    "notifications.linkClicked": "Link được click",
    "notifications.linkClickedMessage": "Link giới thiệu của bạn được click 15 lần",

    // User Menu
    "userMenu.profile": "Hồ sơ cá nhân",
    "userMenu.settings": "Cài đặt",
    "userMenu.logout": "Đăng xuất",

    // Account
    "account.description": "Quản lý thông tin tài khoản và cài đặt của bạn",
    "account.profile": "Hồ sơ",
    "account.payment": "Thanh toán",
    "account.security": "Bảo mật",
    "account.personalInfo": "Thông tin cá nhân",
    "account.fullName": "Họ và tên",
    "account.email": "Email",
    "account.phone": "Số điện thoại",
    "account.company": "Công ty",
    "account.address": "Địa chỉ",
    "account.taxCode": "Mã số thuế",
    "account.paymentInfo": "Thông tin thanh toán",
    "account.bankName": "Tên ngân hàng",
    "account.accountNumber": "Số tài khoản",
    "account.accountHolder": "Chủ tài khoản",
    "account.changePassword": "Đổi mật khẩu",
    "account.currentPassword": "Mật khẩu hiện tại",
    "account.newPassword": "Mật khẩu mới",
    "account.confirmPassword": "Xác nhận mật khẩu",
    "account.twoFactorAuth": "Xác thực hai yếu tố",
    "account.enable2FA": "Bật xác thực 2FA",
    "account.disable2FA": "Tắt xác thực 2FA",

    // Referral Links
    "referralLinks.title": "Link giới thiệu",
    "referralLinks.description": "Quản lý và theo dõi các link giới thiệu của bạn",
    "referralLinks.totalClicks": "Tổng lượt click",
    "referralLinks.totalConversions": "Tổng chuyển đổi",
    "referralLinks.conversionRate": "Tỷ lệ chuyển đổi",
    "referralLinks.createNew": "Tạo link mới",
    "referralLinks.linkNamePlaceholder": "Nhập tên link (VD: Link Facebook, Link Website...)",
    "referralLinks.createLink": "Tạo link",
    "referralLinks.myLinks": "Link của tôi",
    "referralLinks.clicks": "Lượt click",
    "referralLinks.conversions": "Chuyển đổi",
    "referralLinks.created": "Ngày tạo",

    // Common
    "common.loading": "Đang tải...",
    "common.viewAll": "Xem tất cả",
    "common.active": "Hoạt động",
    "common.pending": "Chờ xử lý",
    "common.paused": "Tạm dừng",
    "common.backToHome": "Về trang chủ",
    "common.edit": "Chỉnh sửa",
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.update": "Cập nhật",
    "common.delete": "Xóa",
    "common.confirm": "Xác nhận",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.referralLinks": "Referral Links",
    "nav.customers": "My Customers",
    "nav.commission": "Commission",
    "nav.account": "My Account",
    "nav.support": "Support",

    // Login
    "login.title": "Agent Login",
    "login.subtitle": "Access your agent management system",
    "login.signIn": "Sign In",
    "login.signInDescription": "Enter your login credentials",
    "login.email": "Email",
    "login.emailPlaceholder": "Enter your email",
    "login.password": "Password",
    "login.passwordPlaceholder": "Enter your password",
    "login.forgotPassword": "Forgot password?",
    "login.noAccount": "Don't have an account?",
    "login.signUp": "Sign up now",
    "login.invalidCredentials": "Invalid email or password",
    "login.loginFailed": "Login failed. Please try again.",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.welcomeMessage": "Manage your agent activities efficiently",
    "dashboard.totalCustomers": "Total Customers",
    "dashboard.totalCommission": "Total Commission",
    "dashboard.monthlyEarnings": "Monthly Earnings",
    "dashboard.linkViews": "Link Views",
    "dashboard.recentCustomers": "Recent Customers",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.createReferralLink": "Create Referral Link",
    "dashboard.viewCommission": "View Commission",
    "dashboard.manageCustomers": "Manage Customers",
    "dashboard.updateProfile": "Update Profile",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.viewAll": "View All",
    "notifications.newCustomer": "New Customer",
    "notifications.newCustomerMessage": "You have 1 new customer registration",
    "notifications.commissionPaid": "Commission Paid",
    "notifications.commissionPaidMessage": "This month's commission has been transferred",
    "notifications.linkClicked": "Link Clicked",
    "notifications.linkClickedMessage": "Your referral link was clicked 15 times",

    // User Menu
    "userMenu.profile": "Profile",
    "userMenu.settings": "Settings",
    "userMenu.logout": "Logout",

    // Account
    "account.description": "Manage your account information and settings",
    "account.profile": "Profile",
    "account.payment": "Payment",
    "account.security": "Security",
    "account.personalInfo": "Personal Information",
    "account.fullName": "Full Name",
    "account.email": "Email",
    "account.phone": "Phone Number",
    "account.company": "Company",
    "account.address": "Address",
    "account.taxCode": "Tax Code",
    "account.paymentInfo": "Payment Information",
    "account.bankName": "Bank Name",
    "account.accountNumber": "Account Number",
    "account.accountHolder": "Account Holder",
    "account.changePassword": "Change Password",
    "account.currentPassword": "Current Password",
    "account.newPassword": "New Password",
    "account.confirmPassword": "Confirm Password",
    "account.twoFactorAuth": "Two-Factor Authentication",
    "account.enable2FA": "Enable 2FA",
    "account.disable2FA": "Disable 2FA",

    // Referral Links
    "referralLinks.title": "Referral Links",
    "referralLinks.description": "Manage and track your referral links",
    "referralLinks.totalClicks": "Total Clicks",
    "referralLinks.totalConversions": "Total Conversions",
    "referralLinks.conversionRate": "Conversion Rate",
    "referralLinks.createNew": "Create New Link",
    "referralLinks.linkNamePlaceholder": "Enter link name (e.g., Facebook Link, Website Link...)",
    "referralLinks.createLink": "Create Link",
    "referralLinks.myLinks": "My Links",
    "referralLinks.clicks": "Clicks",
    "referralLinks.conversions": "Conversions",
    "referralLinks.created": "Created",

    // Common
    "common.loading": "Loading...",
    "common.viewAll": "View All",
    "common.active": "Active",
    "common.pending": "Pending",
    "common.paused": "Paused",
    "common.backToHome": "Back to Home",
    "common.edit": "Edit",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.update": "Update",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
  },
}

const AgentLanguageContext = createContext<AgentLanguageContextType | undefined>(undefined)

export function AgentLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  useEffect(() => {
    const storedLanguage = localStorage.getItem("agent-language") as Language
    if (storedLanguage && (storedLanguage === "vi" || storedLanguage === "en")) {
      setLanguage(storedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("agent-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  }

  return <AgentLanguageContext.Provider value={value}>{children}</AgentLanguageContext.Provider>
}

export function useAgentLanguage() {
  const context = useContext(AgentLanguageContext)
  if (context === undefined) {
    throw new Error("useAgentLanguage must be used within an AgentLanguageProvider")
  }
  return context
}
