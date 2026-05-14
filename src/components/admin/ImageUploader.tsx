'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Upload, Check, MousePointer2, Hand } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

type DragMode = 'idle' | 'selecting' | 'moving' | 'resizing' | 'panning'
type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
type ToolMode = 'select' | 'hand'

const PADDING     = 40
const HANDLE_SIZE = 8
const MIN_SEL     = 4
const SCROLL_PAD  = 400  // scrollable margin around canvas in all 4 directions

const HANDLE_CURSOR: Record<HandleId, string> = {
  nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
  e:  'e-resize',  se: 'se-resize', s: 's-resize',
  sw: 'sw-resize', w: 'w-resize',
}

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}

async function getCroppedBlob(imageSrc: string, sel: SelectionRect): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width  = sel.width
  canvas.height = sel.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, sel.x, sel.y, sel.width, sel.height, 0, 0, sel.width, sel.height)
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.88))
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}


function getHandles(sel: SelectionRect, scale: number) {
  const { x, y, width: w, height: h } = sel
  const cx = x + w / 2, cy = y + h / 2
  const pts: { id: HandleId; px: number; py: number }[] = [
    { id: 'nw', px: x,      py: y      }, { id: 'n',  px: cx,     py: y      },
    { id: 'ne', px: x + w,  py: y      }, { id: 'e',  px: x + w,  py: cy     },
    { id: 'se', px: x + w,  py: y + h  }, { id: 's',  px: cx,     py: y + h  },
    { id: 'sw', px: x,      py: y + h  }, { id: 'w',  px: x,      py: cy     },
  ]
  return pts.map(p => ({ id: p.id, cx: p.px * scale + PADDING, cy: p.py * scale + PADDING }))
}

function hitHandle(handles: { id: HandleId; cx: number; cy: number }[], mx: number, my: number): HandleId | null {
  for (const h of handles) {
    const dx = mx - h.cx, dy = my - h.cy
    if (dx * dx + dy * dy <= HANDLE_SIZE * HANDLE_SIZE) return h.id
  }
  return null
}

function inSelection(sel: SelectionRect, ix: number, iy: number): boolean {
  return ix >= sel.x && ix <= sel.x + sel.width && iy >= sel.y && iy <= sel.y + sel.height
}

function applyResize(handle: HandleId, sel: SelectionRect, imgW: number, imgH: number, dx: number, dy: number): SelectionRect {
  let { x, y, width, height } = sel
  if (handle.includes('w')) { x += dx; width  -= dx }
  if (handle.includes('e')) {           width  += dx }
  if (handle.includes('n')) { y += dy;  height -= dy }
  if (handle.includes('s')) {           height += dy }
  if (width  < MIN_SEL) { if (handle.includes('w')) x = sel.x + sel.width - MIN_SEL; width  = MIN_SEL }
  if (height < MIN_SEL) { if (handle.includes('n')) y = sel.y + sel.height - MIN_SEL; height = MIN_SEL }
  x = Math.max(0, Math.min(x, imgW - width))
  y = Math.max(0, Math.min(y, imgH - height))
  width  = Math.min(width,  imgW - x)
  height = Math.min(height, imgH - y)
  return { x, y, width, height }
}

export function ImageUploader({ images, onChange, maxImages }: ImageUploaderProps) {
  const inputRef         = useRef<HTMLInputElement>(null)
  const canvasRef        = useRef<HTMLCanvasElement>(null)
  const containerRef     = useRef<HTMLDivElement>(null)
  const capturedScrollRef = useRef<{ left: number; top: number; scale: number } | null>(null)

  const [src,       setSrc]       = useState<string | null>(null)
  const [image,     setImage]     = useState<HTMLImageElement | null>(null)
  const [scale,     setScale]     = useState(1)
  const [minScale,  setMinScale]  = useState(0.1)
  const [selection, setSelection] = useState<SelectionRect | null>(null)
  const [toolMode,  setToolMode]  = useState<ToolMode>('select')
  const [dragMode,  setDragMode]  = useState<DragMode>('idle')
  const [activeHandle, setActiveHandle] = useState<HandleId | null>(null)
  const [dragStart, setDragStart] = useState<{
    canvasX: number; canvasY: number; imgX: number; imgY: number; sel: SelectionRect
  } | null>(null)
  const [panStart, setPanStart] = useState<{
    mouseX: number; mouseY: number; scrollX: number; scrollY: number
  } | null>(null)
  const [croppedSize, setCroppedSize] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // ---------- ファイル選択 ----------
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const imgData = reader.result as string
      setSrc(imgData)
      const img = await createImage(imgData)
      setImage(img)
      setSelection(null); setCroppedSize(null)
      const containerW = 832, containerH = 568
      const fitScale = Math.min(containerW / img.width, containerH / img.height, 1)
      setScale(fitScale)
      setMinScale(Math.min(fitScale * 0.5, 0.05))
      setToolMode('select')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ---------- 座標変換（PADDING考慮） ----------
  const toCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    return {
      canvasX, canvasY,
      imgX: (canvasX - PADDING) / scale,
      imgY: (canvasY - PADDING) / scale,
    }
  }, [scale])

  // ---------- MouseDown ----------
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return

    // ハンドツール: パニング開始
    if (toolMode === 'hand') {
      setPanStart({
        mouseX: e.clientX, mouseY: e.clientY,
        scrollX: containerRef.current?.scrollLeft ?? 0,
        scrollY: containerRef.current?.scrollTop ?? 0,
      })
      setDragMode('panning')
      return
    }

    const { canvasX, canvasY, imgX, imgY } = toCoords(e)

    if (selection) {
      const handles = getHandles(selection, scale)
      const hit = hitHandle(handles, canvasX, canvasY)
      if (hit) {
        setDragMode('resizing'); setActiveHandle(hit)
        setDragStart({ canvasX, canvasY, imgX, imgY, sel: selection })
        return
      }
      if (inSelection(selection, imgX, imgY)) {
        setDragMode('moving')
        setDragStart({ canvasX, canvasY, imgX, imgY, sel: selection })
        return
      }
    }
    setDragMode('selecting'); setActiveHandle(null)
    setDragStart({ canvasX, canvasY, imgX, imgY, sel: { x: imgX, y: imgY, width: 0, height: 0 } })
    setSelection({ x: imgX, y: imgY, width: 0, height: 0 })
  }, [image, selection, scale, toolMode, toCoords])

  // ---------- MouseMove ----------
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return

    // パニング
    if (dragMode === 'panning' && panStart && containerRef.current) {
      containerRef.current.scrollLeft = panStart.scrollX - (e.clientX - panStart.mouseX)
      containerRef.current.scrollTop  = panStart.scrollY - (e.clientY - panStart.mouseY)
      return
    }

    const { canvasX, canvasY, imgX, imgY } = toCoords(e)

    // カーソル更新（アイドル時のみ）
    if (dragMode === 'idle') {
      if (toolMode === 'hand') {
        canvasRef.current.style.cursor = 'grab'; return
      }
      if (selection) {
        const handles = getHandles(selection, scale)
        const hit = hitHandle(handles, canvasX, canvasY)
        if (hit) { canvasRef.current.style.cursor = HANDLE_CURSOR[hit]; return }
        if (inSelection(selection, imgX, imgY)) { canvasRef.current.style.cursor = 'move'; return }
      }
      canvasRef.current.style.cursor = 'crosshair'
      return
    }

    if (!dragStart) return

    if (dragMode === 'selecting') {
      const x = Math.max(0, Math.min(dragStart.imgX, imgX))
      const y = Math.max(0, Math.min(dragStart.imgY, imgY))
      const w = Math.min(Math.abs(imgX - dragStart.imgX), image.width  - x)
      const h = Math.min(Math.abs(imgY - dragStart.imgY), image.height - y)
      setSelection({ x, y, width: w, height: h })
      return
    }
    if (dragMode === 'moving' && selection) {
      const dx = imgX - dragStart.imgX, dy = imgY - dragStart.imgY
      setSelection({
        ...dragStart.sel,
        x: Math.max(0, Math.min(dragStart.sel.x + dx, image.width  - dragStart.sel.width)),
        y: Math.max(0, Math.min(dragStart.sel.y + dy, image.height - dragStart.sel.height)),
      }); return
    }
    if (dragMode === 'resizing' && activeHandle && dragStart) {
      setSelection(applyResize(activeHandle, dragStart.sel, image.width, image.height,
        imgX - dragStart.imgX, imgY - dragStart.imgY))
    }
  }, [dragMode, dragStart, panStart, activeHandle, selection, image, scale, toolMode, toCoords])

  // ---------- MouseUp ----------
  const handleMouseUp = useCallback(() => {
    if (dragMode === 'panning') { setPanStart(null) }
    if (dragMode !== 'idle') {
      setSelection(prev => {
        if (prev && prev.width > MIN_SEL && prev.height > MIN_SEL) setCroppedSize(null)
        return prev
      })
      setDragMode('idle'); setDragStart(null)
    }
  }, [dragMode])

  // ---------- Canvas 描画 ----------
  useEffect(() => {
    if (!canvasRef.current || !image) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const iw = image.width  * scale
    const ih = image.height * scale
    canvas.width  = iw + PADDING * 2
    canvas.height = ih + PADDING * 2
    // PADDING border stays transparent → CSS checkerboard shows through

    // 画像（余白内）
    ctx.drawImage(image, PADDING, PADDING, iw, ih)

    if (selection && selection.width > MIN_SEL && selection.height > MIN_SEL) {
      const sx = selection.x * scale + PADDING
      const sy = selection.y * scale + PADDING
      const sw = selection.width  * scale
      const sh = selection.height * scale

      // 選択外を暗く
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(PADDING, PADDING, iw, ih)

      // 選択範囲を再描画
      ctx.drawImage(image, selection.x, selection.y, selection.width, selection.height, sx, sy, sw, sh)

      // 枠線
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.5
      ctx.strokeRect(sx, sy, sw, sh)

      // ハンドル
      const handles = getHandles(selection, scale)
      for (const h of handles) {
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#333'; ctx.lineWidth = 1
        ctx.beginPath()
        ctx.rect(h.cx - HANDLE_SIZE / 2, h.cy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE)
        ctx.fill(); ctx.stroke()
      }

      // サイズラベル
      const label = `${Math.round(selection.width)} × ${Math.round(selection.height)}`
      ctx.font = 'bold 13px sans-serif'
      const tw = ctx.measureText(label).width
      const lx = Math.min(sx + 6, canvas.width - tw - 6)
      const ly = sy > 24 ? sy - 6 : sy + sh + 18
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(lx - 3, ly - 13, tw + 6, 18)
      ctx.fillStyle = '#fff'; ctx.fillText(label, lx, ly)
    }
  }, [image, selection, scale])

  // ---------- 画像ロード時: スクロール中央揃え ----------
  useEffect(() => {
    if (!containerRef.current || !image) return
    requestAnimationFrame(() => {
      if (!containerRef.current) return
      const c = containerRef.current
      c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2
      c.scrollTop  = (c.scrollHeight - c.clientHeight) / 2
    })
  }, [image])

  // ---------- ズーム時: 中心点を維持 ----------
  useEffect(() => {
    if (!containerRef.current || !image || !capturedScrollRef.current) return
    const cap = capturedScrollRef.current
    capturedScrollRef.current = null
    const c = containerRef.current
    const imgCx = (cap.left + c.clientWidth  / 2 - SCROLL_PAD) / cap.scale
    const imgCy = (cap.top  + c.clientHeight / 2 - SCROLL_PAD) / cap.scale
    requestAnimationFrame(() => {
      if (!containerRef.current) return
      const cc = containerRef.current
      cc.scrollLeft = Math.max(0, imgCx * scale + SCROLL_PAD - cc.clientWidth  / 2)
      cc.scrollTop  = Math.max(0, imgCy * scale + SCROLL_PAD - cc.clientHeight / 2)
    })
  }, [scale, image])

  // ---------- ファイルサイズ自動計算 ----------
  useEffect(() => {
    if (!src || !selection || selection.width <= MIN_SEL) { return }
    const timer = setTimeout(async () => {
      try {
        const blob = await getCroppedBlob(src, selection)
        setCroppedSize(blob.size)
      } catch { /* ignore */ }
    }, 300)
    return () => clearTimeout(timer)
  }, [src, selection])

  // ---------- キーボード ----------
  const confirmRef = useRef<() => void>(() => {})
  const clearRef   = useRef<() => void>(() => {})

  const handleClear = useCallback(() => {
    setSelection(null); setCroppedSize(null)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!src || !selection || selection.width <= MIN_SEL) return
    setIsUploading(true)
    try {
      const blob = await getCroppedBlob(src, selection)
      const fd = new FormData()
      fd.append('file', blob, `image-${Date.now()}.jpg`)
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      onChange([...images, json.url])
      setSrc(null); setImage(null); setSelection(null); setCroppedSize(null); setScale(1)
    } catch { alert('アップロードに失敗しました') }
    finally { setIsUploading(false) }
  }, [src, selection, images, onChange])

  confirmRef.current = handleConfirm
  clearRef.current   = handleClear

  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter')  { e.preventDefault(); confirmRef.current() }
      if (e.key === 'Escape') { e.preventDefault(); clearRef.current()   }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [src])

  const removeImage = (i: number) => onChange(images.filter((_, j) => j !== i))
  const hasSelection = selection && selection.width > MIN_SEL && selection.height > MIN_SEL

  return (
    <div className="space-y-3">
      {/* サムネイル */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group w-24 h-16 rounded-md overflow-hidden border border-neutral-200 bg-neutral-100">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* アップロードボタン */}
      {!src && (!maxImages || images.length < maxImages) && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 h-9 px-4 rounded-md border border-dashed border-neutral-300 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors w-full justify-center">
          <Upload className="w-4 h-4" />画像を追加
        </button>
      )}
      {maxImages && images.length >= maxImages && (
        <p className="text-xs text-neutral-400 text-center py-2">最大 {maxImages} 枚まで登録できます</p>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      {/* モーダル */}
      {src && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col" style={{ maxHeight: '95vh' }}>

            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 shrink-0">
              <div className="flex items-center gap-4">
                {/* ツール切り替え */}
                <div className="flex gap-0.5 bg-neutral-100 rounded-md p-0.5">
                  <button
                    type="button"
                    title="選択ツール（S）"
                    onClick={() => setToolMode('select')}
                    className={cn('p-1.5 rounded transition-colors', toolMode === 'select' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700')}
                  >
                    <MousePointer2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="ハンドツール（H）"
                    onClick={() => setToolMode('hand')}
                    className={cn('p-1.5 rounded transition-colors', toolMode === 'hand' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700')}
                  >
                    <Hand className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-400">
                  ドラッグで選択 · ハンドルで調整 ·{' '}
                  <kbd className="px-1 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono text-xs">Enter</kbd>{' '}
                  で確定 ·{' '}
                  <kbd className="px-1 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono text-xs">Esc</kbd>{' '}
                  でリセット
                </p>
              </div>
              <button type="button" onClick={() => setSrc(null)} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas エリア */}
            <div
              ref={containerRef}
              className="overflow-auto flex-1"
              style={{
                minHeight: 200,
                backgroundImage: 'repeating-conic-gradient(#c0c0c0 0% 25%, #ffffff 0% 50%)',
                backgroundSize: '24px 24px',
              }}
            >
              <div style={{ padding: SCROLL_PAD }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={cn(dragMode === 'panning' ? 'cursor-grabbing' : toolMode === 'hand' ? 'cursor-grab' : 'cursor-crosshair')}
                  style={{ display: 'block' }}
                />
              </div>
            </div>

            {/* コントロール */}
            <div className="px-5 py-4 space-y-3 shrink-0 border-t border-neutral-100">
              {/* ズーム */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-12 shrink-0">ズーム</span>
                <input type="range" min={minScale} max="3" step="0.05" value={scale}
                  onChange={(e) => {
                    if (containerRef.current) {
                      capturedScrollRef.current = {
                        left: containerRef.current.scrollLeft,
                        top:  containerRef.current.scrollTop,
                        scale,
                      }
                    }
                    setScale(Number(e.target.value))
                  }}
                  className="flex-1 accent-neutral-900" />
                <span className="text-xs text-neutral-500 w-10 text-right">{Math.round(scale * 100)}%</span>
              </div>

              {/* 選択情報 + ファイルサイズ + ボタン */}
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-neutral-500 min-w-0">
                  {hasSelection && (
                    <span>
                      選択範囲: <span className="text-neutral-800 font-medium">{Math.round(selection!.width)} × {Math.round(selection!.height)} px</span>
                      {croppedSize != null && (
                        <span className="ml-3 text-neutral-400">{formatFileSize(croppedSize)}</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {hasSelection && (
                    <button type="button" onClick={handleClear}
                      className="h-9 px-4 rounded-md border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                      リセット
                    </button>
                  )}
                  <button type="button" onClick={() => setSrc(null)}
                    className="h-9 px-4 rounded-md border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                    キャンセル
                  </button>
                  <button type="button" onClick={handleConfirm}
                    disabled={isUploading || !hasSelection}
                    className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-40">
                    <Check className="w-4 h-4" />
                    {isUploading ? 'アップロード中...' : '確定'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
