import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/wallpaper/', // Wallpapers ko high priority crawl karne ke liye
      ],
      disallow: [
        '/api/',       // API routes ko crawl karne ki zaroorat nahi hai
        '/admin/',     // Agar koi admin panel hai toh use hide rakhein
        '/_next/',     // Next.js internal files ko skip karein
      ],
    },
    sitemap: 'https://kroma-4k.vercel.app/sitemap.xml',
  }
}