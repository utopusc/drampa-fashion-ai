import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/create', '/dashboard', '/api/generate'];
const authRoutes = ['/auth/sign-in', '/auth/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to sign-in if trying to access protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL('/auth/sign-in', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if trying to access auth routes with token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // For create route, add additional checks
  if (pathname.startsWith('/create')) {
    // You can add additional validation here, such as:
    // - Checking if user has enough credits
    // - Rate limiting
    // - Feature flags
    
    // Set a custom header that the create page can check
    response.headers.set('X-Route-Protected', 'true');
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and api health check
    '/((?!_next/static|_next/image|favicon.ico|public|api/health).*)',
  ],
};