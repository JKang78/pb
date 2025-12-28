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
    .select("id, view_count")
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

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "true", {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true
  });
  return response;
}
