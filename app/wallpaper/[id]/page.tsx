import { Metadata } from 'next';
import { ShieldCheck, X, Palette, LayoutGrid, Zap, Info } from "lucide-react";
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { notFound } from 'next/navigation';
import WallpaperActions from "@/components/WallpaperAction";

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6", red: "#ef4444", purple: "#a855f7", 
  green: "#22c55e", orange: "#f97316", pink: "#ec4899", dark: "#1a1a1a"
};

export default async function WallpaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docSnap = await getDoc(doc(db, "wallpapers", id));

  if (!docSnap.exists()) notFound();
  const img = docSnap.data();

  const relatedQuery = query(
    collection(db, "wallpapers"), 
    where("category", "==", img.category),
    where("deviceSlug", "==", img.deviceSlug),
    limit(10)
  );
  
  const relatedSnap = await getDocs(relatedQuery);
  const relatedImages = relatedSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(d => d.id !== id);

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-0 md:p-8 lg:p-12 backdrop-blur-3xl selection:bg-blue-600 selection:text-white">
      
      {/* Container with Brand Border */}
      <div className="w-full max-w-6xl max-h-screen md:max-h-[95vh] overflow-y-auto no-scrollbar bg-[#080808] md:rounded-[3.5rem] border border-white/10 relative flex flex-col shadow-2xl">
        
        {/* TOP BRAND BAR */}
        <div className="sticky top-0 z-[60] flex justify-between items-center p-6 md:px-10 md:py-8 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
            {/* Icon with Blue Glow */}
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Zap size={20} className="text-white" fill="white" />
            </div>
            
            <div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase leading-none text-white transition-colors group-hover:text-blue-500">
                Kroma<span className="text-blue-600"> 4K</span>
            </h1>
            <p className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">
                Visual Archive
            </p>
            </div>
        </Link>

        {/* Close Button */}
        <Link 
            href="/" 
            className="bg-white/5 hover:bg-white hover:text-black p-3 md:p-4 rounded-full transition-all border border-white/10 flex items-center justify-center"
        >
            <X size={20}/>
        </Link>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image Container */}
          <div className="flex-[1.4] p-6 md:p-10 flex items-center justify-center bg-black/40">
            <img src={img.url} className="max-w-full max-h-[60vh] md:max-h-[75vh] object-contain rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/5" alt="Visual" />
          </div>

          {/* Right: Info Panel */}
          <div className="flex-1 p-8 md:p-14 flex flex-col gap-8 bg-gradient-to-b from-white/[0.02] to-transparent border-t md:border-t-0 md:border-l border-white/5">
            <div>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <ShieldCheck size={14}/> Kroma Verified 8K Asset
              </p>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.85] mb-2">
                {img.category} <span className="text-blue-600 block text-3xl mt-2 font-black">PRO EDITION</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-colors">
                <p className="text-[9px] text-gray-500 font-black mb-2 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid size={10}/> Category
                </p>
                <div className="text-sm font-black text-white uppercase italic">{img.category || "General"}</div>
              </div>
              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-colors">
                <p className="text-[9px] text-gray-500 font-black mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={10}/> Palette
                </p>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 shadow-lg" 
                    style={{ backgroundColor: COLOR_MAP[img.color?.toLowerCase()] || '#333' }}
                  />
                  <div className="text-sm font-black text-white uppercase italic">{img.color || "Dynamic"}</div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <WallpaperActions 
              imgId={id} 
              imgUrl={img.url} 
              initialLikes={img.likes || 0}
              prompt={img.prompt}
            />

            {/* Branding Tag */}
            <div className="mt-4 pt-6 border-t border-white/5 flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                 <Info size={14} className="text-blue-600" />
               </div>
               <p className="text-[9px] text-gray-500 font-medium leading-relaxed uppercase tracking-tighter">
                 All assets on <span className="text-white font-bold">Kroma4K</span> are optimized for {img.deviceSlug} devices with native 8K fidelity.
               </p>
            </div>
          </div>
        </div>

        {/* Related Visuals Section */}
        <div className="p-10 border-t border-white/5 bg-black/30">
        <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-white/10"></span>
            Related Kroma Visuals
            </h4>
            
            {/* Scroll Hint for Desktop */}
            <div className="hidden md:flex items-center gap-2 text-[8px] font-bold text-blue-500/50 uppercase tracking-[0.2em]">
            <span>Shift + Scroll to explore</span>
            <div className="w-10 h-[1px] bg-blue-500/30"></div>
            </div>
        </div>

        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 cursor-grab active:cursor-grabbing">
            {relatedImages.map((related: any) => (
            <Link 
                key={related.id} 
                href={`/wallpaper/${related.id}`}
                className={`rounded-[2rem] overflow-hidden border border-white/5 hover:border-blue-600/50 transition-all shrink-0 bg-[#111] group relative shadow-xl
                ${img.deviceSlug === 'iphone' || img.deviceSlug === 'samsung' ? 'w-[180px] aspect-[9/16]' : 'w-[320px] aspect-video'}
                `}
            >
                <img 
                src={related.url} 
                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                alt="Related Asset" 
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <p className="text-[9px] font-black text-white tracking-[0.2em] uppercase">Open Archive</p>
                </div>
            </Link>
            ))}

            {/* Empty State if no related found */}
            {relatedImages.length === 0 && (
            <div className="w-full py-10 border border-dashed border-white/5 rounded-[2rem] flex items-center justify-center text-gray-600 text-[10px] uppercase tracking-widest">
                No matching assets in this series
            </div>
            )}
        </div>
        </div>
      </div>
    </div>
  );
}