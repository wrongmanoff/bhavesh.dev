import { NextResponse, type NextRequest } from "next/server";
import { enforceAdminSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Never run middleware on the login page
  if (pathname === "/x9k2-manage/login" || pathname.startsWith("/x9k2-manage/login")) {
    return NextResponse.next();
  }

  return enforceAdminSession(request);
}

export const config = {
  matcher: ["/x9k2-manage/:path*"],
};
