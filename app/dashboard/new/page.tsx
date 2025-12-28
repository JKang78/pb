import { requireOwner } from "../../../lib/auth";
import PostEditorForm from "../../../components/PostEditorForm";
import WritingSettings from "../../../components/WritingSettings";
import { normalizeTheme, Theme } from "../../../lib/db";
import { createPostAction } from "../actions";

export default async function NewPostPage() {
  const { blog } = await requireOwner();
  const theme = normalizeTheme(blog.theme_json as Theme);

  return (
    <section className="space-y-8">
      <h1 className="text-[12px] uppercase tracking-[0.2em] text-muted">New post</h1>
      <WritingSettings theme={theme} />
      <PostEditorForm
        action={createPostAction}
        initialTitle=""
        initialVisibility="private"
        initialContent={{ type: "doc", content: [] }}
        postId={null}
        submitLabel="Publish"
      />
    </section>
  );
}
