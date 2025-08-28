"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Search, Plus, Calendar, MapPin, Users } from "lucide-react"

export default function ProjectsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const projects = [
    {
      id: 1,
      name: "Chung cư Green Park",
      status: "active",
      progress: 75,
      location: "Hà Nội",
      startDate: "2024-01-15",
      endDate: "2024-12-30",
      team: 12,
      budget: "15 tỷ VNĐ",
    },
    {
      id: 2,
      name: "Nhà máy ABC",
      status: "completed",
      progress: 100,
      location: "Hồ Chí Minh",
      startDate: "2023-06-01",
      endDate: "2024-02-28",
      team: 8,
      budget: "8 tỷ VNĐ",
    },
    {
      id: 3,
      name: "Khu đô thị mới",
      status: "planning",
      progress: 25,
      location: "Đà Nẵng",
      startDate: "2024-03-01",
      endDate: "2025-06-30",
      team: 15,
      budget: "25 tỷ VNĐ",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang thực hiện"
      case "completed":
        return "Hoàn thành"
      case "planning":
        return "Lên kế hoạch"
      default:
        return "Không xác định"
    }
  }

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t("user_menu.projects")}</h1>
              <p className="text-slate-600 mt-2">Quản lý và theo dõi các dự án xây dựng</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo dự án mới
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({projects.length})</TabsTrigger>
            <TabsTrigger value="active">
              Đang thực hiện ({projects.filter((p) => p.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Hoàn thành ({projects.filter((p) => p.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="planning">
              Lên kế hoạch ({projects.filter((p) => p.status === "planning").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tiến độ</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {project.startDate} - {project.endDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {project.team} thành viên
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {project.budget}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Xem chi tiết
                      </Button>
                      <Button size="sm" className="flex-1">
                        Quản lý
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects
                .filter((p) => p.status === "active")
                .map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    {/* Same card content as above */}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Same content structure */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tiến độ</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {project.startDate} - {project.endDate}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {project.team} thành viên
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          Xem chi tiết
                        </Button>
                        <Button size="sm" className="flex-1">
                          Quản lý
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Similar structure for completed and planning tabs */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Dự án đã hoàn thành thành công</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="planning">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects
                .filter((p) => p.status === "planning")
                .map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Dự án đang trong giai đoạn lên kế hoạch</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
