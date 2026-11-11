import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // Protect /admin routes (except /admin/login)
  if (request.nextUrl.pathname.startsWith("/admin") && !isLoginPage) {
    if (session !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // If already authenticated and trying to view /admin/login, redirect to /admin
  if (isLoginPage && session === "authenticated") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};