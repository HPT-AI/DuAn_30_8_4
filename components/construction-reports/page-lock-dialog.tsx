"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Unlock, AlertCircle } from "lucide-react"

interface PageLockDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedPages: number[]) => void
  totalPages: number
  lockedPages: number[]
  mode: "lock" | "unlock"
  isLoading?: boolean
}

export function PageLockDialog({
  isOpen,
  onClose,
  onConfirm,
  totalPages,
  lockedPages,
  mode,
  isLoading = false,
}: PageLockDialogProps) {
  const [selectedPages, setSelectedPages] = useState<number[]>([])

  if (!isOpen) return null

  const availablePages =
    mode === "lock"
      ? Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => !lockedPages.includes(page))
      : lockedPages

  const handlePageToggle = (page: number) => {
    setSelectedPages((prev) => (prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]))
  }

  const handleSelectAll = () => {
    setSelectedPages(availablePages)
  }

  const handleDeselectAll = () => {
    setSelectedPages([])
  }

  const handleConfirm = () => {
    onConfirm(selectedPages)
    setSelectedPages([])
  }

  const isLockMode = mode === "lock"
  const title = isLockMode ? "Khóa Tài Liệu" : "Mở Khóa Tài Liệu"
  const description = isLockMode ? "Chọn các trang muốn khóa (không thể chỉnh sửa):" : "Chọn các trang muốn mở khóa:"
  const confirmText = isLockMode ? "Khóa" : "Mở Khóa"
  const icon = isLockMode ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />
  const iconColor = isLockMode ? "text-yellow-400" : "text-blue-400"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 max-w-[90vw] bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${iconColor}`}>
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 mb-4">{description}</p>

          {availablePages.length === 0 ? (
            <div className="flex items-center space-x-2 text-slate-400 mb-4">
              <AlertCircle className="w-4 h-4" />
              <span>{isLockMode ? "Tất cả trang đã được khóa" : "Không có trang nào bị khóa"}</span>
            </div>
          ) : (
            <>
              {/* Select All/Deselect All */}
              <div className="flex justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                >
                  Chọn tất cả
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="text-slate-400 hover:text-slate-300 p-0 h-auto"
                >
                  Bỏ chọn
                </Button>
              </div>

              {/* Page Selection Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6 max-h-48 overflow-y-auto">
                {availablePages.map((page) => (
                  <div
                    key={page}
                    className={`flex items-center space-x-2 p-2 rounded border transition-colors cursor-pointer ${
                      selectedPages.includes(page)
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => handlePageToggle(page)}
                  >
                    <Checkbox
                      checked={selectedPages.includes(page)}
                      onCheckedChange={() => handlePageToggle(page)}
                      className="border-slate-500"
                    />
                    <span className="text-sm text-slate-300">Trang {page}</span>
                  </div>
                ))}
              </div>

              {/* Selected Count */}
              {selectedPages.length > 0 && (
                <p className="text-sm text-slate-400 mb-4">Đã chọn: {selectedPages.length} trang</p>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedPages.length === 0 || isLoading}
              className={`${
                isLockMode ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
