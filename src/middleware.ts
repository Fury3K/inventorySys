import { NextRequest, NextResponse } from "next/server";
import { decrypt, getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") || path === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (path === "/login" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
