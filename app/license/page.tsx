"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer'; // Adjust path to your Footer

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

export default function LicensePage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-blue-600">
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Kroma4K Official Document
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
            Usage <span className="text-blue-600">License</span>
          </motion.h1>
          <p className="mt-6 text-gray-500 font-medium max-w-xl mx-auto italic">Protocol for the distribution and utilization of high-fidelity digital assets.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-24 px-6">
        <Section num="1" title="Personal Utilization" text="You are granted a non-exclusive, worldwide license to use Kroma4K wallpapers for personal customization of your digital devices. This includes desktops, mobile units, and personal tablets." />
        <Section num="2" title="Commercial Restriction" text="Redistribution, resale, or sub-licensing of any Kroma4K visual asset is strictly prohibited. You may not use these assets as part of a commercial product, NFT collection, or printed merchandise without a custom commercial contract." />
        <Section num="3" title="Modification" text="Users are permitted to crop or adjust color grading for personal aesthetic fit. However, creating derivative works for the purpose of distribution remains a violation of this license." />
      </div>
      <Footer />
    </div>
  );
}