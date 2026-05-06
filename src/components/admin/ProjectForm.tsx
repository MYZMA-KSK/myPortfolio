'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Save, ArrowLeft, ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ImageUploader } from './ImageUploader'

export interface ProcessStep {
  id?: string
  phase: '企画' | '制作' | '評価'
  title: string
  description: string
  images: string[]
}

export interface ProjectFormData {
  id?: string
  slug: string
  title: string
  subtitle: string
  description: string
  category: 'web' | 'electronics'
  period: string
  period_start: string | null
  roles: string[]
  tools: string[]
  highlights: string[]
  is_published: boolean
  images?: string[]
  processSteps?: ProcessStep[]
}

interface ProjectFormProps {
  initialData?: ProjectFormData
  mode: 'create' | 'edit'
}

const PHASES = ['企画', '制作', '評価'] as const

const phaseStyle: Record<ProcessStep['phase'], string> = {
  '企画': 'bg-blue-50 text-blue-700 border-blue-200',
  '制作': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '評価': 'bg-amber-50 text-amber-700 border-amber-200',
}

// ---- Tag Input ----
function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed])
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !input && values.length > 0) onChange(values.slice(0, -1))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
      <div className="min-h-[40px] rounded-md border border-neutral-200 bg-white px-3 py-2 flex flex-wrap gap-1.5 focus-within:border-neutral-400 transition-colors">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-full bg-neutral-100 text-xs text-neutral-700 font-medium">
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-neutral-400 hover:text-neutral-700 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={add}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-24 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
        />
      </div>
      <p className="text-xs text-neutral-400 mt-1">Enter で追加、×で削除</p>
    </div>
  )
}

// ---- Process Step Inline Form ----
function ProcessStepForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<ProcessStep>
  onSave: (step: ProcessStep) => void
  onCancel: () => void
}) {
  const [phase, setPhase] = useState<ProcessStep['phase']>(initial?.phase ?? '企画')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [stepImages, setStepImages] = useState<string[]>(initial?.images ?? [])

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 space-y-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">フェーズ</label>
        <div className="flex gap-2">
          {PHASES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPhase(p)}
              className={cn(
                'h-7 px-3 rounded-md text-xs font-medium border transition-colors',
                phase === p ? phaseStyle[p] : 'border-neutral-200 text-neutral-500 bg-white hover:bg-neutral-50'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">タイトル <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ステップのタイトル"
          className="w-full h-9 px-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="このステップの詳細"
          className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">画像</label>
        <ImageUploader images={stepImages} onChange={setStepImages} />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-8 px-3 rounded-md border border-neutral-200 text-xs text-neutral-600 hover:bg-white transition-colors">
          キャンセル
        </button>
        <button
          type="button"
          onClick={() => { if (title.trim()) onSave({ id: initial?.id, phase, title, description, images: stepImages }) }}
          disabled={!title.trim()}
          className="h-8 px-3 rounded-md bg-neutral-900 text-white text-xs font-medium disabled:opacity-40 hover:bg-neutral-700 transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  )
}

// ---- Main Form ----
export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<ProjectFormData>(
    initialData ?? {
      slug: '', title: '', subtitle: '', description: '',
      category: 'web', period: '', period_start: null, roles: [], tools: [], highlights: [], is_published: false,
    }
  )

  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(initialData?.processSteps ?? [])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [addingStep, setAddingStep] = useState(false)

  const set = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleTitleChange = (title: string) => {
    setForm((prev) => {
      const generated = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      return { ...prev, title, slug: mode === 'create' && generated ? generated : prev.slug }
    })
  }

  // Process step operations
  const addStep = (step: ProcessStep) => { setProcessSteps((s) => [...s, step]); setAddingStep(false) }
  const updateStep = (i: number, step: ProcessStep) => { setProcessSteps((s) => s.map((x, j) => j === i ? step : x)); setEditingIndex(null) }
  const deleteStep = (i: number) => setProcessSteps((s) => s.filter((_, j) => j !== i))
  const moveStep = (i: number, dir: 'up' | 'down') => {
    const ni = dir === 'up' ? i - 1 : i + 1
    setProcessSteps((s) => { const a = [...s]; [a[i], a[ni]] = [a[ni], a[i]]; return a })
  }

  const handleSubmit = async (publish?: boolean) => {
    setError(null)
    setIsSaving(true)
    const payload = { ...form, is_published: publish !== undefined ? publish : form.is_published, images, processSteps }

    try {
      const res = await fetch('/api/admin/projects', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || '保存に失敗しました'); return }
      router.push('/admin/projects')
      router.refresh()
    } catch {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="flex items-center justify-center w-8 h-8 rounded-md border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">
              {mode === 'create' ? '新規プロジェクト' : 'プロジェクト編集'}
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {mode === 'create' ? 'プロジェクト情報を入力してください' : form.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!form.is_published && (
            <button type="button" onClick={() => handleSubmit(true)} disabled={isSaving}
              className="h-9 px-4 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50">
              {isSaving ? '保存中...' : '保存して公開'}
            </button>
          )}
          <button type="button" onClick={() => handleSubmit()} disabled={isSaving}
            className={cn('flex items-center gap-1.5 h-9 px-4 rounded-md border text-sm font-medium transition-colors disabled:opacity-50',
              form.is_published ? 'bg-neutral-900 text-white border-transparent hover:bg-neutral-700' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50')}>
            <Save className="w-4 h-4" />
            {isSaving ? '保存中...' : '下書き保存'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Grid: main + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900">基本情報</h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">タイトル <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="例: ECサイトリニューアル"
                className="w-full h-10 px-3 rounded-md border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">スラッグ <span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <span className="flex items-center h-10 px-3 rounded-l-md border border-r-0 border-neutral-200 bg-neutral-50 text-sm text-neutral-400">/projects/</span>
                <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="ec-renewal"
                  className="flex-1 h-10 px-3 rounded-r-md border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">サブタイトル</label>
              <input type="text" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="例: UXリサーチからデザイン実装まで担当"
                className="w-full h-10 px-3 rounded-md border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">説明</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} placeholder="プロジェクトの背景、課題、アプローチについて記述してください"
                className="w-full px-3 py-2.5 rounded-md border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors resize-none" />
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900">タグ・ツール</h2>
            <TagInput label="担当ロール" values={form.roles} onChange={(v) => set('roles', v)} placeholder="例: UXデザイン、UIデザイン" />
            <TagInput label="使用ツール" values={form.tools} onChange={(v) => set('tools', v)} placeholder="例: Figma、React" />
            <TagInput label="ハイライト" values={form.highlights} onChange={(v) => set('highlights', v)} placeholder="例: ユーザーテスト実施" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900">プロジェクト設定</h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">カテゴリ <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {(['web', 'electronics'] as const).map((cat) => (
                  <button key={cat} type="button" onClick={() => set('category', cat)}
                    className={cn('h-9 rounded-md border text-sm font-medium transition-colors',
                      form.category === cat ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50')}>
                    {cat === 'web' ? 'Web' : 'Electronics'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">期間</label>
              <input type="text" value={form.period} onChange={(e) => set('period', e.target.value)} placeholder="例: 2024年4月〜6月"
                className="w-full h-10 px-3 rounded-md border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">期間の開始日（ソート用）</label>
              <input type="date" value={form.period_start ?? ''} onChange={(e) => set('period_start', e.target.value || null)}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">公開状態</label>
              <button type="button" onClick={() => set('is_published', !form.is_published)}
                className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', form.is_published ? 'bg-neutral-900' : 'bg-neutral-200')}>
                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', form.is_published ? 'translate-x-6' : 'translate-x-1')} />
              </button>
              <p className="text-xs text-neutral-500 mt-1.5">
                {form.is_published ? '公開中 — ポートフォリオに表示されます' : '下書き — 非公開です'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Images - full width */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">画像</h2>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Process Steps - full width */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900">プロセス</h2>
          {!addingStep && editingIndex === null && (
            <button type="button" onClick={() => setAddingStep(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              ステップを追加
            </button>
          )}
        </div>

        <div className="space-y-2">
          {processSteps.length === 0 && !addingStep && (
            <p className="text-sm text-neutral-400 py-6 text-center">プロセスステップがありません</p>
          )}

          {processSteps.map((step, i) =>
            editingIndex === i ? (
              <ProcessStepForm key={i} initial={step} onSave={(s) => updateStep(i, s)} onCancel={() => setEditingIndex(null)} />
            ) : (
              <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-md border border-neutral-100 hover:border-neutral-200 group transition-colors">
                <span className={cn('inline-flex items-center h-5 px-1.5 rounded text-xs font-medium border flex-shrink-0 mt-0.5', phaseStyle[step.phase])}>
                  {step.phase}
                </span>
                {step.images?.[0] && (
                  <div className="w-12 h-8 rounded overflow-hidden border border-neutral-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={step.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{step.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button type="button" onClick={() => moveStep(i, 'up')} disabled={i === 0}
                    className="flex items-center justify-center w-7 h-7 rounded border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => moveStep(i, 'down')} disabled={i === processSteps.length - 1}
                    className="flex items-center justify-center w-7 h-7 rounded border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => { setEditingIndex(i); setAddingStep(false) }}
                    className="flex items-center justify-center w-7 h-7 rounded border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => deleteStep(i)}
                    className="flex items-center justify-center w-7 h-7 rounded border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}

          {addingStep && (
            <ProcessStepForm initial={{}} onSave={addStep} onCancel={() => setAddingStep(false)} />
          )}
        </div>
      </div>
    </div>
  )
}
