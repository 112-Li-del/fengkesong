import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "枫松客 · 智能助手",
  description: "与智能助手进行对话",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="h-dvh">{children}</body>
    </html>
  );
}
