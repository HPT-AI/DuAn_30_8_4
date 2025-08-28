"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Users, UserCheck, UserX } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  subscription: string
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastLogin: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyen.van.a@example.com",
      phone: "0123456789",
      subscription: "Professional",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-12-28",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tran.thi.b@example.com",
      phone: "0987654321",
      subscription: "Basic",
      status: "active",
      joinDate: "2024-02-20",
      lastLogin: "2024-12-27",
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "le.van.c@example.com",
      phone: "0555666777",
      subscription: "Free",
      status: "inactive",
      joinDate: "2024-03-10",
      lastLogin: "2024-12-20",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Hoạt động</Badge>
      case "inactive":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Không hoạt động</Badge>
      case "suspended":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Tạm khóa</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "Professional":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Professional</Badge>
      case "Basic":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Basic</Badge>
      case "Free":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Free</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleUpdateUserStatus = (userId: string, newStatus: "active" | "inactive" | "suspended") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Người dùng</h1>
          <p className="text-slate-400 mt-2">Quản lý tài khoản và thông tin người dùng</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <p className="text-xs text-slate-400">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Đang hoạt động</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-xs text-slate-400">+5% so với tuần trước</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Không hoạt động</CardTitle>
            <UserX className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.filter((u) => u.status === "inactive").length}</div>
            <p className="text-xs text-slate-400">-2% so với tuần trước</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Người dùng trả phí</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.filter((u) => u.subscription !== "Free").length}</div>
            <p className="text-xs text-slate-400">+8% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Danh sách Người dùng</CardTitle>
          <CardDescription className="text-slate-400">Quản lý và theo dõi thông tin người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Người dùng</TableHead>
                <TableHead className="text-slate-300">Gói dịch vụ</TableHead>
                <TableHead className="text-slate-300">Trạng thái</TableHead>
                <TableHead className="text-slate-300">Ngày tham gia</TableHead>
                <TableHead className="text-slate-300">Đăng nhập cuối</TableHead>
                <TableHead className="text-slate-300">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                      <div className="text-sm text-slate-400">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-slate-300">{user.joinDate}</TableCell>
                  <TableCell className="text-slate-300">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription className="text-slate-400">
              Cập nhật thông tin và trạng thái người dùng
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Tên</Label>
                <Input defaultValue={selectedUser.name} className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input defaultValue={selectedUser.email} className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div>
                <Label className="text-slate-300">Trạng thái</Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">Lưu thay đổi</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
