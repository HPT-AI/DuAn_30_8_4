"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Bell, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="p-6">{children}</main>
    </div>
  )
}
