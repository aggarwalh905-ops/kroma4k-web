"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const Section = ({ num, title, text }: any) => (
  <div className="mb-16 group">
    <div className="flex items-center gap-4 mb-6">
      <span className="text-blue-600 font-black italic text-xl">0{num}.</span>
      <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-blue-500 transition-colors">{title}</h2>
    </div>
    <p className="text-gray-400 leading-relaxed font-medium text-lg border-l-2 border-white/5 pl-8 ml-3">
      {text}
    </p>
  </div>
);

export default function PrivacyPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen">
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Security Protocol
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
            Privacy <span className="text-blue-600">Policy</span>
          </motion.h1>
          <p className="mt-6 text-gray-500 font-medium max-w-xl mx-auto italic">How we manage, protect, and respect your digital footprint.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-24 px-6">
        <Section num="1" title="Data Collection" text="Kroma4K Labs collects minimal data. We track anonymous download metrics and browser-side 'likes' to enhance our 4K delivery systems. No personal identity is linked to these metrics." />
        <Section num="2" title="Cookies & Storage" text="We use LocalStorage to remember your theme preferences and saved wallpapers. This data stays on your machine and is never transmitted to third-party advertisers." />
        <Section num="3" title="Third-Party Nodes" text="Our image delivery is powered by high-speed CDNs. These nodes may record your IP address temporarily for security purposes and DDoS protection only." />
      </div>
      <Footer />
    </div>
  );
}