'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

type Project = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: 'web' | 'electronics'
  is_published: boolean
  thumbnail: string | null
  created_at: string
  period: string | null
}

type SortField = 'created_at' | 'period'
type SortOrder = 'asc' | 'desc'

function extractPeriodStart(period: string | null): number {
  if (!period) return 0
  const match = period.match(/^(\d{4})年(?:(\d{1,2})月)?/)
  if (!match) return 0
  return parseInt(match[1]) * 100 + (match[2] ? parseInt(match[2]) : 0)
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    loadProjects()
    checkRole()
  }, [])

  async function checkRole() {
    const res = await fetch('/api/admin/role')
    const data = await res.json()
    setIsAdmin(data.role === 'admin')
  }

  async function loadProjects() {
    try {
      const res = await fetch('/api/admin/projects')
      const json = await res.json()
      setProjects(res.ok ? (json.projects || []) : [])
    } catch {
      setError('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let cmp = 0
      if (sortField === 'created_at') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else {
        cmp = extractPeriodStart(a.period) - extractPeriodStart(b.period)
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [projects, sortField, sortOrder])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('このプロジェクトを削除しますか？')) return
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      alert(`削除に失敗しました: ${json.error}`)
      return
    }
    setProjects(projects.filter((p) => p.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-4 h-4 border border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">プロジェクト</h1>
          <p className="text-sm text-neutral-500 mt-0.5">ポートフォリオに掲載するプロジェクトを管理します</p>
        </div>
        {isAdmin && (
          <Link href="/admin/projects/new"
            className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors">
            <Plus className="w-4 h-4" />新規作成
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">プロジェクトがまだ登録されていません</p>
          {isAdmin && (
            <Link href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Plus className="w-4 h-4" />プロジェクトを作成
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 w-14" />
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">タイトル</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">カテゴリ</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('period')} className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
                    期間
                    {sortField === 'period' && (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
                    作成日
                    {sortField === 'created_at' && (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">公開状態</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">操作</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project) => (
                <tr key={project.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-8 rounded overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                      {project.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-neutral-100" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-900">{project.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{project.subtitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border border-neutral-200 text-neutral-600">
                      {project.category === 'web' ? 'Web' : 'Electronics'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-neutral-600">{project.period || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-neutral-600">
                      {new Date(project.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${project.is_published ? 'bg-green-500' : 'bg-neutral-300'}`} />
                      <span className="text-xs text-neutral-600">
                        {project.is_published ? '公開中' : '下書き'}
                      </span>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/projects/${project.slug}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />編集
                        </Link>
                        <button onClick={() => deleteProject(project.id)}
                          className="inline-flex items-center h-8 px-3 rounded-md border border-neutral-200 text-xs text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
