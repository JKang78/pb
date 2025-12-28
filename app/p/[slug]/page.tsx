import { notFound } from "next/navigation";
import { getPublicPostBySlug } from "../../../lib/db";
import ViewTracker from "../../../components/ViewTracker";
import PostContent from "../../../components/PostContent";

export default async function PublicPostPage({
  params
}: {
  params: { slug: string };
}) {
  const post = await getPublicPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-10">
      <ViewTracker slug={post.slug} />
      <header className="space-y-3">
        <h1 className="text-[30px] leading-tight">{post.title}</h1>
        <p className="text-[12px] text-[color:var(--text)] opacity-60">
          {new Date(post.published_at ?? post.created_at).toLocaleDateString()}
        </p>
      </header>
      <PostContent content={post.content_json} />
    </article>
  );
}
