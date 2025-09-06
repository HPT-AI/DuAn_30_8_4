'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    console.log('[GOOGLE-CALLBACK] Received params:', { code: !!code, error, state })

    if (error) {
      console.error('[GOOGLE-CALLBACK] OAuth error:', error)
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_OAUTH_ERROR',
          error: error
        }, window.location.origin)
      }
      window.close()
      return
    }

    if (code) {
      console.log('[GOOGLE-CALLBACK] Exchanging code for token...')
      // Exchange code for token via Next.js API route
      const callbackUrl = `/api/auth/google/callback?` + new URLSearchParams({
        code,
        state: state || ''
      })
      console.log('[GOOGLE-CALLBACK] Calling Next.js API:', callbackUrl)
      
      fetch(callbackUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('[GOOGLE-CALLBACK] Backend response status:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log('[GOOGLE-CALLBACK] Backend success:', data)
        // Send success to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_OAUTH_SUCCESS',
            tokens: data
          }, window.location.origin)
        }
        window.close()
      })
      .catch(error => {
        console.error('[GOOGLE-CALLBACK] Backend error:', error)
        // Send error to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_OAUTH_ERROR',
            error: error.message
          }, window.location.origin)
        }
        window.close()
      })
    } else {
      console.error('[GOOGLE-CALLBACK] No code or error received')
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_OAUTH_ERROR',
          error: 'No authorization code received'
        }, window.location.origin)
      }
      window.close()
    }
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  )
}