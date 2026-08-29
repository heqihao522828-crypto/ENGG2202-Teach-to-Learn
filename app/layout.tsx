import type { Metadata } from "next";
import "./globals.css";
import { imagePath } from "./lib/image-path";

export const metadata: Metadata = {
  title: {
    default: "ENGG2202 · Teach to Learn | HKU Engineering",
    template: "%s | ENGG2202 Teach to Learn",
  },
  description:
    "An ENGG2202 Active Learning project journey where students learn through building, testing, explaining, teaching and contributing.",
  keywords: [
    "ENGG2202",
    "Teach to Learn",
    "Active Learning",
    "HKU Engineering",
    "Green Technology",
    "Project-Based Learning",
  ],
  icons: {
    icon: imagePath("/icon.png"),
    shortcut: imagePath("/icon.png"),
    apple: imagePath("/icon.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
