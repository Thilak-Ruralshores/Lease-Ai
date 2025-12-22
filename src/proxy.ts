import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/extraction")) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === "/login" || pathname === "/signup") {
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect root to dashboard (which will redirect to login if not auth)
  if (pathname === "/") {
     if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
        return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/extraction/:path*", "/login", "/signup"],
};
