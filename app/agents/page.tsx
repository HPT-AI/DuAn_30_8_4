"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { MapPin, Phone, Mail, Users, Award, Building, CheckCircle, Star, ArrowRight } from "lucide-react"

export default function AgentsPage() {
  const { t } = useLanguage()

  const agents = [
    {
      id: 1,
      name: "Công ty TNHH Xây dựng Miền Bắc",
      region: "Hà Nội - Miền Bắc",
      address: "123 Phố Huế, Hai Bà Trưng, Hà Nội",
      phone: "+84 24 3123 4567",
      email: "hanoi@constructvn.com",
      projects: 150,
      rating: 4.9,
      specialties: ["Nhà cao tầng", "Công trình công cộng", "Khu đô thị"],
    },
    {
      id: 2,
      name: "Công ty CP Xây dựng Miền Trung",
      region: "Đà Nẵng - Miền Trung",
      address: "456 Lê Duẩn, Hải Châu, Đà Nẵng",
      phone: "+84 236 3789 012",
      email: "danang@constructvn.com",
      projects: 120,
      rating: 4.8,
      specialties: ["Resort & Khách sạn", "Nhà phố", "Biệt thự"],
    },
    {
      id: 3,
      name: "Công ty TNHH Xây dựng Miền Nam",
      region: "TP.HCM - Miền Nam",
      address: "789 Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "+84 28 3456 7890",
      email: "hcm@constructvn.com",
      projects: 200,
      rating: 4.9,
      specialties: ["Chung cư cao cấp", "Trung tâm thương mại", "Văn phòng"],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-slate-900">ConstructVN</span>
            </Link>
            <Link href="/">
              <Button variant="ghost">← {t("common.back_home")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">{t("agents.title")}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t("agents.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder={t("agents.search_placeholder")} />
            <Button className="bg-slate-900 hover:bg-slate-800">{t("agents.search")}</Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
              <div className="text-gray-600">{t("agents.total_agents")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">63</div>
              <div className="text-gray-600">{t("agents.provinces")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">1000+</div>
              <div className="text-gray-600">{t("agents.completed_projects")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">98%</div>
              <div className="text-gray-600">{t("agents.satisfaction")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Agents */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("agents.featured_title")}</h2>
            <p className="text-lg text-gray-600">{t("agents.featured_subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{agent.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{agent.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{agent.region}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{agent.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{agent.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{agent.projects}</div>
                      <div className="text-xs text-gray-600">{t("agents.projects")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{agent.specialties.length}</div>
                      <div className="text-xs text-gray-600">{t("agents.specialties")}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">{t("agents.specialties")}:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-slate-900 hover:bg-slate-800">
                    {t("agents.contact")} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("agents.benefits_title")}</h2>
            <p className="text-lg text-gray-600">{t("agents.benefits_subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{t("agents.benefit1_title")}</h3>
              <p className="text-gray-600">{t("agents.benefit1_desc")}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{t("agents.benefit2_title")}</h3>
              <p className="text-gray-600">{t("agents.benefit2_desc")}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{t("agents.benefit3_title")}</h3>
              <p className="text-gray-600">{t("agents.benefit3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("agents.cta_title")}</h2>
          <p className="text-xl text-gray-300 mb-8">{t("agents.cta_subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
              {t("agents.become_agent")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              {t("agents.find_agent")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
