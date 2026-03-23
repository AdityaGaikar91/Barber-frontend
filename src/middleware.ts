import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    // Next.js middleware runs on the Edge, so we can't directly read localstorage here. 
    // Usually, tokens should be stored in cookies for pure SSR protection. 
    // Since we're using Zustand with localStorage, we'll do a basic client-side check via a layout,
    // OR if we assume token might be in a cookie later. We will leave this middleware stubbed 
    // but primarily handle redirects in Client components or via AuthProvider for now since standard Zustand uses localStorage.
    
    // For now, if we don't have cookies setup, we will let client side handle it.
    // If you plan to move to cookies:
    // const token = request.cookies.get('auth_token')?.value;

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
