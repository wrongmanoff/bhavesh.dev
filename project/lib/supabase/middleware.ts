import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUserId } from "@/lib/auth/is-admin";

export async function enforceAdminSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No user — redirect to login
  // (login page itself is excluded by matcher in middleware.ts so we never reach here for /login)
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/x9k2-manage/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // User exists but not admin — redirect to login with error
  const admin = await isAdminUserId(supabase, user.id);
  if (!admin) {
    const url = request.nextUrl.clone();
    url.pathname = "/x9k2-manage/login";
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  // Authenticated admin — allow through
  return supabaseResponse;
}
