import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Bhavesh OS — Digital HQ",
    template: "%s | Bhavesh OS",
  },
  description:
    "Bhavesh Katragadda's personal digital operating system — cybersecurity, projects, journal, and life documentation.",
  keywords: ["cybersecurity", "portfolio", "developer", "CTF", "hacking", "blog"],
  authors: [{ name: "Bhavesh Katragadda" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: "Bhavesh OS",
    title: "Bhavesh OS — Digital HQ",
    description:
      "Cybersecurity student, builder, Linux enthusiast. Documenting the journey.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavesh OS",
    description: "Cybersecurity student, builder, Linux enthusiast.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen dark:bg-[#0a0a0a] dark:text-[#e5e5e5]">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
