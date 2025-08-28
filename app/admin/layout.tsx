"use client"

import type React from "react"
import { useState, useEffect } from "react"
import AdminSidebar from "./components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Bell, User } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    setIsAuthenticated(authStatus === "true")
  }, [])

  useEffect(() => {
    const handleAuthChange = () => {
      const authStatus = localStorage.getItem("admin_authenticated")
      setIsAuthenticated(authStatus === "true")
    }

    window.addEventListener("admin_auth_changed", handleAuthChange)
    return () => window.removeEventListener("admin_auth_changed", handleAuthChange)
  }, [])

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-white">Dashboard Quản trị</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
