import "./globals.css";
import { AuthInitializer } from "./providers/AuthInitializer";
import { Toaster } from "sonner";
import RouteGuard from "@/components/auth/RouteGuard";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleAuthProviderWrapper } from "./providers/GoogleAuthProviderWrapper";
import Script from "next/script";

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

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);
              t.async=1;
              t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}
        </Script>
      </body>

      {/* Google Analytics */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}