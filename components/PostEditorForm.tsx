"use client";

import { useState } from "react";
import Editor from "./Editor";

export default function PostEditorForm({
  action,
  initialTitle,
  initialVisibility,
  initialContent,
  postId,
  submitLabel
}: {
  action: (formData: FormData) => void;
  initialTitle: string;
  initialVisibility: "public" | "private";
  initialContent: unknown;
  postId: string | null;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [visibility, setVisibility] = useState<"public" | "private">(initialVisibility);
  const [draftPostId, setDraftPostId] = useState<string | null>(postId);

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Untitled"
            className="input-minimal editor-title"
          />
        </div>
        <div className="flex items-center gap-3 text-[12px] text-muted">
          <span className="uppercase tracking-[0.18em]">Visibility</span>
          <select
            name="visibility"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as "public" | "private")}
            className="input-minimal w-auto text-[12px]"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>
      <Editor
        initialContent={initialContent}
        postId={draftPostId}
        title={title}
        visibility={visibility}
        onPostIdChange={(nextId) => setDraftPostId(nextId)}
      />
      {draftPostId && <input type="hidden" name="draft_post_id" value={draftPostId} />}
      <button type="submit" className="editor-button text-[12px] uppercase tracking-[0.18em]">
        {submitLabel}
      </button>
    </form>
  );
}
