"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, CreditCard, TrendingUp, Activity, DollarSign, UserCheck, Lock } from "lucide-react"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("admin_authenticated") === "true")
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (username === "adminfn" && password === "adminfn") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      window.dispatchEvent(new Event("admin_auth_changed"))
    } else {
      setError("Tài khoản hoặc mật khẩu không đúng")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Đăng nhập Admin</CardTitle>
            <p className="text-slate-400">Truy cập hệ thống quản trị ConstructVN</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Tài khoản
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  placeholder="Nhập tài khoản"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      title: "Tổng người dùng",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Doanh thu tháng",
      value: "₫45,230,000",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Gói đăng ký",
      value: "1,234",
      change: "+23%",
      icon: CreditCard,
      color: "text-orange-500",
    },
    {
      title: "Người dùng hoạt động",
      value: "892",
      change: "+5%",
      icon: Activity,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Quản trị</h1>
        <p className="text-slate-400">Tổng quan hệ thống ConstructVN</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-green-500 mt-1">{stat.change} so với tháng trước</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-400">
              <TrendingUp className="h-8 w-8 mr-2" />
              Biểu đồ doanh thu
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Người dùng mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Người dùng {i}</p>
                    <p className="text-xs text-slate-400">user{i}@example.com</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
