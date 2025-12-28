import { generateHTML, generateText, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null
      }
    };
  },

  parseHTML() {
    return [{ tag: "iframe[data-video]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      {
        ...HTMLAttributes,
        "data-video": "true",
        frameborder: "0",
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowfullscreen: "true"
      }
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});

export const editorExtensions = [
  StarterKit,
  Link.configure({
    openOnClick: false
  }),
  Image,
  VideoEmbed,
  Placeholder.configure({
    placeholder: "Write quietly."
  })
];

export function renderContent(content: unknown) {
  return generateHTML(content ?? { type: "doc", content: [] }, editorExtensions);
}

function extractStoragePath(src: string) {
  if (src.startsWith("/api/media?path=")) {
    return null;
  }
  try {
    const url = new URL(src, "http://local");
    const pathname = url.pathname;
    const publicMarker = "/storage/v1/object/public/media/";
    const signedMarker = "/storage/v1/object/sign/media/";
    if (pathname.includes(publicMarker)) {
      return decodeURIComponent(pathname.split(publicMarker)[1] ?? "");
    }
    if (pathname.includes(signedMarker)) {
      return decodeURIComponent(pathname.split(signedMarker)[1] ?? "");
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeContentImages(content: unknown): unknown {
  if (!content || typeof content !== "object") {
    return content;
  }

  const node = content as { type?: string; attrs?: Record<string, any>; content?: unknown[] };
  const nextNode: typeof node = { ...node };

  if (node.type === "image" && node.attrs?.src) {
    const path = extractStoragePath(String(node.attrs.src));
    if (path) {
      nextNode.attrs = {
        ...node.attrs,
        src: `/api/media?path=${encodeURIComponent(path)}`
      };
    }
  }

  if (Array.isArray(node.content)) {
    nextNode.content = node.content.map((child) => normalizeContentImages(child));
  }

  return nextNode;
}

export function excerptFromContent(content: unknown, maxLength = 160) {
  const text = generateText(content ?? { type: "doc", content: [] }, editorExtensions).trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
}
