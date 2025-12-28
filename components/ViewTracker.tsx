"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/view/${slug}`, { method: "POST" });
  }, [slug]);

  return null;
}
