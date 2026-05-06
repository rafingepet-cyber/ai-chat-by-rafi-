import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat by Rafi",
  description: "AI Chat Assistant yang bisa ngobrol dan bikin kode - Powered by Groq",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
