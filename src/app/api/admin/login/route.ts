import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()

  const viewerPassword = process.env.VIEWER_PASSWORD || 'portfolio2024'
  const adminPassword = process.env.ADMIN_PASSWORD

  let role: string | null = null

  if (password === adminPassword) {
    role = 'admin'
  } else if (password === viewerPassword) {
    role = 'viewer'
  }

  if (!role) {
    return NextResponse.json(
      { error: 'パスワードが間違っています' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true, role })

  response.cookies.set('admin-role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24時間
    path: '/',
  })

  return response
}
