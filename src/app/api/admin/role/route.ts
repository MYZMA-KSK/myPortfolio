import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const role = request.cookies.get('admin-role')?.value

  if (!role) {
    return NextResponse.json({ role: null }, { status: 401 })
  }

  return NextResponse.json({ role })
}
