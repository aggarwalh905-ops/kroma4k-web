"use client";
import { useState, useEffect } from "react";
import { Heart, Share2, Download, Copy, Check, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

export default function WallpaperActions({ imgId, imgUrl, initialLikes, prompt }: any) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
          onClick={() => copyToClipboard(window.location.href, 'link')}
          className="px-8 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-gray-400 hover:bg-white hover:text-black transition-all"
        >
          {copiedLink ? <Check size={18} className="text-green-500"/> : <Share2 size={18} />}
        </button>
      </div>

      <a 
        href={imgUrl} 
        target="_blank" 
        download 
        className="w-full bg-blue-600 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-blue-500 shadow-2xl shadow-blue-600/30 active:scale-95"
      >
        <Download size={20}/> Download 8K Original
      </a>
    </div>
  );
}