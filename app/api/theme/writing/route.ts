import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "../../../../lib/auth";
import { ensureOwnerBlog, normalizeTheme, Theme, updateTheme } from "../../../../lib/db";

const allowedFonts = new Set<Theme["font"]>(["inter", "serif", "mono"]);
const allowedSizes = new Set<Theme["baseFontSize"]>([14, 16, 18, 20, 22, 24]);
const allowedLineHeights = new Set<Theme["lineHeight"]>([1.4, 1.5, 1.6, 1.8, 2.0]);
const allowedLetterSpacing = new Set<Theme["letterSpacing"]>([0, 0.01, 0.02]);

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blog = await ensureOwnerBlog(user.id);
  const current = normalizeTheme(blog.theme_json as Theme);

  const body = (await request.json()) as Partial<Theme> & { text?: string };

  const nextTheme: Theme = {
    ...current,
    font: allowedFonts.has(body.font as Theme["font"]) ? (body.font as Theme["font"]) : current.font,
    baseFontSize: allowedSizes.has(body.baseFontSize as Theme["baseFontSize"])
      ? (body.baseFontSize as Theme["baseFontSize"])
      : current.baseFontSize,
    lineHeight: allowedLineHeights.has(body.lineHeight as Theme["lineHeight"])
      ? (body.lineHeight as Theme["lineHeight"])
      : current.lineHeight,
    letterSpacing: allowedLetterSpacing.has(body.letterSpacing as Theme["letterSpacing"])
      ? (body.letterSpacing as Theme["letterSpacing"])
      : current.letterSpacing,
    colors: {
      ...current.colors,
      text: typeof body.text === "string" && body.text.trim() ? body.text.trim() : current.colors.text
    }
  };

  await updateTheme(blog.id, nextTheme);

  revalidatePath("/");
  revalidatePath("/dashboard/new");
  revalidatePath("/dashboard/edit");
  revalidatePath("/dashboard/theme");

  return NextResponse.json({ ok: true });
}
