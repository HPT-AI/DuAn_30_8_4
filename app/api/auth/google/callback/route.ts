import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  console.log('[GOOGLE-CALLBACK-API] Received params:', { code: !!code, error, state })

  if (error) {
    console.error('[GOOGLE-CALLBACK-API] OAuth error:', error)
    return NextResponse.json({ error }, { status: 400 })
  }

  if (!code) {
    console.error('[GOOGLE-CALLBACK-API] No code received')
    return NextResponse.json({ error: 'No authorization code received' }, { status: 400 })
  }

  try {
    // Call backend API
    const backendUrl = `http://localhost:8000/api/v1/auth/google/callback?` + new URLSearchParams({
      code,
      state: state || ''
    })
    
    console.log('[GOOGLE-CALLBACK-API] Calling backend:', backendUrl)
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('[GOOGLE-CALLBACK-API] Backend response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('[GOOGLE-CALLBACK-API] Backend error:', errorData)
      return NextResponse.json({ error: 'Backend authentication failed' }, { status: response.status })
    }

    const data = await response.json()
    console.log('[GOOGLE-CALLBACK-API] Backend success:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GOOGLE-CALLBACK-API] Request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}