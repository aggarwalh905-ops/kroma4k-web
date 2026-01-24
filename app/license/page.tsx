import { ShieldCheck, Zap, Scale, Globe, FileText, Info } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-24 selection:bg-blue-600">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 border-b border-white/5 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-6">
            <ShieldCheck size={14} className="text-blue-500"/>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Official License v4.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            Asset <span className="text-blue-600">Rights</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
            This document outlines the legal framework for the use of neural-generated visuals synthesized via FLUX technology on the Kroma4K platform.
          </p>
        </header>

        <div className="space-y-16 text-gray-400">
          {/* Section 1 */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <h2 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <Zap size={14} className="text-blue-500"/> 01. Neural Origin
              </h2>
            </div>
            <div className="col-span-2 space-y-4">
              <p>
                Every asset in the Kroma4K archive is a product of high-parameter neural synthesis. We utilize the <strong>FLUX.1 model architecture</strong>, deployed via <strong>Pollinations AI</strong>, to generate raw latent data. 
              </p>
              <p>
                These outputs undergo a proprietary "Kroma-Calibration" process, involving multi-stage AI upscaling (ESRGAN/Real-ESRGAN variants) to reach a native 8K resolution ($7680 \times 4320$) while maintaining pixel-perfect fidelity.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <h2 className="text-white font-black uppercase tracking-widest text-xs">02. Personal Grant</h2>
            </div>
            <div className="col-span-2 space-y-6">
              <p>Kroma Visual Labs grants you a worldwide, non-exclusive, non-sublicensable license for personal, non-commercial display. This includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Personal Device Displays",
                  "Hardware Testing & Benchmarking",
                  "Educational Moodboards",
                  "Streaming Overlays (Non-Monetized)",
                  "Home Interior Digital Frames",
                  "Social Media Headers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3 - PROHIBITED */}
          <section className="p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/10">
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
              <Scale size={16} className="text-red-500"/> 03. Commercial Restriction
            </h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>The following actions constitute a breach of license and may result in legal action or archive blacklisting:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                <li>Reselling neural assets as standalone digital files or NFT collections.</li>
                <li>Incorporating Kroma4K assets into commercial stock photography databases.</li>
                <li>Using visuals for physical merchandise (Print-on-Demand) without a Corporate Tier License.</li>
                <li>Claiming manual "authorship" of the visual synthesis—acknowledgment of AI synthesis is required.</li>
              </ul>
            </div>
          </section>

          <footer className="pt-12 border-t border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
            Protocol Index: K4K-L-2026-X99
          </footer>
        </div>
      </div>
    </div>
  );
}