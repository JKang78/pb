import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-serif)", "Iowan Old Style", "Baskerville", "Times New Roman", "serif"],
        body: ["var(--font-serif)", "Iowan Old Style", "Charter", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Iowan Old Style", "Charter", "Georgia", "serif"],
        mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
        sans: ["var(--font-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
