import { NextResponse } from "next/server";
import { getUser } from "../../../lib/auth";
import { ensureOwnerBlog } from "../../../lib/db";
import { createSupabaseServiceClient } from "../../../lib/supabaseServer";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureOwnerBlog(user.id);

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop() || "bin";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
  const filePath = `posts/${fileName}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase.storage.from("media").upload(filePath, buffer, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ path: filePath });
}
