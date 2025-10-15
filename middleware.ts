import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  
  const protectedPaths = [
    '/dashboard',
    '/api/auth/me',
    '/api/company',
    '/api/companies',
    '/api/jobs',
    '/api/applications',
    '/api/dashboard'
  ];

  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedRoute) {
    if (!token) {
      if (pathname.startsWith('/api')) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      const decoded = verifyJwt(token);
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', decoded.sub);
      requestHeaders.set('x-user-role', decoded.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (error) {
      console.error('[Middleware] Token verification failed:', error instanceof Error ? error.message : error);
      if (pathname.startsWith('/api')) {
        const response = new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
        response.cookies.set('token', '', { path: '/', maxAge: -1 });
        return response;
      }
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      const response = NextResponse.redirect(url);
      response.cookies.set('token', '', { path: '/', maxAge: -1 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
