import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const path = url.pathname;

  if (token) {
    if (path === "/login" || path === "/signup" || path === "/verify" || path === "/") {
      console.log("Redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (path.startsWith("/:path*")) {
      console.log("Redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verify/:path*",
    "/:path*", // Only protect dashboard-related routes
  ],
};
