import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: { [key: string]: any }) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Ignore cookie writes in Server Components.
        }
      },
      remove(name: string, options: { [key: string]: any }) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Ignore cookie writes in Server Components.
        }
      }
    }
  });
}

export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role key.");
  }

  return createServerClient(url, serviceKey, {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {}
    }
  });
}
