"use client"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Download, Calendar, DollarSign, FileText, Plus, Smartphone, QrCode, Building2 } from "lucide-react"
import { useState } from "react"

export default function BillingPage() {
  const { t } = useLanguage()
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState("card")

  const invoices = [
    {
      id: "INV-001",
      date: "2024-01-15",
      amount: "2,500,000",
      status: "paid",
      description: "Dự án Chung cư Green Park - Tháng 1",
    },
    {
      id: "INV-002",
      date: "2024-02-15",
      amount: "3,200,000",
      status: "paid",
      description: "Dự án Nhà máy ABC - Tháng 2",
    },
    {
      id: "INV-003",
      date: "2024-03-15",
      amount: "1,800,000",
      status: "pending",
      description: "Dự án Khu đô thị mới - Tháng 3",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/26",
      isDefault: true,
      holderName: "Nguyễn Văn A",
    },
    {
      id: 2,
      type: "bank",
      bankName: "Vietcombank",
      accountNumber: "****1234",
      isDefault: false,
      holderName: "Nguyễn Văn A",
    },
    {
      id: 3,
      type: "ewallet",
      provider: "MoMo",
      phone: "****5678",
      isDefault: false,
      holderName: "Nguyễn Văn A",
    },
    {
      id: 4,
      type: "qr",
      bankName: "Techcombank",
      accountNumber: "****9012",
      isDefault: false,
      holderName: "Nguyễn Văn A",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán"
      case "pending":
        return "Chờ thanh toán"
      case "overdue":
        return "Quá hạn"
      default:
        return "Không xác định"
    }
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5 text-slate-400" />
      case "bank":
        return <Building2 className="h-5 w-5 text-slate-400" />
      case "ewallet":
        return <Smartphone className="h-5 w-5 text-slate-400" />
      case "qr":
        return <QrCode className="h-5 w-5 text-slate-400" />
      default:
        return <CreditCard className="h-5 w-5 text-slate-400" />
    }
  }

  const getPaymentMethodDisplay = (method: any) => {
    switch (method.type) {
      case "card":
        return {
          title: `${method.brand} •••• ${method.last4}`,
          subtitle: `Hết hạn ${method.expiry} • ${method.holderName}`,
        }
      case "bank":
        return {
          title: method.bankName,
          subtitle: `Tài khoản ${method.accountNumber} • ${method.holderName}`,
        }
      case "ewallet":
        return {
          title: `Ví ${method.provider}`,
          subtitle: `${method.phone} • ${method.holderName}`,
        }
      case "qr":
        return {
          title: `${method.bankName} QR`,
          subtitle: `${method.accountNumber} • ${method.holderName}`,
        }
      default:
        return { title: "Unknown", subtitle: "" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t("user_menu.billing")}</h1>
          <p className="text-slate-600 mt-2">Quản lý thanh toán và hóa đơn</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tổng chi phí tháng này</p>
                  <p className="text-2xl font-bold text-slate-900">5,200,000 VNĐ</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Hóa đơn chờ thanh toán</p>
                  <p className="text-2xl font-bold text-slate-900">1</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Phương thức thanh toán</p>
                  <p className="text-2xl font-bold text-slate-900">{paymentMethods.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
            <TabsTrigger value="payments">Phương thức thanh toán</TabsTrigger>
            <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách hóa đơn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{invoice.id}</p>
                            <p className="text-sm text-slate-600">{invoice.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-slate-900">{invoice.amount} VNĐ</p>
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {invoice.date}
                          </p>
                        </div>

                        <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>

                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Phương thức thanh toán</CardTitle>
                <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm phương thức
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setSelectedPaymentType("card")}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                            selectedPaymentType === "card"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <CreditCard className="h-6 w-6" />
                          <span className="font-medium">Thẻ tín dụng</span>
                          <span className="text-sm text-gray-500">Visa, Mastercard</span>
                        </button>

                        <button
                          onClick={() => setSelectedPaymentType("qr")}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                            selectedPaymentType === "qr"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <QrCode className="h-6 w-6" />
                          <span className="font-medium">Chuyển khoản QR</span>
                          <span className="text-sm text-gray-500">Quét mã, chuyển khoản</span>
                        </button>
                      </div>

                      {selectedPaymentType === "card" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cardNumber">Số thẻ *</Label>
                              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div>
                              <Label htmlFor="cardName">Tên chủ thẻ *</Label>
                              <Input id="cardName" placeholder="Nguyễn Văn A" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Ngày hết hạn *</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Địa chỉ thanh toán</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="city">Thành phố *</Label>
                                <Input id="city" placeholder="Hồ Chí Minh" />
                              </div>
                              <div>
                                <Label htmlFor="postal">Mã bưu điện</Label>
                                <Input id="postal" placeholder="700000" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPaymentType === "qr" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bankSelect">Chọn ngân hàng</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn ngân hàng" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vcb">Vietcombank</SelectItem>
                                <SelectItem value="tcb">Techcombank</SelectItem>
                                <SelectItem value="mb">MB Bank</SelectItem>
                                <SelectItem value="acb">ACB</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="accountNumber">Số tài khoản</Label>
                            <Input id="accountNumber" placeholder="1234567890" />
                          </div>

                          <div>
                            <Label htmlFor="accountName">Tên tài khoản</Label>
                            <Input id="accountName" placeholder="NGUYEN VAN A" />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
                          Hủy
                        </Button>
                        <Button onClick={() => setShowAddPaymentDialog(false)}>Thêm phương thức</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const display = getPaymentMethodDisplay(method)
                    return (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getPaymentIcon(method.type)}
                          <div>
                            <p className="font-medium text-slate-900">{display.title}</p>
                            <p className="text-sm text-slate-600">{display.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {method.isDefault && <Badge variant="secondary">Mặc định</Badge>}
                          <Button variant="outline" size="sm">
                            Chỉnh sửa
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>Chưa có giao dịch nào</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
