import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generateRandomPrompt } from "@/lib/promptGenerator";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  // 1. Security check for Cron job (set this in your .env.local)
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
    const results = [];
    
    // Generating 10 images per cron hit
    for (let i = 0; i < 10; i++) {
      const config = deviceConfigs[Math.floor(Math.random() * deviceConfigs.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const assignedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      
      // 3. Get Base Prompt with Error Handling
      let basePrompt = "";
      try {
        // We ensure category is passed correctly. 
        // If your lib expects specific types, use: category as any
        basePrompt = generateRandomPrompt(category);
      } catch (err) {
        basePrompt = `A high-end ${category} masterpiece`;
      }

      // 4. Final Prompt Engineering (Ensures Color and Quality)
      const finalPrompt = `${basePrompt}, ${assignedColor} color palette, cinematic lighting, 8k resolution, highly detailed, photorealistic`;
      const seed = Math.floor(Math.random() * 2147483647);

      // 5. Pollinations Flux API URL
      const apiUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(finalPrompt)}?model=flux&seed=${seed}&width=${config.width}&height=${config.height}&nologo=true&enhance=true`;

      // 6. Fetch using API Key in Headers
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`
        }
      });

      if (response.ok) {
        // 7. Save to Firestore (Clean Schema: No views, added color)
        const docRef = await addDoc(collection(db, "wallpapers"), {
          url: apiUrl,
          prompt: finalPrompt,
          category: category,
          color: assignedColor, // Crucial for your Palette Filter
          device: config.label,
          deviceSlug: config.slug,
          downloads: 0,
          likes: Math.floor(Math.random() * 8), // Initial trending boost
          createdAt: serverTimestamp(),
          tags: [category.toLowerCase(), assignedColor.toLowerCase(), "4k", "kroma4k"]
        });
        results.push(docRef.id);
      }
    }

    return new Response(JSON.stringify({ 
        success: true, 
        count: results.length, 
        ids: results 
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