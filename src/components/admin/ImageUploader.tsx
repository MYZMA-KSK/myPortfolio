'use client'

import { useState, useCallback, useRef } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { X, Upload, ZoomIn, ZoomOut, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
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

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.88))
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [aspect, setAspect] = useState<number | undefined>(16 / 9)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!src || !croppedArea) return
    setIsUploading(true)
    try {
      const blob = await getCroppedBlob(src, croppedArea)
      const formData = new FormData()
      formData.append('file', blob, `image-${Date.now()}.jpg`)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      onChange([...images, json.url])
      setSrc(null)
      setZoom(1)
      setCrop({ x: 0, y: 0 })
    } catch (err) {
      alert('アップロードに失敗しました')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group w-24 h-16 rounded-md overflow-hidden border border-neutral-200 bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {!src && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 h-9 px-4 rounded-md border border-dashed border-neutral-300 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors w-full justify-center"
        >
          <Upload className="w-4 h-4" />
          画像を追加
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      {/* Crop modal */}
      {src && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900">画像をトリミング</h3>
              <button type="button" onClick={() => setSrc(null)} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crop area */}
            <div className="relative bg-neutral-900" style={{ height: 300 }}>
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="px-5 py-4 space-y-4">
              {/* Aspect ratio */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 w-16">比率</span>
                <div className="flex gap-1.5">
                  {[
                    { label: '自由', value: undefined },
                    { label: '16:9', value: 16 / 9 },
                    { label: '4:3', value: 4 / 3 },
                    { label: '1:1', value: 1 },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAspect(value)}
                      className={cn(
                        'h-7 px-2.5 rounded text-xs border transition-colors',
                        aspect === value
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-16">ズーム</span>
                <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.1))} className="text-neutral-400 hover:text-neutral-700">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range" min={1} max={3} step={0.05}
                  value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-neutral-900"
                />
                <button type="button" onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="text-neutral-400 hover:text-neutral-700">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setSrc(null)} className="h-9 px-4 rounded-md border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isUploading ? 'アップロード中...' : '確定'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
