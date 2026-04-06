import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_PIN_COOKIE = "site_pin_ok";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasValidPin = request.cookies.get(SITE_PIN_COOKIE)?.value === "1";

  if (!hasValidPin && pathname !== "/pin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/pin";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (hasValidPin && pathname === "/pin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*"
};
