'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
  Award,
  User,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutContentProps {
  children: React.ReactNode
}

export function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = () => {
    setIsSigningOut(true)
    document.cookie = 'admin-role=; path=/; max-age=0'
    setTimeout(() => {
      router.push('/admin/login')
      router.refresh()
    }, 300)
  }

  const navItems = [
    { label: 'プロジェクト', href: '/admin/projects', icon: Briefcase },
    { label: 'スキル', href: '/admin/skills', icon: Award },
    { label: '経歴', href: '/admin/experience', icon: User },
    { label: 'プロフィール', href: '/admin/profile', icon: Settings },
  ]

  return (
    <div className="h-screen flex bg-white text-neutral-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-200 lg:relative',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <LayoutGrid className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Portfolio</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-neutral-200">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{isSigningOut ? 'ログアウト中...' : 'ログアウト'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-neutral-200 flex items-center px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-sm text-neutral-400">
              <span>Portfolio</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-neutral-900 font-medium">
                {navItems.find(i => pathname?.startsWith(i.href))?.label ?? '管理'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
