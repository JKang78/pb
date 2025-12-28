import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";
import Nav from "../components/Nav";
import { getPublicBlog } from "../lib/db";
import { getUser } from "../lib/auth";

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif"
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "A quiet space for writing."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const blog = await getPublicBlog();
  const user = await getUser();
  const title = blog?.title ?? "My Blog";
  const theme = blog?.theme_json ?? null;

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <ThemeProvider theme={theme}>
          <Nav blogTitle={title} isOwner={Boolean(user)} />
          <main className="mx-auto w-full max-w-[var(--content-width)] px-6 pb-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
