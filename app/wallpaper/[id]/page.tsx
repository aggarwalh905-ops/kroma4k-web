import { Metadata } from 'next';
import { ShieldCheck, X, Palette, LayoutGrid, Zap, Info, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { notFound } from 'next/navigation';
import WallpaperActions from "@/components/WallpaperAction";

// --- Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const docSnap = await getDoc(doc(db, "wallpapers", id));
  
  if (!docSnap.exists()) return { title: "Not Found | Kroma4K" };
  const img = docSnap.data();

  return {
    title: `${img.category} | Kroma4K Pro Edition`,
    description: img.prompt || "High-fidelity 8K wallpaper archive.",
    openGraph: { images: [img.url] },
  };
}

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6", red: "#ef4444", purple: "#a855f7", 
  green: "#22c55e", orange: "#f97316", pink: "#ec4899", 
  dark: "#1a1a1a", white: "#ffffff", yellow: "#eab308"
};

export default async function WallpaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docSnap = await getDoc(doc(db, "wallpapers", id));

  if (!docSnap.exists()) notFound();
  const img = docSnap.data();

  // Optimized Related Query: Finds images in same category but excludes current ID
  const relatedQuery = query(
    collection(db, "wallpapers"), 
    where("category", "==", img.category),
    limit(12)
  );
  
  const relatedSnap = await getDocs(relatedQuery);
  const relatedImages = relatedSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(d => d.id !== id)
    .slice(0, 8); // Ensure exactly 8 related items

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-0 md:p-6 lg:p-10 selection:bg-blue-600 selection:text-white">
      
      {/* Main Glassmorphism Container */}
      <div className="w-full max-w-7xl max-h-screen md:max-h-[92vh] overflow-y-auto no-scrollbar bg-[#080808] md:rounded-[3rem] border border-white/10 relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {/* HEADER BAR */}
        <div className="sticky top-0 z-[60] flex justify-between items-center px-6 py-5 md:px-10 md:py-8 bg-[#080808]/90 backdrop-blur-2xl border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-blue-600/20">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter italic uppercase leading-none text-white">
                Kroma<span className="text-blue-600"> 4K</span>
              </h1>
              <p className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">PRO ARCHIVE</p>
            </div>
          </Link>

          <Link 
            href="/" 
            className="group flex items-center gap-3 bg-white/5 hover:bg-white px-5 py-3 rounded-2xl transition-all border border-white/10"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-black transition-colors hidden sm:block">Return to Hub</span>
            <X size={18} className="text-gray-400 group-hover:text-black" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* VISUAL PREVIEW AREA */}
          <div className="flex-[1.3] p-4 md:p-10 lg:p-16 flex items-center justify-center bg-black/60 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div 
              className="absolute inset-0 opacity-20 blur-[120px] pointer-events-none" 
              style={{ backgroundColor: COLOR_MAP[img.color?.toLowerCase()] || '#3b82f6' }}
            />
            
            <img 
              src={img.url} 
              className="relative z-10 max-w-full max-h-[65vh] md:max-h-[75vh] object-contain rounded-2xl md:rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" 
              alt={img.prompt || "Kroma 8K Asset"} 
            />
          </div>

          {/* DATA & ACTIONS PANEL */}
          <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col gap-10 bg-[#0a0a0a] border-t lg:border-t-0 lg:border-l border-white/5">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20">
                <ShieldCheck size={12} className="text-blue-500"/>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Kroma Verified 8K</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                {img.category}
                <span className="block text-blue-600 text-2xl md:text-3xl mt-4 not-italic tracking-normal">ULTRA-HDR EDITION</span>
              </h2>
            </header>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <p className="text-[9px] text-gray-500 font-black mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                  <LayoutGrid size={12}/> Asset Class
                </p>
                <div className="text-sm font-black text-white uppercase italic">{img.category || "General"}</div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <p className="text-[9px] text-gray-500 font-black mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Palette size={12}/> Spectrum
                </p>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: COLOR_MAP[img.color?.toLowerCase()] || '#333' }}
                  />
                  <div className="text-sm font-black text-white uppercase italic">{img.color || "Dynamic"}</div>
                </div>
              </div>
            </div>

            {/* Client-Side Interactive Component */}
            <div className="bg-white/5 p-1 rounded-[2.5rem] border border-white/5">
                <WallpaperActions 
                imgId={id} 
                imgUrl={img.url} 
                initialLikes={img.likes || 0}
                prompt={img.prompt || "Neural-generated 8K masterpiece."}
                />
            </div>

            {/* Hardware Compatibility */}
            <div className="pt-8 border-t border-white/5 flex items-start gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                 <Info size={16} className="text-blue-500" />
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] text-white font-black uppercase tracking-widest">Hardware Calibration</p>
                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase">
                   Optimized for <span className="text-blue-400">{img.deviceSlug || 'Universal'}</span> panels. Native bit-depth preserved for OLED/Mini-LED displays.
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* RELATED ASSETS SECTION */}
        <div className="p-8 md:p-12 bg-black/40 border-t border-white/5">
          <div className="flex items-center justify-between mb-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-blue-500/30"></span>
                Related Visuals
              </h4>
              <div className="hidden md:block h-[1px] flex-1 mx-10 bg-white/5"></div>
              <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">ARCHIVE: {img.category}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedImages.map((related: any) => (
                <Link 
                    key={related.id} 
                    href={`/wallpaper/${related.id}`}
                    className={`group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]
                    ${img.deviceSlug === 'iphone' || img.deviceSlug === 'samsung' ? 'aspect-[9/16]' : 'aspect-video'}
                    `}
                >
                    <img 
                      src={related.url} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
                      alt="Kroma Related" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6">
                      <p className="text-[9px] font-black text-white tracking-widest uppercase">Inspect Asset</p>
                    </div>
                </Link>
              ))}

              {relatedImages.length === 0 && (
                <div className="col-span-full py-20 border border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-4">
                    <LayoutGrid className="text-gray-800" size={40} />
                    <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em]">End of Archive Series</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}