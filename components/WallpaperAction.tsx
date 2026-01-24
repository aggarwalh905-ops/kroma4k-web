"use client";
import { useState, useEffect } from "react";
import { Heart, Share2, Download, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

export default function WallpaperActions({ imgId, imgUrl, initialLikes, prompt, category }: any) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 1. Sync likes from Firestore and check LocalStorage for "Liked" state
  useEffect(() => {
    // Persistent Liked State
    const likedWallpapers = JSON.parse(localStorage.getItem("kroma_liked_ids") || "[]");
    if (likedWallpapers.includes(imgId)) {
      setIsLiked(true);
    }

    // Real-time Likes Sync
    const unsub = onSnapshot(doc(db, "wallpapers", imgId), (doc) => {
      if (doc.exists()) setLikes(doc.data().likes || 0);
    });
    return () => unsub();
  }, [imgId]);

  // 2. Upvote Logic
  const handleUpvote = async () => {
    if (isLiked) return;

    try {
      setIsLiked(true);
      const likedWallpapers = JSON.parse(localStorage.getItem("kroma_liked_ids") || "[]");
      localStorage.setItem("kroma_liked_ids", JSON.stringify([...likedWallpapers, imgId]));

      await updateDoc(doc(db, "wallpapers", imgId), { 
        likes: increment(1) 
      });
    } catch (err) {
      console.error("Error upvoting:", err);
      setIsLiked(false);
    }
  };

  // 3. Share Logic (Native Share or Clipboard)
  const handleShare = async () => {
    const shareData = {
      title: `Kroma4K | ${category || 'Wallpaper'}`,
      text: `Check out this amazing 8K wallpaper!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      setSharing(true);
      setTimeout(() => setSharing(false), 2000);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // 4. Download Logic
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Kroma4K-${(category || 'wallpaper').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) { 
      console.error("Download failed", err); 
    } finally { 
      setDownloading(false); 
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Prompt Box */}
      <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 relative group transition-all hover:border-blue-500/50">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12}/> AI Generation Prompt
          </p>
          <button 
            onClick={copyPrompt}
            className="p-2 rounded-xl bg-white/5 hover:bg-white hover:text-black transition-all"
          >
            {copiedPrompt ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
          </button>
        </div>
        <p className="text-sm text-gray-400 italic leading-relaxed pr-4">
          &quot;{prompt || "Visual data encrypted."}&quot;
        </p>
      </div>

      {/* Upvote and Share Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={handleUpvote}
          className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-2 active:scale-95 ${
            isLiked 
            ? "bg-red-500/10 border-red-500/20 text-red-500" 
            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white hover:text-black"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          {likes} Upvotes
        </button>

        <button 
          onClick={handleShare} 
          className="flex-1 py-5 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95"
        >
          {sharing ? (
            <><Check size={14} className="text-green-500"/> Copied</>
          ) : (
            <><Share2 size={14}/> Share Asset</>
          )}
        </button>
      </div>

      {/* Main Download Button */}
      <button 
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-blue-600 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-blue-500 hover:shadow-blue-600/40 active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-600/20"
      >
        {downloading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <><Download size={18}/> Download 8K</>
        )}
      </button>
    </div>
  );
}