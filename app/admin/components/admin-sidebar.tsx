"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
  Shield,
  X,
  ChevronDown,
  ChevronRight,
  Palette,
} from "lucide-react"
import { useState } from "react"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isContentOpen, setIsContentOpen] = useState(pathname.startsWith("/admin/content"))
  const [isHomepageOpen, setIsHomepageOpen] = useState(pathname.startsWith("/admin/content/homepage"))

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý người dùng",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Quản lý gói dịch vụ",
      href: "/admin/subscriptions",
      icon: CreditCard,
    },
    {
      name: "Báo cáo & Thống kê",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Quản lý Thương hiệu",
      href: "/admin/branding",
      icon: Palette,
    },
    {
      name: "Bảo mật",
      href: "/admin/security",
      icon: Shield,
    },
    {
      name: "Cài đặt hệ thống",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const contentPages = [
    { name: "Về chúng tôi", href: "/admin/content/about" },
    { name: "Dịch vụ", href: "/admin/content/services" },
    { name: "Liên hệ", href: "/admin/content/contact" },
    { name: "Đăng ký", href: "/admin/content/register" },
    { name: "Đăng nhập", href: "/admin/content/login" },
  ]

  const homepageSubsections = [
    { name: "Hero Section", href: "/admin/content/homepage/hero" },
    { name: "Tính năng nổi bật", href: "/admin/content/homepage/features" },
    { name: "Tại sao chọn chúng tôi", href: "/admin/content/homepage/why-choose-us" },
  ]

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800",
                )}
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}

          <div>
            <button
              onClick={() => setIsContentOpen(!isContentOpen)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin/content")
                  ? "bg-orange-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800",
              )}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <span>Quản lý nội dung</span>
              </div>
              {isContentOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isContentOpen && (
              <div className="ml-6 mt-2 space-y-1">
                <div>
                  <button
                    onClick={() => setIsHomepageOpen(!isHomepageOpen)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname.startsWith("/admin/content/homepage")
                        ? "bg-orange-400 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800",
                    )}
                  >
                    <span>Trang chủ</span>
                    {isHomepageOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </button>

                  {isHomepageOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {homepageSubsections.map((subsection) => {
                        const isActive = pathname === subsection.href
                        return (
                          <Link
                            key={subsection.name}
                            href={subsection.href}
                            className={cn(
                              "block px-3 py-1.5 rounded text-xs transition-colors",
                              isActive
                                ? "bg-orange-300 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-800",
                            )}
                            onClick={onClose}
                          >
                            {subsection.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

                {contentPages.map((page) => {
                  const isActive = pathname === page.href
                  return (
                    <Link
                      key={page.name}
                      href={page.href}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive ? "bg-orange-400 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800",
                      )}
                      onClick={onClose}
                    >
                      {page.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
