"use client"

import type React from "react"

import { useState } from "react"
import { useAgentLanguage } from "../../contexts/agent-language-context"
import AgentLayout from "../../components/agent-layout"
import { Phone, Mail, Clock, ChevronDown, ChevronUp, Send } from "lucide-react"

export default function SupportPage() {
  const { t } = useAgentLanguage()
  const [activeTab, setActiveTab] = useState("contact")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const faqData = [
    {
      id: 1,
      question: "Làm thế nào để tạo link giới thiệu tùy chỉnh?",
      answer:
        "Bạn có thể tạo link giới thiệu tùy chỉnh bằng cách vào mục 'Link Giới thiệu', nhấp vào nút 'Tạo link mới' và nhập tên chiến dịch. Hệ thống sẽ tự động tạo link với tham số tracking riêng cho bạn.",
    },
    {
      id: 2,
      question: "Khi nào tôi nhận được hoa hồng?",
      answer:
        "Hoa hồng sẽ được tính ngay khi khách hàng thanh toán thành công. Hoa hồng sẽ chuyển từ trạng thái 'Chờ duyệt' sang 'Đã duyệt' sau 3-5 ngày làm việc và được thanh toán vào cuối mỗi tháng.",
    },
    {
      id: 3,
      question: "Tỷ lệ hoa hồng được tính như thế nào?",
      answer:
        "Tỷ lệ hoa hồng cơ bản là 5% trên tổng giá trị gói cước khách hàng thanh toán. Đối với các gói cao cấp hoặc đại lý VIP, tỷ lệ có thể cao hơn. Bạn có thể xem chi tiết trong mục 'Hoa hồng'.",
    },
    {
      id: 4,
      question: "Làm thế nào để thay đổi thông tin thanh toán?",
      answer:
        "Vào mục 'Tài khoản của tôi' > 'Thông tin thanh toán', cập nhật thông tin mới và nhấp 'Lưu'. Lưu ý rằng việc thay đổi sẽ có hiệu lực sau 24 giờ và cần xác minh qua email.",
    },
    {
      id: 5,
      question: "Tôi có thể rút hoa hồng khi nào?",
      answer:
        "Bạn có thể yêu cầu rút hoa hồng khi số dư khả dụng đạt tối thiểu 500,000₫. Yêu cầu rút tiền sẽ được xử lý trong vòng 3-5 ngày làm việc.",
    },
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setContactForm({ subject: "", message: "", priority: "normal" })
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("sidebar.support")}</h1>
          <p className="text-gray-600">Nhận hỗ trợ và tìm câu trả lời cho các câu hỏi thường gặp</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="agent-card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Hotline hỗ trợ</h3>
            <p className="text-sm text-gray-600 mb-2">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
            <a href="tel:+84123456789" className="text-blue-600 hover:text-blue-800 font-medium">
              +84 123 456 789
            </a>
          </div>

          <div className="agent-card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Email hỗ trợ</h3>
            <p className="text-sm text-gray-600 mb-2">Phản hồi trong 24 giờ</p>
            <a href="mailto:agent-support@constructvn.com" className="text-green-600 hover:text-green-800 font-medium">
              agent-support@constructvn.com
            </a>
          </div>

          <div className="agent-card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Giờ làm việc</h3>
            <p className="text-sm text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
            <p className="text-sm text-gray-600">Thứ 7: 8:00 - 12:00</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="agent-card">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "contact", label: "Liên hệ hỗ trợ" },
                { id: "faq", label: "Câu hỏi thường gặp" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-slate-500 text-slate-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "contact" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gửi yêu cầu hỗ trợ</h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="agent-input"
                      placeholder="Mô tả ngắn gọn vấn đề của bạn"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                      className="agent-input"
                    >
                      <option value="low">Thấp</option>
                      <option value="normal">Bình thường</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={6}
                      className="agent-input"
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải, các bước đã thực hiện và thông tin liên quan khác..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="agent-button-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Câu hỏi thường gặp</h3>
                <div className="space-y-3">
                  {faqData.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-3">
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  )
}
