import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BUCKET = 'project-images'

export async function POST(request: NextRequest) {
  const role = request.cookies.get('admin-role')?.value
  if (role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const bytes = await file.arrayBuffer()

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: bytes,
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[upload]', err)
    return NextResponse.json({ error: err.message || 'アップロードに失敗しました' }, { status: res.status })
  }

  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`
  return NextResponse.json({ url })
}
