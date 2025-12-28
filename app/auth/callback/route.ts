import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/dashboard";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const safeNext = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";
  const destination = new URL(safeNext, request.url);
  if (safeNext.startsWith("/verify")) {
    destination.searchParams.set("verified", "1");
  }
  const response = NextResponse.redirect(destination);

  if (code) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { [key: string]: any }) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: { [key: string]: any }) {
          response.cookies.set({ name, value: "", ...options });
        }
      }
    });

    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
