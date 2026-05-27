import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JEE Archive - Free JEE Main & Advanced Mock Tests with NTA Interface",
  description:
    "Start practicing for JEE Main 2026 with real NTA interface. Access 10,000+ chapter-wise PYQs, mock tests, and get instant results with detailed solutions. Free online test series.",
  alternates: {
    canonical: "https://jeearchive.com",
  },
  openGraph: {
    title: "JEE Archive - Free JEE Main & Advanced Mock Tests",
    description:
      "Practice JEE mock tests with real NTA interface. Chapter-wise PYQs, instant results, and detailed solutions. Free for all JEE aspirants.",
    url: "https://jeearchive.com",
    siteName: "JEE Archive",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JEE Archive - Mock Test Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Archive - Free JEE Main & Advanced Mock Tests",
    description:
      "Practice JEE mock tests with real NTA interface. Chapter-wise PYQs, instant results, and detailed solutions.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function page() {
  redirect("/login");
}