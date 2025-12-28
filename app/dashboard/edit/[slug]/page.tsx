import { notFound } from "next/navigation";
import { requireOwner } from "../../../../lib/auth";
import { getOwnerPostBySlug, normalizeTheme, Theme } from "../../../../lib/db";
import PostEditorForm from "../../../../components/PostEditorForm";
import { updatePostAction } from "../../actions";
import WritingSettings from "../../../../components/WritingSettings";

export default async function EditPostPage({
  params
}: {
  params: { slug: string };
}) {
  const { blog } = await requireOwner();
  const post = await getOwnerPostBySlug(blog.id, params.slug);
  const theme = normalizeTheme(blog.theme_json as Theme);

  if (!post) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <h1 className="text-[12px] uppercase tracking-[0.2em] text-muted">Edit post</h1>
      <WritingSettings theme={theme} />
      <PostEditorForm
        action={updatePostAction.bind(null, post.id)}
        initialTitle={post.title}
        initialVisibility={post.visibility}
        initialContent={post.content_json}
        postId={post.id}
        submitLabel="Save"
      />
    </section>
  );
}
