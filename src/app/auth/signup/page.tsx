'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上である必要があります')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="text-green-600 dark:text-green-400 text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold">登録完了</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            登録完了しました。確認メールをご確認の上、ログインしてください。
          </p>
          <p className="text-sm text-neutral-500">
            ログインページに移動します...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">新規登録</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              ポートフォリオ管理アカウントを作成してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
              <p className="text-xs text-neutral-500">6文字以上</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-medium"
            >
              {isLoading ? '登録中...' : '登録する'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-neutral-50 dark:bg-neutral-950 px-2 text-neutral-600 dark:text-neutral-400">
                または
              </span>
            </div>
          </div>

          <Link href="/auth/login">
            <Button variant="outline" className="w-full h-11 text-base font-medium">
              ログイン
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
