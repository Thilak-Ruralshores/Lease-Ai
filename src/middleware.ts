// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
const PRIVATE_ROUTES = ["/dashboard", "/keywords", "/extraction", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth-token")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname === route);
  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Redirect if trying to access private page without token
  if (isPrivate && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Redirect if logged in and trying to access login/signup
  if (authToken && (pathname === "/login" || pathname === "/signup")) {
    const homeUrl = new URL("/", request.url);
    const response = NextResponse.redirect(homeUrl);
    // Explicitly prevent caching the login page state
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    return response;
  }

  const response = NextResponse.next();

  // 3. APPLY TO ALL DYNAMIC ROUTES (Private + Login/Signup)
  // This ensures that hitting 'Back' from the dashboard to login 
  // or vice versa ALWAYS triggers a fresh server check.
  if (isPrivate || pathname === "/login" || pathname === "/signup") {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/keywords/:path*",
    "/extraction/:path*",
    "/login",
    "/signup",
    "/",
  ],
};
