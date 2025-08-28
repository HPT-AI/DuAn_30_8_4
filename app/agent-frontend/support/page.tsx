"use client"

import type React from "react"

import { useState } from "react"
import AgentLayout from "@/components/agent/agent-layout"
import { useAgentLanguage } from "@/contexts/agent-language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Phone, Mail, Clock, ChevronDown, ChevronRight } from "lucide-react"

export default function SupportPage() {
  const { t } = useAgentLanguage()
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium",
  })
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: t("support.faq1Question"),
      answer: t("support.faq1Answer"),
    },
    {
      id: 2,
      question: t("support.faq2Question"),
      answer: t("support.faq2Answer"),
    },
    {
      id: 3,
      question: t("support.faq3Question"),
      answer: t("support.faq3Answer"),
    },
    {
      id: 4,
      question: t("support.faq4Question"),
      answer: t("support.faq4Answer"),
    },
  ]

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit contact form logic here
    console.log("Contact form submitted:", contactForm)
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("support.title")}</h1>
          <p className="text-slate-600 mt-1">{t("support.description")}</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">{t("support.phone")}</h3>
              <p className="text-slate-600">+84 123 456 789</p>
              <p className="text-sm text-slate-500 mt-1">{t("support.phoneHours")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">{t("support.email")}</h3>
              <p className="text-slate-600">support@constructvn.com</p>
              <p className="text-sm text-slate-500 mt-1">{t("support.emailResponse")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">{t("support.workingHours")}</h3>
              <p className="text-slate-600">8:00 - 18:00</p>
              <p className="text-sm text-slate-500 mt-1">{t("support.workingDays")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contact" className="space-y-6">
          <TabsList>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {t("support.contactUs")}
            </TabsTrigger>
            <TabsTrigger value="faq">{t("support.faq")}</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>{t("support.sendMessage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitContact} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("support.subject")}</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder={t("support.subjectPlaceholder")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">{t("support.priority")}</Label>
                      <select
                        id="priority"
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="low">{t("support.priorityLow")}</option>
                        <option value="medium">{t("support.priorityMedium")}</option>
                        <option value="high">{t("support.priorityHigh")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("support.message")}</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={t("support.messagePlaceholder")}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t("support.sendMessage")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>{t("support.frequentlyAsked")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-slate-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50"
                      >
                        <span className="font-medium text-slate-900">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="h-5 w-5 text-slate-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && <div className="px-4 pb-3 text-slate-600">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AgentLayout>
  )
}
