import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "../../../../lib/supabaseServer";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const cookieName = `viewed_${params.slug}`;
  const existing = request.headers.get("cookie")?.includes(`${cookieName}=`);

  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseServiceClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, blog_id, view_count")
    .eq("slug", params.slug)
    .eq("visibility", "public")
    .single();

  if (error || !post) {
    return NextResponse.json({ ok: true });
  }

  await supabase
    .from("posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", post.id);

  // Log the view event so the owner can see when views happened.
  // This is intentionally best-effort and does not block the response.
  const { error: viewError } = await supabase.from("post_views").insert({
    post_id: post.id,
    blog_id: post.blog_id
  });
  if (viewError) {
    // Do not fail the request if view logging has an issue.
    console.error("Failed to log post view", viewError);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "true", {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true
  });
  return response;
}
