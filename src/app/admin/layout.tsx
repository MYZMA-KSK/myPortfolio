'use client'

import { usePathname } from 'next/navigation'
import { AdminLayoutContent } from '@/components/admin/AdminLayoutContent'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return <AdminLayoutContent>{children}</AdminLayoutContent>
}
