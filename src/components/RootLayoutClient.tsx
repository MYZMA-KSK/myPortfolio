'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PasswordGate from '@/components/PasswordGate'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <PasswordGate>
      <Header />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </PasswordGate>
  )
}
