"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Monitor, Smartphone, Search, Heart, 
  X, Palette, TrendingUp, Clock, Loader2, 
  Sparkles, ArrowRight, Laptop, Filter, LayoutGrid,
  ChevronRight, RefreshCw, Zap, Layers, ShieldCheck,
  SmartphoneNfc, LaptopMinimal, MonitorPlay, MousePointer2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, query, orderBy, limit, getDocs, where, 
  doc, updateDoc, increment, startAfter 
} from "firebase/firestore";

// --- Constants ---
const CATEGORIES = [
  "All", "Anime", "Cyberpunk", "Nature", "Space", "Minimal", 
  "Cars", "Abstract", "Architecture", "Fantasy", "Cinematic"
];

const DEVICE_CONFIGS = [
  { label: "All", slug: "all", icon: <LayoutGrid size={16}/> },
  { label: "iPhone 15 Pro", slug: "iphone", icon: <Smartphone size={16}/> },
  { label: "Samsung S24 Ultra", slug: "samsung", icon: <SmartphoneNfc size={16}/> },
  { label: "MacBook Pro 16", slug: "laptop", icon: <LaptopMinimal size={16}/> },
  { label: "Desktop 4K", slug: "desktop", icon: <MonitorPlay size={16}/> }
];

const BATCH_SIZE = 12;

// --- Sub-components ---
const ImageCard = memo(({ img, isLiked, onClick, innerRef }: any) => (
  <motion.div 
    ref={innerRef}
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    onClick={() => onClick(img)}
    className="relative aspect-[3/4] group cursor-pointer rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl"
  >
    <img 
      src={img.url} 
      loading="lazy"
      alt={img.prompt} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end backdrop-blur-[2px]">
      <div className="flex justify-between items-end transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{img.category}</span>
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Heart size={14} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} /> {img.likes || 0}
          </span>
        </div>
        <div className="p-3 bg-white text-black rounded-2xl shadow-xl active:scale-90 transition-transform">
          <Download size={18} />
        </div>
      </div>
    </div>
  </motion.div>
));
ImageCard.displayName = "ImageCard";

export default function Kroma4K_Ultimate() {
  const [showGallery, setShowGallery] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("likes");
  const [downloading, setDownloading] = useState(false);
  const [likedImages, setLikedImages] = useState<string[]>([]);
  const router = useRouter();

  const loadData = useCallback(async (isNextPage = false) => {
    if (!showGallery) return;
    if (isNextPage) setLoadingMore(true);
    else { setLoading(true); setImages([]); }

    try {
      let q = query(collection(db, "wallpapers"), orderBy(sortBy, "desc"));
      if (activeCategory !== "All") q = query(q, where("category", "==", activeCategory));
      if (deviceFilter !== "all") q = query(q, where("deviceSlug", "==", deviceFilter));
      q = query(q, limit(BATCH_SIZE));
      if (isNextPage && lastDoc) q = query(q, startAfter(lastDoc));

      const snap = await getDocs(q);
      const newImages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === BATCH_SIZE);
      setImages(prev => isNextPage ? [...prev, ...newImages] : newImages);
    } catch (error) { console.error(error); } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, deviceFilter, sortBy, lastDoc, showGallery]);

  useEffect(() => {
    const saved = localStorage.getItem("kroma_likes");
    if (saved) setLikedImages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (showGallery) loadData(false);
  }, [activeCategory, deviceFilter, sortBy, showGallery]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadData(true);
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, loadData]);

  const handleLike = async (id: string) => {
    if (likedImages.includes(id)) return;
    try {
      const newLiked = [...likedImages, id];
      setLikedImages(newLiked);
      localStorage.setItem("kroma_likes", JSON.stringify(newLiked));
      setImages(prev => prev.map(img => img.id === id ? { ...img, likes: (img.likes || 0) + 1 } : img));
      await updateDoc(doc(db, "wallpapers", id), { likes: increment(1) });
    } catch (err) { console.error(err); }
  };

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Kroma4K-${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  const filteredImages = useMemo(() => {
    return images.filter(i => 
      i.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  return (
    <div className="bg-[#020202] text-white min-h-screen selection:bg-blue-600 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!showGallery ? (
          <motion.section 
            key="landing" exit={{ opacity: 0, scale: 1.05 }}
            className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden"
          >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />

            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
              >
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">AI-Powered 8K Renders</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-6xl md:text-[140px] font-black tracking-tighter leading-[0.8] italic text-center mb-8"
              >
                THE FUTURE OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">VISUALS</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-gray-400 text-center max-w-2xl text-sm md:text-lg mb-12 font-medium leading-relaxed px-4"
              >
                Explore a curated universe of ultra-high-definition wallpapers designed specifically for your premium hardware. 
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <button 
                  onClick={() => setShowGallery(true)}
                  className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)]"
                >
                  Enter Experience <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                  Documentation
                </button>
              </motion.div>

              {/* Bento Feature Preview (Mobile Optimized) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 w-full opacity-60">
                  {[
                    { label: "8K Quality", icon: <Layers size={16}/> },
                    { label: "Device Sync", icon: <RefreshCw size={16}/> },
                    { label: "Daily Drops", icon: <Clock size={16}/> },
                    { label: "Pro Assets", icon: <ShieldCheck size={16}/> },
                  ].map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5">
                        <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">{f.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <header className="sticky top-0 z-[100] bg-black/60 backdrop-blur-3xl border-b border-white/5">
              <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowGallery(false)}>
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center font-black italic shadow-lg">K</div>
                    <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block">Kroma<span className="text-blue-500">4K</span></h1>
                  </div>

                  <div className="flex-1 max-w-xl relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search aesthetics..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 text-sm font-medium transition-all"
                    />
                  </div>

                  <button className="p-3 bg-white/5 rounded-2xl border border-white/10 md:hidden">
                    <Filter size={20} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {DEVICE_CONFIGS.map(dev => (
                      <button 
                        key={dev.slug}
                        onClick={() => setDeviceFilter(dev.slug)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${deviceFilter === dev.slug ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                      >
                        {dev.icon} {dev.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-[1800px] mx-auto px-4 md:px-8 py-12 min-h-screen">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                {filteredImages.map((img, index) => (
                  <ImageCard 
                    key={img.id}
                    img={img}
                    isLiked={likedImages.includes(img.id)}
                    onClick={() => router.push(`/wallpaper/${img.id}`)}
                    innerRef={index === filteredImages.length - 1 ? lastElementRef : null}
                  />
                ))}
              </div>
              
              {(loading || loadingMore) && (
                <div className="py-24 flex flex-col items-center gap-4">
                  <div className="h-10 w-10 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Streaming Neural Assets</p>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-0 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] bg-[#080808] md:rounded-[3rem] border-white/5 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="flex-[1.5] bg-black relative flex items-center justify-center overflow-hidden">
                <button onClick={() => setSelectedImg(null)} className="absolute top-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full md:hidden">
                  <X size={20}/>
                </button>
                <img src={selectedImg.url} className="w-full h-full object-contain" alt="Preview" />
              </div>

              <div className="flex-1 p-8 md:p-14 flex flex-col justify-between border-l border-white/5 bg-[#0a0a0a]">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">{selectedImg.category}</h2>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Monitor size={12}/> ID: {selectedImg.id.slice(0,8)}
                      </p>
                    </div>
                    <button onClick={() => setSelectedImg(null)} className="hidden md:block p-4 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all">
                      <X size={20}/>
                    </button>
                  </div>

                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap size={12} className="text-blue-400"/> Neural Source
                    </p>
                    <p className="text-sm text-gray-300 font-medium italic leading-relaxed">
                      "{selectedImg.prompt || "High-fidelity conceptual art render."}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Target</p>
                        <p className="text-xs font-black uppercase">{selectedImg.deviceSlug || 'Universal'}</p>
                      </div>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Format</p>
                        <p className="text-xs font-black uppercase">Ultra-HDR</p>
                      </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-12">
                  <button 
                    onClick={() => handleLike(selectedImg.id)}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${likedImages.includes(selectedImg.id) ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                  >
                    <Heart size={18} className={likedImages.includes(selectedImg.id) ? "fill-current" : ""} />
                    {likedImages.includes(selectedImg.id) ? 'In Collection' : 'Add to Favorites'}
                  </button>

                  <button 
                    onClick={() => handleDownload(selectedImg.url, selectedImg.category)}
                    className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    {downloading ? <Loader2 className="animate-spin" /> : <><Download size={18}/> Download 8K Original</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}