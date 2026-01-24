import { Info, Gavel, RefreshCw, Database } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-24 selection:bg-blue-600">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            Terms of <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-gray-500 text-lg">System Operating Procedures & User Guidelines.</p>
        </header>

        <div className="space-y-20">
          <section className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Gavel size={14} className="text-blue-500"/> 1.0 System Access
            </h3>
            <p className="text-gray-400 leading-relaxed">
              By accessing the Kroma4K Archive, you are engaging with a specialized delivery system for high-resolution neural data. Use of this site implies full consent to these terms. Kroma4K is intended for users who demand professional-grade visual fidelity and understand the nature of AI-generated content.
            </p>
          </section>

          <section className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Database size={14} className="text-blue-500"/> 2.0 Data Integrity & Scraping
            </h3>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
              <p className="text-gray-400 text-sm">
                The Kroma4K infrastructure is optimized for human browsing. Automated data extraction (Web Scraping), mass-downloading via bots, or attempts to harvest our specific FLUX prompt engineering metadata are strictly prohibited. 
              </p>
              <div className="flex items-center gap-3 text-red-500/80 font-black text-[10px] uppercase tracking-widest bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                <Info size={14}/> Automatic IP Blacklisting is active for high-velocity requests.
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <RefreshCw size={14} className="text-blue-500"/> 3.0 Service Availability
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Kroma4K operates on a "Dynamic Archive" model. Assets may be added, rotated, or archived permanently based on aesthetic quality and server load. We do not guarantee the perpetual availability of any specific image. Users are encouraged to "Deploy" (Download) their preferred assets immediately.
            </p>
          </section>

          <section className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Info size={14} className="text-blue-500"/> 4.0 Disclaimer
            </h3>
            <p className="text-gray-400 italic text-sm border-l-2 border-blue-600 pl-6">
              KROMA4K PROVIDES NEURAL ASSETS "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE ARE NOT LIABLE FOR ANY DISPLAY HARDWARE MALFUNCTION OR DATA LOSS RESULTING FROM THE DOWNLOAD OF THESE EXTREMELY HIGH-RESOLUTION FILES.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}