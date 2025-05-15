import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@civic/auth/nextjs/middleware"

const withCivicAuth = authMiddleware()

export default function middleware(request: NextRequest)  {
const  { pathname } = request.nextUrl

// protected routes
const protectedRoutes = ['/raffles', '/profile'];

// check if route is protected
const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));


//  apply the auth middleware
if (isProtectedRoute) {
    // Check if the user is authenticated
    try {
      // Get the auth response from Civic middleware
      const authResponse = withCivicAuth(request);
      
      // If the middleware returns a response (redirect to auth), use it
      if (authResponse) {
        // Create a custom response that redirects to our auth page
        const url = new URL('/raffles', request.url);
        return NextResponse.redirect(url);
      }
      
      // If no response, the user is authenticated and can proceed
      return NextResponse.next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      // Redirect to auth page on error
      const url = new URL('/auth', request.url);
      return NextResponse.redirect(url);
    }
  }

  // For non-protected routes, allow access
  return NextResponse.next();
}

export const config = {

    matcher: [
        '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif).*)',

    ]

}


