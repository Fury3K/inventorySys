import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // 1. Define protected and public routes
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/dashboard") || path === "/";
  const isPublicRoute = path === "/login";

  // 2. Decrypt the session to verify it
  const decryptedSession = session ? await decrypt(session) : null;

  // 3. Redirect to /login if the user is not authenticated on a protected route
  if (isProtectedRoute && !decryptedSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Redirect to / if the user is authenticated on a public route
  if (isPublicRoute && decryptedSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
