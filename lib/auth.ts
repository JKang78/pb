import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabaseServer";
import { ensureOwnerBlog } from "./db";

export async function getUser() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireOwner() {
  const user = await requireUser();
  const blog = await ensureOwnerBlog(user.id);
  return { user, blog };
}
