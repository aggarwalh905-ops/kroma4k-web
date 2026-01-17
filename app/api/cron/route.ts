import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generateRandomPrompt } from "@/lib/promptGenerator";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  // Kitni images banani hai (Default 3)
  const countParam = searchParams.get('count');
  const imageCount = countParam ? parseInt(countParam) : 3;

  // 1. Security check
  if (key !== process.env.CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. Define standard categories and colors for database consistency
  const categories = [
    "Anime", "Cyberpunk", "Nature", "Space", "Minimal", "Cars", 
    "Abstract", "Architecture", "Fantasy", "Cinematic"
  ];

  const colorPalette = ["Blue", "Red", "Purple", "Green", "Orange", "Pink", "Dark"];

  const deviceConfigs = [
    { label: "iPhone 15 Pro", width: 1179, height: 2556, slug: "iphone" },
    { label: "Samsung S24 Ultra", width: 1440, height: 3120, slug: "samsung" },
    { label: "MacBook Pro 16", width: 3456, height: 2234, slug: "laptop" },
    { label: "Desktop 4K", width: 3840, height: 2160, slug: "desktop" }
  ];

  try {
    // Parallel processing ke liye task array banaya
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

      // 5. Pollinations Flux API URL
      const apiUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(finalPrompt)}?model=flux&seed=${seed}&width=${config.width}&height=${config.height}&nologo=true&enhance=true`;

      // 6. Fetch with Website Referrer (Important for Pollinations)
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`,
          'Referer': 'https://kroma-4k.vercel.app', // <--- Apni website URL yahan likhein
          'X-Source': 'Kroma4k'
        }
      });

      if (response.ok) {
        // 7. Save to Firestore
        const docRef = await addDoc(collection(db, "wallpapers"), {
          url: apiUrl,
          prompt: finalPrompt,
          category: category,
          color: assignedColor,
          device: config.label,
          deviceSlug: config.slug,
          downloads: 0,
          likes: Math.floor(Math.random() * 8),
          createdAt: serverTimestamp(),
          tags: [category.toLowerCase(), assignedColor.toLowerCase(), "4k", "kroma4k"]
        });
        return docRef.id;
      }
      return null;
    });

    // Saare tasks ek saath chalenge (Parallel)
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
    return new Response(JSON.stringify({ error: "Batch Generation Failed" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    }); 
  }
}