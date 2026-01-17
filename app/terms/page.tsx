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

export default function TermsPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen">
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            User Agreement
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
            Terms of <span className="text-blue-600">Service</span>
          </motion.h1>
          <p className="mt-6 text-gray-500 font-medium max-w-xl mx-auto italic">The legal framework governing your access to the Kroma4K ecosystem.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-24 px-6">
        <Section num="1" title="Acceptance of Terms" text="By accessing Kroma4K, you agree to be bound by these service protocols. If you do not agree with any part of these terms, you are prohibited from using or accessing this site." />
        <Section num="2" title="Platform Abuse" text="You may not use automated scripts, scrapers, or bots to download bulk assets from our servers. Excessive bandwidth usage that impacts other users may result in temporary IP restriction." />
        <Section num="3" title="Service Availability" text="Kroma4K Labs provides these assets 'as is'. We reserve the right to modify or discontinue any wallpaper collection or service feature without prior notice." />
      </div>
      <Footer />
    </div>
  );
}