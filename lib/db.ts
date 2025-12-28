import { createSupabaseServerClient, createSupabaseServiceClient } from "./supabaseServer";

export type Theme = {
  template: "minimal" | "notebook" | "typewriter";
  font: "inter" | "serif" | "mono";
  width: "narrow" | "normal" | "wide";
  baseFontSize: 14 | 16 | 18 | 20 | 22 | 24;
  lineHeight: 1.4 | 1.5 | 1.6 | 1.8 | 2.0;
  letterSpacing: 0 | 0.01 | 0.02;
  colors: {
    background: string;
    text: string;
    accent: string;
  };
};

export const defaultTheme: Theme = {
  template: "minimal",
  font: "serif",
  width: "narrow",
  baseFontSize: 18,
  lineHeight: 1.5,
  letterSpacing: 0,
  colors: {
    background: "#111110",
    text: "#e6e1d9",
    accent: "#b9a88f"
  }
};

export type Blog = {
  id: string;
  owner_user_id: string;
  title: string;
  slug: string;
  theme_json: Theme;
  created_at: string;
};

export type Post = {
  id: string;
  blog_id: string;
  slug: string;
  title: string;
  content_json: unknown;
  visibility: "public" | "private";
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (base) {
    return base;
  }
  return `post-${Math.random().toString(36).slice(2, 8)}`;
}

export async function ensureOwnerBlog(ownerId: string) {
  const supabase = createSupabaseServerClient();
  const preferredSlug = process.env.BLOG_SLUG;
  if (preferredSlug) {
    const { data: slugMatch, error: slugError } = await supabase
      .from("blogs")
      .select("*")
      .eq("owner_user_id", ownerId)
      .eq("slug", preferredSlug)
      .maybeSingle();

    if (slugError) {
      throw slugError;
    }

    if (slugMatch) {
      return slugMatch as Blog;
    }
  }

  const { data: existing, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("owner_user_id", ownerId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing as Blog;
  }

  const baseSlug = process.env.BLOG_SLUG || "main";
  const candidates = [
    baseSlug,
    `${baseSlug}-${ownerId.slice(0, 6)}`,
    `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`
  ];

  for (const candidate of candidates) {
    const { data: created, error: insertError } = await supabase
      .from("blogs")
      .insert({
        owner_user_id: ownerId,
        title: "My Blog",
        slug: candidate,
        theme_json: defaultTheme
      })
      .select("*")
      .single();

    if (!insertError) {
      return created as Blog;
    }

    if (insertError.code !== "23505") {
      throw insertError;
    }
  }

  throw new Error("Unable to create a unique blog slug.");
}

export async function getPublicBlog() {
  const slug = process.env.BLOG_SLUG;
  const supabase = createSupabaseServiceClient();
  let query = supabase.from("blogs").select("*");
  if (slug) {
    query = query.eq("slug", slug);
  }
  const { data, error } = await query.order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error) {
    throw error;
  }
  return data as Blog | null;
}

export async function getPublicPosts(blogId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, published_at, created_at")
    .eq("blog_id", blogId)
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getPublicPostBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("visibility", "public")
    .single();

  if (error) {
    return null;
  }

  return data as Post;
}

export async function getOwnerPosts(blogId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("blog_id", blogId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Post[];
}

export async function getOwnerPostBySlug(blogId: string, slug: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("blog_id", blogId)
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }

  return data as Post;
}

export async function createPost(blogId: string, title: string, content: unknown, visibility: "public" | "private") {
  const supabase = createSupabaseServerClient();
  const slug = slugify(title);
  const publishedAt = visibility === "public" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      blog_id: blogId,
      slug,
      title,
      content_json: content ?? { type: "doc", content: [] },
      visibility,
      published_at: publishedAt
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function updatePost(postId: string, updates: Partial<Post>) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Post;
}

export async function deletePost(postId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) {
    throw error;
  }
}

export async function updateTheme(blogId: string, theme: Theme) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blogs")
    .update({ theme_json: theme })
    .eq("id", blogId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Blog;
}

export function normalizeTheme(theme?: Partial<Theme> | null): Theme {
  if (!theme) {
    return defaultTheme;
  }
  return {
    ...defaultTheme,
    ...theme,
    letterSpacing:
      theme.letterSpacing === 0.01 || theme.letterSpacing === 0.02 ? theme.letterSpacing : 0,
    colors: {
      ...defaultTheme.colors,
      ...(theme.colors ?? {})
    }
  } as Theme;
}

export function buildSlug(title: string) {
  return slugify(title);
}
