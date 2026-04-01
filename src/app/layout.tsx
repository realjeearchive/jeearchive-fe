import type { Metadata } from "next";
import "./globals.css";
import { AuthInitializer } from "./providers/AuthInitializer";
import { Toaster } from "sonner";
import RouteGuard from "@/components/auth/RouteGuard";
import Script from "next/script";


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
      <body>
        <AuthInitializer>
          <RouteGuard>{children}</RouteGuard>
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
    </html>
  );
}
