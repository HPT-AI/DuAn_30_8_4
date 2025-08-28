"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Shield, QrCode, Copy, Check, X } from "lucide-react"

export default function SubscribePage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan") || "professional"
  const [copied, setCopied] = useState(false)

  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [showCodeVerification, setShowCodeVerification] = useState(false)
  const [verificationPhone, setVerificationPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    plan: selectedPlan,
    mainPaymentMethod: "online", // online or qr_transfer
    paymentMethod: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  })

  const plans = {
    free: { name: t("pricing.free.name"), price: "₫0", monthly: true },
    basic: { name: t("pricing.basic.name"), price: "₫299,000", monthly: true },
    professional: { name: t("pricing.professional.name"), price: "₫599,000", monthly: true },
    enterprise: { name: t("pricing.enterprise.name"), price: "₫1,299,000", monthly: true },
  }

  const orderId = `CV${Date.now().toString().slice(-6)}`
  const transferContent = `ConstructVN ${orderId} ${formData.fullName || "KhachHang"}`

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const copyTransferContent = () => {
    navigator.clipboard.writeText(transferContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.mainPaymentMethod === "qr_transfer") {
      // Direct processing for QR transfer - no verification needed
      console.log("QR Transfer subscription data:", formData)
      alert(
        "Đăng ký thành công! Vui lòng chuyển khoản theo thông tin đã cung cấp. Chúng tôi sẽ kích hoạt tài khoản sau khi nhận được thanh toán.",
      )
      return
    }

    // Phone verification only for credit card payments
    setVerificationPhone(formData.phone)
    setShowPhoneVerification(true)
  }

  const handlePhoneVerification = () => {
    setShowPhoneVerification(false)
    setShowCodeVerification(true)
  }

  const handleCodeInput = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleFinalVerification = () => {
    const code = verificationCode.join("")
    if (code.length === 6) {
      console.log("Subscription data:", formData)
      console.log("Verification code:", code)
      setShowCodeVerification(false)
      alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-slate-900">ConstructVN</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Đăng ký gói dịch vụ</h1>
          <p className="text-lg text-gray-600">Hoàn tất thông tin để bắt đầu sử dụng ConstructVN</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      Đăng ký {plans[formData.plan as keyof typeof plans]?.name}
                    </h2>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {plans[formData.plan as keyof typeof plans]?.price}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">mỗi tháng</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Line Items */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {plans[formData.plan as keyof typeof plans]?.name}
                        </div>
                        <div className="text-sm text-gray-600">Thanh toán hàng tháng</div>
                      </div>
                      <div className="font-medium text-gray-900">
                        {plans[formData.plan as keyof typeof plans]?.price}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">Tổng phụ</div>
                      <div className="font-medium text-gray-900">
                        {plans[formData.plan as keyof typeof plans]?.price}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-700">Thuế</span>
                        <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                          <span className="text-xs text-gray-600">i</span>
                        </div>
                      </div>
                      <div className="font-medium text-gray-500">₫0</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-900">Tổng tiền phải trả hôm nay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {plans[formData.plan as keyof typeof plans]?.price}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Tên công ty</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Chọn gói dịch vụ</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.plan} onValueChange={(value) => handleInputChange("plan", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Miễn phí - ₫0/tháng</SelectItem>
                      <SelectItem value="basic">Cơ bản - ₫299,000/tháng</SelectItem>
                      <SelectItem value="professional">Chuyên nghiệp - ₫599,000/tháng</SelectItem>
                      <SelectItem value="enterprise">Doanh nghiệp - ₫1,299,000/tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              {formData.plan !== "free" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Phương thức thanh toán</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.mainPaymentMethod === "online"
                            ? "border-slate-900 bg-slate-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleInputChange("mainPaymentMethod", "online")}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-slate-700" />
                          <div>
                            <h3 className="font-medium">Thanh toán trực tuyến</h3>
                            <p className="text-sm text-gray-600">Thẻ tín dụng</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.mainPaymentMethod === "qr_transfer"
                            ? "border-slate-900 bg-slate-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleInputChange("mainPaymentMethod", "qr_transfer")}
                      >
                        <div className="flex items-center space-x-3">
                          <QrCode className="w-6 h-6 text-slate-700" />
                          <div>
                            <h3 className="font-medium">Chuyển khoản QR</h3>
                            <p className="text-sm text-gray-600">Quét mã, chuyển khoản</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {formData.mainPaymentMethod === "online" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Số thẻ *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="font-medium">Địa chỉ thanh toán</h4>
                          <div>
                            <Label htmlFor="billingAddress">Địa chỉ *</Label>
                            <Input
                              id="billingAddress"
                              value={formData.billingAddress}
                              onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">Thành phố *</Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode">Mã bưu điện</Label>
                              <Input
                                id="zipCode"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.mainPaymentMethod === "qr_transfer" && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn chuyển khoản</h4>
                          <ol className="text-sm text-blue-800 space-y-1">
                            <li>1. Quét mã QR bên dưới bằng app ngân hàng</li>
                            <li>
                              2. Nhập số tiền: <strong>{plans[formData.plan as keyof typeof plans]?.price}</strong>
                            </li>
                            <li>3. Nhập nội dung chuyển khoản (bắt buộc)</li>
                            <li>4. Xác nhận chuyển khoản</li>
                            <li>5. Chúng tôi sẽ kích hoạt tài khoản trong 1-2 giờ</li>
                          </ol>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* QR Code */}
                          <div className="text-center">
                            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                <QrCode className="w-24 h-24 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 mt-2">Quét mã để chuyển khoản</p>
                            </div>
                          </div>

                          {/* Bank Info */}
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Ngân hàng</Label>
                              <p className="text-lg font-semibold">Vietcombank</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Số tài khoản</Label>
                              <p className="text-lg font-semibold">1234567890</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Chủ tài khoản</Label>
                              <p className="text-lg font-semibold">CONSTRUCTVN JSC</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Số tiền</Label>
                              <p className="text-2xl font-bold text-slate-900">
                                {plans[formData.plan as keyof typeof plans]?.price}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Transfer Content */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Nội dung chuyển khoản (bắt buộc)</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input value={transferContent} readOnly className="bg-gray-50" />
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
                          <p className="text-xs text-gray-600 mt-1">
                            Mã đơn hàng: <strong>{orderId}</strong>
                          </p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung để chúng tôi có thể xác nhận và
                            kích hoạt tài khoản nhanh chóng.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Security Notice */}
              <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Bảo mật thông tin</p>
                  <p>
                    Thông tin của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi không lưu trữ thông tin thẻ tín dụng.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              {(formData.plan === "free" || formData.mainPaymentMethod === "online") && (
                <div className="flex justify-end space-x-4">
                  <Link href="/">
                    <Button variant="outline">Hủy</Button>
                  </Link>
                  <Button type="submit" size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                    {formData.plan === "free" ? "Đăng ký miễn phí" : "Xác nhận đăng ký"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="font-medium">link</span>
              </div>
              <button onClick={() => setShowPhoneVerification(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Vui lòng xác minh số điện thoại của bạn</h2>
              <p className="text-gray-600 text-sm">
                Trước khi có thể gửi mã đến email của bạn, chúng tôi cần xác minh thêm thông tin về bạn. Vui lòng nhập
                số điện thoại của bạn có số đuôi +64.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center border-2 border-green-500 rounded-lg p-3">
                <div className="flex items-center space-x-2 mr-3">
                  <img src="/api/placeholder/24/16" alt="VN" className="w-6 h-4" />
                  <span className="text-sm">+84</span>
                </div>
                <input
                  type="text"
                  value={verificationPhone}
                  onChange={(e) => setVerificationPhone(e.target.value)}
                  className="flex-1 outline-none text-lg"
                  placeholder="0961 363 164"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePhoneVerification}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
              >
                Xác minh
              </Button>
              <Button
                onClick={() => setShowPhoneVerification(false)}
                variant="outline"
                className="w-full py-3 rounded-lg font-medium"
              >
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCodeVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="font-medium">link</span>
              </div>
              <button onClick={() => setShowCodeVerification(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Xác nhận đó là bạn</h2>
              <p className="text-gray-600 text-sm">
                Nhập mã đã được gửi đến <br />
                <strong>{formData.email}</strong> để sử dụng thông tin đã lưu của mình.
              </p>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg outline-none ${
                    index === 0 && digit ? "border-green-500 bg-green-50" : "border-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Đã gửi mã, vui lòng kiểm tra email của bạn.</p>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Đang nhập với {formData.email}. Thiết bị của bạn sẽ được lưu lại cho lần sau.</p>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleFinalVerification}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                disabled={verificationCode.join("").length !== 6}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
