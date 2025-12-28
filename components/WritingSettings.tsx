"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Theme } from "../lib/db";

const fontClassMap: Record<Theme["font"], string> = {
  inter: "font-sans",
  serif: "font-body",
  mono: "font-mono"
};

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "").trim();
  const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(normalized, 16);
  if (Number.isNaN(value) || normalized.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function WritingSettings({ theme }: { theme: Theme }) {
  const [font, setFont] = useState<Theme["font"]>(theme.font);
  const [baseFontSize, setBaseFontSize] = useState<Theme["baseFontSize"]>(theme.baseFontSize);
  const [lineHeight, setLineHeight] = useState<Theme["lineHeight"]>(theme.lineHeight);
  const [letterSpacing, setLetterSpacing] = useState<Theme["letterSpacing"]>(theme.letterSpacing ?? 0);
  const [textColor, setTextColor] = useState<string>(theme.colors.text);
  const [status, setStatus] = useState<string>("");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  const payload = useMemo(
    () => ({ font, baseFontSize, lineHeight, letterSpacing, text: textColor }),
    [font, baseFontSize, lineHeight, letterSpacing, textColor]
  );

  const applyLocalTheme = useCallback(() => {
    const root = document.getElementById("theme-root");
    if (!root) {
      return;
    }

    root.classList.remove("font-sans", "font-body", "font-mono");
    root.classList.add(fontClassMap[font]);
    root.style.setProperty("--base-font-size", `${baseFontSize}px`);
    root.style.setProperty("--line-height", String(lineHeight));
    root.style.setProperty("--letter-spacing", `${letterSpacing}em`);
    root.style.setProperty("--text", textColor);
    root.style.color = textColor;
    document.documentElement.style.setProperty("--text", textColor);
    document.documentElement.style.setProperty("--text-muted", hexToRgba(textColor, 0.6));
    document.documentElement.style.setProperty("--border", hexToRgba(textColor, 0.18));
    root.style.setProperty("--text-muted", hexToRgba(textColor, 0.6));
    root.style.setProperty("--border", hexToRgba(textColor, 0.18));
  }, [font, baseFontSize, lineHeight, letterSpacing, textColor]);

  const scheduleSave = useCallback(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(async () => {
      setStatus("Saving...");
      const response = await fetch("/api/theme/writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setStatus("Save failed");
        return;
      }

      setStatus("Saved");
    }, 400);
  }, [payload]);

  useEffect(() => {
    applyLocalTheme();
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    scheduleSave();
  }, [applyLocalTheme, scheduleSave, payload]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  return (
    <section className="settings-panel">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">Writing style</h2>
        <span className="text-[11px] text-muted">{status}</span>
      </div>

      <div className="settings-grid">
        <div className="setting-row">
          <span className="setting-label">Font</span>
          <div className="segmented">
            {(["serif", "inter", "mono"] as Theme["font"][]).map((value) => (
              <button
                key={value}
                type="button"
                className="segmented-button"
                data-active={font === value}
                onClick={() => setFont(value)}
              >
                {value === "serif" ? "Serif" : value === "inter" ? "Sans" : "Mono"}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">Text size</span>
          <div className="segmented">
            {([14, 16, 18, 20, 22, 24] as Theme["baseFontSize"][]).map((value) => (
              <button
                key={value}
                type="button"
                className="segmented-button"
                data-active={baseFontSize === value}
                onClick={() => setBaseFontSize(value)}
              >
                {value}px
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">Line height</span>
          <div className="segmented">
            {([1.4, 1.5, 1.6, 1.8, 2.0] as Theme["lineHeight"][]).map((value) => (
              <button
                key={value}
                type="button"
                className="segmented-button"
                data-active={lineHeight === value}
                onClick={() => setLineHeight(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">Letter spacing</span>
          <div className="segmented">
            {([0, 0.01, 0.02] as Theme["letterSpacing"][]).map((value) => (
              <button
                key={value}
                type="button"
                className="segmented-button"
                data-active={letterSpacing === value}
                onClick={() => setLetterSpacing(value)}
              >
                {value === 0 ? "Tight" : value === 0.01 ? "Normal" : "Open"}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">Text color</span>
          <div className="color-row">
            <input
              type="color"
              aria-label="Text color"
              value={textColor}
              onChange={(event) => setTextColor(event.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={textColor}
              onChange={(event) => setTextColor(event.target.value)}
              className="input-minimal"
            />
            <span className="text-[11px] text-muted">Applies to all text.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
