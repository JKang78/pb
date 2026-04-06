"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions, normalizeContentImages } from "../lib/tiptap";

function normalizeVideoUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const idFromQuery = parsed.searchParams.get("v");
      if (idFromQuery) {
        return `https://www.youtube.com/embed/${idFromQuery}`;
      }
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
      if (parts[0] === "embed" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

export default function Editor({
  initialContent,
  postId,
  title,
  visibility,
  onPostIdChange
}: {
  initialContent: unknown;
  postId: string | null;
  title: string;
  visibility: "public" | "private";
  onPostIdChange?: (postId: string) => void;
}) {
  const [currentPostId, setCurrentPostId] = useState<string | null>(postId);
  const [status, setStatus] = useState<string>("");
  const [contentJson, setContentJson] = useState<unknown>(
    initialContent ?? { type: "doc", content: [] }
  );
  const pendingSave = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedInitialContent = useMemo(
    () => normalizeContentImages(initialContent),
    [initialContent]
  );

  const editor = useEditor({
    extensions: editorExtensions,
    content: normalizedInitialContent ?? { type: "doc", content: [] },
    editorProps: {
      attributes: {
        class:
          "prose-content editor-content focus:outline-none max-w-none"
      }
    }
  });

  const saveDraft = useCallback(
    async (content: unknown) => {
      setStatus("Saving...");
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: currentPostId,
          title,
          visibility,
          content
        })
      });

      if (!response.ok) {
        setStatus("Autosave failed");
        return;
      }

      const data = (await response.json()) as { postId: string };
      if (data.postId && data.postId !== currentPostId) {
        setCurrentPostId(data.postId);
        onPostIdChange?.(data.postId);
      }
      setStatus("Saved");
    },
    [currentPostId, title, visibility, onPostIdChange]
  );

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      const nextJson = editor.getJSON();
      setContentJson(nextJson);
      if (pendingSave.current) {
        clearTimeout(pendingSave.current);
      }
      pendingSave.current = setTimeout(() => {
        saveDraft(nextJson);
      }, 2500);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, saveDraft]);

  const handleImageUpload = async (file: File) => {
    setStatus("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      setStatus(error.error ?? "Upload failed");
      return;
    }

    const data = (await response.json()) as { path?: string };
    if (data.path) {
      editor?.chain().focus().setImage({ src: `/api/media?path=${encodeURIComponent(data.path)}` }).run();
      setStatus("Saved");
    } else {
      setStatus("Upload failed");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="editor-toolbar flex flex-wrap text-xs">
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet
        </button>
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </button>
        <button
          type="button"
          className="editor-button"
          aria-pressed={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (!url) {
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          Link
        </button>
        <label className="editor-button cursor-pointer">
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
          />
        </label>
        <button
          type="button"
          className="editor-button"
          onClick={() => {
            const url = window.prompt("Paste a YouTube or Vimeo URL");
            if (!url) {
              return;
            }
            const src = normalizeVideoUrl(url);
            editor
              .chain()
              .focus()
              .insertContent({ type: "videoEmbed", attrs: { src } })
              .run();
          }}
        >
          Video
        </button>
        <span className="ml-auto text-xs text-muted">{status}</span>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name="content_json" value={JSON.stringify(contentJson)} />
    </div>
  );
}
