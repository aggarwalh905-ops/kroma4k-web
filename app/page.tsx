"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
  Download, Smartphone, Search, Heart, 
  LayoutGrid, ArrowRight, Loader2, 
  Zap, ShieldCheck, SmartphoneNfc, 
  LaptopMinimal, MonitorPlay, Flame, Calendar,
  Globe, Instagram, Twitter, Github, Plus
} from "lucide-react";

// --- Supabase Import ---
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "Anime", "Cyberpunk", "Nature", "Space", "Minimal", "Cars", "Abstract", "Architecture", "Fantasy", "Cinematic"];

const DEVICE_CONFIGS = [
  { label: "All", slug: "all", icon: <LayoutGrid size={16}/> },
  { label: "iPhone", slug: "iphone", icon: <Smartphone size={16}/> },
  { label: "Samsung", slug: "samsung", icon: <SmartphoneNfc size={16}/> },
  { label: "MacBook", slug: "laptop", icon: <LaptopMinimal size={16}/> },
  { label: "Desktop", slug: "desktop", icon: <MonitorPlay size={16}/> }
];

const BATCH_SIZE = 12;

// --- Image Card ---
const ImageCard = memo(({ img, isLiked, onClick, innerRef }: any) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div 
      ref={innerRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(img.id)}
      className="relative aspect-[9/16] group cursor-pointer rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      )}

      <img 
        src={img.url} 
        alt={img.prompt || "Wallpaper"} 
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x700/0a0a0a/ffffff?text=Kroma4K";
        }}
        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 p-4 md:p-6 flex flex-col justify-end">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5 md:gap-1">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-blue-500">{img.category}</span>
            <span className="text-[10px] md:text-xs font-bold text-white flex items-center gap-1.5">
              <Heart size={14} className={isLiked ? "fill-red-500 text-red-500" : "text-white/70"} /> {img.likes || 0}
            </span>
          </div>
          <div className="p-2 md:p-3 bg-blue-600/90 backdrop-blur-md text-white rounded-xl md:rounded-2xl shadow-xl border border-white/10">
            <Download size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ImageCard.displayName = "ImageCard";

const Footer = () => (
  <footer className="bg-[#050505] border-t border-white/5 pt-16 md:pt-24 pb-10 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic">K</div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Kroma<span className="text-blue-500">4K</span></h2>
        </div>
        <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">
          The world&apos;s premier neural-asset archive. High-fidelity 8K visuals calibrated for professional displays and next-gen mobile hardware.
        </p>
        <div className="flex gap-4">
          <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors"><Twitter size={18}/></div>
          <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors"><Instagram size={18}/></div>
          <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors"><Github size={18}/></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2">
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-500 mb-6">Archive</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-medium">
            <li className="hover:text-white cursor-pointer transition-colors">Latest Releases</li>
            <li className="hover:text-white cursor-pointer transition-colors">Trending Now</li>
            <li className="hover:text-white cursor-pointer transition-colors">Desktop 8K</li>
            <li className="hover:text-white cursor-pointer transition-colors">Mobile Pro</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-500 mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-medium">
            <li><Link href="/license" className="hover:text-white transition-colors">License</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">© 2026 Kroma Visual Labs. All Rights Reserved.</p>
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
        <Globe size={12}/> Global Archive v4.2.0
      </div>
    </div>
  </footer>
);

export default function Kroma4K_Ultimate() {
  const [showGallery, setShowGallery] = useState(false); 
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0); 
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at"); 
  const [likedImages, setLikedImages] = useState<string[]>([]);
  const router = useRouter();

  // --- Improved Load Function ---
  const loadData = useCallback(async (isNextPage = false) => {
    if (isNextPage) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentPage = isNextPage ? page + 1 : 0;
      const from = currentPage * BATCH_SIZE;
      const to = from + BATCH_SIZE - 1;

      let query = supabase.from('wallpapers').select('*');

      // 1. Database level Global Search
      if (searchTerm.trim() !== "") {
        query = query.ilike('prompt', `%${searchTerm}%`);
      }

      // 2. Filters
      // Check karein ki category "All" toh nahi hai
      if (activeCategory !== "All") {
        query = query.eq('category', activeCategory);
      }
      // Same for device
      if (deviceFilter !== "all") {
        query = query.eq('device_slug', deviceFilter);
      }

      // 3. Sorting (Optimized by our new indexes)
      query = query
        .order(sortBy === "likes" ? "likes" : "created_at", { ascending: false })
        .range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setHasMore(data.length === BATCH_SIZE);
        setImages(prev => {
          const combined = isNextPage ? [...prev, ...data] : data;
          return Array.from(new Map(combined.map(item => [item.id, item])).values());
        });
        if (isNextPage) setPage(prev => prev + 1);
      }
    } catch (error) { 
      console.error("Supabase Error:", error); 
    } finally { 
      setLoading(false); 
      setLoadingMore(false); 
    }
  }, [activeCategory, deviceFilter, sortBy, page, searchTerm]); 

  // Initial Load & Filter Watcher
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      setImages([]);
      loadData(false);
    }, 400); // 0.4 seconds ka wait typing rukne par

    return () => clearTimeout(handler);
  }, [activeCategory, deviceFilter, sortBy, searchTerm]); 

  useEffect(() => {
    const saved = localStorage.getItem("kroma_likes");
    if (saved) setLikedImages(JSON.parse(saved));
  }, []);

  // --- Infinite Scroll Observer ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadData(true);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, loadData]);

  const displayImages = images;

  return (
    <div className="bg-[#020202] text-white min-h-screen selection:bg-blue-600 overflow-x-hidden font-sans">
      <AnimatePresence mode="wait">
        {!showGallery ? (
          <motion.section 
            key="landing" exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="relative min-h-screen flex flex-col bg-[#020202]"
          >
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e3a8a33_0%,transparent_60%)]" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
              >
                <Zap size={14} className="text-blue-500 fill-blue-500"/>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 text-center">v4.0 Pro Engine Active</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-[160px] font-black tracking-tighter leading-[0.8] italic text-center mb-8 md:mb-10 uppercase"
              >
                KROMA<span className="text-blue-600">4K</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-gray-500 text-xs md:text-xl font-medium text-center max-w-2xl mb-12 px-4 leading-relaxed"
              >
                Neural-asset archive for ultra-high resolution displays. Manually calibrated 8K aesthetics.
              </motion.p>

              <motion.div 
                className="relative z-10 w-full flex justify-center" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
              >
                <button 
                  onClick={() => setShowGallery(true)}
                  className="group w-full max-w-[280px] md:max-w-none md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)]"
                >
                  Explore Archive <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            <div className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {[
                { icon: <ShieldCheck className="text-blue-500"/>, title: "Verified 8K", desc: "Native high-fidelity clarity." },
                { icon: <MonitorPlay className="text-purple-500"/>, title: "Responsive", desc: "Optimized for all displays." },
                { icon: <Flame className="text-orange-500"/>, title: "Neural Logic", desc: "Advanced aesthetic curation." }
              ].map((f, i) => (
                <div key={i} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                  {f.icon}
                  <h3 className="font-black uppercase tracking-widest text-xs md:text-sm">{f.title}</h3>
                  <p className="text-gray-500 text-[10px] md:text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <Footer />
          </motion.section>
        ) : (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-3xl border-b border-white/5">
              <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4 space-y-4 md:space-y-6">
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowGallery(false)}>
                      <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-xs">K</div>
                      <h1 className="text-lg font-black tracking-tighter uppercase">Kroma<span className="text-blue-500">4K</span></h1>
                    </div>
                    <div className="flex md:hidden bg-white/5 p-1 rounded-xl border border-white/10 scale-90">
                      <button onClick={() => setSortBy("likes")} className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase ${sortBy === "likes" ? 'bg-white text-black' : 'text-gray-500'}`}>
                        Trending
                      </button>
                      <button onClick={() => setSortBy("created_at")} className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase ${sortBy === "created_at" ? 'bg-white text-black' : 'text-gray-500'}`}>
                        New
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:flex-1 md:max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search aesthetics..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500/50 text-xs font-medium transition-all text-white"
                    />
                  </div>
                  
                  <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setSortBy("likes")} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === "likes" ? 'bg-white text-black' : 'text-gray-500'}`}>
                      <Flame size={12} className="inline mr-2"/> Trending
                    </button>
                    <button onClick={() => setSortBy("created_at")} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === "created_at" ? 'bg-white text-black' : 'text-gray-500'}`}>
                      <Calendar size={12} className="inline mr-2"/> New
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pb-2">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full pb-1">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat} onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {DEVICE_CONFIGS.map(dev => (
                      <button 
                        key={dev.slug} onClick={() => setDeviceFilter(dev.slug)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${deviceFilter === dev.slug ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}
                      >
                        {dev.icon} {dev.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-[1800px] mx-auto px-4 md:px-8 py-8 md:py-12 min-h-screen">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-8">
                {displayImages.map((img, index) => (
                  <ImageCard 
                    key={`${img.id}-${index}`} 
                    img={img}
                    isLiked={likedImages.includes(img.id)}
                    onClick={(id: string) => router.push(`/wallpaper/${id}`)}
                    innerRef={index === displayImages.length - 1 ? lastElementRef : null}
                  />
                ))}
              </div>
              
              {/* No Results State */}
              {displayImages.length === 0 && !loading && (
                <div className="py-40 text-center">
                  <p className="text-gray-500 uppercase font-black tracking-widest text-xs">No assets found in this segment</p>
                </div>
              )}

              {/* Load More Button & Infinite Scroll Indicator */}
              <div className="py-24 flex flex-col items-center gap-6">
                {hasMore && !loading && !loadingMore && (
                  <button 
                    onClick={() => loadData(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                  >
                    <Plus size={16}/> Load More Archive
                  </button>
                )}

                {(loading || loadingMore) && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Streaming Visual Data</p>
                  </div>
                )}
                
                {!hasMore && displayImages.length > 0 && (
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] opacity-40">End of Neural Archive</p>
                )}
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}