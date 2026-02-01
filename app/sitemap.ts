import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// Supabase client initialize karein
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const ITEMS_PER_SITEMAP = 20000;

export async function generateSitemaps() {
  const { count } = await supabase
    .from('wallpapers')
    .select('*', { count: 'exact', head: true });

  const total = count || 0;
  const numberOfSitemaps = Math.max(1, Math.ceil(total / ITEMS_PER_SITEMAP));
  
  return Array.from({ length: numberOfSitemaps }, (_, id) => ({ id }));
}

export default async function sitemap(props: any): Promise<MetadataRoute.Sitemap> {
  const params = await props;
  const sitemapId = typeof params.id !== 'undefined' ? Number(params.id) : 0;
  const baseUrl = 'https://kroma-4k.vercel.app';
  
  const safeId = isNaN(sitemapId) ? 0 : sitemapId;
  const start = safeId * ITEMS_PER_SITEMAP;
  const end = start + ITEMS_PER_SITEMAP - 1;

  // IMPORTANT: Supabase service role key 1000 ki limit bypass karne deti hai
  const { data, error } = await supabase
    .from('wallpapers')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error || !data) {
    console.error("❌ Fetch Error:", error?.message);
    return [];
  }

  const staticPages: MetadataRoute.Sitemap = safeId === 0 ? [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ] : [];

  const wallpaperEntries = data.map((item) => ({
    url: `${baseUrl}/wallpaper/${item.id}`,
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  console.log(`🚀 SITEMAP ${safeId} generated with ${wallpaperEntries.length} links`);

  return [...staticPages, ...wallpaperEntries];
}

export const revalidate = 3600;