import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function supabaseHeaders() {
  return {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  }
}

function extractPeriodStart(period: string | null): number {
  if (!period) return 0
  const match = period.match(/^(\d{4})年(?:(\d{1,2})月)?/)
  if (!match) return 0
  return parseInt(match[1]) * 100 + (match[2] ? parseInt(match[2]) : 0)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const [projectRes, stepsRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&limit=1`,
        { headers: supabaseHeaders() }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=id`,
        { headers: supabaseHeaders() }
      ),
    ])

    const data = await projectRes.json()
    if (!projectRes.ok || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const project = data[0]

    const [imagesRes, processRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/project_images?project_id=eq.${project.id}&order=order_index.asc`,
        { headers: supabaseHeaders() }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/process_steps?project_id=eq.${project.id}&order=order_index.asc`,
        { headers: supabaseHeaders() }
      ),
    ])

    const images = imagesRes.ok ? await imagesRes.json() : []
    const processSteps = processRes.ok ? await processRes.json() : []

    return NextResponse.json({
      project: {
        ...project,
        images: Array.isArray(images) ? images.map((img: { image_url: string }) => img.image_url) : [],
        processSteps: Array.isArray(processSteps) ? processSteps : [],
      }
    })
  }

  // 全プロジェクト一覧（公開済みのみ、period 降順）
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?select=*,project_images(image_url,order_index)&is_published=eq.true`,
    { headers: supabaseHeaders() }
  )
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: res.status })

  const projects = data
    .map((p: Record<string, unknown> & { project_images?: { image_url: string; order_index: number }[] }) => {
      const imgs = (p.project_images ?? []).sort((a, b) => a.order_index - b.order_index)
      const { project_images: _, ...rest } = p
      return { ...rest, thumbnail: imgs[0]?.image_url ?? null }
    })
    .sort((a: { period?: string }, b: { period?: string }) =>
      extractPeriodStart(b.period ?? null) - extractPeriodStart(a.period ?? null)
    )

  return NextResponse.json({ projects })
}
