"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/login-modal"
import { UserMenu } from "@/components/user-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  Play,
  FileText,
  Package,
  Users,
  CheckCircle,
  Shield,
  Clock,
  Trophy,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Warehouse,
  Wrench,
  Globe,
  HardHat,
  GraduationCap,
  MessageCircle,
  Calculator,
  Settings,
} from "lucide-react"

export default function HomePage() {
  const { language, setLanguage, t, isHydrated } = useLanguage()
  const { user, isAdmin } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [logoUrl, setLogoUrl] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thi%E1%BA%BFt%20k%E1%BA%BF%20ch%C6%B0a%20c%C3%B3%20t%C3%AAn-2hrKzlEBNUsowunq4hgLzKZdV6sHWg.png",
  )
  const [brandText, setBrandText] = useState("HDT AI")

  useEffect(() => {
    // Load saved branding from localStorage
    const savedLogo = localStorage.getItem("admin_logo_url")
    const savedText = localStorage.getItem("admin_brand_text")

    if (savedLogo) setLogoUrl(savedLogo)
    if (savedText) setBrandText(savedText)

    // Listen for branding updates from admin
    const handleBrandingUpdate = (event: CustomEvent) => {
      const { logoUrl: newLogo, brandText: newText } = event.detail
      setLogoUrl(newLogo)
      setBrandText(newText)
    }

    window.addEventListener("brandingUpdated", handleBrandingUpdate as EventListener)

    return () => {
      window.removeEventListener("brandingUpdated", handleBrandingUpdate as EventListener)
    }
  }, [])

  const handlePlayVideo = () => {
    setIsVideoPlaying(true)
  }

  const getPricing = (plan: string) => {
    const pricing = {
      free: {
        monthly: t("pricing.free.price"),
        yearly: t("pricing.free.price_yearly"),
      },
      basic: {
        monthly: t("pricing.basic.price_monthly"),
        yearly: t("pricing.basic.price_yearly"),
      },
      professional: {
        monthly: t("pricing.professional.price_monthly"),
        yearly: t("pricing.professional.price_yearly"),
      },
      enterprise: {
        monthly: t("pricing.enterprise.price_monthly"),
        yearly: t("pricing.enterprise.price_yearly"),
      },
    }
    return pricing[plan as keyof typeof pricing]?.[billingCycle] || pricing[plan as keyof typeof pricing]?.monthly
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src={logoUrl || "/placeholder.svg"}
                alt={`${brandText} Logo`}
                className="w-16 h-16 rounded-full shadow-lg shadow-cyan-500/25"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {brandText}
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition-colors">
                {isHydrated ? t("header.about") : "Về chúng tôi"}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-slate-300 hover:text-cyan-400 transition-colors">
                  <span>{isHydrated ? t("header.services") : "Dịch vụ"}</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    asChild
                    className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700"
                  >
                    <Link href="/construction-reports">
                      <FileText className="w-4 h-4" />
                      <span>{isHydrated ? t("services.construction_report") : "Báo cáo thi công"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700">
                    <Warehouse className="w-4 h-4" />
                    <span>{isHydrated ? t("services.warehouse_management") : "Quản lý kho"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700">
                    <Wrench className="w-4 h-4" />
                    <span>{isHydrated ? t("services.material_management") : "Quản lý vật tư"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700">
                    <HardHat className="w-4 h-4" />
                    <span>{isHydrated ? t("services.construction_consulting") : "Công tác tư vấn xây dựng"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700">
                    <GraduationCap className="w-4 h-4" />
                    <span>{isHydrated ? t("services.training") : "Đào tạo"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700">
                    <MessageCircle className="w-4 h-4" />
                    <span>{isHydrated ? t("services.chatbot") : "Chatbot"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700">
                    <Calculator className="w-4 h-4" />
                    <span>{isHydrated ? t("services.design_calculation") : "Tính toán thiết kế"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition-colors">
                {isHydrated ? t("header.pricing") : "Giá"}
              </a>
              <Link href="/agent-frontend" className="text-slate-300 hover:text-cyan-400 transition-colors">
                {isHydrated ? t("header.agents") : "Đại lý"}
              </Link>
              <Link href="/contact" className="text-slate-300 hover:text-cyan-400 transition-colors">
                {isHydrated ? t("header.contact") : "Liên hệ"}
              </Link>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {isHydrated ? t("header.guide") : "Hướng dẫn"}
              </a>
              {user && isAdmin() && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-slate-300 hover:text-orange-400 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-slate-800 border-slate-700">
                    <DropdownMenuItem
                      asChild
                      className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 hover:bg-slate-700"
                    >
                      <Link href="/admin">
                        <Shield className="w-4 h-4" />
                        <span>AdminFrontend</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 hover:bg-slate-700"
                    >
                      <Link href="/admin-agent">
                        <Users className="w-4 h-4" />
                        <span>AdminAgent</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>{language === "vi" ? "🇻🇳 VN" : "🇺🇸 EN"}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    onClick={() => setLanguage("vi")}
                    className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700"
                  >
                    <span>🇻🇳</span>
                    <span>Tiếng Việt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700"
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
                    className="text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    {isHydrated ? t("header.login") : "Đăng nhập"}
                  </Button>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
                      {isHydrated ? t("header.start") : "Bắt đầu"}
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
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent leading-tight mb-6 whitespace-pre-line">
                {t("hero.title")}
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">{t("hero.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                  >
                    {t("hero.start_free")}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent hover:border-cyan-400 transition-all"
                  onClick={handlePlayVideo}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t("hero.view_demo")}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div
                className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg aspect-video flex items-center justify-center shadow-2xl shadow-cyan-500/10 border border-slate-600/50 cursor-pointer"
                onClick={handlePlayVideo}
              >
                {!isVideoPlaying ? (
                  <div className="text-center">
                    <Play className="w-16 h-16 text-cyan-400 mx-auto mb-2 hover:text-cyan-300 transition-colors" />
                    <p className="text-slate-300">{t("hero.video_intro")}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-cyan-400">Đang phát video demo...</p>
                    <p className="text-slate-400 text-sm mt-1">Click để dừng</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-4">
              {t("features.title")}
            </h2>
            <p className="text-lg text-slate-400">{t("features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 group">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("features.project_management")}</h3>
                <p className="text-slate-400 mb-4">{t("features.project_management_desc")}</p>
                <a href="#" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline transition-colors">
                  {t("features.learn_more")}
                </a>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 group">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("features.construction_diary")}</h3>
                <p className="text-slate-400 mb-4">{t("features.construction_diary_desc")}</p>
                <a href="#" className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors">
                  {t("features.learn_more")}
                </a>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 group">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t("features.team_management")}</h3>
                <p className="text-slate-400 mb-4">{t("features.team_management_desc")}</p>
                <a
                  href="#"
                  className="text-emerald-400 font-medium hover:text-emerald-300 hover:underline transition-colors"
                >
                  {t("features.learn_more")}
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-8">
                {t("why.title")}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{t("why.vietnam_standard")}</h3>
                    <p className="text-slate-400">{t("why.vietnam_standard_desc")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{t("why.friendly_interface")}</h3>
                    <p className="text-slate-400">{t("why.friendly_interface_desc")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/25">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{t("why.high_security")}</h3>
                    <p className="text-slate-400">{t("why.high_security_desc")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{t("why.support_247")}</h3>
                    <p className="text-slate-400">{t("why.support_247_desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-600/50">
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">{t("why.trusted_by")}</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mt-2">
                    1000+
                  </p>
                  <p className="text-slate-400">{t("why.companies")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-lg text-slate-400">{t("testimonials.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6">"{t("testimonials.review1")}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">N</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Nguyễn Văn A</p>
                    <p className="text-sm text-slate-400">Giám đốc dự án - Công ty ABC</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6">"{t("testimonials.review2")}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">T</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Trần Thị B</p>
                    <p className="text-sm text-slate-400">Kỹ sư trưởng - Công ty XYZ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6">"{t("testimonials.review3")}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">L</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Lê Văn C</p>
                    <p className="text-sm text-slate-400">Quản lý dự án - Công ty DEF</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
        id="pricing"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-lg text-slate-400 mb-8">{t("pricing.subtitle")}</p>

            <div className="flex items-center justify-center mb-8">
              <div className="bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                <div className="flex items-center">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      billingCycle === "monthly"
                        ? "bg-slate-700 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t("pricing.monthly")}
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                      billingCycle === "yearly"
                        ? "bg-slate-700 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t("pricing.yearly")}
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {t("pricing.save_percent").replace("{percent}", "17")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Plan */}
            <Card className="p-8 hover:shadow-lg hover:shadow-cyan-500/10 transition-all bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.free.name")}</h3>
                  <p className="text-slate-400 mb-4">{t("pricing.free.description")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {getPricing("free")}
                    </span>
                    <span className="text-slate-400">
                      /{billingCycle === "monthly" ? t("pricing.month") : t("pricing.year")}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                    <Link href={`/subscribe?plan=free&billing=${billingCycle}`} className="block w-full">
                      {t("pricing.choose_plan")}
                    </Link>
                  </Button>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-300">{t("pricing.free.feature1")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-300">{t("pricing.free.feature2")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-300">{t("pricing.free.feature3")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="p-8 hover:shadow-lg hover:shadow-blue-500/10 transition-all bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.basic.name")}</h3>
                  <p className="text-slate-400 mb-4">{t("pricing.basic.description")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {getPricing("basic")}
                    </span>
                    <span className="text-slate-400">
                      /{billingCycle === "monthly" ? t("pricing.month") : t("pricing.year")}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25">
                    <Link href={`/subscribe?plan=basic&billing=${billingCycle}`} className="block w-full">
                      {t("pricing.choose_plan")}
                    </Link>
                  </Button>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.basic.feature1")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.basic.feature2")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.basic.feature3")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.basic.feature4")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="p-8 border-2 border-cyan-500/50 relative hover:shadow-lg hover:shadow-cyan-500/20 transition-all bg-gradient-to-br from-slate-800/80 to-slate-700/80">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg shadow-cyan-500/25">
                  {t("pricing.popular")}
                </span>
              </div>
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.professional.name")}</h3>
                  <p className="text-slate-400 mb-4">{t("pricing.professional.description")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {getPricing("professional")}
                    </span>
                    <span className="text-slate-400">
                      /{billingCycle === "monthly" ? t("pricing.month") : t("pricing.year")}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                    <Link href={`/subscribe?plan=professional&billing=${billingCycle}`} className="block w-full">
                      {t("pricing.choose_plan")}
                    </Link>
                  </Button>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.professional.feature1")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.professional.feature2")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.professional.feature3")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.professional.feature4")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.professional.feature5")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 hover:shadow-lg hover:shadow-purple-500/10 transition-all bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.enterprise.name")}</h3>
                  <p className="text-slate-400 mb-4">{t("pricing.enterprise.description")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {getPricing("enterprise")}
                    </span>
                    <span className="text-slate-400">
                      /{billingCycle === "monthly" ? t("pricing.month") : t("pricing.year")}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25">
                    <Link href={`/subscribe?plan=enterprise&billing=${billingCycle}`} className="block w-full">
                      {t("pricing.choose_plan")}
                    </Link>
                  </Button>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.enterprise.feature1")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.enterprise.feature2")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.enterprise.feature3")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.enterprise.feature4")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.enterprise.feature5")}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{t("pricing.enterprise.feature6")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-slate-300 mb-8 whitespace-pre-line">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder={t("cta.placeholder")}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500/50"
            />
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
              >
                {t("cta.register")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src={logoUrl || "/placeholder.svg"}
                  alt={`${brandText} Logo`}
                  className="w-12 h-12 rounded-full shadow-lg shadow-cyan-500/25"
                />
                <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {brandText}
                </span>
              </div>
              <p className="text-slate-400 mb-4">{t("footer.description")}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>contact@constructvn.com</span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2 text-sm text-slate-400">
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
              <ul className="space-y-2 text-sm text-slate-400">
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
              <ul className="space-y-2 text-sm text-slate-400">
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

          {/* Newsletter */}
          <div className="border-t border-slate-700/50 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold text-white mb-2">{t("footer.newsletter")}</h3>
                <p className="text-sm text-slate-400">{t("footer.newsletter_desc")}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("footer.email_placeholder")}
                  className="w-64 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500/50"
                />
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                  {t("footer.subscribe")}
                </Button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-700/50 pt-8 mt-8 text-center">
            <p className="text-sm text-slate-400">{t("footer.copyright")}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2 6a6 6 0 1112 0v8a6 6 0 11-12 0V6zm6-2a2 2 0 100 4 2 2 0 000-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
