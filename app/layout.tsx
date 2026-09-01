import type { Metadata } from "next";
import "./globals.css";
import { imagePath } from "./lib/image-path";

const siteUrl = "https://active-learning-kyle.github.io/ENGG2202-Teach-to-Learn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ENGG2202 Engineering Challenges II | HKU Engineering",
    template: "%s | ENGG2202 Engineering Challenges II",
  },
  description:
    "The ENGG2202 Engineering Challenges II course hub for HKU students: Green Technology projects, six project Gates, student guidance, assessment and open engineering examples.",
  keywords: [
    "ENGG2202",
    "Teach to Learn",
    "Active Learning",
    "HKU Engineering",
    "Green Technology",
    "Project-Based Learning",
  ],
  alternates: {
    canonical: `${siteUrl}/`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/`,
    siteName: "ENGG2202 Engineering Challenges II",
    title: "ENGG2202 Engineering Challenges II | HKU Engineering",
    description:
      "Green Technology projects, six project Gates, student guidance, assessment and open engineering examples for ENGG2202 at HKU.",
  },
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: "ENGG2202 Engineering Challenges II",
              description:
                "An HKU Engineering course in which students develop Green Technology projects through six evidence-led project Gates.",
              url: `${siteUrl}/`,
              provider: {
                "@type": "CollegeOrUniversity",
                name: "The University of Hong Kong",
                sameAs: "https://www.hku.hk/",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
