"use client";
import { useState, useEffect } from "react";
import { Heart, Share2, Download, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

export default function WallpaperActions({ imgId, imgUrl, initialLikes, prompt }: any) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "wallpapers", imgId), (doc) => {
      if (doc.exists()) setLikes(doc.data().likes || 0);
    });
    return () => unsub();
  }, [imgId]);

  const copyToClipboard = (text: string, type: 'prompt' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Kroma4K-${filename.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Prompt Box with Copy Button */}
      <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 relative group transition-all hover:border-blue-500/50">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12}/> AI Generation Prompt
          </p>
          <button 
            onClick={() => copyToClipboard(prompt, 'prompt')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white hover:text-black transition-all"
          >
            {copiedPrompt ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
          </button>
        </div>
        <p className="text-sm text-gray-400 italic leading-relaxed pr-4">
          &quot;{prompt || "Visual data encrypted."}&quot;
        </p>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={async () => {
            if (!isLiked) {
              setIsLiked(true);
              await updateDoc(doc(db, "wallpapers", imgId), { likes: increment(1) });
            }
          }}
          className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${isLiked ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white hover:text-black"}`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          {likes} Upvotes
        </button>

        <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Kroma4K | ' + selectedImg.category, url: window.location.href });
                    }
                  }} 
                  className="w-full py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  <Share2 size={14}/> Share Architecture
                </button>
      </div>

      <button 
                        onClick={() => handleDownload(selectedImg.url, selectedImg.category)}
                        disabled={downloading}
                        className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-blue-500 hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-600/20"
                      >
                        {downloading ? <Loader2 className="animate-spin" /> : <><Download size={18}/> Download 8K</>}
                      </button>
    </div>
  );
}