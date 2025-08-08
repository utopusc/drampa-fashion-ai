import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/sign-in',
  '/auth/sign-up',
  '/api/auth/login',
  '/api/auth/register',
  '/api/save-fashn-key',
  '/api/health',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Add security headers for mixed content handling
  const response = NextResponse.next();
  
  // Temporarily allow mixed content for HTTP backend
  if (process.env.NEXT_PUBLIC_BACKEND_URL?.startsWith('http://')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self' http://31.220.81.177 https://31.220.81.177 ws: wss:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: http://31.220.81.177 https://31.220.81.177;"
    );
    // Allow HTTP requests from HTTPS (development only)
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return response;
  }
  
  // Allow static files and API routes (except protected ones)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/uploads/')
  ) {
    return NextResponse.next();
  }
  
  // Check for authentication token in multiple places
  const authToken = request.cookies.get('auth-token')?.value ||
                   request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If no token found, redirect to sign-in with redirect parameter
  if (!authToken) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    if (pathname !== '/auth/sign-in') {
      signInUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(signInUrl);
  }
  
  // Allow the request to continue (token will be validated by individual API routes)
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};