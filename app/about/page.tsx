"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/login-modal"
import { UserMenu } from "@/components/user-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
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
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

export default function AboutPage() {
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-white">ConstructVN</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-cyan-400 font-medium">
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
              <Link href="/agent-frontend" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {t("header.agents")}
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
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
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
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

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t("about.hero.title")}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">{t("about.hero.description")}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 border-l-4 border-l-cyan-500 bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-xl shadow-cyan-500/10">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="w-8 h-8 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">{t("about.mission.title")}</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">{t("about.mission.description")}</p>
              </CardContent>
            </Card>

            <Card className="p-8 border-l-4 border-l-blue-500 bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-xl shadow-blue-500/10">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-6">
                  <Eye className="w-8 h-8 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">{t("about.vision.title")}</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">{t("about.vision.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t("about.values.title")}</h2>
            <p className="text-lg text-gray-300">{t("about.values.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-slate-800/50 backdrop-blur-md border-slate-700 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Heart className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("about.values.quality.title")}</h3>
                <p className="text-gray-300">{t("about.values.quality.description")}</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-slate-800/50 backdrop-blur-md border-slate-700 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("about.values.customer.title")}</h3>
                <p className="text-gray-300">{t("about.values.customer.description")}</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-slate-800/50 backdrop-blur-md border-slate-700 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("about.values.innovation.title")}</h3>
                <p className="text-gray-300">{t("about.values.innovation.description")}</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-slate-800/50 backdrop-blur-md border-slate-700 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("about.values.trust.title")}</h3>
                <p className="text-gray-300">{t("about.values.trust.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t("about.stats.title")}</h2>
            <p className="text-lg text-gray-300">{t("about.stats.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <p className="text-gray-300">{t("about.stats.projects")}</p>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-gray-300">{t("about.stats.clients")}</p>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                5+
              </div>
              <p className="text-gray-300">{t("about.stats.years")}</p>
            </div>
            <div className="text-center p-6 bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                99%
              </div>
              <p className="text-gray-300">{t("about.stats.satisfaction")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t("about.why.title")}</h2>
            <p className="text-lg text-gray-300">{t("about.why.subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t("about.why.experience.title")}</h3>
                  <p className="text-gray-300">{t("about.why.experience.description")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t("about.why.technology.title")}</h3>
                  <p className="text-gray-300">{t("about.why.technology.description")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t("about.why.support.title")}</h3>
                  <p className="text-gray-300">{t("about.why.support.description")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t("about.why.compliance.title")}</h3>
                  <p className="text-gray-300">{t("about.why.compliance.description")}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-xl shadow-cyan-500/10">
                <CardContent className="p-0 text-center">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{t("about.why.award.title")}</h3>
                  <p className="text-gray-300 mb-6">{t("about.why.award.description")}</p>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                      {t("about.why.get_started")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-white">ConstructVN</span>
              </div>
              <p className="text-gray-300 mb-4">{t("footer.description")}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>contact@constructvn.com</span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
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
              <ul className="space-y-2 text-sm text-gray-300">
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
              <ul className="space-y-2 text-sm text-gray-300">
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
