import { MetadataRoute } from 'next'
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit, startAfter } from "firebase/firestore";

const IMAGES_PER_SITEMAP = 40000; // Safe limit (max 50,000)

// 1. Ye function batayega ki total kitne sitemaps banane hain
export async function generateSitemaps() {
  // Ideally, aap ek alag 'stats' doc se total count lein fast performance ke liye
  // Filhal hum assume kar rahe hain aapke paas 120,000 images hain (3 sitemaps)
  // Aap total count fetch karke (totalCount / IMAGES_PER_SITEMAP) calculate kar sakte hain
  return [{ id: 0 }, { id: 1 }, { id: 2 }]; 
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kroma-4k.vercel.app';
  
  // Pehla sitemap (id: 0) static pages bhi include karega
  const staticPages = id === 0 ? [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ] : [];

  // Pagination logic for Firestore
  const wallRef = collection(db, "wallpapers");
  let q = query(wallRef, orderBy("createdAt", "desc"), limit(IMAGES_PER_SITEMAP));

  // Agar id > 0 hai, toh skip logic lagayein
  if (id > 0) {
    // Note: Firestore mein skip kerna mahnga ho sakta hai. 
    // Best practice: Sitemap generation ke waqt IDs ka range use karein.
    // Filhal hum simple offset logic use kar rahe hain:
    const prevSnap = await getDocs(query(wallRef, orderBy("createdAt", "desc"), limit(id * IMAGES_PER_SITEMAP)));
    const lastVisible = prevSnap.docs[prevSnap.docs.length - 1];
    q = query(wallRef, orderBy("createdAt", "desc"), startAfter(lastVisible), limit(IMAGES_PER_SITEMAP));
  }

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

  return [...(staticPages as any), ...wallpaperEntries];
}