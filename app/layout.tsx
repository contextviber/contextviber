import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContextViber - AI Context Management Tool",
  description: "Smart context management for AI conversations. Generate file trees, count tokens, and maintain conversation continuity with ChatGPT, Claude, and Cursor.",
  keywords: "AI context, file tree generator, token counter, ChatGPT, Claude, Cursor, developer tools",
  authors: [{ name: "ContextViber Team" }],
  openGraph: {
    title: "ContextViber - Never Lose Your AI Context Again",
    description: "Smart context management that keeps your AI conversations flowing",
    url: "https://contextviber.com",
    siteName: "ContextViber",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}