import Link from "next/link";
import { getPublicBlog, getPublicPosts } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const blog = await getPublicBlog();

  if (!blog) {
    return (
      <section className="space-y-6">
        <h1 className="text-[28px] leading-tight">My Blog</h1>
        <p className="text-[13px] text-[color:var(--text)] opacity-70">
          This space will open after the owner logs in.
        </p>
      </section>
    );
  }

  const posts = await getPublicPosts(blog.id);

  return (
    <section className="space-y-14">
      <div className="space-y-3 border-b border-[color:var(--border)] pb-6">
        <h1 className="text-[28px] leading-tight">{blog.title}</h1>
        <p className="text-[13px] text-[color:var(--text)] opacity-70">
          A quiet notebook of notes and essays.
        </p>
      </div>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-[15px] text-[color:var(--text)] opacity-70">
            No public posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="border-b border-[color:var(--border)] pb-5 last:border-b-0"
            >
              <div className="space-y-1">
              <h2 className="text-[18px] leading-snug">
                <Link href={`/p/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-[12px] text-[color:var(--text)] opacity-60">
                {new Date(post.published_at ?? post.created_at).toLocaleDateString()}
              </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
