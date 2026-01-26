export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { generateRandomPrompt } from "@/lib/promptGenerator";
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

const generateId = () => crypto.randomBytes(10).toString('hex');

/**
 * Uploads an image to ImgBB by fetching it from Pollinations first.
 * Ensures the API Key is used and sends the image as a Blob.
 */
async function uploadToImgBB(pollinationsUrl: string) {
  try {
    // 1. Fetch the image from Pollinations using the API Key
    const pollinationsRes = await fetch(pollinationsUrl, {
      headers: { 'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}` }
    });

    if (!pollinationsRes.ok) throw new Error(`Pollinations Error: ${pollinationsRes.status}`);
    
    const imageBlob = await pollinationsRes.blob();

    // 2. Upload that Blob to ImgBB
    const formData = new FormData();
    formData.append('image', imageBlob);
    
    const imgBBRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    const data = await imgBBRes.json();
    return data.success ? data.data.url : null;
  } catch (error) {
    console.error("❌ ImgBB Upload Error:", error);
    return null;
  }
}

export async function GET(req: Request) {
  console.log("🚀 --- KROMA 4K CRON START ---");
  
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const countParam = searchParams.get('count');
  const imageCount = countParam ? parseInt(countParam) : 1;

  if (key !== process.env.CRON_SECRET) {
    console.error("❌ Auth Failed: Invalid Key");
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
    const results = [];

    for (let i = 0; i < imageCount; i++) {
      console.log(`\n📸 Processing Image ${i + 1}/${imageCount}...`);
      
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
      
      // The generated Pollinations URL
      const pollinationsUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(finalPrompt)}?model=flux&seed=${seed}&width=${config.width}&height=${config.height}&nologo=true&enhance=true`;

      console.log(`🔗 Pollinations URL: ${pollinationsUrl}`);

      // --- STEP 1: UPLOAD TO IMGBB ---
      const imgBBUrl = await uploadToImgBB(pollinationsUrl);

      if (imgBBUrl) {
        const newId = generateId();
        const tagList = [category.toLowerCase(), assignedColor.toLowerCase(), "4k", "kroma4k"];
        
        // --- STEP 2: SUPABASE INSERT ---
        // url = Pollinations URL
        // permanent_url = ImgBB URL
        const { data: record, error: dbError } = await supabase
          .from('wallpapers')
          .insert([{
              id: newId, 
              url: pollinationsUrl, 
              permanent_url: imgBBUrl, 
              prompt: finalPrompt,
              category: category,
              color: assignedColor,
              device_slug: config.slug,
              downloads: 0,
              likes: Math.floor(Math.random() * 15),
              tags: tagList,
              is_migrated: true,
          }])
          .select().single();

        if (dbError) {
          console.error("❌ DB Insert Error:", dbError.message);
          continue;
        }
        console.log(`💾 Saved to DB: ${newId}`);

        // --- STEP 3: TELEGRAM POST ---
        try {
          const viewUrl = `https://kroma-4k.vercel.app/wallpaper/${newId}`;
          const hashtags = tagList.map(t => `#${t.replace(/\s+/g, '')}`).join(' ');
          
          const caption = 
            `<b>💎 KROMA 4K EXCLUSIVE</b>\n\n` +
            `📂 <b>Category:</b> ${category}\n` +
            `📱 <b>Resolution:</b> ${config.label}\n` +
            `📝 <b>Prompt:</b> <i>${finalPrompt.substring(0, 150)}...</i>\n\n` +
            `${hashtags}\n\n` +
            `🚀 <b>Join:</b> @Kroma_4K`;

          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: "@Kroma_4K",
              photo: imgBBUrl, // Sending the permanent ImgBB link to Telegram
              caption: caption,
              parse_mode: 'HTML',
              disable_notification: true,
              reply_markup: {
                inline_keyboard: [[{ text: "🌐 View & Download 4K", url: viewUrl }]]
              }
            })
          });
          console.log("✅ Telegram Post Success");
        } catch (tgErr: any) {
          console.error("❌ Telegram Post Error:", tgErr.message);
        }

        results.push(newId);
      } else {
        console.warn(`⚠️ Failed to generate/host image ${i + 1}`);
      }
    }

    console.log(`🏁 --- CRON FINISHED (${results.length} images) ---`);
    return new Response(JSON.stringify({ success: true, count: results.length, ids: results }), { status: 200 });

  } catch (error: any) { 
    console.error("💀 Critical Error:", error.message);
    return new Response(JSON.stringify({ error: "Batch Failed", details: error.message }), { status: 500 });
  }
}