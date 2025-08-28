import type React from "react"
import { AgentAuthProvider } from "@/contexts/agent-auth-context"
import { AgentLanguageProvider } from "@/contexts/agent-language-context"
import "../globals.css"

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <AgentLanguageProvider>
          <AgentAuthProvider>{children}</AgentAuthProvider>
        </AgentLanguageProvider>
      </body>
    </html>
  )
}
