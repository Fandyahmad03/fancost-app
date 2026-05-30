"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [simulatedBudget, setSimulatedBudget] = useState(75);

  // Array teks yang akan berganti-ganti
  const headlines = [
    "Uangmu Bocor?", 
    "Gaji Numpang Lewat?", 
    "Tabungan Susah Nambah?"
  ];
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Timer untuk mengganti teks setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert("Gagal Daftar: " + error.message);
      else alert("Berhasil daftar! Silakan cek email / langsung masuk.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Gagal Login: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans relative overflow-x-hidden flex flex-col">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* NAVBAR */}
      <header className="relative z-20 max-w-6xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <span className="text-black text-xs font-black">F</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            FANCOST<span className="text-cyan-400">.</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20 uppercase tracking-wider">
            Verified & Secure
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-20 max-w-6xl mx-auto w-full px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1 items-center">
        
        {/* SISI KIRI: Headline Utama & Showcase */}
        <div className="space-y-8">
          
          <div className="space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-300 tracking-wide">Engine Finansial Generasi Baru</span>
            </motion.div>

            {/* HEADLINE YANG BERGANTI-GANTI - Diperbaiki tingginya agar tidak menumpuk */}
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight min-h-[130px] sm:min-h-[100px] flex flex-col justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="block"
                >
                  {headlines[headlineIndex]}
                </motion.div>
              </AnimatePresence>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent block mt-1">
                Kunci Dengan Presisi.
              </span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-light mt-4"
            >
              Hentikan kebiasaan mencatat manual yang melelahkan. Fancost melacak, mengalokasikan limit harian, dan mengamankan tabungan Anda dalam satu arsitektur aman.
            </motion.p>
          </div>

          {/* SYSTEM BENTO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
            
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-md sm:col-span-2 flex flex-col sm:flex-row gap-4 justify-between items-center"
            >
              <div className="space-y-1 text-left w-full">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Interactive Limit</div>
                <h3 className="text-sm font-bold text-white">Simulasi Jatah Harian</h3>
              </div>
              <div className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-zinc-400">Sisa Anggaran:</span>
                  <span className="text-cyan-400">{simulatedBudget}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" 
                  value={simulatedBudget} 
                  onChange={(e) => setSimulatedBudget(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-md flex flex-col justify-center text-left"
            >
              <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                <span>📊</span> Analitik Cerdas
              </h4>
              <p className="text-[11px] text-zinc-500 font-medium">Visualisasi perbandingan kas instan.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-md flex flex-col justify-center text-left"
            >
              <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                <span>⚡</span> Cloud Sync
              </h4>
              <p className="text-[11px] text-zinc-500 font-medium">Data tersimpan aman (End-to-End).</p>
            </motion.div>

          </div>
        </div>

        {/* SISI KANAN: Form Autentikasi */}
        <div className="w-full max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-zinc-900/70 border border-zinc-800 rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="space-y-2 mb-8 text-left">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isRegister ? "Buat Akun Baru" : "Masuk ke Sistem"}
              </h2>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                {isRegister ? "Langkah awal mengamankan masa depan finansial teratur Anda." : "Gunakan alamat email terdaftar untuk mengakses radar keuangan."}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner placeholder:text-zinc-700" 
                  placeholder="nama@email.com" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Kata Sandi</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner placeholder:text-zinc-700" 
                  placeholder="••••••••" 
                />
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all mt-4 disabled:opacity-40 flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : isRegister ? (
                  "Daftar Akun Gratis"
                ) : (
                  "Akses Dashboard"
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors"
              >
                {isRegister ? "Sudah punya akun? Masuk di sini" : "Belum punya akun? Daftar gratis sekarang"}
              </button>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}