import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angelo Selitto | Senior Systems Architect",
  description: "25+ years in enterprise systems & healthcare IT. Epic EHR, Imprivata SSO, deterministic AI. Founder of VerifyMedCodes & Claudit.",
  keywords: ["Systems Architect", "Healthcare IT", "Epic EHR", "Imprivata", "AI", "Solutions Architect"],
  authors: [{ name: "Angelo Selitto" }],
  openGraph: {
    title: "Angelo Selitto | Senior Systems Architect",
    description: "25+ years in enterprise systems & healthcare IT. Epic EHR, Imprivata SSO, deterministic AI.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
