import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briefly — Executive Communication Coach",
  description: "Daily workplace language practice for confident leaders.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
