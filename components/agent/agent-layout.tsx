"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAgentAuth } from "@/contexts/agent-auth-context"
import { useAgentLanguage } from "@/contexts/agent-language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Home,
  LinkIcon,
  Users,
  DollarSign,
  HelpCircle,
  ChevronRight,
  Globe,
} from "lucide-react"

interface AgentLayoutProps {
  children: React.ReactNode
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAgentAuth()
  const { t, language, setLanguage } = useAgentLanguage()
  const router = useRouter()
  const pathname = usePathname()

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navigation = [
    { name: t("nav.dashboard"), href: "/agent-frontend", icon: Home },
    { name: t("nav.referralLinks"), href: "/agent-frontend/referral-links", icon: LinkIcon },
    { name: t("nav.customers"), href: "/agent-frontend/customers", icon: Users },
    { name: t("nav.commission"), href: "/agent-frontend/commission", icon: DollarSign },
    { name: t("nav.account"), href: "/agent-frontend/account", icon: User },
    { name: t("nav.support"), href: "/agent-frontend/support", icon: HelpCircle },
  ]

  const notifications = [
    {
      id: 1,
      title: t("notifications.newCustomer"),
      message: t("notifications.newCustomerMessage"),
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      title: t("notifications.commissionPaid"),
      message: t("notifications.commissionPaidMessage"),
      time: "1 giờ trước",
      unread: true,
    },
    {
      id: 3,
      title: t("notifications.linkClicked"),
      message: t("notifications.linkClickedMessage"),
      time: "2 giờ trước",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  // Generate breadcrumb
  const generateBreadcrumb = () => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ name: t("nav.dashboard"), href: "/agent-frontend" }]

    if (paths.length > 1) {
      const currentNav = navigation.find((nav) => nav.href === pathname)
      if (currentNav) {
        breadcrumbs.push({ name: currentNav.name, href: pathname })
      }
    }

    return breadcrumbs
  }

  const handleLogout = () => {
    logout()
    router.push("/agent-frontend/login")
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <header className="bg-slate-800/50 backdrop-blur-xl shadow-lg border-b border-slate-700/50 sticky top-0 z-40 relative">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-white hidden sm:block group-hover:text-cyan-300 transition-colors">
                ConstructVN Agent
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative" ref={languageMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center space-x-1 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === "vi" ? "VI" : "EN"}</span>
              </Button>

              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-700/50 py-1 z-50">
                  <button
                    onClick={() => {
                      setLanguage("vi")
                      setLanguageMenuOpen(false)
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors ${
                      language === "vi" ? "bg-slate-700/50 font-medium text-cyan-300" : ""
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en")
                      setLanguageMenuOpen(false)
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors ${
                      language === "en" ? "bg-slate-700/50 font-medium text-cyan-300" : ""
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-cyan-400 to-blue-500 border-0 shadow-lg shadow-cyan-500/25">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-700/50 z-50">
                  <div className="p-4 border-b border-slate-700/50">
                    <h3 className="font-semibold text-white">{t("notifications.title")}</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${notification.unread ? "bg-cyan-500/10" : ""}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-white text-sm">{notification.title}</p>
                            <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
                            <p className="text-slate-400 text-xs mt-2">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shadow-lg shadow-cyan-400/50"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-700/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                      {t("notifications.viewAll")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <div className="w-8 h-8 rounded-full ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-400/20 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || "A"}</span>
                </div>
                <span className="hidden sm:inline font-medium">{user?.name}</span>
              </Button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-700/50 py-1 z-50">
                  <Link
                    href="/agent-frontend/account"
                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    {t("userMenu.profile")}
                  </Link>
                  <Link
                    href="/agent-frontend/account"
                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    {t("userMenu.settings")}
                  </Link>
                  <hr className="my-1 border-slate-700/50" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    {t("userMenu.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-800/50 backdrop-blur-xl shadow-xl border-r border-slate-700/50 transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 lg:ml-0 relative">
          <div className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              {generateBreadcrumb().map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-slate-500 mx-2" />}
                  <Link
                    href={crumb.href}
                    className={`transition-colors ${
                      index === generateBreadcrumb().length - 1
                        ? "text-white font-medium"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="p-6 relative">{children}</div>
        </main>
      </div>
    </div>
  )
}
