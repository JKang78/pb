import { ReactNode } from "react";
import { normalizeTheme, Theme } from "../lib/db";

const widthMap: Record<Theme["width"], string> = {
  narrow: "640px",
  normal: "720px",
  wide: "860px"
};

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "").trim();
  const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(normalized, 16);
  if (Number.isNaN(value) || normalized.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ThemeProvider({
  children,
  theme
}: {
  children: ReactNode;
  theme?: Partial<Theme> | null;
}) {
  const normalized = normalizeTheme(theme ?? undefined);
  const borderColor = hexToRgba(normalized.colors.text, 0.18);
  const mutedText = hexToRgba(normalized.colors.text, 0.6);
  const fontClass =
    normalized.font === "mono"
      ? "font-mono"
      : normalized.font === "inter"
      ? "font-sans"
      : "font-body";

  return (
    <div
      id="theme-root"
      className={`min-h-screen template-${normalized.template} ${fontClass}`}
      style={{
        ["--bg" as string]: normalized.colors.background,
        ["--text" as string]: normalized.colors.text,
        ["--accent" as string]: normalized.colors.accent,
        ["--border" as string]: borderColor,
        ["--text-muted" as string]: mutedText,
        ["--content-width" as string]: widthMap[normalized.width],
        ["--base-font-size" as string]: `${normalized.baseFontSize}px`,
        ["--line-height" as string]: normalized.lineHeight,
        ["--letter-spacing" as string]: `${normalized.letterSpacing}em`
      }}
    >
      {children}
    </div>
  );
}
