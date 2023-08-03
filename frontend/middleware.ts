import { NextRequest, NextResponse } from "next/server";
import { APP_TOKENS } from "./utils/constants";

export function middleware(request: NextRequest) {
  //   let cookie = request.cookies.get("nextjs")?.value;
  const paths = ["/dashboard", "/competition"];

  const publicPaths = ["/", "/login", "/signup"];

  const isAuthenticated = request.cookies.has(APP_TOKENS.ACCESS_TOKEN);
  const nextUrl = request.nextUrl;

  // if not isAuthenticated, only allow visiting public paths
  if (!isAuthenticated && !publicPaths.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //   if (apiClientPaths.some((path) => nextUrl.pathname.startsWith(path))) {
  //     return NextResponse.rewrite(new URL(nextUrl.pathname, request.url));
  //   } else {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
