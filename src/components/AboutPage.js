// File: src/components/AboutPage.js
import React from "react";

export default function AboutPage({ onClose }) {
  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans relative pb-12 selection:bg-cyan-500/30 animate-in fade-in duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Navbar Khusus About */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <button 
            onClick={onClose} 
            className="group flex items-center gap-2.5 text-zinc-400 hover:text-cyan-400 text-xs font-black uppercase tracking-widest transition-colors py-2"
          >
            <span className="inline-block group-hover:-translate-x-1 transition-transform duration-300 text-sm leading-none font-normal">
              ←
            </span> 
            <span className="leading-none pt-0.5">
              Kembali ke Dashboard
            </span>
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-12 space-y-16">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.4)] transition-all duration-500 cursor-default">
            <span className="text-black text-5xl font-black">F</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">FANCOST<span className="text-cyan-400">.</span></h1>
            <p className="text-[10px] md:text-xs text-cyan-400 font-bold tracking-[0.3em] uppercase">Smart Financial Management</p>
          </div>
          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Platform pencatatan keuangan pribadi yang dirancang dengan antarmuka modern dan fitur analitik cerdas. Membantu Anda memantau arus kas, menetapkan batas pengeluaran harian, dan mengontrol keuangan dengan presisi.
          </p>
        </div>

        {/* FITUR & TEKNOLOGI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 fill-mode-both">
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-800/80 hover:border-cyan-500/30 transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Core Features
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Real-time Transaction Tracking</li>
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Smart Daily Budget Quota</li>
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Interactive Visual Analytics</li>
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Multi-period Data Filtering</li>
            </ul>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-800/80 hover:border-indigo-500/30 transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'Recharts'].map((tech) => (
                <span key={tech} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:border-zinc-600 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DEVELOPER PROFILE SECTION */}
        <div className="bg-zinc-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-zinc-800/80 text-center space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 fill-mode-both hover:bg-zinc-900/60 transition-all">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Developed By</p>
          
          {/* SILAKAN GANTI KONTEN PROFIL KAMU DI SINI */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">FANDY AHMAD</h2>
            <p className="text-xs md:text-sm text-cyan-400 font-medium mt-1">Frontend Developer / Software Engineer</p>
          </div>
          
          <p className="text-xs text-zinc-400 max-w-lg mx-auto pb-4">
            Berdedikasi untuk menciptakan aplikasi web yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang mulus dan estetika visual yang tinggi.
          </p>

          <div className="flex justify-center gap-4 pt-4 border-t border-zinc-800/80">
            <a href="https://github.com/Fandyahmad03" target="_blank" rel="noreferrer" className="text-xs font-bold text-zinc-400 hover:text-white bg-zinc-950 px-4 py-2 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all hover:-translate-y-1">
              GitHub
            </a>
            <a href="https://www.instagram.com/fandyahmad_____?igsh=MTUycmR1bmVqaTZocA%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="text-xs font-bold text-zinc-400 hover:text-white bg-zinc-950 px-4 py-2 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all hover:-translate-y-1">
              Instagram
            </a>
            <a href="https://linkedin.com/in/username-kamu" target="_blank" rel="noreferrer" className="text-xs font-bold text-zinc-400 hover:text-white bg-zinc-950 px-4 py-2 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-all hover:-translate-y-1">
              LinkedIn
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}