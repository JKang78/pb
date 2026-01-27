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
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="pointer-events-auto w-full max-w-[280px] border border-sky-200/70 bg-sky-100 px-5 py-4 text-sm text-sky-900">
        <div className="flex items-start justify-between gap-3">
          <p className="leading-snug">Stop overthinking :)</p>
          <button
            aria-label="Dismiss message"
            className="text-sky-700/80 hover:text-sky-900"
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
