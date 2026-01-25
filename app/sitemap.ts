import { MetadataRoute } from 'next'
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  orderBy, 
  query, 
  limit 
} from "firebase/firestore";

// Google supports up to 50k, but Firebase fetches are fastest at 10k or less.
const MAX_URLS = 10000; 

export const revalidate = 86400; // Cache for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kroma-4k.vercel.app';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    // 2. Fetch only the most recent wallpapers (fastest query)
    const wallRef = collection(db, "wallpapers");
    const q = query(wallRef, orderBy("createdAt", "desc"), limit(MAX_URLS));
    
    const snapshot = await getDocs(q);
    
    const wallpaperEntries = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/wallpaper/${doc.id}`,
        lastModified: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    return [...staticPages, ...wallpaperEntries];
  } catch (error) {
    console.error("Sitemap fetch failed, returning static pages only:", error);
    return staticPages;
  }
}