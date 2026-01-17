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

// --- Professional SEO & Image Indexing Metadata ---
export const metadata: Metadata = {
  title: "Kroma4K | High-Fidelity AI Wallpapers",
  description: "The world's premier destination for high-fidelity 8K AI generated wallpapers. Precision, Quality, and Artistry in every pixel.",
  keywords: ["AI Wallpapers", "4K Wallpapers", "8K Visuals", "Kroma4K", "Digital Art", "Desktop Backgrounds"],
  authors: [{ name: "Kroma4K Labs" }],
  metadataBase: new URL('https://kroma-4k.vercel.app'), // Mandatory for Absolute URLs
  
  // Google ko images crawl karne ke liye allow karna
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large', // Google Images mein badi image dikhane ke liye
      'max-snippet': -1,
    },
  },

  // OpenGraph (Social Media & Image Search indexing support)
  openGraph: {
    type: "website",
    url: "https://kroma-4k.vercel.app",
    title: "Kroma4K | Ultra HD AI Art",
    description: "Download stunning 8K AI wallpapers for free.",
    siteName: "Kroma4K",
    images: [
      {
        url: "/og-image.jpg", // Public folder mein ek image rakhen jo website share karte waqt dikhe
        width: 1200,
        height: 630,
        alt: "Kroma4K AI Wallpaper Gallery",
      },
    ],
  },

  // Twitter/X Cards
  twitter: {
    card: "summary_large_image",
    title: "Kroma4K | 8K AI Wallpapers",
    description: "The future of digital backgrounds.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white selection:bg-blue-600/30 overflow-x-hidden`}
      >
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}