export const dynamic = 'force-dynamic';
// Imports change karein
import { createClient } from '@supabase/supabase-js';
import { generateRandomPrompt } from "@/lib/promptGenerator";

// Supabase client initialize karein (Aap ise separate lib file mein bhi rakh sakte hain)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key use karein backend functions ke liye
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  const countParam = searchParams.get('count');
  const imageCount = countParam ? parseInt(countParam) : 3;

  if (key !== process.env.CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const categories = ["Anime", "Cyberpunk", "Nature", "Space", "Minimal", "Cars", "Abstract", "Architecture", "Fantasy", "Cinematic"];
  const colorPalette = ["Blue", "Red", "Purple", "Green", "Orange", "Pink", "Dark"];
  const deviceConfigs = [
    { label: "iPhone 15 Pro", width: 1179, height: 2556, slug: "iphone" },
    { label: "Samsung S24 Ultra", width: 1440, height: 3120, slug: "samsung" },
    { label: "MacBook Pro 16", width: 3456, height: 2234, slug: "laptop" },
    { label: "Desktop 4K", width: 3840, height: 2160, slug: "desktop" }
  ];

  try {
    const generationPromises = Array.from({ length: imageCount }).map(async () => {
      const config = deviceConfigs[Math.floor(Math.random() * deviceConfigs.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const assignedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      
      let basePrompt = "";
      try {
        basePrompt = generateRandomPrompt(category);
      } catch (err) {
        basePrompt = `A high-end ${category} masterpiece`;
      }

      const finalPrompt = `${basePrompt}, ${assignedColor} color palette, cinematic lighting, 8k resolution, highly detailed, photorealistic`;
      const seed = Math.floor(Math.random() * 2147483647);

      const apiUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(finalPrompt)}?model=flux&seed=${seed}&width=${config.width}&height=${config.height}&nologo=true&enhance=true`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`,
          'Referer': 'https://kroma-4k.vercel.app',
          'X-Source': 'Kroma4k'
        }
      });

      if (response.ok) {
        // --- SUPABASE INSERT START ---
        const { data, error } = await supabase
          .from('wallpapers') // Table ka naam
          .insert([
            {
              url: apiUrl,
              prompt: finalPrompt,
              category: category,
              color: assignedColor,
              device: config.label,
              device_slug: config.slug, // Database mein snake_case use karna better hota hai
              downloads: 0,
              likes: Math.floor(Math.random() * 8),
              tags: [category.toLowerCase(), assignedColor.toLowerCase(), "4k", "kroma4k"],
              // created_at automatically handles ho jayega agar table default set hai
              is_migrated: false,
            }
          ])
          .select(); // Inserted data wapas lene ke liye

        if (error) throw error;
        return data[0].id;
        // --- SUPABASE INSERT END ---
      }
      return null;
    });

    const results = await Promise.all(generationPromises);
    const successfulIds = results.filter(id => id !== null);

    return new Response(JSON.stringify({ 
        success: true, 
        count: successfulIds.length, 
        ids: successfulIds 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) { 
    console.error("Generator Error:", error.message);
    return new Response(JSON.stringify({ error: "Batch Generation Failed", details: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    }); 
  }
}