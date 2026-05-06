import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // /admin/login はそのままアクセス許可
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // viewer or admin どちらでも /admin にアクセス可能
    const role = request.cookies.get('admin-role')
    if (!role) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
