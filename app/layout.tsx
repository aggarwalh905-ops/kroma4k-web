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

// --- Professional SEO Metadata ---
export const metadata: Metadata = {
  title: "Kroma4K | High-Fidelity AI Wallpapers",
  description: "The world's premier destination for high-fidelity 8K AI generated wallpapers. Precision, Quality, and Artistry in every pixel.",
  keywords: ["AI Wallpapers", "4K Wallpapers", "8K Visuals", "Kroma4K", "Digital Art"],
  authors: [{ name: "Kroma4K Labs" }],
  icons: {
    icon: "/favicon.ico", // Make sure you have an icon in your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white selection:bg-blue-600/30`}
      >
        {/* The main wrapper ensures your background stays dark across all pages */}
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}