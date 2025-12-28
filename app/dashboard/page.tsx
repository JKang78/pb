import Link from "next/link";
import { requireOwner } from "../../lib/auth";
import { getOwnerPosts } from "../../lib/db";
import { deletePostAction, toggleVisibilityAction } from "./actions";
import ConfirmDeleteForm from "../../components/ConfirmDeleteForm";

export default async function DashboardPage() {
  const { blog } = await requireOwner();
  const posts = await getOwnerPosts(blog.id);

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">All posts, quiet and private.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/new" className="border border-[color:var(--text)] px-4 py-2 text-sm">
            New post
          </Link>
          <Link href="/dashboard/theme" className="border border-[color:var(--text)] px-4 py-2 text-sm">
            Theme
          </Link>
        </div>
      </header>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="flex flex-col gap-3 border-b border-gray-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-medium">{post.title}</h2>
                  <p className="text-xs text-gray-500">
                    Updated {new Date(post.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="border border-gray-400 px-2 py-1">
                    {post.visibility}
                  </span>
                  <span className="text-gray-500">Views {post.view_count}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Link href={`/dashboard/edit/${post.slug}`} className="border border-[color:var(--text)] px-3 py-1">
                  Edit
                </Link>
                <form
                  action={toggleVisibilityAction.bind(
                    null,
                    post.id,
                    post.slug,
                    post.visibility === "public" ? "private" : "public"
                  )}
                >
                  <button type="submit" className="border border-[color:var(--text)] px-3 py-1">
                    Make {post.visibility === "public" ? "private" : "public"}
                  </button>
                </form>
                <ConfirmDeleteForm action={deletePostAction.bind(null, post.id, post.slug)} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
