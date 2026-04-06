import { NextResponse } from "next/server";
import { getUser } from "../../../lib/auth";
import { createSupabaseServiceClient } from "../../../lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  const isPublicAsset = path.startsWith("public/");
  const isPrivateAsset = path.startsWith("private/");

  if (!isPublicAsset && !isPrivateAsset) {
    return NextResponse.json(
      { error: "Invalid media path. Expected public/ or private/ prefix." },
      { status: 400 }
    );
  }

  if (isPrivateAsset) {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 7);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl, { status: 307 });
}
