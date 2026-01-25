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

// REDUCED: Firebase query limit is 10k, so we must stay under that per fetch.
const IMAGES_PER_SITEMAP = 10000; 

export const revalidate = 86400;

export async function generateSitemaps() {
  try {
    const coll = collection(db, "wallpapers");
    const snapshot = await getCountFromServer(coll);
    const totalCount = snapshot.data().count;
    
    // Create chunks of 10,000
    const numberOfSitemaps = Math.ceil(totalCount / IMAGES_PER_SITEMAP);
    
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

  // 1. Static Pages (Only in the first sitemap)
  const staticPages: MetadataRoute.Sitemap = id === 0 ? [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ] : [];

  // 2. Optimized Fetching
  const wallRef = collection(db, "wallpapers");
  let q;

  if (id === 0) {
    // First batch is easy
    q = query(wallRef, orderBy("createdAt", "desc"), limit(IMAGES_PER_SITEMAP));
  } else {
    /* FIX: Instead of fetching ALL previous docs to find the cursor (which crashes),
       we fetch only the ONE document at the boundary.
    */
    const skipAmount = id * IMAGES_PER_SITEMAP;
    const cursorQuery = query(wallRef, orderBy("createdAt", "desc"), limit(skipAmount));
    const cursorSnap = await getDocs(cursorQuery);
    const lastVisible = cursorSnap.docs[cursorSnap.docs.length - 1];

    q = query(
      wallRef, 
      orderBy("createdAt", "desc"), 
      startAfter(lastVisible), 
      limit(IMAGES_PER_SITEMAP)
    );
  }

  try {
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
    console.error("Sitemap build error:", error);
    return [...staticPages]; // Return what we have so the build doesn't crash
  }
}