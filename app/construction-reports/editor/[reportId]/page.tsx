"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useLanguage } from "@/contexts/language-context"

import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Save,
  Lock,
  Unlock,
  FileText,
  Upload,
  Plus,
  Eye,
  Printer,
  Share2,
  X,
  Mail,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

declare global {
  interface Window {
    DocsAPI?: {
      DocEditor: new (id: string, config: any) => any
    }
    DocEditor?: {
      instances: Record<string, any>
    }
  }
}

interface DocumentConfig {
  document: {
    fileType: string
    key: string
    title: string
    url: string
    permissions: {
      edit: boolean
      download: boolean
      print: boolean
    }
  }
  documentType: string
  editorConfig: {
    user: {
      id: string
      name: string
    }
    customization: {
      autosave: boolean
      forcesave: boolean
      compactToolbar: boolean
    }
    callbackUrl: string
  }
  width: string
  height: string
}

export default function ReportEditorPage() {
  const params = useParams()
  const reportId = params.reportId as string
  const { t } = useLanguage()

  const [reportName, setReportName] = useState("Báo cáo thi công")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documentConfig, setDocumentConfig] = useState<DocumentConfig | null>(null)
  const [totalPages, setTotalPages] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)
  const [mockContent, setMockContent] = useState("Đây là nội dung của trang")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmails, setShareEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [shareType, setShareType] = useState<"specific" | "all">("specific")
  const [emailError, setEmailError] = useState("")
  const [showLockModal, setShowLockModal] = useState(false)
  const [lockAction, setLockAction] = useState<"lock" | "unlock">("lock")
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleRemoveEmail = (email: string) => {
    setShareEmails((prev) => prev.filter((e) => e !== email))
  }

  useEffect(() => {
    initializeDocument()
    loadReportName()
  }, [reportId])

  const loadReportName = () => {
    const savedReports = localStorage.getItem("construction-reports")
    if (savedReports) {
      try {
        const reports = JSON.parse(savedReports)
        const currentReport = reports.find((r: any) => r.id === reportId)
        if (currentReport) {
          setReportName(currentReport.title || currentReport.name || "Báo cáo thi công")
          return
        }
      } catch (error) {
        console.error("[v0] Error loading report name:", error)
      }
    }

    if (reportId.includes("rep-")) {
      setReportName("Báo cáo thi công")
    } else {
      setReportName("Báo cáo thi công")
    }
  }

  const initializeDocument = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const onlyofficeUrl = process.env.NEXT_PUBLIC_ONLYOFFICE_SERVER_URL
      if (!onlyofficeUrl) {
        console.log("[v0] ONLYOFFICE server not configured, using fallback UI")
        setIsLoading(false)
        return
      }

      const config: DocumentConfig = {
        document: {
          fileType: "docx",
          key: `report_${reportId}_${Date.now()}`,
          title: `Báo cáo thi công - ${reportId}`,
          url: `/api/construction-reports/documents/${reportId}`,
          permissions: {
            edit: true,
            download: true,
            print: true,
          },
        },
        documentType: "word",
        editorConfig: {
          user: {
            id: "user_1",
            name: "Construction Manager",
          },
          customization: {
            autosave: true,
            forcesave: true,
            compactToolbar: false,
          },
          callbackUrl: `/api/construction-reports/callback`,
        },
        width: "100%",
        height: "100%",
      }

      setDocumentConfig(config)
      await loadOnlyOfficeScript()

      if (typeof window !== "undefined" && window.DocsAPI) {
        new window.DocsAPI.DocEditor("onlyoffice-editor", config)
      } else {
        throw new Error("ONLYOFFICE API not available")
      }

      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error initializing document:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      setIsLoading(false)
    }
  }

  const loadOnlyOfficeScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Not in browser environment"))
        return
      }

      if (window.DocsAPI) {
        resolve()
        return
      }

      const onlyofficeUrl = process.env.NEXT_PUBLIC_ONLYOFFICE_SERVER_URL
      if (!onlyofficeUrl) {
        reject(new Error("ONLYOFFICE server URL not configured"))
        return
      }

      const script = document.createElement("script")
      script.src = `${onlyofficeUrl}/web-apps/apps/api/documents/api.js`
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load ONLYOFFICE script"))
      document.head.appendChild(script)
    })
  }

  const handleSave = () => {
    try {
      if (typeof window !== "undefined" && window.DocEditor?.instances) {
        const editor = Object.values(window.DocEditor.instances)[0]
        if (editor) {
          editor.downloadAs("docx")
        }
      }
    } catch (error) {
      console.error("[v0] Error saving document:", error)
    }
  }

  const handleLockAll = () => {
    setLockAction("lock")
    setShowLockModal(true)
  }

  const handleUnlockAll = () => {
    setLockAction("unlock")
    setShowLockModal(true)
  }

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum)
    setMockContent("Đây là nội dung của trang")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleAddReport = () => {
    console.log("[v0] Tạo thêm báo cáo - nhân bản trang cuối")

    // Copy the last 2 pages (n-1 and n) to create new pages (n+1 and n+2)
    const lastTwoPages = [totalPages - 1, totalPages]
    const newPageNumbers = [totalPages + 1, totalPages + 2]

    console.log(`[v0] Sao chép trang ${lastTwoPages.join(", ")} thành trang ${newPageNumbers.join(", ")}`)

    // Update total pages count
    setTotalPages((prev) => prev + 2)

    // Set current page to the first newly created page
    setCurrentPage(totalPages + 1)

    // In a real implementation with ONLYOFFICE, this would call:
    // - Document Builder API to duplicate pages
    // - Copy content from pages (n-1, n) to (n+1, n+2)
    // - Mark new pages as "unedited" status

    console.log(`[v0] Tổng số trang sau khi thêm: ${totalPages + 2}`)
  }

  const handlePreview = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const documentContent = document.querySelector("#onlyoffice-editor")?.innerHTML || ""
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Xem trước - Báo cáo T75620435379</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .preview-container { max-width: 210mm; margin: 0 auto; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="preview-container">
              ${documentContent}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      if (window.DocEditor?.instances) {
        const editor = Object.values(window.DocEditor.instances)[0]
        if (editor && editor.downloadAs) {
          console.log("[v0] Printing via ONLYOFFICE")
          return
        }
      }

      const printContent = document.querySelector("#onlyoffice-editor")
      if (printContent) {
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>In báo cáo - T75620435379</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 0; }
                  @page { size: A4; margin: 20mm; }
                  .print-container { width: 100%; }
                </style>
              </head>
              <body>
                <div class="print-container">
                  ${printContent.innerHTML}
                </div>
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.print()
          printWindow.close()
        }
      }
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleShareSubmit = () => {
    if (shareType === "all") {
      console.log("[v0] Chia sẻ với tất cả thành viên")
    } else if (shareEmails.length > 0) {
      console.log("[v0] Chia sẻ với emails:", shareEmails)
    }
    setShowShareModal(false)
    setShareEmails([])
    setCurrentEmail("")
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    const trimmedEmail = currentEmail.trim()

    if (!trimmedEmail) {
      setEmailError(t("editor.share.email_error_required"))
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError(t("editor.share.email_error_invalid"))
      return
    }

    if (shareEmails.includes(trimmedEmail)) {
      setEmailError(t("editor.share.email_error_exists"))
      return
    }

    setShareEmails([...shareEmails, trimmedEmail])
    setCurrentEmail("")
    setEmailError("")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmail(e.target.value)
    if (emailError) {
      setEmailError("")
    }
  }

  const handleImageSlotClick = (slotIndex: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => {
              const newImages = [...prev]
              newImages[slotIndex] = event.target!.result as string
              return newImages
            })
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handlePageSelect = (pageNum: number) => {
    setSelectedPages((prev) => (prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]))
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPages([])
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1))
    }
    setSelectAll(!selectAll)
  }

  const handleLockUnlockSubmit = () => {
    if (selectedPages.length > 0) {
      console.log(`[v0] ${lockAction === "lock" ? "Khóa" : "Mở khóa"} các trang:`, selectedPages)
    }
    setShowLockModal(false)
    setSelectedPages([])
    setSelectAll(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <div className="w-80 bg-gradient-to-b from-teal-900 to-slate-900 flex flex-col text-white">
        {/* Header */}
        <div className="p-4 border-b border-teal-700/30">
          <div className="flex items-center justify-between mb-2">
            <Link href="/construction-reports">
              <Button variant="ghost" size="sm" className="text-teal-200 hover:text-white hover:bg-teal-700/30 p-1">
                <ArrowLeft className="w-4 h-4" />
                {t("editor.back")}
              </Button>
            </Link>
            <span className="text-teal-200 text-sm">
              {t("editor.page")} {currentPage}/{totalPages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{reportName}</h1>
            <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-medium">
              {t("editor.group")}
            </span>
          </div>
        </div>

        <div className="p-4">
          <Button
            onClick={handleAddReport}
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium shadow-lg mb-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("editor.add_report")}
          </Button>
          <p className="text-xs text-teal-300 text-center mb-4">{t("editor.add_report_desc")}</p>

          <Button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t("editor.share_report")}
          </Button>
        </div>

        <div className="px-4 pb-4">
          <h3 className="text-white font-medium text-sm mb-3">{t("editor.lock_unlock")}</h3>
          <div className="space-y-2">
            <Button
              onClick={handleLockAll}
              variant="ghost"
              className="w-full justify-start text-teal-200 hover:text-white hover:bg-teal-700/30 p-2"
            >
              <Lock className="w-4 h-4 mr-3" />
              {t("editor.lock_all")}
            </Button>
            <Button
              onClick={handleUnlockAll}
              variant="ghost"
              className="w-full justify-start text-teal-200 hover:text-white hover:bg-teal-700/30 p-2"
            >
              <Unlock className="w-4 h-4 mr-3" />
              {t("editor.unlock_all")}
            </Button>
          </div>
        </div>

        {/* Page Grid */}
        <div className="px-4 pb-4">
          <h3 className="text-white font-medium text-sm mb-3">{t("editor.page_navigation")}</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`aspect-square border rounded cursor-pointer flex items-center justify-center text-xs font-medium transition-all ${
                  pageNum === currentPage
                    ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                    : "border-teal-600 bg-teal-700/30 text-teal-200 hover:border-teal-500 hover:bg-teal-600/50"
                }`}
              >
                {pageNum}
              </div>
            ))}
          </div>
        </div>

        {/* Document Info */}
        <div className="mt-auto p-4 border-t border-teal-700/30">
          <h3 className="text-white font-medium text-sm mb-2">{t("editor.document_info")}</h3>
          <div className="space-y-1 text-xs text-teal-200">
            <p>
              {t("editor.total_pages")}: {totalPages} {t("editor.page").toLowerCase()}
            </p>
            <p>
              {t("editor.locked_pages")}: 0 {t("editor.page").toLowerCase()}
            </p>
            <p>{t("editor.updated")}: 14:43:53 26/8/2026</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-slate-800 px-6 py-3 flex items-center gap-4">
          <Button onClick={handlePreview} variant="ghost" size="sm" className="text-white hover:bg-slate-700">
            <Eye className="w-4 h-4 mr-2" />
            {t("editor.preview")}
          </Button>
          <Button onClick={handleSave} variant="ghost" size="sm" className="text-white hover:bg-slate-700">
            <Save className="w-4 h-4 mr-2" />
            {t("editor.save")}
          </Button>
          <Button onClick={handlePrint} variant="ghost" size="sm" className="text-white hover:bg-slate-700">
            <Printer className="w-4 h-4 mr-2" />
            {t("editor.print")}
          </Button>
        </div>

        {/* Document viewer */}
        <div className="flex-1 p-6">
          <div className="h-full flex items-center justify-center">
            <div
              className="w-[210mm] h-[297mm] max-w-full max-h-full bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden relative"
              style={{ aspectRatio: "210/297" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("editor.loading")}</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-red-300" />
                    <p className="text-lg text-red-600 mb-2">{t("editor.error_loading")}</p>
                    <p className="text-sm text-gray-500">{error}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div id="onlyoffice-editor" className="w-full h-full p-8">
                    {!process.env.NEXT_PUBLIC_ONLYOFFICE_SERVER_URL ? (
                      <div className="h-full flex flex-col">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                          <h1 className="text-2xl font-bold text-gray-800 mb-2">{reportName}</h1>
                          <p className="text-gray-600">
                            {t("editor.page")} {currentPage} / {totalPages}
                          </p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          {currentPage === totalPages ? (
                            <div className="w-full max-w-2xl">
                              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                {t("editor.construction_images")}
                              </h2>
                              <div className="grid grid-cols-2 gap-4">
                                {Array.from({ length: 4 }, (_, i) => (
                                  <div
                                    key={i}
                                    onClick={() => handleImageSlotClick(i)}
                                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
                                  >
                                    {uploadedImages[i] ? (
                                      <img
                                        src={uploadedImages[i] || "/placeholder.svg"}
                                        alt={`${t("editor.image")} ${i + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="text-center text-gray-400">
                                        <Upload className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-sm">
                                          {t("editor.image")} {i + 1}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="w-full max-w-4xl">
                              <div className="prose prose-lg max-w-none">
                                <p className="text-gray-600 text-center text-lg">
                                  {t("editor.page_content")} {currentPage}
                                </p>
                                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                                  <p className="text-gray-700 leading-relaxed">
                                    {t("editor.demo_content").replace("{page}", currentPage.toString())}
                                  </p>
                                </div>
                                <div className="mt-6 text-sm text-gray-500 text-center">{t("editor.demo_mode")}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-6">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{reportName}</span>
                            <span>
                              {t("editor.page")} {currentPage}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg">{t("editor.onlyoffice_placeholder")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Auto-save indicator */}
                  <div className="absolute bottom-4 right-4 bg-gray-600/90 text-white px-3 py-1 rounded text-sm">
                    {t("editor.auto_save")}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {lockAction === "lock" ? t("editor.lock.title") : t("editor.unlock.title")}
              </h3>
              <Button
                onClick={() => setShowLockModal(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="selectAll" className="text-gray-700 font-medium">
                  {t("editor.lock.select_all")}
                </label>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{t("editor.lock.select_specific")}</p>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <label
                      key={pageNum}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(pageNum)}
                        onChange={() => handlePageSelect(pageNum)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {t("editor.page")} {pageNum}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedPages.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    {t("editor.lock.selected_count")
                      .replace("{count}", selectedPages.length.toString())
                      .replace("{pages}", selectedPages.join(", "))}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowLockModal(false)}
                  variant="outline"
                  className="flex-1 text-slate-900 hover:text-white"
                >
                  {t("editor.share.cancel")}
                </Button>
                <Button
                  onClick={handleLockUnlockSubmit}
                  className={`flex-1 ${
                    lockAction === "lock" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={selectedPages.length === 0}
                >
                  {lockAction === "lock" ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {t("editor.lock.lock_pages")}
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      {t("editor.unlock.unlock_pages")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t("editor.share.title")}</h3>
              <Button
                onClick={() => setShowShareModal(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shareType"
                    value="specific"
                    checked={shareType === "specific"}
                    onChange={(e) => setShareType(e.target.value as "specific")}
                    className="text-blue-600"
                  />
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{t("editor.share.email_specific")}</span>
                </label>

                {shareType === "specific" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="email"
                          placeholder={t("editor.share.email_placeholder")}
                          value={currentEmail}
                          onChange={handleEmailChange}
                          onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            emailError ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                      </div>
                      <Button
                        onClick={handleAddEmail}
                        disabled={!currentEmail.trim()}
                        className="bg-green-600 hover:bg-green-700 px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {shareEmails.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">{t("editor.share.shared_with")}</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {shareEmails.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                            >
                              <span className="text-sm text-gray-700">{email}</span>
                              <Button
                                onClick={() => handleRemoveEmail(email)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shareType"
                    value="all"
                    checked={shareType === "all"}
                    onChange={(e) => setShareType(e.target.value as "all")}
                    className="text-blue-600"
                  />
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{t("editor.share.all_members")}</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowShareModal(false)} variant="outline" className="flex-1">
                  {t("editor.share.cancel")}
                </Button>
                <Button
                  onClick={handleShareSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={shareType === "specific" && shareEmails.length === 0}
                >
                  {t("editor.share.share")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
