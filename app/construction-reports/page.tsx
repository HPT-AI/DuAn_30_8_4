"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Building,
  FileText,
  Users,
  Calendar,
  Upload,
  FolderOpen,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

import { useRouter } from "next/navigation"

interface ProjectGroup {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "paused"
  startDate: string
  endDate?: string
  manager: string
}

interface Construction {
  id: string
  name: string
  location: string
  status: "active" | "completed" | "paused"
  startDate: string
  endDate?: string
  manager: string
  projectGroupId: string
}

interface Category {
  id: string
  name: string
  description: string
  constructionId: string // Changed from projectId to constructionId
  status: "pending" | "in-progress" | "completed"
  createdDate: string
}

interface Report {
  id: string
  title: string
  categoryId: string
  status: "draft" | "completed" | "approved"
  createdDate: string
  lastModified: string
}

interface TemplateFile {
  id: string
  name: string
  file: File
  uploadDate: string
  isDefault: boolean
  pageCount?: number
  size: number // Store actual file size
}

export default function ConstructionReportsPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const [selectedProjectGroup, setSelectedProjectGroup] = useState<ProjectGroup | null>(null)
  const [selectedConstruction, setSelectedConstruction] = useState<Construction | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // const [searchTerm, setSearchTerm] = useState("")

  const [showCreateProjectGroup, setShowCreateProjectGroup] = useState(false)
  const [showCreateConstruction, setShowCreateConstruction] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [showCreateReport, setShowCreateReport] = useState(false)

  const [showEditProjectGroup, setShowEditProjectGroup] = useState(false)
  const [showEditConstructionDialog, setShowEditConstructionDialog] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [editingProjectGroup, setEditingProjectGroup] = useState<ProjectGroup | null>(null)
  const [editingConstruction, setEditingConstruction] = useState<Construction | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [newProjectGroup, setNewProjectGroup] = useState({
    name: "",
    description: "",
    manager: "",
    status: "active" as const,
  })

  const [newConstruction, setNewConstruction] = useState({
    name: "",
    location: "",
    manager: "",
    status: "active" as const,
    templateFile: null,
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    status: "pending" as const,
  })

  const [newReport, setNewReport] = useState({
    title: "",
    status: "draft" as const,
  })

  const [templateFiles, setTemplateFiles] = useState<TemplateFile[]>([])
  const [templateErrors, setTemplateErrors] = useState({ file: "" })

  // Mock data - converted to state for updates
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([
    {
      id: "pg-1",
      name: "Dự án Khu đô thị mới",
      description: "Dự án phát triển khu đô thị hiện đại",
      status: "active",
      startDate: "2024-01-01",
      manager: "Nguyễn Văn A",
    },
    {
      id: "pg-2",
      name: "Dự án Trung tâm thương mại",
      description: "Xây dựng hệ thống trung tâm thương mại",
      status: "active",
      startDate: "2024-02-01",
      manager: "Trần Thị B",
    },
  ])

  const [constructions, setConstructions] = useState<Construction[]>([
    {
      id: "const-1",
      name: "Chung cư Sunrise Tower",
      location: "Quận 1, TP.HCM",
      status: "active",
      startDate: "2024-01-15",
      manager: "Nguyễn Văn A",
      projectGroupId: "pg-1",
    },
    {
      id: "const-2",
      name: "Khu đô thị mới Vinhomes",
      location: "Quận 9, TP.HCM",
      status: "active",
      startDate: "2024-02-01",
      manager: "Trần Thị B",
      projectGroupId: "pg-1",
    },
    {
      id: "const-3",
      name: "Trung tâm thương mại Plaza",
      location: "Quận 3, TP.HCM",
      status: "completed",
      startDate: "2023-06-01",
      endDate: "2024-01-30",
      manager: "Lê Văn C",
      projectGroupId: "pg-2",
    },
  ])

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "cat-1",
      name: "Móng và kết cấu",
      description: "Thi công móng, cột, dầm chính",
      constructionId: "const-1", // Updated to constructionId
      status: "completed",
      createdDate: "2024-01-20",
    },
    {
      id: "cat-2",
      name: "Tường và vách ngăn",
      description: "Xây tường, lắp vách ngăn",
      constructionId: "const-1",
      status: "in-progress",
      createdDate: "2024-02-01",
    },
    {
      id: "cat-3",
      name: "Hệ thống điện nước",
      description: "Lắp đặt hệ thống điện, nước, gas",
      constructionId: "const-1",
      status: "pending",
      createdDate: "2024-02-15",
    },
  ])

  const [reports, setReports] = useState<Report[]>([
    {
      id: "rep-1",
      title: "Báo cáo tiến độ tuần 1",
      categoryId: "cat-1",
      status: "approved",
      createdDate: "2024-01-25",
      lastModified: "2024-01-26",
    },
    {
      id: "rep-2",
      title: "Báo cáo chất lượng thi công",
      categoryId: "cat-1",
      status: "completed",
      createdDate: "2024-02-01",
      lastModified: "2024-02-02",
    },
    {
      id: "rep-3",
      title: "Báo cáo an toàn lao động",
      categoryId: "cat-2",
      status: "draft",
      createdDate: "2024-02-10",
      lastModified: "2024-02-12",
    },
  ])

  const [projectGroupErrors, setProjectGroupErrors] = useState<{ [key: string]: string }>({})
  const [constructionErrors, setConstructionErrors] = useState<{ [key: string]: string }>({})
  const [categoryErrors, setCategoryErrors] = useState<{ [key: string]: string }>({})
  const [reportErrors, setReportErrors] = useState<{ [key: string]: string }>({})

  const [showEditReport, setShowEditReport] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)
  const [showDeleteProjectGroupConfirm, setShowDeleteProjectGroupConfirm] = useState(false)
  const [projectGroupToDelete, setProjectGroupToDelete] = useState<string | null>(null)
  const [showDeleteConstructionConfirm, setShowDeleteConstructionConfirm] = useState(false)
  const [constructionToDelete, setConstructionToDelete] = useState<string | null>(null)
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [showDeleteTemplateConfirm, setShowDeleteTemplateConfirm] = useState(false)
  const [showDeleteTemplateDialog, setShowDeleteTemplateDialog] = useState(false)
  const [showDeleteProjectGroupDialog, setShowDeleteProjectGroupDialog] = useState(false)
  const [showDeleteConstructionDialog, setShowDeleteConstructionDialog] = useState(false)
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false)
  const [showDeleteReportDialog, setShowDeleteReportDialog] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Construction | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFile | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-progress":
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "paused":
      case "pending":
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Đang thực hiện",
      completed: "Hoàn thành",
      paused: "Tạm dừng",
      pending: "Chờ thực hiện",
      "in-progress": "Đang tiến hành",
      draft: "Bản nháp",
      approved: "Đã duyệt",
    }
    return statusMap[status] || status
  }

  // const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredConstructions = constructions.filter(
    (construction) => construction.projectGroupId === selectedProjectGroup?.id,
  )
  const filteredCategories = categories.filter((category) => category.constructionId === selectedConstruction?.id)
  const filteredReports = reports.filter((report) => report.categoryId === selectedCategory?.id)

  const handleCreateProjectGroup = () => {
    const errors: { [key: string]: string } = {}

    if (!newProjectGroup.name.trim()) errors.name = "Tên dự án là bắt buộc"
    if (!newProjectGroup.manager.trim()) errors.manager = "Quản lý là bắt buộc"

    if (Object.keys(errors).length > 0) {
      setProjectGroupErrors(errors)
      return
    }

    setProjectGroupErrors({})
    const projectGroup: ProjectGroup = {
      id: `pg-${Date.now()}`,
      name: newProjectGroup.name,
      description: newProjectGroup.description,
      manager: newProjectGroup.manager,
      status: newProjectGroup.status,
      startDate: new Date().toISOString().split("T")[0],
    }

    setProjectGroups((prev) => {
      const newProjectGroups = [...prev, projectGroup]
      localStorage.setItem("projectGroups", JSON.stringify(newProjectGroups))
      return newProjectGroups
    })
    setNewProjectGroup({ name: "", description: "", manager: "", status: "active" })
    setShowCreateProjectGroup(false)
  }

  const handleCreateConstruction = () => {
    const errors: { [key: string]: string } = {}

    if (!newConstruction.name.trim()) errors.name = "Tên công trình là bắt buộc"
    if (!newConstruction.location.trim()) errors.location = "Địa điểm là bắt buộc"
    if (!newConstruction.manager.trim()) errors.manager = "Quản lý là bắt buộc"
    if (!selectedProjectGroup) errors.projectGroup = "Vui lòng chọn dự án trước"

    if (Object.keys(errors).length > 0) {
      setConstructionErrors(errors)
      return
    }

    setConstructionErrors({})
    const construction: Construction = {
      id: `const-${Date.now()}`,
      name: newConstruction.name,
      location: newConstruction.location,
      manager: newConstruction.manager,
      status: newConstruction.status,
      startDate: new Date().toISOString().split("T")[0],
      projectGroupId: selectedProjectGroup!.id,
    }

    setConstructions((prev) => {
      const newConstructions = [...prev, construction]
      localStorage.setItem("constructions", JSON.stringify(newConstructions))
      return newConstructions
    })
    setNewConstruction({ name: "", location: "", manager: "", status: "active", templateFile: null })
    setShowCreateConstruction(false)
  }

  const handleCreateCategory = () => {
    const errors: { [key: string]: string } = {}

    if (!newCategory.name.trim()) errors.name = "Tên hạng mục là bắt buộc"
    if (!selectedConstruction) errors.construction = "Vui lòng chọn công trình trước"

    if (Object.keys(errors).length > 0) {
      setCategoryErrors(errors)
      return
    }

    setCategoryErrors({})
    const category: Category = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      constructionId: selectedConstruction!.id, // Updated to constructionId
      status: newCategory.status,
      createdDate: new Date().toISOString().split("T")[0],
    }

    setCategories((prev) => {
      const newCategories = [...prev, category]
      localStorage.setItem("categories", JSON.stringify(newCategories))
      return newCategories
    })
    setNewCategory({ name: "", description: "", status: "pending" })
    setShowCreateCategory(false)
  }

  const handleCreateReport = () => {
    const errors: { [key: string]: string } = {}

    if (!newReport.title.trim()) errors.title = "Tiêu đề báo cáo là bắt buộc"
    if (!selectedCategory) errors.category = "Vui lòng chọn hạng mục trước"

    if (Object.keys(errors).length > 0) {
      setReportErrors(errors)
      return
    }

    setReportErrors({})
    const reportId = `rep-${Date.now()}`
    const report: Report = {
      id: reportId,
      title: newReport.title,
      categoryId: selectedCategory!.id,
      status: newReport.status,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    setReports((prev) => {
      const newReports = [...prev, report]
      localStorage.setItem("reports", JSON.stringify(newReports))
      return newReports
    })
    setNewReport({ title: "", status: "draft" })
    setShowCreateReport(false)

    // Navigate to editor page
    router.push(`/construction-reports/editor/${reportId}`)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
      status: category.status,
    })
    setShowEditCategory(true)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    const errors: { [key: string]: string } = {}
    if (!editingCategory.name.trim()) errors.name = "Tên hạng mục là bắt buộc"

    if (Object.keys(errors).length > 0) {
      setCategoryErrors(errors)
      return
    }

    setCategoryErrors({})
    const updatedCategories = categories.map((c) =>
      c.id === editingCategory.id
        ? { ...c, name: editingCategory.name, description: editingCategory.description, status: editingCategory.status }
        : c,
    )
    setCategories(updatedCategories)
    localStorage.setItem("categories", JSON.stringify(updatedCategories))

    // Update selected category if it's the one being edited
    if (selectedCategory?.id === editingCategory.id) {
      setSelectedCategory({
        ...editingCategory,
        name: editingCategory.name,
        description: editingCategory.description,
        status: editingCategory.status,
      })
    }

    setNewCategory({ name: "", description: "", status: "pending" })
    setEditingCategory(null)
    setShowEditCategory(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setShowDeleteCategoryDialog(true)
  }

  const confirmDeleteCategory = () => {
    console.log("[v0] confirmDeleteCategory called, categoryToDelete:", categoryToDelete)
    if (categoryToDelete) {
      setCategories((prev) => {
        const newCategories = prev.filter((c) => c.id !== categoryToDelete)
        localStorage.setItem("categories", JSON.stringify(newCategories))
        console.log("[v0] Categories after delete:", newCategories.length)
        return newCategories
      })
      setReports((prev) => {
        const newReports = prev.filter((r) => r.categoryId !== categoryToDelete)
        localStorage.setItem("reports", JSON.stringify(newReports))
        return newReports
      })
      if (selectedCategory?.id === categoryToDelete) {
        setSelectedCategory(null)
      }
      setCategoryToDelete(null)
    }
    console.log("[v0] Closing delete category dialog")
    setShowDeleteCategoryDialog(false)
  }

  const handleDeleteReport = (reportId: string) => {
    setReportToDelete(reportId)
    setShowDeleteReportDialog(true)
  }

  const confirmDeleteReport = () => {
    if (reportToDelete) {
      setReports((prev) => {
        const newReports = prev.filter((r) => r.id !== reportToDelete)
        localStorage.setItem("reports", JSON.stringify(newReports))
        return newReports
      })
      setReportToDelete(null)
    }
    setShowDeleteReportDialog(false)
  }

  useEffect(() => {
    const savedTemplates = localStorage.getItem("templateFiles")
    if (savedTemplates) {
      const templatesData = JSON.parse(savedTemplates)
      const templates = templatesData.map((templateData: any) => ({
        ...templateData,
        file: new File([templateData.content], templateData.name, { type: templateData.type }),
        size: templateData.size || 0,
        pageCount: templateData.pageCount || 8, // Default to 8 pages if not set
      }))
      setTemplateFiles(templates)
    }
  }, [])

const getWordPageCount = async (file: File): Promise<number> => {
  try {
    // Import mammoth.js dynamically
    const mammoth = await import('mammoth')
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Extract text content from Word document
    const result = await mammoth.extractRawText({ arrayBuffer })
    const text = result.value
    
    // Count explicit page breaks
    const pageBreaks = (text.match(/\f/g) || []).length
    
    // If no explicit page breaks, estimate based on content length
    if (pageBreaks === 0) {
      // Estimate: ~500 words per page for typical documents
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
      const estimatedPages = Math.max(1, Math.ceil(wordCount / 500))
      return Math.min(estimatedPages, 20) // Cap at 20 pages for safety
    }
    
    // Return page breaks + 1 (first page doesn't have a break before it)
    return Math.max(1, pageBreaks + 1)
    
  } catch (error) {
    console.error('Error reading Word document:', error)
    
    // Fallback: estimate based on file size
    const fileSizeKB = file.size / 1024
    // Rough estimate: 50KB per page for Word documents
    const estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 50))
    return Math.min(estimatedPages, 20) // Cap at 20 pages
  }
}

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setTemplateErrors({ file: "Chỉ chấp nhận file Word (.docx)" })
        return
      }

      // Get page count
      const pageCount = await getWordPageCount(file)

      const newTemplate: TemplateFile = {
        id: Date.now().toString(),
        name: file.name,
        file: file,
        uploadDate: new Date().toLocaleDateString('vi-VN'),
        isDefault: templateFiles.length === 0,
        pageCount: pageCount,
        size: file.size,
      }

      const updatedTemplates = [...templateFiles, newTemplate]
      setTemplateFiles(updatedTemplates)
      setTemplateErrors({ file: "" })

      const reader = new FileReader()
      reader.onload = () => {
        const templatesData = updatedTemplates.map((template) => ({
          id: template.id,
          name: template.name,
          type: template.file.type,
          size: template.size, // Use template.size instead of template.file.size
          content: reader.result,
          uploadDate: template.uploadDate,
          isDefault: template.isDefault,
          pageCount: template.pageCount,
        }))
        localStorage.setItem("templateFiles", JSON.stringify(templatesData))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSetDefaultTemplate = (templateId: string) => {
    const updatedTemplates = templateFiles.map((template) => ({
      ...template,
      isDefault: template.id === templateId,
    }))
    setTemplateFiles(updatedTemplates)

    const templatesData = updatedTemplates.map((template) => ({
      id: template.id,
      name: template.name,
      type: template.file.type,
      size: template.size, // Use template.size instead of template.file.size
      content: template.file,
      uploadDate: template.uploadDate,
      isDefault: template.isDefault,
      pageCount: template.pageCount,
    }))
    localStorage.setItem("templateFiles", JSON.stringify(templatesData))
  }

  const handleRemoveTemplate = (templateId: string) => {
    setTemplateToDelete(templateId)
    setShowDeleteTemplateConfirm(true)
  }

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      const updatedTemplates = templateFiles.filter((template) => template.id !== templateToDelete)

      // If deleted template was default and there are other templates, make first one default
      if (updatedTemplates.length > 0) {
        const deletedTemplate = templateFiles.find((t) => t.id === templateToDelete)
        if (deletedTemplate?.isDefault) {
          updatedTemplates[0].isDefault = true
        }
      }

      setTemplateFiles(updatedTemplates)
      localStorage.setItem("templateFiles", JSON.stringify(updatedTemplates))
    }
    setShowDeleteTemplateConfirm(false)
    setTemplateToDelete(null)
  }

  const handleEditReport = (report: Report) => {
    setEditingReport(report)
    setNewReport({
      title: report.title,
      status: report.status,
    })
    setShowEditReport(true)
  }

  const handleUpdateReport = () => {
    if (!editingReport) return

    const errors: { [key: string]: string } = {}
    if (!editingReport.title.trim()) errors.title = "Tiêu đề báo cáo là bắt buộc"

    if (Object.keys(errors).length > 0) {
      setReportErrors(errors)
      return
    }

    setReportErrors({})
    const updatedReports = reports.map((r) =>
      r.id === editingReport.id ? { ...r, title: editingReport.title, status: editingReport.status } : r,
    )
    setReports(updatedReports)
    localStorage.setItem("reports", JSON.stringify(updatedReports))

    setNewReport({ title: "", status: "draft" })
    setEditingReport(null)
    setShowEditReport(false)
  }

  const handleSelectProjectGroup = (projectGroup: ProjectGroup) => {
    setSelectedProjectGroup(projectGroup)
    setSelectedConstruction(null)
    setSelectedCategory(null)
  }

  const handleSelectConstruction = (construction: Construction) => {
    setSelectedConstruction(construction)
    setSelectedCategory(null)
  }

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleReportClick = (report: Report) => {
    router.push(`/construction-reports/editor/${report.id}`)
  }

  const handleTemplateDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      handleTemplateUpload({ target: { files: [file] } as any)
    }
  }

  const handleEditProjectGroup = (projectGroup: ProjectGroup) => {
    console.log("[v0] handleEditProjectGroup called with:", projectGroup)
    setEditingProjectGroup(projectGroup)
    console.log("[v0] Setting showEditProjectGroup to true")
    setShowEditProjectGroup(true)
  }
\
  const handleDeleteProjectGroup = (projectGroupId: string) => {
    setProjectGroupToDelete(projectGroupId)
    setShowDeleteProjectGroupDialog(true)
  }

  const confirmDeleteProjectGroup = () => {
    if (projectGroupToDelete) {
      setProjectGroups((prev) => {
        const newProjectGroups = prev.filter((pg) => pg.id !== projectGroupToDelete)
        localStorage.setItem("projectGroups", JSON.stringify(newProjectGroups))
        return newProjectGroups
      })
      // Delete all related constructions, categories, and reports
      setConstructions((prev) => {
        const newConstructions = prev.filter((c) => c.projectGroupId !== projectGroupToDelete)
        localStorage.setItem("constructions", JSON.stringify(newConstructions))
        return newConstructions
      })
      setCategories((prev) => {
        const newCategories = prev.filter((cat) => {
          const construction = constructions.find((c) => c.id === cat.constructionId)
          return construction?.projectGroupId !== projectGroupToDelete
        })
        localStorage.setItem("categories", JSON.stringify(newCategories))
        return newCategories
      })
      setReports((prev) => {
        const newReports = prev.filter((r) => {
          const category = categories.find((cat) => cat.id === r.categoryId)
          const construction = constructions.find((c) => c.id === category?.constructionId)
          return construction?.projectGroupId !== projectGroupToDelete
        })
        localStorage.setItem("reports", JSON.stringify(newReports))
        return newReports
      })
      if (selectedProjectGroup?.id === projectGroupToDelete) {
        setSelectedProjectGroup(null)
        setSelectedConstruction(null)
        setSelectedCategory(null)
      }
      setProjectGroupToDelete(null)
    }
    setShowDeleteProjectGroupDialog(false)
  }

  const handleEditConstruction = (construction: Construction) => {
    console.log("[v0] handleEditConstruction called with:", construction)
    setEditingConstruction(construction)
    console.log("[v0] Setting showEditConstructionDialog to true")
    setShowEditConstructionDialog(true)
  }

  const handleDeleteConstruction = (constructionId: string) => {
    setConstructionToDelete(constructionId)
    setShowDeleteConstructionDialog(true)
  }

  const confirmDeleteConstruction = () => {
    if (constructionToDelete) {
      setConstructions((prev) => {
        const newConstructions = prev.filter((c) => c.id !== constructionToDelete)
        localStorage.setItem("constructions", JSON.stringify(newConstructions))
        return newConstructions
      })

      // Also delete related categories and reports
      setCategories((prev) => {
        const newCategories = prev.filter((cat) => cat.constructionId !== constructionToDelete)
        localStorage.setItem("categories", JSON.stringify(newCategories))
        return newCategories
      })

      setReports((prev) => {
        const categoriesToDelete = categories.filter((cat) => cat.constructionId === constructionToDelete)
        const categoryIdsToDelete = categoriesToDelete.map((cat) => cat.id)
        const newReports = prev.filter((report) => !categoryIdsToDelete.includes(report.categoryId))
        localStorage.setItem("reports", JSON.stringify(newReports))
        return newReports
      })
    }
    setConstructionToDelete(null)
    setShowDeleteConstructionDialog(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                <span>{t("construction_reports.back_home")}</span>
              </Link>
              <div className="h-6 w-px bg-slate-600" />
              <h1 className="text-xl font-semibold text-cyan-400">{t("construction_reports.title")}</h1>
            </div>
            <span className="text-sm text-slate-400">{t("construction_reports.title")}</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">{t("construction_reports.title")}</h1>
          </div>
          <p className="text-slate-400">{t("construction_reports.subtitle")}</p>
        </div>

        {/* Template Upload Section */}
        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-cyan-400">
              <FileText className="h-5 w-5" />
              <span>{t("construction_reports.template_title")}</span>
              <span className="text-red-400">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div>
                <div
                  className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer mb-4"
                  onClick={() => document.getElementById("template-upload")?.click()}
                  onDrop={handleTemplateDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("construction_reports.template_upload")}</h3>
                  <p className="text-cyan-400 text-sm mb-2">{t("construction_reports.template_accept")}</p>
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-md p-3 mb-4">
                    <p className="text-yellow-400 text-sm font-medium">{t("construction_reports.template_warning")}</p>
                    <p className="text-yellow-300 text-sm">{t("construction_reports.template_note")}</p>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{t("construction_reports.template_drag")}</p>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">{t("construction_reports.template_choose")}</Button>
                  <input
                    id="template-upload"
                    type="file"
                    accept=".docx"
                    className="hidden"
                    onChange={handleTemplateUpload}
                  />
                </div>

                {templateFiles.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-slate-300">Chọn file mẫu mặc định:</Label>
                      <Select
                        value={templateFiles.find(t => t.isDefault)?.id || ""}
                        onValueChange={handleSetDefaultTemplate}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Chọn file mẫu làm mặc định" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {templateFiles.map((template) => (
                            <SelectItem key={template.id} value={template.id} className="text-white">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{template.name}</span>
                                {template.isDefault && <span className="text-green-400">(Mặc định)</span>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-300">Danh sách file mẫu:</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {templateFiles.map((template) => (
                            <div
                              key={template.id}
                              className={`bg-slate-700 rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors ${
                                selectedTemplate?.id === template.id ? 'ring-2 ring-cyan-400' : 'hover:bg-slate-600'
                              }`}
                              onClick={() => setSelectedTemplate(template)}
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="h-8 w-8 text-cyan-400" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium">{template.name}</p>
                                    {template.isDefault && (
                                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Mặc định</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-400">
                                    {(template.size / (1024 * 1024)).toFixed(2)} MB • {template.uploadDate} • Word
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!template.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSetDefaultTemplate(template.id)
                                    }}
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveTemplate(template.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-700 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-slate-300 mb-3">Thông tin chi tiết</h4>
                          {selectedTemplate ? (
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-12 w-12 text-cyan-400" />
                                <div>
                                  <p className="font-medium text-white">{selectedTemplate.name}</p>
                                  {selectedTemplate.isDefault && (
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">File mẫu mặc định</span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Kích thước:</span>
                                  <span className="text-white">{(selectedTemplate.size / (1024 * 1024)).toFixed(2)} MB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Ngày upload:</span>
                                  <span className="text-white">{selectedTemplate.uploadDate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Số trang:</span>
                                  <span className="text-white">{selectedTemplate.pageCount || 'Đang tính...'} trang</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Định dạng:</span>
                                  <span className="text-white">Microsoft Word (.docx)</span>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-600">
                                <div className="flex space-x-2">
                                  {!selectedTemplate.isDefault && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleSetDefaultTemplate(selectedTemplate.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Đặt làm mặc định
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveTemplate(selectedTemplate.id)}
                                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Xóa file
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-slate-400 py-8">
                              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>Click vào file mẫu để xem thông tin chi tiết</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-lg font-medium">{t("construction_reports.template_title")}</h3>
                </div>
                <p className="text-slate-300 mb-4">{t("construction_reports.template_description")}</p>
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-md p-3">
                  <p className="text-yellow-300 text-sm font-medium">{t("construction_reports.template_last_page")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid - Updated to 4 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Project Groups Column */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-blue-400">
                <FolderOpen className="h-5 w-5" />
                <span>Dự án</span>
              </CardTitle>
              <Dialog open={showCreateProjectGroup} onOpenChange={setShowCreateProjectGroup}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Tạo dự án mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectgroup-name">Tên dự án *</Label>
                      <Input
                        id="projectgroup-name"
                        value={newProjectGroup.name}
                        onChange={(e) => setNewProjectGroup({ ...newProjectGroup, name: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Tên dự án"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectgroup-description">Mô tả</Label>
                      <Textarea
                        id="projectgroup-description"
                        value={newProjectGroup.description}
                        onChange={(e) => setNewProjectGroup({ ...newProjectGroup, description: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Mô tả dự án"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectgroup-manager">Quản lý *</Label>
                      <Input
                        id="projectgroup-manager"
                        value={newProjectGroup.manager}
                        onChange={(e) => setNewProjectGroup({ ...newProjectGroup, manager: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Quản lý dự án"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectgroup-status">Trạng thái</Label>
                      <Select
                        value={newProjectGroup.status}
                        onValueChange={(value: any) => setNewProjectGroup({ ...newProjectGroup, status: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="active">Đang thực hiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="paused">Tạm dừng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateProjectGroup(false)}
                        className="text-slate-900"
                      >
                        Hủy
                      </Button>
                      <Button onClick={handleCreateProjectGroup} className="bg-blue-600 hover:bg-blue-700">
                        Tạo dự án
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectGroups.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Chọn dự án để xem công trình</p>
              ) : (
                projectGroups.map((projectGroup) => (
                  <div
                    key={projectGroup.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedProjectGroup?.id === projectGroup.id
                        ? "bg-blue-900/30 border-blue-600"
                        : "bg-slate-700 border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => handleSelectProjectGroup(projectGroup)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{projectGroup.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProjectGroup(projectGroup)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProjectGroup(projectGroup.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    {projectGroup.description && (
                      <p className="text-sm text-slate-400 mb-2">{projectGroup.description}</p>
                    )}
                    <p className="text-sm text-slate-400 mb-2">Quản lý: {projectGroup.manager}</p>
                    <Badge
                      variant={
                        projectGroup.status === "completed"
                          ? "default"
                          : projectGroup.status === "active"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        projectGroup.status === "completed"
                          ? "bg-blue-600"
                          : projectGroup.status === "active"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                      }
                    >
                      {projectGroup.status === "active"
                        ? "Đang thực hiện"
                        : projectGroup.status === "completed"
                          ? "Hoàn thành"
                          : "Tạm dừng"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Constructions Column */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-cyan-400">
                <Building className="h-5 w-5" />
                <span>Công trình</span>
              </CardTitle>
              <Dialog open={showCreateConstruction} onOpenChange={setShowCreateConstruction}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700" disabled={!selectedProjectGroup}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Tạo công trình mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="construction-name">Tên công trình *</Label>
                      <Input
                        id="construction-name"
                        value={newConstruction.name}
                        onChange={(e) => setNewConstruction({ ...newConstruction, name: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Tên công trình"
                      />
                    </div>
                    <div>
                      <Label htmlFor="construction-location">Địa điểm *</Label>
                      <Input
                        id="construction-location"
                        value={newConstruction.location}
                        onChange={(e) => setNewConstruction({ ...newConstruction, location: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Địa điểm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="construction-manager">Quản lý *</Label>
                      <Input
                        id="construction-manager"
                        value={newConstruction.manager}
                        onChange={(e) => setNewConstruction({ ...newConstruction, manager: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Quản lý công trình"
                      />
                    </div>
                    <div>
                      <Label htmlFor="construction-status">Trạng thái</Label>
                      <Select
                        value={newConstruction.status}
                        onChange={(value: any) => setNewConstruction({ ...newConstruction, status: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="active">Đang thực hiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="paused">Tạm dừng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateConstruction(false)}
                        className="text-slate-900"
                      >
                        Hủy
                      </Button>
                      <Button onClick={handleCreateConstruction} className="bg-cyan-600 hover:bg-cyan-700">
                        Tạo công trình
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedProjectGroup ? (
                <p className="text-slate-400 text-center py-8">Chọn dự án để xem công trình</p>
              ) : filteredConstructions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Chọn công trình để xem hạng mục</p>
              ) : (
                filteredConstructions.map((construction) => (
                  <div
                    key={construction.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConstruction?.id === construction.id
                        ? "bg-cyan-900/30 border-cyan-600"
                        : "bg-slate-700 border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => handleSelectConstruction(construction)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{construction.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditConstruction(construction)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConstruction(construction.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{construction.location}</p>
                    <p className="text-sm text-slate-400 mb-2">Quản lý: {construction.manager}</p>
                    <Badge
                      variant={
                        construction.status === "completed"
                          ? "default"
                          : construction.status === "active"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        construction.status === "completed"
                          ? "bg-blue-600"
                          : construction.status === "active"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                      }
                    >
                      {construction.status === "active"
                        ? "Đang thực hiện"
                        : construction.status === "completed"
                          ? "Hoàn thành"
                          : "Tạm dừng"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Categories Column */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-purple-400">
                <Users className="h-5 w-5" />
                <span>{t("construction_reports.categories")}</span>
              </CardTitle>
              <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700" disabled={!selectedConstruction}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("construction_reports.create_category")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>{t("construction_reports.modal.create_category")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">{t("construction_reports.category_name")} *</Label>
                      <Input
                        id="category-name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder={t("construction_reports.category_name")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-description">{t("construction_reports.category_description")}</Label>
                      <Textarea
                        id="category-description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder={t("construction_reports.category_description")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-status">{t("construction_reports.project_status")}</Label>
                      <Select
                        value={newCategory.status}
                        onValueChange={(value: any) => setNewCategory({ ...newCategory, status: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="pending">{t("construction_reports.status.pending")}</SelectItem>
                          <SelectItem value="in-progress">{t("construction_reports.status.in_progress")}</SelectItem>
                          <SelectItem value="completed">{t("construction_reports.status.completed")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateCategory(false)} className="text-slate-900">
                        {t("construction_reports.actions.cancel")}
                      </Button>
                      <Button onClick={handleCreateCategory} className="bg-purple-600 hover:bg-purple-700">
                        {t("construction_reports.actions.create")}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedConstruction ? (
                <p className="text-slate-400 text-center py-8">Chọn công trình để xem hạng mục</p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-slate-400 text-center py-8">{t("construction_reports.select_category")}</p>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCategory?.id === category.id
                        ? "bg-purple-900/30 border-purple-600"
                        : "bg-slate-700 border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => handleSelectCategory(category)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCategory(category)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCategoryToDelete(category.id)
                            setShowDeleteCategoryDialog(true)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    {category.description && <p className="text-sm text-slate-400 mb-2">{category.description}</p>}
                    <Badge
                      variant={
                        category.status === "completed"
                          ? "default"
                          : category.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        category.status === "completed"
                          ? "bg-blue-600"
                          : category.status === "in-progress"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                      }
                    >
                      {t(`construction_reports.status.${category.status.replace("-", "_")}`)}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Reports Column */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <FileText className="h-5 w-5" />
                <span>{t("construction_reports.reports")}</span>
              </CardTitle>
              <Dialog open={showCreateReport} onOpenChange={setShowCreateReport}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={!selectedCategory}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("construction_reports.create_report")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>{t("construction_reports.modal.create_report")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="report-title">{t("construction_reports.report_title")} *</Label>
                      <Input
                        id="report-title"
                        value={newReport.title}
                        onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                        className="bg-slate-700 border-slate-600"
                        placeholder={t("construction_reports.report_title")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="report-status">{t("construction_reports.project_status")}</Label>
                      <Select
                        value={newReport.status}
                        onValueChange={(value: any) => setNewReport({ ...newReport, status: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="draft">{t("construction_reports.status.draft")}</SelectItem>
                          <SelectItem value="completed">{t("construction_reports.status.completed")}</SelectItem>
                          <SelectItem value="approved">{t("construction_reports.status.approved")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateReport(false)} className="text-slate-900">
                        {t("construction_reports.actions.cancel")}
                      </Button>
                      <Button onClick={handleCreateReport} className="bg-green-600 hover:bg-green-700">
                        {t("construction_reports.actions.create")}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedCategory ? (
                <p className="text-slate-400 text-center py-8">{t("construction_reports.select_report")}</p>
              ) : filteredReports.length === 0 ? (
                <p className="text-slate-400 text-center py-8">{t("construction_reports.select_report")}</p>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 rounded-lg border bg-slate-700 border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                    onClick={() => handleReportClick(report)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{report.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditReport(report)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setReportToDelete(report.id)
                            setShowDeleteReportDialog(true)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {t("construction_reports.project_status")}: {new Date(report.createdDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-400 mb-2">
                      Sửa: {new Date(report.lastModified).toLocaleDateString()}
                    </p>
                    <Badge
                      variant={
                        report.status === "approved"
                          ? "default"
                          : report.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        report.status === "approved"
                          ? "bg-green-600"
                          : report.status === "completed"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                      }
                    >
                      {t(`construction_reports.status.${report.status}`)}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics - Updated to include project groups */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{projectGroups.length}</p>
                  <p className="text-sm text-slate-400">Tổng dự án</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold">{constructions.length}</p>
                  <p className="text-sm text-slate-400">Tổng công trình</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-slate-400">{t("construction_reports.stats.total_categories")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-sm text-slate-400">{t("construction_reports.stats.total_reports")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">{projectGroups.filter((pg) => pg.status === "active").length}</p>
                  <p className="text-sm text-slate-400">Đang thực hiện</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialogs */}
        <Dialog open={showDeleteProjectGroupDialog} onOpenChange={setShowDeleteProjectGroupDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa dự án này không?</p>
              <p className="text-sm text-slate-400">
                Tất cả công trình, hạng mục và báo cáo liên quan sẽ bị xóa. Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteProjectGroupDialog(false)}
                  className="text-slate-900"
                >
                  Hủy
                </Button>
                <Button onClick={confirmDeleteProjectGroup} className="bg-red-600 hover:bg-red-700">
                  Xóa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConstructionDialog} onOpenChange={setShowDeleteConstructionDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-red-400">{t("construction_reports.confirm_delete")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-slate-300">{t("construction_reports.confirm_delete_construction")}</p>
              <p className="text-sm text-slate-400">{t("construction_reports.delete_construction_warning")}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConstructionDialog(false)}
                className="border-slate-600 text-slate-900 hover:bg-slate-700 hover:text-white"
              >
                {t("construction_reports.cancel")}
              </Button>
              <Button variant="destructive" onClick={confirmDeleteConstruction} className="bg-red-600 hover:bg-red-700">
                {t("construction_reports.delete")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">{t("construction_reports.delete.confirm_title")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{t("construction_reports.delete.category_message")}</p>
              <p className="text-sm text-slate-400">{t("construction_reports.delete.category_warning")}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteCategoryDialog(false)} className="text-slate-900">
                  {t("construction_reports.actions.cancel")}
                </Button>
                <Button onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
                  {t("construction_reports.actions.delete")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteReportDialog} onOpenChange={setShowDeleteReportDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">{t("construction_reports.delete.confirm_title")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{t("construction_reports.delete.report_message")}</p>
              <p className="text-sm text-slate-400">{t("construction_reports.delete.report_warning")}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteReportDialog(false)} className="text-slate-900">
                  {t("construction_reports.actions.cancel")}
                </Button>
                <Button onClick={confirmDeleteReport} className="bg-red-600 hover:bg-red-700">
                  {t("construction_reports.actions.delete")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteTemplateConfirm} onOpenChange={setShowDeleteTemplateConfirm}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">{t("construction_reports.confirm_delete")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{t("construction_reports.confirm_delete_template")}</p>
              <p className="text-slate-400 text-sm">{t("construction_reports.delete_template_warning")}</p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteTemplateConfirm(false)}
                className="border-slate-600 text-slate-900 hover:bg-slate-700 hover:text-white"
              >
                {t("construction_reports.cancel")}
              </Button>
              <Button onClick={confirmDeleteTemplate} className="bg-red-600 hover:bg-red-700">
                {t("construction_reports.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog open={showEditProject} onOpenChange={setShowEditProject}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{t("construction_reports.modal.edit_project")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-project-name">{t("construction_reports.project_name")} *</Label>
                <Input
                  id="edit-project-name"
                  value={editingProject?.name || ""}
                  onChange={(e) =>
                    setEditingProject(editingProject ? { ...editingProject, name: e.target.value } : null)
                  }
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="edit-project-location">{t("construction_reports.project_location")} *</Label>
                <Input
                  id="edit-project-location"
                  value={editingProject?.location || ""}
                  onChange={(e) =>
                    setEditingProject(editingProject ? { ...editingProject, location: e.target.value } : null)
                  }
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="edit-project-manager">{t("construction_reports.project_manager")} *</Label>
                <Input
                  id="edit-project-manager"
                  value={editingProject?.manager || ""}
                  onChange={(e) =>
                    setEditingProject(editingProject ? { ...editingProject, manager: e.target.value } : null)
                  }
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="edit-project-status">{t("construction_reports.project_status")}</Label>
                <Select
                  value={editingProject?.status}
                  onValueChange={(value: any) =>
                    setEditingProject(editingProject ? { ...editingProject, status: value } : null)
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active">{t("construction_reports.status.active")}</SelectItem>
                    <SelectItem value="completed">{t("construction_reports.status.completed")}</SelectItem>
                    <SelectItem value="paused">{t("construction_reports.status.paused")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditProject(false)} className="text-slate-900">
                  {t("construction_reports.actions.cancel")}
                </Button>
                <Button onClick={() => {}} className="bg-cyan-600 hover:bg-cyan-700">
                  {t("construction_reports.actions.update")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{t("construction_reports.modal.edit_category")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">{t("construction_reports.category_name")} *</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)
                  }
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="edit-category-description">{t("construction_reports.category_description")}</Label>
                <Textarea
                  id="edit-category-description"
                  value={editingCategory?.description || ""}
                  onChange={(e) =>
                    setEditingCategory(editingCategory ? { ...editingCategory, description: e.target.value } : null)
                  }
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="edit-category-status">{t("construction_reports.project_status")}</Label>
                <Select
                  value={editingCategory?.status}
                  onChange={(value: any) =>
                    setEditingCategory(editingCategory ? { ...editingCategory, status: value } : null)
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="pending">{t("construction_reports.status.pending")}</SelectItem>
                    <SelectItem value="in-progress">{t("construction_reports.status.in_progress")}</SelectItem>
                    <SelectItem value="completed">{t("construction_reports.status.completed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditCategory(false)} className="text-slate-900">
                  {t("construction_reports.actions.cancel")}
                </Button>
                <Button onClick={handleUpdateCategory} className="bg-purple-600 hover:bg-purple-700">
                  {t("construction_reports.actions.update")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Report Dialog */}
        <Dialog open={showEditReport} onOpenChange={setShowEditReport}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{t("construction_reports.modal.edit_report")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-report-title">{t("construction_reports.report_title")} *</Label>
                <Input
                  id="edit-report-title"
                  value={editingReport?.title || ""}
                  onChange={(e) => setEditingReport(editingReport ? { ...editingReport, title: e.target.value } : null)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="edit-report-status">{t("construction_reports.project_status")}</Label>
                <Select
                  value={editingReport?.status}
                  onValueChange={(value: any) =>
                    setEditingReport(editingReport ? { ...editingReport, status: value } : null)
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="draft">{t("construction_reports.status.draft")}</SelectItem>
                    <SelectItem value="completed">{t("construction_reports.status.completed")}</SelectItem>
                    <SelectItem value="approved">{t("construction_reports.status.approved")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditReport(false)} className="text-slate-900">
                  {t("construction_reports.actions.cancel")}
                </Button>
                <Button onClick={handleUpdateReport} className="bg-green-600 hover:bg-green-700">
                  {t("construction_reports.actions.update")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit ProjectGroup Dialog */}
        <Dialog open={showEditProjectGroup} onOpenChange={setShowEditProjectGroup}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{t("construction_reports.modal.edit_project_group")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-projectgroup-name">{t("construction_reports.project_group_name")} *</Label>
                <Input
                  id="edit-projectgroup-name"
                  value={editingProjectGroup?.name || ""}
                  onChange={(e) => setEditingProjectGroup((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-projectgroup-description">{t("construction_reports.description")}</Label>
                <Textarea
                  id="edit-projectgroup-description"
                  value={editingProjectGroup?.description || ""}
                  onChange={(e) =>
                    setEditingProjectGroup((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-projectgroup-manager">{t("construction_reports.manager")} *</Label>
                <Input
                  id="edit-projectgroup-manager"
                  value={editingProjectGroup?.manager || ""}
                  onChange={(e) =>
                    setEditingProjectGroup((prev) => (prev ? { ...prev, manager: e.target.value } : null))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-projectgroup-status">{t("construction_reports.status")}</Label>
                <Select
                  value={editingProjectGroup?.status || "active"}
                  onValueChange={(value) =>
                    setEditingProjectGroup((prev) => (prev ? { ...prev, status: value } : null))
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active">{t("construction_reports.status_active")}</SelectItem>
                    <SelectItem value="completed">{t("construction_reports.status_completed")}</SelectItem>
                    <SelectItem value="on-hold">{t("construction_reports.status_on_hold")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditProjectGroup(false)}
                className="border-slate-600 text-slate-900 hover:bg-slate-100"
              >
                {t("construction_reports.cancel")}
              </Button>
              <Button
                onClick={() => {
                  if (editingProjectGroup && editingProjectGroup.name && editingProjectGroup.manager) {
                    setProjectGroups((prev) => {
                      const newProjectGroups = prev.map((pg) =>
                        pg.id === editingProjectGroup.id ? editingProjectGroup : pg,
                      )
                      localStorage.setItem("projectGroups", JSON.stringify(newProjectGroups))
                      return newProjectGroups
                    })
                    setShowEditProjectGroup(false)
                    setEditingProjectGroup(null)
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("construction_reports.update")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Construction Dialog */}
        <Dialog open={showEditConstructionDialog} onOpenChange={setShowEditConstructionDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{t("construction_reports.modal.edit_construction")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-construction-name">{t("construction_reports.construction_name")} *</Label>
                <Input
                  id="edit-construction-name"
                  value={editingConstruction?.name || ""}
                  onChange={(e) => setEditingConstruction((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-construction-location">{t("construction_reports.location")} *</Label>
                <Input
                  id="edit-construction-location"
                  value={editingConstruction?.location || ""}
                  onChange={(e) =>
                    setEditingConstruction((prev) => (prev ? { ...prev, location: e.target.value } : null))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-construction-manager">{t("construction_reports.manager")} *</Label>
                <Input
                  id="edit-construction-manager"
                  value={editingConstruction?.manager || ""}
                  onChange={(e) =>
                    setEditingConstruction((prev) => (prev ? { ...prev, manager: e.target.value } : null))
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-construction-status">{t("construction_reports.status")}</Label>
                <Select
                  value={editingConstruction?.status || "in-progress"}
                  onValueChange={(value) =>
                    setEditingConstruction((prev) => (prev ? { ...prev, status: value } : null))
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="in-progress">{t("construction_reports.status_in_progress")}</SelectItem>
                    <SelectItem value="completed">{t("construction_reports.status_completed")}</SelectItem>
                    <SelectItem value="on-hold">{t("construction_reports.status_on_hold")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditConstructionDialog(false)}
                className="border-slate-600 text-slate-900 hover:bg-slate-100"
              >
                {t("construction_reports.cancel")}
              </Button>
              <Button
                onClick={() => {
                  if (
                    editingConstruction &&
                    editingConstruction.name &&
                    editingConstruction.location &&
                    editingConstruction.manager
                  ) {
                    setConstructions((prev) => {
                      const newConstructions = prev.map((c) =>
                        c.id === editingConstruction.id ? editingConstruction : c,
                      )
                      localStorage.setItem("constructions", JSON.stringify(newConstructions))
                      return newConstructions
                    })
                    setShowEditConstructionDialog(false)
                    setEditingConstruction(null)
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("construction_reports.update")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
