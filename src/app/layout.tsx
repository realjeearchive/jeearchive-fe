import type { Metadata } from "next";
import "./globals.css";
import { AuthInitializer } from "./providers/AuthInitializer";
import { Toaster } from "sonner";
import RouteGuard from "@/components/auth/RouteGuard";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleAuthProviderWrapper } from "./providers/GoogleAuthProviderWrapper";

export const metadata: Metadata = {
  title: "JEE Mock Test Platform - jeearchive",
  description: "jeearchive provides the most realistic and comprehensive practice environment for JEE students, allowing them to test their knowledge and master every topic before the actual exam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 🔥 FIX: Added default background and text colors to the body to prevent the white flash */}
      <body style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', margin: 0 }}>
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
      </body> 
      
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}