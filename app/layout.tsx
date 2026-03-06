import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retirement Savings Calculator",
  description: "See how long your savings will last in retirement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
