export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { generateRandomPrompt } from "@/lib/promptGenerator";
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

const generateId = () => crypto.randomBytes(10).toString('hex');

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
      const apiUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(finalPrompt)}?model=flux&seed=${seed}&width=${config.width}&height=${config.height}&nologo=true&enhance=true`;

      console.log(`🔗 API URL: ${apiUrl}`);

      // --- VERIFY POLLINATIONS ---
      const check = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}` }
      });
      
      console.log(`📡 Pollinations Status: ${check.status}`);

      if (check.ok) {
        const newId = generateId();
        const tagList = [category.toLowerCase(), assignedColor.toLowerCase(), "4k", "kroma4k"];
        
        // --- STEP 1: DB INSERT ---
        const { data: record, error: dbError } = await supabase
          .from('wallpapers')
          .insert([{
              id: newId, 
              url: apiUrl,
              prompt: finalPrompt,
              category: category,
              color: assignedColor,
              device: config.label,
              device_slug: config.slug,
              downloads: 0,
              likes: Math.floor(Math.random() * 8),
              tags: tagList,
              is_migrated: false,
          }])
          .select().single();

        if (dbError) {
          console.error("❌ DB Insert Error:", dbError.message);
          continue;
        }
        console.log(`💾 Saved to DB: ${newId}`);

        // --- STEP 2: TELEGRAM POST (Custom Format) ---
        try {
          const viewUrl = `https://kroma-4k.vercel.app/wallpaper/${record.id}`;
          const hashtags = tagList.map(t => `#${t.replace(/\s+/g, '')}`).join(' ');
          
          const caption = 
            `<b>💎 KROMA 4K EXCLUSIVE</b>\n\n` +
            `📂 <b>Category:</b> ${category}\n` +
            `📱 <b>Resolution:</b> ${config.label}\n` +
            `📝 <b>Prompt:</b> <i>${finalPrompt.substring(0, 150)}...</i>\n\n` +
            `${hashtags}\n\n` +
            `🚀 <b>Join:</b> @Kroma_4K`;

          console.log("📤 Sending to Telegram with custom caption...");
          
          const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: "@Kroma_4K",
              photo: apiUrl,
              caption: caption,
              parse_mode: 'HTML',
              disable_notification: true,
              reply_markup: {
                inline_keyboard: [[{ text: "🌐 View & Download 4K", url: viewUrl }]]
              }
            })
          });

          const tgData = await tgRes.json();
          if (tgData.ok) {
            console.log("✅ Telegram Post Success!");
            const tgPostLink = `https://t.me/Kroma_4K/${tgData.result.message_id}`;
            await supabase.from('wallpapers').update({ url: tgPostLink, is_migrated: true }).eq('id', record.id);
          } else {
            console.error("❌ Telegram API Error:", tgData.description);
          }
        } catch (tgErr: any) {
          console.error("❌ Telegram Network Error:", tgErr.message);
        }

        results.push(record.id);
      } else {
        console.warn(`⚠️ Skipping Image: Pollinations returned ${check.status}`);
      }
    }

    console.log(`🏁 --- KROMA 4K CRON FINISHED (${results.length} images) ---`);
    return new Response(JSON.stringify({ success: true, count: results.length, ids: results }), { status: 200 });

  } catch (error: any) { 
    console.error("💀 Critical Error:", error.message);
    return new Response(JSON.stringify({ error: "Batch Failed", details: error.message }), { status: 500 });
  }
}