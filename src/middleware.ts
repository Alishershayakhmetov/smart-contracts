// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/api/auth',
    '/_next',
    '/public',
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || 
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public')
  );

  // Skip middleware for public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if no token and not public route
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For API routes, add user info to headers
  if (pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', token.id as string);
    requestHeaders.set('x-user-email', token.email as string);
    requestHeaders.set('x-user-name', token.name as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};