import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EarlyOtter",
  description: "Your morning schedule, perfectly synced.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
