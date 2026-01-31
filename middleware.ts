import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const allowedUsers = process.env.ALLOWED_USERS?.split(",").map(e => e.trim()) || []
  const userEmail = req.auth?.user?.email

  // Allow unauthenticated requests to pass through
  // (they'll be redirected by page-level auth checks)
  if (!req.auth) {
    return NextResponse.next()
  }

  // Check if user's email is in the whitelist
  if (userEmail && !allowedUsers.includes(userEmail)) {
    const accessDeniedUrl = new URL("/access-denied", req.url)
    return NextResponse.redirect(accessDeniedUrl)
  }

  return NextResponse.next()
})

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth.js routes)
     * - signin (sign-in page)
     * - access-denied (access denied page)
     * - _next (Next.js internals)
     * - Static files (favicon, images, etc.)
     */
    "/((?!api/auth|signin|access-denied|_next/static|_next/image|favicon.ico).*)",
  ],
}
