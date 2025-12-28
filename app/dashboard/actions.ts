"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOwner } from "../../lib/auth";
import { createPost, updatePost, deletePost, updateTheme } from "../../lib/db";
import { createSupabaseServerClient } from "../../lib/supabaseServer";

export async function createPostAction(formData: FormData) {
  const { blog } = await requireOwner();
  const title = String(formData.get("title") ?? "Untitled");
  const visibility = (String(formData.get("visibility") ?? "private") as "public" | "private");
  const content = JSON.parse(String(formData.get("content_json") ?? "{}"));
  const draftPostId = formData.get("draft_post_id");

  if (draftPostId) {
    const supabase = createSupabaseServerClient();
    const { data: existing, error } = await supabase.from("posts").select("slug").eq("id", draftPostId).single();
    if (error) {
      throw error;
    }
    await updatePost(String(draftPostId), {
      title,
      visibility,
      content_json: content,
      published_at: visibility === "public" ? new Date().toISOString() : null
    });
    redirect(`/dashboard/edit/${existing.slug}`);
  }

  const post = await createPost(blog.id, title, content, visibility);
  redirect(`/dashboard/edit/${post.slug}`);
}

export async function updatePostAction(postId: string, formData: FormData) {
  await requireOwner();
  const title = String(formData.get("title") ?? "Untitled");
  const visibility = (String(formData.get("visibility") ?? "private") as "public" | "private");
  const content = JSON.parse(String(formData.get("content_json") ?? "{}"));

  const supabase = createSupabaseServerClient();
  const { data: current, error } = await supabase
    .from("posts")
    .select("published_at, slug")
    .eq("id", postId)
    .single();
  if (error) {
    throw error;
  }

  const publishedAt = visibility === "public" ? current.published_at ?? new Date().toISOString() : null;

  await updatePost(postId, {
    title,
    visibility,
    content_json: content,
    published_at: publishedAt
  });
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/p/${current.slug}`);
}

export async function toggleVisibilityAction(
  postId: string,
  slug: string,
  nextVisibility: "public" | "private"
) {
  await requireOwner();
  const supabase = createSupabaseServerClient();
  const { data: current, error } = await supabase.from("posts").select("published_at").eq("id", postId).single();
  if (error) {
    throw error;
  }
  const publishedAt = nextVisibility === "public" ? current.published_at ?? new Date().toISOString() : null;
  await updatePost(postId, { visibility: nextVisibility, published_at: publishedAt });
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/p/${slug}`);
}

export async function deletePostAction(postId: string, slug: string) {
  await requireOwner();
  await deletePost(postId);
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/p/${slug}`);
}

export async function updateThemeAction(theme: unknown) {
  const { blog } = await requireOwner();
  await updateTheme(blog.id, theme as any);
  revalidatePath("/");
  revalidatePath("/dashboard/theme");
}
