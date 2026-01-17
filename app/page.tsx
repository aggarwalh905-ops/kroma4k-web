"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Monitor, Smartphone, Search, Heart, Share2, 
  X, Palette, TrendingUp, Clock, Copy, Check, Loader2, 
  Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Github,
  Laptop, MonitorSmartphone
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, query, orderBy, limit, getDocs, where, 
  doc, updateDoc, increment, startAfter 
} from "firebase/firestore";

// --- Constants ---
const COLORS = [
  { name: "Blue", hex: "#3b82f6" },
  { name: "Red", hex: "#ef4444" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Green", hex: "#22c55e" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Dark", hex: "#1a1a1a" }
];

const DEVICE_CONFIGS = [
  { label: "iPhone", width: 1179, height: 2556, slug: "iphone", icon: <Smartphone size={12}/> },
  { label: "S24 Ultra", width: 1440, height: 3120, slug: "samsung", icon: <Smartphone size={12}/> },
  { label: "MacBook", width: 3456, height: 2234, slug: "laptop", icon: <Laptop size={12}/> },
  { label: "Desktop", width: 3840, height: 2160, slug: "desktop", icon: <Monitor size={12}/> }
];

const BATCH_SIZE = 15;

// --- Sub-components ---
const Footer = memo(() => (
  <footer className="border-t border-white/5 bg-[#050505] pt-24 pb-12 w-full relative z-10 overflow-hidden">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-blue-600/5 blur-[120px] pointer-events-none" />
    <div className="max-w-[1800px] mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-left">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic shadow-2xl shadow-blue-600/40 transform hover:rotate-3 transition-transform cursor-pointer">
              K4
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              KROMA<span className="text-blue-600">4K</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs font-medium">
            The world&apos;s premier destination for high-fidelity AI generated visuals. 
            Precision, Quality, and Artistry in every single pixel.
          </p>
          <div className="flex gap-5 items-center">
            <a href="https://github.com/aggarwalh905-ops" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Github size={20} />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 col-span-1 md:col-span-2">
          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] mb-8 text-blue-500">Explore</h4>
            <ul className="space-y-5 text-sm text-gray-400 font-bold">
              {["Trending Now", "Editor's Choice", "Color Palette", "All Categories"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="h-px w-0 bg-blue-600 group-hover:w-3 transition-all"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] mb-8 text-blue-500">Legal</h4>
            <ul className="space-y-5 text-sm text-gray-400 font-bold">
              {[
                { name: "Usage License", href: "/license" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="h-px w-0 bg-blue-600 group-hover:w-3 transition-all"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
        <p>© 2026 Kroma4K Labs. Engineered for Excellence.</p>
        <div className="flex items-center gap-6">
          <p className="text-blue-600/50">Designed in California</p>
          <p>Global Version 2.0.4</p>
        </div>
      </div>
    </div>
  </footer>
));
Footer.displayName = "Footer";

const ImageCard = memo(({ img, isLiked, onLike, onClick, innerRef }: any) => (
  <motion.div 
    ref={innerRef}
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.3 }}
    onClick={() => onClick(img)}
    className="relative break-inside-avoid group cursor-zoom-in rounded-[2.5rem] overflow-hidden bg-[#111]"
  >
    <img 
      src={img.url} 
      loading="lazy"
      alt={`${img.category} - ${img.prompt} | Kroma4K 8K Wallpaper`} // Google isse hi search result me dikhayega
      className="w-full object-cover" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end backdrop-blur-[2px]">
      <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="flex items-center gap-2 text-xs font-black tracking-widest text-white">
          <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} /> {img.likes || 0}
        </span>
        <div className="p-3 bg-white text-black rounded-full shadow-xl"><Download size={16} /></div>
      </div>
    </div>
  </motion.div>
));
ImageCard.displayName = "ImageCard";

// --- Main Component ---
export default function Kroma4K_Ultimate() {
  const [showGallery, setShowGallery] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeColor, setActiveColor] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("iphone");
  const [sortBy, setSortBy] = useState("likes");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likedImages, setLikedImages] = useState<string[]>([]);

  const handleSurpriseMe = useCallback(() => {
    if (images.length === 0) return;
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImg(images[randomIndex]);
  }, [images]);

  const loadData = useCallback(async (isNextPage = false) => {
    if (!showGallery) return;
    if (isNextPage) setLoadingMore(true);
    else setLoading(true);

    try {
      let q = query(collection(db, "wallpapers"), orderBy(sortBy, "desc"), limit(BATCH_SIZE));
      
      if (activeCategory !== "All") q = query(q, where("category", "==", activeCategory));
      if (activeColor !== "All") q = query(q, where("color", "==", activeColor));
      if (deviceFilter !== "all") q = query(q, where("deviceSlug", "==", deviceFilter));
      
      if (isNextPage && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snap = await getDocs(q);
      const newImages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === BATCH_SIZE);
      setImages(prev => isNextPage ? [...prev, ...newImages] : newImages);
    } catch (error) {
      console.error("Firebase Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, activeColor, deviceFilter, sortBy, lastDoc, showGallery]);

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

  useEffect(() => {
    const saved = localStorage.getItem("kroma_likes");
    if (saved) setLikedImages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (showGallery) {
      setLastDoc(null);
      setHasMore(true);
      setImages([]); 
      loadData(false);
    }
  }, [activeCategory, activeColor, deviceFilter, sortBy, showGallery]); 

  const handleLike = async (id: string) => {
    if (likedImages.includes(id)) return;
    try {
      const newLiked = [...likedImages, id];
      setLikedImages(newLiked);
      localStorage.setItem("kroma_likes", JSON.stringify(newLiked));
      
      setImages(prev => prev.map(img => img.id === id ? { ...img, likes: (img.likes || 0) + 1 } : img));
      if (selectedImg?.id === id) {
        setSelectedImg((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
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
      link.download = `Kroma4K-${filename.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredImages = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return images.filter(i => 
      i.prompt?.toLowerCase().includes(lowerSearch) ||
      i.category?.toLowerCase().includes(lowerSearch)
    );
  }, [images, searchTerm]);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-600 overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        {!showGallery ? (
          <motion.section 
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col bg-black overflow-y-auto min-h-screen"
          >
            <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center py-20">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-black tracking-widest uppercase mb-8 backdrop-blur-md"
                    >
                        <Sparkles size={14} /> The Future of Visuals
                    </motion.div>

                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-[140px] font-black tracking-tighter leading-none mb-6 italic"
                    >
                        KROMA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">4K</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mb-12"
                    >
                        Ultra-high definition 8K AI masterpieces. Precision engineered for iPhone, S24 Ultra, and 4K Desktop setups.
                    </motion.p>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button 
                            onClick={() => setShowGallery(true)}
                            className="group bg-white text-black px-12 py-5 rounded-2xl font-black uppercase flex items-center gap-3 tracking-widest text-sm transition-all hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
                        >
                            Enter Experience <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl w-full border-t border-white/10 pt-12">
                        {[
                            { icon: <ShieldCheck />, label: "8K Quality", sub: "Verified" },
                            { icon: <Zap />, label: "Instant", sub: "Cloud Link" },
                            { icon: <Palette />, label: "AI Driven", sub: "Custom" },
                            { icon: <Globe />, label: "Global", sub: "Trending" }
                        ].map((feat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="text-blue-500 mb-2">{feat.icon}</div>
                                <div className="font-black text-xs uppercase tracking-tighter">{feat.label}</div>
                                <div className="text-gray-600 text-[9px] uppercase font-bold tracking-widest">{feat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
          </motion.section>
        ) : (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="border-b border-white/5 bg-black/80 backdrop-blur-2xl sticky top-0 z-[100]">
              <div className="max-w-[1800px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 cursor-pointer shrink-0 group" onClick={() => setShowGallery(false)}>
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-black italic shadow-lg group-hover:scale-110 transition-transform">K4</div>
                  <h1 className="text-xl font-black tracking-tighter hidden md:block uppercase">Kroma<span className="text-blue-600">4K</span></h1>
                </div>

                <div className="flex-1 max-w-2xl relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search 8K renders..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:bg-white/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>

                <button 
                  onClick={handleSurpriseMe}
                  className="bg-white/5 border border-white/10 p-3 md:px-6 md:py-3 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-white hover:text-black transition-all shrink-0 uppercase tracking-widest"
                >
                  <Sparkles size={16} /><span className="hidden sm:inline">Surprise</span>
                </button>
              </div>
            </nav>

            <div className="bg-[#050505]/90 backdrop-blur-md border-b border-white/5 sticky top-20 z-[90]">
              <div className="max-w-[1800px] mx-auto px-6 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-6">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1"><Palette size={12}/> Color</span>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveColor("All")} className={`w-6 h-6 rounded-full border border-white/10 text-[8px] font-black flex items-center justify-center transition-all ${activeColor === "All" ? "bg-white text-black scale-110" : "bg-white/5 hover:bg-white/10"}`}>ALL</button>
                      {COLORS.map(c => (
                        <button 
                          key={c.name} 
                          onClick={() => setActiveColor(c.name)} 
                          style={{ backgroundColor: c.hex }} 
                          className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${activeColor === c.name ? "ring-2 ring-white ring-offset-4 ring-offset-[#050505]" : "opacity-40 grayscale-[20%]"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar max-w-full">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                    <button onClick={() => setSortBy("likes")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${sortBy === 'likes' ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}><TrendingUp size={12}/> POPULAR</button>
                    <button onClick={() => setSortBy("createdAt")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${sortBy === 'createdAt' ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}><Clock size={12}/> NEW</button>
                  </div>

                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                    {DEVICE_CONFIGS.map((config) => (
                      <button 
                        key={config.slug}
                        onClick={() => setDeviceFilter(config.slug)} 
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${deviceFilter === config.slug ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 uppercase'}`}
                      >
                        {config.icon}
                        <span className="hidden sm:inline">{config.label}</span>
                        {config.slug === 'samsung' && <span className="sm:hidden">S24</span>}
                        {config.slug === 'iphone' && <span className="sm:hidden">iOS</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <main className="max-w-[1800px] mx-auto px-4 md:px-6 pt-8 pb-24 min-h-[60vh]">
              <div className="mb-10 overflow-x-auto no-scrollbar">
                  <div className="flex gap-2">
                  {["All", "Anime", "Cyberpunk", "Nature", "Space", "Minimal", "Cars", "Abstract", "Architecture", "Fantasy", "Cinematic"].map(cat => (
                      <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20 scale-105" : "bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10"}`}
                      >
                      {cat}
                      </button>
                  ))}
                  </div>
              </div>

              {loading ? (
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {[...Array(10)].map((_, i) => <div key={i} className="h-80 bg-white/5 animate-pulse rounded-[2.5rem]" />)}
                 </div>
              ) : (
                <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
                    {filteredImages.map((img, index) => (
                      <ImageCard 
                        key={img.id}
                        img={img}
                        isLiked={likedImages.includes(img.id)}
                        onLike={handleLike}
                        onClick={() => router.push(`/wallpaper/${img.id}`)}
                        innerRef={index === filteredImages.length - 1 ? lastElementRef : null}
                      />
                    ))}
                </div>
              )}
              
              {loadingMore && <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={40} /></div>}
              
              {!hasMore && !loading && (
                  <div className="text-center py-20 opacity-20 font-black uppercase tracking-[0.5em] text-xs">
                      End of Universe
                  </div>
              )}
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl max-h-[95vh] overflow-y-auto no-scrollbar bg-[#080808] rounded-[3rem] border border-white/10 relative flex flex-col shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedImg(null)} 
                className="absolute top-6 right-6 bg-white/5 hover:bg-white hover:text-black p-4 rounded-full transition-all z-50 backdrop-blur-md border border-white/10"
              >
                <X size={24}/>
              </button>
              
              <div className="flex flex-col md:flex-row">
                {/* Left: Image Preview */}
                <div className="flex-[1.4] p-4 md:p-6 flex items-center justify-center bg-black/40 min-h-[40vh]">
                  <img 
                    src={selectedImg.url} 
                    className="max-w-full max-h-[50vh] md:max-h-[75vh] object-contain rounded-2xl shadow-2xl" 
                    alt="Preview" 
                  />
                </div>

                {/* Right: Details & Actions */}
                <div className="flex-1 p-8 md:p-12 flex flex-col gap-6 bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                      <ShieldCheck size={14}/> Verified 8K Asset
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                      {selectedImg.category} <span className="text-blue-600 block text-2xl md:text-3xl mt-1">PRO EDITION</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                        <p className="text-[9px] text-gray-500 font-black mb-1 tracking-widest uppercase">Resolution</p>
                        <div className="text-lg font-black uppercase text-blue-400">
                          {DEVICE_CONFIGS.find(d => d.slug === selectedImg.deviceSlug)?.width || 3840}x{DEVICE_CONFIGS.find(d => d.slug === selectedImg.deviceSlug)?.height || 2160}
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                        <p className="text-[9px] text-gray-500 font-black mb-1 tracking-widest uppercase">Palette</p>
                        <div className="flex items-center justify-center gap-2 text-lg font-black uppercase">
                          <div className="w-3 h-3 rounded-full shadow-lg" style={{backgroundColor: COLORS.find(c => c.name === selectedImg.color)?.hex || '#333'}} />
                          {selectedImg.color || "N/A"}
                        </div>
                    </div>
                  </div>

                  {/* Prompt Box with Scrollability */}
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 relative group">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles size={12}/> AI Generation Prompt
                        </p>
                        <button 
                          onClick={() => copyPrompt(selectedImg.prompt)} 
                          className="bg-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                          {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-sm text-gray-400 italic font-medium leading-relaxed">
                          &quot;{selectedImg.prompt || "Visual data encrypted."}&quot;
                        </p>
                      </div>
                  </div>

                  <div className="flex flex-col gap-3">
                      <button 
                        disabled={likedImages.includes(selectedImg.id)} 
                        onClick={() => handleLike(selectedImg.id)} 
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border ${likedImages.includes(selectedImg.id) ? "bg-white/5 border-white/5 text-gray-500" : "bg-white text-black hover:bg-blue-600 hover:text-white border-transparent hover:scale-[1.01]"}`}
                      >
                        {likedImages.includes(selectedImg.id) ? "Asset Upvoted" : "Upvote Asset"}
                      </button>

                      <button 
                        onClick={() => handleDownload(selectedImg.url, selectedImg.category)}
                        disabled={downloading}
                        className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-blue-500 hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-600/20"
                      >
                        {downloading ? <Loader2 className="animate-spin" /> : <><Download size={18}/> Download 8K</>}
                      </button>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Related Images */}
              <div className="p-8 border-t border-white/5 bg-black/20">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Related Visuals</h4>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {images
                    .filter(img => img.id !== selectedImg.id && img.category === selectedImg.category)
                    .slice(0, 6)
                    .map(related => (
                      <div 
                        key={related.id} 
                        onClick={() => setSelectedImg(related)}
                        className="min-w-[180px] h-32 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-blue-600 transition-all shrink-0"
                      >
                        <img src={related.url} className="w-full h-full object-cover" alt="Related" />
                      </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}