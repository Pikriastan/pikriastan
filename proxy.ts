import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PATHS: string[] = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!(session || isPublicPath)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
