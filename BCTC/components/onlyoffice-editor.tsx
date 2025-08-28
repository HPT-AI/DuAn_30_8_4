"use client"
import { useEffect, useRef } from "react"

// Extend Window interface to include DocEditor
declare global {
  interface Window {
    DocEditor: any
  }
}

interface OnlyOfficeEditorProps {
  documentUrl: string
  documentKey: string
  onDocumentReady?: () => void
  onError?: (error: any) => void
}

export default function OnlyOfficeEditor({
  documentUrl,
  documentKey,
  onDocumentReady,
  onError,
}: OnlyOfficeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Load ONLYOFFICE Document Server API
    const loadOnlyOfficeAPI = () => {
      return new Promise((resolve, reject) => {
        if (window.DocEditor) {
          resolve(window.DocEditor)
          return
        }

        const script = document.createElement("script")
        script.src = `${process.env.NEXT_PUBLIC_ONLYOFFICE_SERVER_URL || "http://localhost:8080"}/web-apps/apps/api/documents/api.js`
        script.onload = () => resolve(window.DocEditor)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const initializeEditor = async () => {
      try {
        await loadOnlyOfficeAPI()

        if (!editorRef.current) return

        // ONLYOFFICE configuration
        const config = {
          document: {
            fileType: "docx",
            key: documentKey,
            title: "Báo cáo Thi công.docx",
            url: documentUrl,
            permissions: {
              comment: true,
              copy: true,
              download: true,
              edit: true,
              fillForms: true,
              modifyFilter: true,
              modifyContentControl: true,
              review: true,
              print: true,
            },
          },
          documentType: "word",
          editorConfig: {
            mode: "edit",
            lang: "vi",
            callbackUrl: `${window.location.origin}/api/documents/callback`,
            user: {
              id: "user-1",
              name: "User",
              group: "users",
            },
            customization: {
              autosave: true,
              forcesave: false,
              submitForm: false,
              plugins: true,
              macros: true,
              chat: false,
              comments: true,
              zoom: 100,
              compactToolbar: false,
              leftMenu: true,
              rightMenu: true,
              toolbar: true,
              statusBar: true,
              help: true,
              about: true,
            },
            events: {
              onDocumentReady: () => {
                console.log("[ONLYOFFICE] Document ready")
                onDocumentReady?.()
              },
              onError: (event: any) => {
                console.error("[ONLYOFFICE] Error:", event)
                onError?.(event)
              },
              onWarning: (event: any) => {
                console.warn("[ONLYOFFICE] Warning:", event)
              },
              onInfo: (event: any) => {
                console.info("[ONLYOFFICE] Info:", event)
              },
            },
          },
          width: "100%",
          height: "100%",
          type: "desktop",
        }

        // Initialize ONLYOFFICE editor
        editorInstanceRef.current = new window.DocEditor(editorRef.current.id, config)
      } catch (error) {
        console.error("Failed to initialize ONLYOFFICE editor:", error)
        onError?.(error)
      }
    }

    initializeEditor()

    // Cleanup
    return () => {
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroyEditor()
        } catch (error) {
          console.error("Error destroying editor:", error)
        }
      }
    }
  }, [documentUrl, documentKey, onDocumentReady, onError])

  return (
    <div
      ref={editorRef}
      id={`onlyoffice-editor-${documentKey}`}
      className="w-full h-full min-h-[600px]"
      style={{ minHeight: "calc(100vh - 200px)" }}
    />
  )
}
