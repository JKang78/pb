"use client";

import { useEffect, useMemo, useState } from "react";

type OverthinkingPopupProps = {
  title: string;
};

export default function OverthinkingPopup({ title }: OverthinkingPopupProps) {
  const [visible, setVisible] = useState(false);

  const shouldShow = useMemo(() => {
    const normalized = title.trim().toLowerCase();
    return normalized === "life of having a girlfriend...";
  }, [title]);

  useEffect(() => {
    if (shouldShow) {
      setVisible(true);
    }
  }, [shouldShow]);

  if (!shouldShow || !visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50">
      <div className="pointer-events-auto max-w-[220px] border border-white/15 bg-black/70 px-4 py-3 text-sm text-white/90">
        <div className="flex items-start justify-between gap-3">
          <p className="leading-snug">Stop overthinking :)</p>
          <button
            aria-label="Dismiss message"
            className="text-white/60 hover:text-white/90"
            onClick={() => setVisible(false)}
            type="button"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

