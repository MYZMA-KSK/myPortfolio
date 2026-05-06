import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID!

function requireAuth(request: NextRequest) {
  const role = request.cookies.get('admin-role')?.value
  if (!role) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }
  return null
}

function requireAdmin(request: NextRequest) {
  const role = request.cookies.get('admin-role')?.value
  if (role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }
  return null
}

function supabaseHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Prefer': 'return=representation',
  }
}

async function fetchProcessSteps(projectId: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/process_steps?project_id=eq.${projectId}&order=order_index.asc`,
    { headers: supabaseHeaders() }
  )
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function saveProcessSteps(projectId: string, steps: Array<{ id?: string; phase: string; title: string; description: string; images: string[] }>) {
  const delRes = await fetch(`${SUPABASE_URL}/rest/v1/process_steps?project_id=eq.${projectId}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  })
  if (!delRes.ok) {
    const err = await delRes.json().catch(() => ({}))
    console.error('[saveProcessSteps] DELETE failed:', err)
  }

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const insRes = await fetch(`${SUPABASE_URL}/rest/v1/process_steps`, {
      method: 'POST',
      headers: supabaseHeaders(),
      body: JSON.stringify({
        project_id: projectId,
        phase: step.phase,
        title: step.title,
        description: step.description || null,
        images: step.images || [],
        order_index: i,
      }),
    })
    if (!insRes.ok) {
      const err = await insRes.json().catch(() => ({}))
      console.error(`[saveProcessSteps] INSERT step[${i}] failed:`, err)
    }
  }
}

async function fetchImages(projectId: string): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/project_images?project_id=eq.${projectId}&order=order_index.asc`,
    { headers: supabaseHeaders() }
  )
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data.map((r: { image_url: string }) => r.image_url) : []
}

async function saveImages(projectId: string, imageUrls: string[]) {
  await fetch(`${SUPABASE_URL}/rest/v1/project_images?project_id=eq.${projectId}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  })
  for (let i = 0; i < imageUrls.length; i++) {
    await fetch(`${SUPABASE_URL}/rest/v1/project_images`, {
      method: 'POST',
      headers: supabaseHeaders(),
      body: JSON.stringify({ project_id: projectId, image_url: imageUrls[i], order_index: i }),
    })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const sort = searchParams.get('sort')

  if (slug) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { headers: supabaseHeaders() }
    )
    const data = await res.json()
    if (!res.ok || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const project = data[0]
    const [processSteps, images] = await Promise.all([
      fetchProcessSteps(project.id),
      fetchImages(project.id),
    ])
    return NextResponse.json({ project: { ...project, processSteps, images } })
  }

  let orderClause = 'order=order_index.asc'
  if (sort) {
    if (sort === 'created_at_asc') {
      orderClause = 'order=created_at.asc'
    } else if (sort === 'created_at_desc') {
      orderClause = 'order=created_at.desc'
    } else if (sort === 'period_start_asc') {
      orderClause = 'order=period_start.asc.nullsfirst'
    } else if (sort === 'period_start_desc') {
      orderClause = 'order=period_start.desc.nullslast'
    }
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?select=*,project_images(image_url,order_index)&${orderClause}`,
    { headers: supabaseHeaders() }
  )
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.message || 'Failed to fetch' }, { status: res.status })

  const projects = data.map((p: Record<string, unknown> & { project_images?: { image_url: string; order_index: number }[] }) => {
    const imgs = p.project_images ?? []
    imgs.sort((a, b) => a.order_index - b.order_index)
    const { project_images: _, ...rest } = p
    return { ...rest, thumbnail: imgs[0]?.image_url ?? null }
  })

  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY が設定されていません' }, { status: 500 })
  }

  const body = await request.json()
  const { slug, title, subtitle, description, category, period, period_start, roles, tools, highlights, is_published, processSteps, images } = body

  if (!slug || !title || !category) {
    return NextResponse.json({ error: 'slug, title, category は必須です' }, { status: 400 })
  }

  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id`, { headers: supabaseHeaders() })
  const existing = await countRes.json()
  const orderIndex = Array.isArray(existing) ? existing.length : 0

  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify({
      user_id: ADMIN_USER_ID,
      slug, title,
      subtitle: subtitle || null,
      description: description || null,
      category,
      period: period || null,
      period_start: period_start || null,
      roles: roles || [],
      tools: tools || [],
      highlights: highlights || [],
      is_published: is_published ?? false,
      order_index: orderIndex,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[POST /api/admin/projects]', data)
    return NextResponse.json({ error: data.message || JSON.stringify(data) }, { status: res.status })
  }

  const project = Array.isArray(data) ? data[0] : data
  await Promise.all([
    processSteps?.length ? saveProcessSteps(project.id, processSteps) : Promise.resolve(),
    images?.length ? saveImages(project.id, images) : Promise.resolve(),
  ])

  return NextResponse.json({ project }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY が設定されていません' }, { status: 500 })
  }

  const body = await request.json()
  const { id, slug, title, subtitle, description, category, period, period_start, roles, tools, highlights, is_published, processSteps, images } = body

  if (!id) return NextResponse.json({ error: 'id は必須です' }, { status: 400 })

  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
    method: 'PATCH',
    headers: supabaseHeaders(),
    body: JSON.stringify({
      slug, title,
      subtitle: subtitle || null,
      description: description || null,
      category,
      period: period || null,
      period_start: period_start || null,
      roles: roles || [],
      tools: tools || [],
      highlights: highlights || [],
      is_published: is_published ?? false,
      updated_at: new Date().toISOString(),
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[PUT /api/admin/projects]', data)
    return NextResponse.json({ error: data.message || JSON.stringify(data) }, { status: res.status })
  }

  await Promise.all([
    processSteps !== undefined ? saveProcessSteps(id, processSteps) : Promise.resolve(),
    images !== undefined ? saveImages(id, images) : Promise.resolve(),
  ])

  return NextResponse.json({ project: Array.isArray(data) ? data[0] : data })
}

export async function DELETE(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY が設定されていません' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id は必須です' }, { status: 400 })

  // Delete process steps first (cascade)
  await fetch(`${SUPABASE_URL}/rest/v1/process_steps?project_id=eq.${id}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  })

  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    console.error('[DELETE /api/admin/projects]', data)
    return NextResponse.json({ error: data.message || '削除に失敗しました' }, { status: res.status })
  }

  return NextResponse.json({ success: true })
}
