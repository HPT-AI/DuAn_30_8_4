"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, Calendar, TrendingUp, Wallet, History, Check, QrCode, Copy, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubscriptionPage() {
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [showUpgradePaymentDialog, setShowUpgradePaymentDialog] = useState(false)
  const [upgradeSelectedPlan, setUpgradeSelectedPlan] = useState<any>(null)
  const [paymentMethodType, setPaymentMethodType] = useState("online")
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    bankName: "",
    accountNumber: "",
    ewalletProvider: "",
    phoneNumber: "",
  })
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentSubscription = {
    plan: "professional",
    planName: "Professional",
    price: 599000,
    nextBilling: "2024-02-15",
    balance: 1250000,
    status: "active",
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: ["1 dự án", "Báo cáo cơ bản", "1GB lưu trữ"],
      current: false,
    },
    {
      id: "basic",
      name: "Basic",
      price: 299000,
      features: ["5 dự án", "Báo cáo cơ bản", "Hỗ trợ email", "10GB lưu trữ"],
      current: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: 599000,
      features: ["Không giới hạn dự án", "Báo cáo chi tiết", "Hỗ trợ 24/7", "100GB lưu trữ", "Quản lý nhóm"],
      current: true,
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 1299000,
      features: [
        "Tất cả tính năng Pro",
        "API tùy chỉnh",
        "Đào tạo chuyên sâu",
        "Lưu trữ không giới hạn",
        "Quản lý đa chi nhánh",
      ],
      current: false,
    },
  ]

  const transactions = [
    {
      id: 1,
      date: "2024-01-15",
      type: "subscription",
      amount: 599000,
      status: "completed",
      description: "Professional Plan - Tháng 1",
    },
    {
      id: 2,
      date: "2024-01-10",
      type: "topup",
      amount: 500000,
      status: "completed",
      description: "Nạp tiền vào tài khoản",
    },
    {
      id: 3,
      date: "2023-12-15",
      type: "subscription",
      amount: 599000,
      status: "completed",
      description: "Professional Plan - Tháng 12",
    },
  ]

  const topupAmounts = [100000, 200000, 500000, 1000000, 2000000]

  const paymentMethods = [
    {
      id: "card-1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/26",
      holderName: "Nguyễn Văn A",
      isDefault: true,
    },
    {
      id: "bank-1",
      type: "bank",
      bankName: "Vietcombank",
      accountNumber: "****1234",
      holderName: "Nguyễn Văn A",
      isDefault: false,
    },
    {
      id: "momo-1",
      type: "ewallet",
      provider: "MoMo",
      phone: "****5678",
      isDefault: false,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getPaymentMethodDisplay = (method: any) => {
    switch (method.type) {
      case "card":
        return `${method.brand} •••• ${method.last4}`
      case "bank":
        return `${method.bankName} ${method.accountNumber}`
      case "ewallet":
        return `${method.provider} ${method.phone}`
      default:
        return "Phương thức thanh toán"
    }
  }

  const copyTransferContent = () => {
    const amount = customAmount || "0"
    const transferContent = `ConstructVN NAP${Date.now().toString().slice(-6)} ${amount}`
    navigator.clipboard.writeText(transferContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddPaymentMethod = () => {
    if (paymentMethodType === "online" && newPaymentMethod.type === "credit_card") {
      if (
        !newPaymentMethod.cardNumber ||
        !newPaymentMethod.holderName ||
        !newPaymentMethod.expiryDate ||
        !newPaymentMethod.cvv
      ) {
        alert("Vui lòng điền đầy đủ thông tin thẻ tín dụng")
        return
      }
    }

    console.log("Adding payment method:", newPaymentMethod)
    setShowAddPaymentDialog(false)
    // Reset form
    setNewPaymentMethod({
      type: "credit_card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      holderName: "",
      billingAddress: "",
      city: "",
      zipCode: "",
      bankName: "",
      accountNumber: "",
      ewalletProvider: "",
      phoneNumber: "",
    })
  }

  const handleTopUp = async () => {
    if (!customAmount || !selectedPaymentMethod) {
      alert("Vui lòng chọn số tiền và phương thức thanh toán")
      return
    }

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert(`Nạp tiền thành công ${formatCurrency(Number.parseInt(customAmount))}`)
      setCustomAmount("")
      setSelectedPaymentMethod("")
    } catch (error) {
      alert("Có lỗi xảy ra khi nạp tiền")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePlanUpgrade = (plan: any) => {
    if (plan.current) return
    setUpgradeSelectedPlan(plan)
    setShowUpgradePaymentDialog(true)
  }

  const handleUpgradePayment = async () => {
    if (!upgradeSelectedPlan) return

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert(`Nâng cấp thành công lên gói ${upgradeSelectedPlan.name}`)
      setShowUpgradePaymentDialog(false)
      setUpgradeSelectedPlan(null)
    } catch (error) {
      alert("Có lỗi xảy ra khi nâng cấp")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay về trang chủ</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-white">ConstructVN</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý gói dịch vụ</h1>
          <p className="text-slate-300">Quản lý subscription, nâng cấp gói và nạp tiền</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Tổng quan</TabsTrigger>
            <TabsTrigger value="upgrade" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Nâng cấp</TabsTrigger>
            <TabsTrigger value="topup" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Nạp tiền</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Lịch sử</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Gói hiện tại</CardTitle>
                  <CreditCard className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{currentSubscription.planName}</div>
                  <p className="text-xs text-slate-400">{formatCurrency(currentSubscription.price)}/tháng</p>
                  <Badge variant="secondary" className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {currentSubscription.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Số dư tài khoản</CardTitle>
                  <Wallet className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(currentSubscription.balance)}</div>
                  <p className="text-xs text-slate-400">Có thể sử dụng để thanh toán</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Thanh toán tiếp theo</CardTitle>
                  <Calendar className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">15/02</div>
                  <p className="text-xs text-slate-400">{formatCurrency(currentSubscription.price)}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Thông tin gói dịch vụ</CardTitle>
                <CardDescription className="text-slate-400">Chi tiết về gói {currentSubscription.planName} hiện tại</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Tên gói:</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">{currentSubscription.planName}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Giá:</span>
                    <span className="font-semibold text-white">{formatCurrency(currentSubscription.price)}/tháng</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Trạng thái:</span>
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Đang hoạt động</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Ngày gia hạn:</span>
                    <span className="text-white">{currentSubscription.nextBilling}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

          <TabsContent value="upgrade" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Nâng cấp gói dịch vụ</h2>
              <p className="text-slate-300">Chọn gói phù hợp với nhu cầu của bạn</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative bg-slate-800 border-slate-700 ${plan.current ? "ring-2 ring-cyan-500" : ""} ${plan.popular ? "border-orange-500" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white">Phổ biến nhất</Badge>
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-3 right-3">
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Hiện tại</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg text-white">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-white">{plan.price === 0 ? "Miễn phí" : formatCurrency(plan.price)}</div>
                    {plan.price > 0 && <p className="text-sm text-slate-400">/tháng</p>}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-slate-300">
                          <Check className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.current ? "bg-slate-700 text-slate-300" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}
                      variant={plan.current ? "secondary" : "default"}
                      disabled={plan.current}
                      onClick={() => handlePlanUpgrade(plan)}
                    >
                      {plan.current ? "Gói hiện tại" : "Chọn gói này"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

          <Dialog open={showUpgradePaymentDialog} onOpenChange={setShowUpgradePaymentDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nâng cấp gói dịch vụ</DialogTitle>
                <DialogDescription>Xác nhận nâng cấp lên gói {upgradeSelectedPlan?.name}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {upgradeSelectedPlan && (
                  <Card className="bg-slate-800">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-semibold">Nâng cấp lên {upgradeSelectedPlan.name}</h3>
                          <div className="text-3xl font-bold text-blue-600">
                            {formatCurrency(upgradeSelectedPlan.price)}
                            <span className="text-sm font-normal text-slate-300"> mỗi tháng</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>{upgradeSelectedPlan.name}</span>
                            <span>{formatCurrency(upgradeSelectedPlan.price)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-slate-300">
                            <span>Thanh toán hàng tháng</span>
                            <span></span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Tổng phụ</span>
                            <span>{formatCurrency(upgradeSelectedPlan.price)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Thuế</span>
                            <span>0.00 VND</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center font-semibold text-lg">
                            <span>Tổng tiền phải trả hôm nay</span>
                            <span>{formatCurrency(upgradeSelectedPlan.price)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <Label className="text-base font-medium">Loại phương thức thanh toán</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethodType === "online"
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => setPaymentMethodType("online")}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-slate-700" />
                        <div>
                          <h3 className="font-medium">Thanh toán trực tuyến</h3>
                          <p className="text-sm text-slate-300">Thẻ tín dụng, ví điện tử</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethodType === "qr_transfer"
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => setPaymentMethodType("qr_transfer")}
                    >
                      <div className="flex items-center space-x-3">
                        <QrCode className="w-6 h-6 text-slate-700" />
                        <div>
                          <h3 className="font-medium">Chuyển khoản QR</h3>
                          <p className="text-sm text-slate-300">Quét mã, chuyển khoản</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {paymentMethodType === "online" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upgrade-holder-name">Tên chủ thẻ *</Label>
                      <Input
                        id="upgrade-holder-name"
                        placeholder="Nguyễn Văn A"
                        value={newPaymentMethod.holderName}
                        onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, holderName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="upgrade-card-number">Số thẻ *</Label>
                      <Input
                        id="upgrade-card-number"
                        placeholder="1234 5678 9012 3456"
                        value={newPaymentMethod.cardNumber}
                        onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="upgrade-expiry-date">Ngày hết hạn *</Label>
                        <Input
                          id="upgrade-expiry-date"
                          placeholder="MM/YY"
                          value={newPaymentMethod.expiryDate}
                          onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, expiryDate: e.target.value }))}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="upgrade-cvv">CVV *</Label>
                        <Input
                          id="upgrade-cvv"
                          placeholder="123"
                          value={newPaymentMethod.cvv}
                          onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cvv: e.target.value }))}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethodType === "qr_transfer" && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn chuyển khoản</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Quét mã QR bên dưới bằng app ngân hàng</li>
                        <li>2. Nhập số tiền: {upgradeSelectedPlan && formatCurrency(upgradeSelectedPlan.price)}</li>
                        <li>3. Nhập nội dung chuyển khoản (bắt buộc)</li>
                        <li>4. Xác nhận chuyển khoản</li>
                        <li>5. Chúng tôi sẽ cộng tiền trong 1-2 giờ</li>
                      </ol>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-slate-600 inline-block">
                          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <QrCode className="w-24 h-24 text-gray-400" />
                          </div>
                          <p className="text-sm text-slate-300 mt-2">Quét mã để chuyển khoản</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-300">Ngân hàng</Label>
                          <p className="text-lg font-semibold">Vietcombank</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-300">Số tài khoản</Label>
                          <p className="text-lg font-semibold">1234567890</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-300">Chủ tài khoản</Label>
                          <p className="text-lg font-semibold">CONSTRUCTVN JSC</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-300">Số tiền</Label>
                          <p className="text-lg font-semibold text-blue-600">
                            {upgradeSelectedPlan && formatCurrency(upgradeSelectedPlan.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-300">Nội dung chuyển khoản (bắt buộc)</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={`ConstructVN UPGRADE${Date.now().toString().slice(-6)} ${upgradeSelectedPlan?.name || ""}`}
                          readOnly
                          className="bg-slate-800"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = `ConstructVN UPGRADE${Date.now().toString().slice(-6)} ${upgradeSelectedPlan?.name || ""}`
                            navigator.clipboard.writeText(content)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                          className="flex items-center space-x-1 bg-transparent"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copied ? "Đã copy" : "Copy"}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethodType === "online" && (
                  <Button className="w-full" size="lg" onClick={handleUpgradePayment} disabled={isProcessing}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isProcessing ? "Đang xử lý..." : `Nâng cấp lên ${upgradeSelectedPlan?.name}`}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="topup" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Nạp tiền vào tài khoản
              </CardTitle>
              <CardDescription className="text-slate-400">
                Số dư hiện tại: <span className="font-semibold">{formatCurrency(currentSubscription.balance)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Chọn số tiền nạp</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {topupAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-12 bg-transparent"
                      onClick={() => setCustomAmount(amount.toString())}
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Hoặc nhập số tiền tùy chỉnh</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Nhập số tiền..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Chọn phương thức thanh toán</Label>
                <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-12 text-left justify-start bg-transparent">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Chọn phương thức thanh toán
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
                      <DialogDescription>
                        Chọn và cấu hình phương thức thanh toán cho giao dịch nạp tiền
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Payment Method Type Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Loại phương thức thanh toán</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              paymentMethodType === "online"
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                            onClick={() => setPaymentMethodType("online")}
                          >
                            <div className="flex items-center space-x-3">
                              <CreditCard className="w-6 h-6 text-slate-700" />
                              <div>
                                <h3 className="font-medium">Thanh toán trực tuyến</h3>
                                <p className="text-sm text-slate-300">Thẻ tín dụng, ví điện tử</p>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              paymentMethodType === "qr_transfer"
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                            onClick={() => setPaymentMethodType("qr_transfer")}
                          >
                            <div className="flex items-center space-x-3">
                              <QrCode className="w-6 h-6 text-slate-700" />
                              <div>
                                <h3 className="font-medium">Chuyển khoản QR</h3>
                                <p className="text-sm text-slate-300">Quét mã, chuyển khoản</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {paymentMethodType === "online" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="holder-name">Tên chủ thẻ *</Label>
                            <Input
                              id="holder-name"
                              placeholder="Nguyễn Văn A"
                              value={newPaymentMethod.holderName}
                              onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, holderName: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="card-number">Số thẻ *</Label>
                            <Input
                              id="card-number"
                              placeholder="1234 5678 9012 3456"
                              value={newPaymentMethod.cardNumber}
                              onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cardNumber: e.target.value }))}
                              maxLength={19}
                              required
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry-date">Ngày hết hạn *</Label>
                              <Input
                                id="expiry-date"
                                placeholder="MM/YY"
                                value={newPaymentMethod.expiryDate}
                                onChange={(e) =>
                                  setNewPaymentMethod((prev) => ({ ...prev, expiryDate: e.target.value }))
                                }
                                maxLength={5}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={newPaymentMethod.cvv}
                                onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cvv: e.target.value }))}
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h4 className="font-medium">Địa chỉ thanh toán</h4>
                            <div>
                              <Label htmlFor="billing-address">Địa chỉ *</Label>
                              <Input
                                id="billing-address"
                                placeholder="123 Đường ABC, Quận XYZ"
                                value={newPaymentMethod.billingAddress}
                                onChange={(e) =>
                                  setNewPaymentMethod((prev) => ({ ...prev, billingAddress: e.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="city">Thành phố *</Label>
                                <Input
                                  id="city"
                                  placeholder="Hồ Chí Minh"
                                  value={newPaymentMethod.city}
                                  onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, city: e.target.value }))}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="zip-code">Mã bưu điện</Label>
                                <Input
                                  id="zip-code"
                                  placeholder="700000"
                                  value={newPaymentMethod.zipCode}
                                  onChange={(e) =>
                                    setNewPaymentMethod((prev) => ({ ...prev, zipCode: e.target.value }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethodType === "qr_transfer" && (
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn chuyển khoản</h4>
                            <ol className="text-sm text-blue-800 space-y-1">
                              <li>1. Quét mã QR bên dưới bằng app ngân hàng</li>
                              <li>2. Nhập số tiền cần nạp</li>
                              <li>3. Nhập nội dung chuyển khoản (bắt buộc)</li>
                              <li>4. Xác nhận chuyển khoản</li>
                              <li>5. Chúng tôi sẽ cộng tiền trong 1-2 giờ</li>
                            </ol>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* QR Code */}
                            <div className="text-center">
                              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-slate-600 inline-block">
                                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <QrCode className="w-24 h-24 text-gray-400" />
                                </div>
                                <p className="text-sm text-slate-300 mt-2">Quét mã để chuyển khoản</p>
                              </div>
                            </div>

                            {/* Bank Info */}
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-slate-300">Ngân hàng</Label>
                                <p className="text-lg font-semibold">Vietcombank</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-slate-300">Số tài khoản</Label>
                                <p className="text-lg font-semibold">1234567890</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-slate-300">Chủ tài khoản</Label>
                                <p className="text-lg font-semibold">CONSTRUCTVN JSC</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-slate-300">
                              Nội dung chuyển khoản (bắt buộc)
                            </Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                value={`ConstructVN NAP${Date.now().toString().slice(-6)} ${customAmount || "[Số tiền]"}`}
                                readOnly
                                className="bg-slate-800"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={copyTransferContent}
                                className="flex items-center space-x-1 bg-transparent"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? "Đã copy" : "Copy"}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Security Notice */}
                      <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium mb-1">Bảo mật thông tin</p>
                          <p>
                            Thông tin của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi không lưu trữ thông tin thẻ
                            tín dụng.
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {!selectedPaymentMethod && customAmount && (
                  <p className="text-sm text-red-600">Vui lòng chọn phương thức thanh toán để tiếp tục</p>
                )}
              </div>

              {customAmount && selectedPaymentMethod && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span>Số tiền nạp:</span>
                        <span className="text-xl font-bold">{formatCurrency(Number.parseInt(customAmount) || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Phương thức:</span>
                        <span className="font-medium">
                          {getPaymentMethodDisplay(paymentMethods.find((m) => m.id === selectedPaymentMethod))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Phí giao dịch:</span>
                        <span className="font-medium text-green-600">Miễn phí</span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleTopUp} disabled={isProcessing}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {isProcessing ? "Đang xử lý..." : "Tiến hành nạp tiền"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Lịch sử giao dịch
              </CardTitle>
              <CardDescription className="text-slate-400">Xem tất cả các giao dịch của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "subscription"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {transaction.type === "subscription" ? (
                          <CreditCard className="h-4 w-4" />
                        ) : (
                          <TrendingUp className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-slate-300">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "subscription" ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {transaction.type === "subscription" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge variant={transaction.status === "completed" ? "secondary" : "destructive"}>
                        {transaction.status === "completed" ? "Hoàn thành" : "Thất bại"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
