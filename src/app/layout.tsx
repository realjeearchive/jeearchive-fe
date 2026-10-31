import "./globals.css";
import { AuthInitializer } from "./providers/AuthInitializer";
import { Toaster } from "sonner";
import RouteGuard from "@/components/auth/RouteGuard";
import { GoogleAuthProviderWrapper } from "./providers/GoogleAuthProviderWrapper";
import Script from "next/script";
import { DeferredAnalytics } from "./providers/DeferredAnalytics";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeearchive.com"),

  title: "JEE Mock Test Platform - JEEArchive",
  description:
    "Practice JEE Main & Advanced with Chapter-wise PYQs, Mock Tests, Previous Year Papers and detailed performance analytics.",

  openGraph: {
    title: "JEE Mock Test Platform - JEEArchive",
    description:
      "Practice JEE Main & Advanced with Chapter-wise PYQs, Mock Tests, Previous Year Papers and detailed performance analytics.",
    url: "https://jeearchive.com",
    siteName: "JEEArchive",
    type: "website",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "JEEArchive",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "JEE Mock Test Platform - JEEArchive",
    description:
      "Practice JEE Main & Advanced with Chapter-wise PYQs, Mock Tests, Previous Year Papers and detailed performance analytics.",
    images: ["/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        <AuthInitializer>
          <GoogleAuthProviderWrapper>
            <RouteGuard>{children}</RouteGuard>
          </GoogleAuthProviderWrapper>
        </AuthInitializer>

        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: { fontSize: 14 },
          }}
        />

        {/* Google Analytics queue: tiny, runs early so the page view is
            recorded. gtag.js and Clarity themselves load on first
            interaction (or after 6s) via DeferredAnalytics. */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        <DeferredAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          clarityId={process.env.NEXT_PUBLIC_CLARITY_ID}
        />
      </body>
    </html>
  );
}