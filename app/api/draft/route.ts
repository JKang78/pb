import { NextResponse } from "next/server";
import { getUser } from "../../../lib/auth";
import { ensureOwnerBlog, createPost, updatePost } from "../../../lib/db";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    postId?: string | null;
    title?: string;
    visibility?: "public" | "private";
    content?: unknown;
  };

  const blog = await ensureOwnerBlog(user.id);
  const title = body.title ?? "Untitled";
  const visibility = body.visibility ?? "private";
  const content = body.content ?? { type: "doc", content: [] };

  if (body.postId) {
    await updatePost(body.postId, {
      title,
      visibility,
      content_json: content,
      published_at: visibility === "public" ? new Date().toISOString() : null
    });
    return NextResponse.json({ postId: body.postId });
  }

  const post = await createPost(blog.id, title, content, visibility);
  return NextResponse.json({ postId: post.id });
}
