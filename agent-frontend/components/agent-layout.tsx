"use client"

import type React from "react"

import { useAgentAuth } from "../contexts/agent-auth-context"
import { useAgentLanguage } from "../contexts/agent-language-context"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Bell,
  Globe,
  User,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Link,
  Users,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  MessageSquare,
  Newspaper,
} from "lucide-react"

interface AgentLayoutProps {
  children: React.ReactNode
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const { agent, logout } = useAgentAuth()
  const { language, setLanguage, t } = useAgentLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()

  const sidebarItems = [
    { key: "dashboard", icon: LayoutDashboard, href: "/agent-frontend" },
    { key: "referralLinks", icon: Link, href: "/agent-frontend/referral-links" },
    { key: "myCustomers", icon: Users, href: "/agent-frontend/customers" },
    { key: "commission", icon: DollarSign, href: "/agent-frontend/commission" },
    { key: "myAccount", icon: Settings, href: "/agent-frontend/account" },
    { key: "support", icon: HelpCircle, href: "/agent-frontend/support" },
  ]

  const notifications = [
    {
      id: 1,
      type: "new_customer",
      title: "Khách hàng mới đăng ký",
      message: "Nguyễn Thị B đã đăng ký qua link giới thiệu của bạn",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: 2,
      type: "commission",
      title: "Hoa hồng mới",
      message: "Bạn đã nhận được 125,000₫ hoa hồng",
      time: "4 giờ trước",
      read: false,
    },
    {
      id: 3,
      type: "payment",
      title: "Thanh toán hoa hồng",
      message: "Hoa hồng tháng 12 đã được chuyển khoản",
      time: "1 ngày trước",
      read: true,
    },
  ]

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ name: t("sidebar.dashboard"), href: "/agent-frontend" }]

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1]
      const pageMap: { [key: string]: string } = {
        "referral-links": t("sidebar.referralLinks"),
        customers: t("sidebar.myCustomers"),
        commission: t("sidebar.commission"),
        account: t("sidebar.myAccount"),
        support: t("sidebar.support"),
      }

      if (pageMap[currentPage]) {
        breadcrumbs.push({ name: pageMap[currentPage], href: pathname })
      }
    }

    return breadcrumbs
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-slate-900 text-white p-2 rounded-lg">
                <span className="font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">ConstructVN</h1>
                <p className="text-xs text-gray-500">Agent Portal</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-md hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">{t("header.notifications")}</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-blue-500" : "bg-gray-300"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-slate-600 hover:text-slate-500">Xem tất cả thông báo</button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
                className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100"
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700 uppercase">{language}</span>
              </button>
            </div>

            {/* Contact */}
            <button className="hidden md:block text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{t("header.contact")}</span>
            </button>

            {/* Agent News */}
            <button className="hidden md:block text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
              <Newspaper className="h-4 w-4" />
              <span>{t("header.news")}</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-medium">
                  {agent?.name?.charAt(0) || "A"}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{agent?.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a href="/agent-frontend/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="inline h-4 w-4 mr-2" />
                    {t("header.account")}
                  </a>
                  <a
                    href="/agent-frontend/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="inline h-4 w-4 mr-2" />
                    {t("header.changePassword")}
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    {t("header.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out pt-16
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
        >
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || (item.href !== "/agent-frontend" && pathname.startsWith(item.href))
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive ? "bg-slate-900 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{t(`sidebar.${item.key}`)}</span>
                    </a>
                  </li>
                )
              })}

              {/* Logout */}
              <li className="pt-4 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t("header.logout")}</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <li key={breadcrumb.href} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                    <a
                      href={breadcrumb.href}
                      className={`text-sm ${
                        index === getBreadcrumbs().length - 1
                          ? "text-gray-900 font-medium"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {breadcrumb.name}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {(notificationsOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotificationsOpen(false)
            setUserMenuOpen(false)
          }}
        />
      )}
    </div>
  )
}
