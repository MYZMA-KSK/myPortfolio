'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'

type FormData = Parameters<typeof ProjectForm>[0]['initialData']

export default function EditProjectPage() {
  const params = useParams<{ slug: string }>()
  const [project, setProject] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(params.slug)}`)
      const json = await res.json()

      if (!res.ok || !json.project) {
        setError('プロジェクトが見つかりません')
      } else {
        const d = json.project
        const allImages: string[] = d.images ?? []
        setProject({
          id: d.id,
          slug: d.slug,
          title: d.title,
          subtitle: d.subtitle ?? '',
          description: d.description ?? '',
          category: d.category,
          period: d.period ?? '',
          roles: d.roles ?? [],
          tools: d.tools ?? [],
          highlights: d.highlights ?? [],
          is_published: d.is_published,
          mainImage: allImages[0],
          galleryImages: allImages.slice(1),
          processSteps: d.processSteps ?? [],
        })
      }
      setIsLoading(false)
    }
    load()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-4 h-4 border border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
        <p className="text-sm text-neutral-500">{error ?? 'エラーが発生しました'}</p>
      </div>
    )
  }

  return <ProjectForm mode="edit" initialData={project} />
}
