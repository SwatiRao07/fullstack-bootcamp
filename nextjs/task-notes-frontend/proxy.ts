import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import { config as appConfig } from './lib/config';

const JWT_SECRET = new TextEncoder().encode(
  appConfig.jwtSecret || 'your-secret-key'
);

// Routes that require authentication
const protectedRoutes = ['/tasks', '/profile', '/settings'];

// Routes that should redirect to tasks if already authenticated
const authRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('auth-token')?.value;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    path.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.includes(path);

  // Verify token if it exists
  let isValidToken = false;
  if (token) {
    try {
      // Typically, jwtVerify is for validating JSON Web Tokens natively on edge runtimes like Next.js proxy.
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
    } catch (e) {
      console.error(`JWT Verification failed for token ${token.substring(0, 10)}...:`, e);
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      response.cookies.delete('user');
      return response;
    }
  }

  // Redirect logic
  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
