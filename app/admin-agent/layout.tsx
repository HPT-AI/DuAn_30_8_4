"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, ArrowLeft, User, Settings, LogOut, Globe } from "lucide-react"
import Link from "next/link"

export default function AdminAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại Admin
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-white">Quản lý Agent</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Admin User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <span className="hidden md:block text-sm font-medium">Admin</span>
              </Button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-slate-400">admin@example.com</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <User className="w-4 h-4 mr-3" />
                      Thông tin cá nhân
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                      <Globe className="w-4 h-4 mr-3" />
                      Ngôn ngữ
                    </button>
                  </div>
                  
                  <div className="border-t border-slate-700">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="p-6">{children}</main>
      
      {/* Overlay to close menu when clicking outside */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  )
}
