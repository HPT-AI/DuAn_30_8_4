"use client"

import { useState } from "react"
import AgentLayout from "@/components/agent/agent-layout"
import { useAgentLanguage } from "@/contexts/agent-language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Eye, Users, TrendingUp, ExternalLink } from "lucide-react"

export default function ReferralLinksPage() {
  const { t } = useAgentLanguage()
  const [newLinkName, setNewLinkName] = useState("")

  const referralLinks = [
    {
      id: 1,
      name: "Link Facebook",
      url: "https://constructvn.com/ref/agent123-fb",
      clicks: 245,
      conversions: 12,
      created: "2024-01-10",
      status: "active",
    },
    {
      id: 2,
      name: "Link Website",
      url: "https://constructvn.com/ref/agent123-web",
      clicks: 189,
      conversions: 8,
      created: "2024-01-08",
      status: "active",
    },
    {
      id: 3,
      name: "Link Email Campaign",
      url: "https://constructvn.com/ref/agent123-email",
      clicks: 67,
      conversions: 3,
      created: "2024-01-05",
      status: "paused",
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification here
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("referralLinks.title")}</h1>
            <p className="text-slate-600 mt-1">{t("referralLinks.description")}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("referralLinks.totalClicks")}</p>
                  <p className="text-2xl font-bold text-slate-900">501</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("referralLinks.totalConversions")}</p>
                  <p className="text-2xl font-bold text-slate-900">23</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{t("referralLinks.conversionRate")}</p>
                  <p className="text-2xl font-bold text-slate-900">4.6%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Link */}
        <Card>
          <CardHeader>
            <CardTitle>{t("referralLinks.createNew")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder={t("referralLinks.linkNamePlaceholder")}
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                className="flex-1"
              />
              <Button className="sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                {t("referralLinks.createLink")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("referralLinks.myLinks")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralLinks.map((link) => (
                <div key={link.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{link.name}</h3>
                        <Badge variant={link.status === "active" ? "default" : "secondary"}>
                          {link.status === "active" ? t("common.active") : t("common.paused")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-700 flex-1 truncate">
                          {link.url}
                        </code>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(link.url, "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <span>
                          {t("referralLinks.clicks")}: <strong>{link.clicks}</strong>
                        </span>
                        <span>
                          {t("referralLinks.conversions")}: <strong>{link.conversions}</strong>
                        </span>
                        <span>
                          {t("referralLinks.created")}: {link.created}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  )
}
