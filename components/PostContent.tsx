"use client";

import { useMemo } from "react";
import { normalizeContentImages, renderContent } from "../lib/tiptap";

export default function PostContent({ content }: { content: unknown }) {
  const html = useMemo(() => {
    const normalized = normalizeContentImages(content);
    return renderContent(normalized);
  }, [content]);

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
