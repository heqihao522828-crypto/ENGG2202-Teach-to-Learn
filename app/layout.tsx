import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Active Learning | HKU Engineering",
  description: "Active Learning website, Faculty of Engineering, The University of Hong Kong",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
