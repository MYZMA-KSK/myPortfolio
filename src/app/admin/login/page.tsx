'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/projects')
      router.refresh()
    } else {
      setError('パスワードが間違っています')
      setPassword('')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 bg-black rounded-full" />
        </div>

        <h1 className="text-neutral-900 text-xl font-semibold text-center mb-1">
          Portfolio にアクセス
        </h1>
        <p className="text-neutral-500 text-sm text-center mb-8">
          パスワードを入力してください
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoFocus
            className="w-full h-10 px-3 rounded-md bg-white border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
          />

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? '確認中...' : '続ける'}
          </button>
        </form>
      </div>
    </div>
  )
}
