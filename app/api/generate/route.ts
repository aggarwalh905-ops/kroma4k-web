import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 1. Security Check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const styles = ["Cyberpunk", "Minimalist", "Space", "Anime", "Nature", "Oil Painting", "Abstract"];
  const batchSize = 10; // Generate 10 images per trigger

  try {
    for (let i = 0; i < batchSize; i++) {
      const style = styles[Math.floor(Math.random() * styles.length)];
      const seed = Math.floor(Math.random() * 1000000);
      const prompt = `4k high resolution wallpaper, ${style} style, masterpiece, trending on artstation`;
      
      // Pollinations URL Construction
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1920&height=1080&nologo=true`;

      await addDoc(collection(db, "wallpapers"), {
        url: imageUrl,
        prompt: prompt,
        style: style,
        createdAt: serverTimestamp(),
      });
    }
    return NextResponse.json({ success: true, message: `Generated ${batchSize} images` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}