import { MetadataRoute } from 'next'
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  orderBy, 
  query, 
  limit, 
  startAfter, 
  getCountFromServer 
} from "firebase/firestore";

const IMAGES_PER_SITEMAP = 45000; // Staying under the 50k limit

export const revalidate = 86400; // Cache for 24 hours to save Firebase costs

export async function generateSitemaps() {
  try {
    const coll = collection(db, "wallpapers");
    const snapshot = await getCountFromServer(coll);
    const totalCount = snapshot.data().count;
    
    // Calculate how many sitemaps we need
    const numberOfSitemaps = Math.ceil(totalCount / IMAGES_PER_SITEMAP);
    
    // Returns [{ id: 0 }, { id: 1 }, ...]
    return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
  } catch (e) {
    console.error("Error generating sitemap IDs:", e);
    return [{ id: 0 }];
  }
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kroma-4k.vercel.app';
  const startAtOffset = id * IMAGES_PER_SITEMAP;

  // 1. Static Pages (Only in the first sitemap)
  const staticPages: MetadataRoute.Sitemap = id === 0 ? [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ] : [];

  // 2. Optimized Fetching
  // For very large datasets, we fetch only the necessary slice
  const wallRef = collection(db, "wallpapers");
  let q = query(wallRef, orderBy("createdAt", "desc"), limit(IMAGES_PER_SITEMAP));

  if (id > 0) {
    // Get the last document of the previous batch to use as a cursor
    const prevQuery = query(wallRef, orderBy("createdAt", "desc"), limit(startAtOffset));
    const prevSnap = await getDocs(prevQuery);
    const lastVisible = prevSnap.docs[prevSnap.docs.length - 1];
    q = query(wallRef, orderBy("createdAt", "desc"), startAfter(lastVisible), limit(IMAGES_PER_SITEMAP));
  }

  const snapshot = await getDocs(q);
  
  const wallpaperEntries = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${baseUrl}/wallpaper/${doc.id}`,
      // Fallback to current date if createdAt is missing
      lastModified: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  return [...staticPages, ...wallpaperEntries];
}