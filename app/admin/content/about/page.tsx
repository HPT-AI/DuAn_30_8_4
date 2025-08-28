"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye } from "lucide-react"

export default function AboutContentPage() {
  const [content, setContent] = useState({
    hero: {
      title: "Về ConstructVN",
      subtitle: "Chúng tôi là đội ngũ chuyên gia công nghệ với sứ mệnh cách mạng hóa ngành xây dựng Việt Nam",
    },
    mission: {
      title: "Sứ mệnh",
      description:
        "Mang đến giải pháp công nghệ tiên tiến nhất cho ngành xây dựng, giúp các doanh nghiệp tối ưu hóa quy trình và nâng cao hiệu quả công việc.",
    },
    vision: {
      title: "Tầm nhìn",
      description:
        "Trở thành nền tảng quản lý xây dựng hàng đầu Việt Nam, góp phần xây dựng một ngành xây dựng hiện đại và bền vững.",
    },
    team: {
      title: "Đội ngũ",
      description: "Đội ngũ chuyên gia giàu kinh nghiệm trong lĩnh vực công nghệ và xây dựng",
    },
  })

  const handleSave = () => {
    console.log("Saving about content:", content)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý nội dung - Về chúng tôi</h1>
          <p className="text-slate-400">Chỉnh sửa nội dung trang giới thiệu</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Hero Section</CardTitle>
            <CardDescription className="text-slate-400">Phần giới thiệu chính</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="about-title"
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="about-subtitle" className="text-slate-300">
                Mô tả
              </Label>
              <Textarea
                id="about-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sứ mệnh</CardTitle>
            <CardDescription className="text-slate-400">Sứ mệnh của công ty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mission-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="mission-title"
                value={content.mission.title}
                onChange={(e) => setContent({ ...content, mission: { ...content.mission, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="mission-desc" className="text-slate-300">
                Nội dung
              </Label>
              <Textarea
                id="mission-desc"
                value={content.mission.description}
                onChange={(e) =>
                  setContent({ ...content, mission: { ...content.mission, description: e.target.value } })
                }
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tầm nhìn</CardTitle>
            <CardDescription className="text-slate-400">Tầm nhìn của công ty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vision-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="vision-title"
                value={content.vision.title}
                onChange={(e) => setContent({ ...content, vision: { ...content.vision, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="vision-desc" className="text-slate-300">
                Nội dung
              </Label>
              <Textarea
                id="vision-desc"
                value={content.vision.description}
                onChange={(e) => setContent({ ...content, vision: { ...content.vision, description: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Đội ngũ</CardTitle>
            <CardDescription className="text-slate-400">Thông tin về đội ngũ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="team-title" className="text-slate-300">
                Tiêu đề
              </Label>
              <Input
                id="team-title"
                value={content.team.title}
                onChange={(e) => setContent({ ...content, team: { ...content.team, title: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="team-desc" className="text-slate-300">
                Mô tả
              </Label>
              <Textarea
                id="team-desc"
                value={content.team.description}
                onChange={(e) => setContent({ ...content, team: { ...content.team, description: e.target.value } })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
