import { MetadataRoute } from 'next'
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Firestore se saare wallpaper documents fetch karne ka function
async function getWallpapers() {
  try {
    const snapshot = await getDocs(collection(db, "wallpapers"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Sitemap fetch error:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kroma-4k.vercel.app'
  
  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/license`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // 2. Dynamic Wallpaper Pages (Aapke naye /wallpaper/[id] structure ke liye)
  const wallpapers = await getWallpapers();
  
  const wallpaperEntries: MetadataRoute.Sitemap = wallpapers.map((img: any) => ({
    url: `${baseUrl}/wallpaper/${img.id}`, 
    lastModified: img.createdAt?.toDate?.() || new Date(), // Agar timestamp hai toh wahi use hoga
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...wallpaperEntries]
}