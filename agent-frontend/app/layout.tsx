import type React from "react"
import { Inter } from "next/font/google"
import { AgentAuthProvider } from "../contexts/agent-auth-context"
import { AgentLanguageProvider } from "../contexts/agent-language-context"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ConstructVN Agent Portal",
  description: "Cổng thông tin dành cho đại lý ConstructVN",
}

export default function AgentRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="bg-gray-50">
        <AgentLanguageProvider>
          <AgentAuthProvider>{children}</AgentAuthProvider>
        </AgentLanguageProvider>
      </body>
    </html>
  )
}
