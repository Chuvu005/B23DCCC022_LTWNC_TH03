import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, search } = req.nextUrl;
  const fullPath = pathname + search;

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', fullPath);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin')) {
    const role = req.auth?.user?.role;
    if (role !== 'admin') {
      const forbiddenUrl = new URL('/forbidden', req.nextUrl.origin);
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/loans/:path*', '/admin/:path*'],
};
