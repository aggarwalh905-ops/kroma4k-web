import { Shield, Globe, EyeOff, Lock, Server } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-24 selection:bg-blue-600">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            Privacy <span className="text-blue-600">Protocol</span>
          </h1>
          <p className="text-gray-500 text-lg tracking-wide uppercase font-bold text-[10px]">Security Clearance: Public // Archive Access</p>
        </header>

        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-4">
              <EyeOff size={32} className="text-blue-600 mb-2"/>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Zero Identity Tracking</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Kroma4K does not utilize tracking cookies, pixel trackers, or account-based identification. Your session remains anonymous. We do not sell user behavior data because we do not collect it.
              </p>
            </div>
            <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-4">
              <Lock size={32} className="text-blue-600 mb-2"/>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">LocalStorage Paradigm</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your "Upvotes" and preferences are stored in your browser's <strong>LocalStorage</strong>. This data never leaves your machine unless you interact with our Firebase-powered "Like" counter.
              </p>
            </div>
          </div>

          <section className="space-y-8">
            <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4">Infrastructure Partners</h3>
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="shrink-0 h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                  <Server size={20} className="text-blue-500"/>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase mb-1">Google Firebase</h4>
                  <p className="text-gray-500 text-xs">Used for real-time like counts and global archive metadata. Operates under standard SOC 2 Type II security compliance.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                  <Globe size={20} className="text-blue-500"/>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase mb-1">Pollinations AI</h4>
                  <p className="text-gray-500 text-xs">The generation engine for latent data synthesis. Their privacy policy applies during the image creation phase.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-blue-600 p-12 rounded-[3.5rem] text-center">
            <Shield size={40} className="text-white mx-auto mb-6"/>
            <h2 className="text-white font-black uppercase tracking-[0.2em] text-xl mb-4">Encryption is Standard</h2>
            <p className="text-white/80 text-sm max-w-xl mx-auto">
              All data transmitted between your hardware and the Kroma4K servers is protected by 256-bit TLS encryption. Your visual exploration is private by design.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}