"use client";
import React from 'react';
import { Github, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-24 pb-12 w-full relative z-10 overflow-hidden">
      {/* Ambient Glow - Adds depth to the dark theme */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1800px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-left">
          
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic shadow-2xl shadow-blue-600/40 transform hover:rotate-3 transition-transform cursor-pointer">
                K4
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase text-white">
                KROMA<span className="text-blue-600">4K</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs font-medium">
              The world&apos;s premier destination for high-fidelity AI generated visuals. 
              Precision, Quality, and Artistry in every single pixel.
            </p>
            <div className="flex gap-5 items-center">
              <a 
                href="https://github.com/aggarwalh905-ops" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                title="GitHub"
              >
                <Github size={20} />
              </a>              
            </div>
          </div>

          {/* Links Group */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 col-span-1 md:col-span-2">
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.2em] mb-8 text-blue-500">Explore</h4>
              <ul className="space-y-5 text-sm text-gray-400 font-bold">
                {["Trending Now", "Editor's Choice", "Color Palette", "All Categories"].map((item) => (
                  <li key={item}>
                    <a href="/" className="hover:text-white transition-colors flex items-center gap-2 group">
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

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
          <p className="text-center md:text-left">© 2026 Kroma4K Labs. Engineered for Excellence.</p>
          <div className="flex items-center gap-6">
            <p className="text-blue-600/50 hidden sm:block">Designed in California</p>
            <p>Global Version 2.0.4</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;