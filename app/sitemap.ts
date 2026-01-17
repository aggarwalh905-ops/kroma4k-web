import { MetadataRoute } from 'next'
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// --- YE DO LINES ZARUR ADD KAREIN ---
export const dynamic = 'force-dynamic'; 
export const revalidate = 3600; // Har 1 ghante mein naya data check karega
// ------------------------------------

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
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const wallpapers = await getWallpapers();
  
  const wallpaperEntries: MetadataRoute.Sitemap = wallpapers.map((img: any) => ({
    url: `${baseUrl}/wallpaper/${img.id}`, 
    // Safe timestamp handling
    lastModified: img.createdAt?.toDate ? img.createdAt.toDate() : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...wallpaperEntries]
}