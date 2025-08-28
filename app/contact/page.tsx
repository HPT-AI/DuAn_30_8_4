"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/login-modal"
import { UserMenu } from "@/components/user-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  ChevronDown,
  Globe,
  FileText,
  Warehouse,
  Wrench,
  HardHat,
  GraduationCap,
  MessageCircle,
  Calculator,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react"

export default function ContactPage() {
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert(t("contact.form.success"))
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-white">ConstructVN</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {t("header.about")}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors">
                  <span>{t("header.services")}</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-slate-800/95 backdrop-blur-md border-slate-700">
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <FileText className="w-4 h-4" />
                    <span>{t("services.construction_report")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <Warehouse className="w-4 h-4" />
                    <span>{t("services.warehouse_management")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <Wrench className="w-4 h-4" />
                    <span>{t("services.material_management")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <HardHat className="w-4 h-4" />
                    <span>{t("services.construction_consulting")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <GraduationCap className="w-4 h-4" />
                    <span>{t("services.training")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <MessageCircle className="w-4 h-4" />
                    <span>{t("services.chatbot")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50">
                    <Calculator className="w-4 h-4" />
                    <span>{t("services.design_calculation")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {t("header.pricing")}
              </a>
              <Link href="/agents" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {t("header.agents")}
              </Link>
              <Link href="/contact" className="text-cyan-400 font-medium">
                {t("header.contact")}
              </Link>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                {t("header.guide")}
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>{language === "vi" ? "🇻🇳 VN" : "🇺🇸 EN"}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800/95 backdrop-blur-md border-slate-700">
                  <DropdownMenuItem
                    onClick={() => setLanguage("vi")}
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50"
                  >
                    <span>🇻🇳</span>
                    <span>Tiếng Việt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50"
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    {t("header.login")}
                  </Button>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                      {t("header.start")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{t("contact.hero.title")}</h1>
          <p className="text-xl text-gray-300 leading-relaxed">{t("contact.hero.description")}</p>
        </div>
      </section>

      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">{t("contact.info.title")}</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                      <MapPin className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t("contact.info.address.title")}</h3>
                      <p className="text-gray-300">{t("contact.info.address.value")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                      <Phone className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t("contact.info.phone.title")}</h3>
                      <p className="text-gray-300">{t("contact.info.phone.value")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                      <Mail className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t("contact.info.email.title")}</h3>
                      <p className="text-gray-300">{t("contact.info.email.value")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                      <Clock className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{t("contact.info.hours.title")}</h3>
                      <p className="text-gray-300">{t("contact.info.hours.weekdays")}</p>
                      <p className="text-gray-300">{t("contact.info.hours.weekend")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-white mb-4">{t("contact.social.title")}</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/25"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-xl shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>{t("contact.form.title")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">
                        {t("contact.form.name")}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t("contact.form.name_placeholder")}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">
                        {t("contact.form.email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder={t("contact.form.email_placeholder")}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      {t("contact.form.phone")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder={t("contact.form.phone_placeholder")}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-300">
                      {t("contact.form.subject")}
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder={t("contact.form.subject_placeholder")}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-300">
                      {t("contact.form.message")}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder={t("contact.form.message_placeholder")}
                      rows={5}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("contact.form.sending")
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("contact.form.send")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t("contact.map.title")}</h2>
            <p className="text-lg text-gray-300">{t("contact.map.description")}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-lg h-96 flex items-center justify-center shadow-xl shadow-cyan-500/10">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-400">{t("contact.map.placeholder")}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-white">ConstructVN</span>
              </div>
              <p className="text-gray-300 mb-4">{t("footer.description")}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>contact@constructvn.com</span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-cyan-400 transition-colors">
                    {t("footer.about")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.services")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.news")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.careers")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.support")}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.help_center")}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                    {t("footer.contact")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.report_bug")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.feature_request")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.terms")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.cookies")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer.community")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-700/50 pt-8 mt-8 text-center">
            <p className="text-sm text-gray-400">{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
