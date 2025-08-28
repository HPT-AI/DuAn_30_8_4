"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Users,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Package,
  AlertTriangle,
  Shield,
  Database,
  Mail,
  Bell,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      title: "Tổng quan",
      icon: BarChart3,
      href: "/admin",
      badge: null,
    },
    {
      title: "Người dùng",
      icon: Users,
      href: "/admin/users",
      badge: "1,247",
    },
    {
      title: "Gói dịch vụ",
      icon: Package,
      href: "/admin/subscriptions",
      badge: "892",
    },
    {
      title: "Thanh toán",
      icon: CreditCard,
      href: "/admin/payments",
      badge: null,
    },
    {
      title: "Báo cáo",
      icon: FileText,
      href: "/admin/reports",
      badge: null,
    },
    {
      title: "Hỗ trợ",
      icon: AlertTriangle,
      href: "/admin/support",
      badge: "23",
    },
    {
      title: "Thông báo",
      icon: Bell,
      href: "/admin/notifications",
      badge: "5",
    },
    {
      title: "Phân tích",
      icon: TrendingUp,
      href: "/admin/analytics",
      badge: null,
    },
    {
      title: "Cơ sở dữ liệu",
      icon: Database,
      href: "/admin/database",
      badge: null,
    },
    {
      title: "Email",
      icon: Mail,
      href: "/admin/emails",
      badge: null,
    },
    {
      title: "Bảo mật",
      icon: Shield,
      href: "/admin/security",
      badge: null,
    },
    {
      title: "Cài đặt",
      icon: Settings,
      href: "/admin/settings",
      badge: null,
    },
  ]

  return (
    <div
      className={cn(
        "bg-slate-900 border-r border-slate-700/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center shadow-lg shadow-red-500/25">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Admin
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-red-400"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-300 hover:text-red-400 hover:bg-red-500/10",
              collapsed ? "px-2" : "px-3",
            )}
          >
            <item.icon className={cn("w-4 h-4", collapsed ? "" : "mr-3")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">{item.badge}</span>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Trạng thái hệ thống</span>
            </div>
            <div className="text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="text-emerald-400">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span>Load:</span>
                <span className="text-yellow-400">Medium</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
