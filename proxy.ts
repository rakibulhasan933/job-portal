import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!!")

const COOKIE_NAME = "jobconnect_token"

// Routes that require authentication
const protectedRoutes = ["/admin", "/employer", "/seeker"]

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  employer: ["/employer"],
  seeker: ["/seeker"],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const user = payload as {
      userId: string
      email: string
      role: string
      isApproved: boolean
      isBlocked: boolean
    }

    // Check if user is blocked
    if (user.isBlocked) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("error", "blocked")
      // Clear the cookie by setting it to expire
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(COOKIE_NAME)
      return response
    }

    // Check role-based access
    for (const [role, routes] of Object.entries(roleRoutes)) {
      const isRoleRoute = routes.some((route) => pathname.startsWith(route))
      if (isRoleRoute && user.role !== role) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = user.role === "admin" ? "/admin" : user.role === "employer" ? "/employer" : "/seeker"
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    // Check if employer is approved for employer routes
    if (pathname.startsWith("/employer") && !user.isApproved) {
      return NextResponse.redirect(new URL("/pending-approval", request.url))
    }

    return NextResponse.next()
  } catch {
    // Invalid token - redirect to login
    const loginUrl = new URL("/login", request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*", "/seeker/:path*"],
}
