"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Kata sandi minimal 6 karakter bos!");
      setLoading(false);
      return;
    }

    // Fungsi sakti Supabase untuk nyimpen password baru
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError("Gagal ganti kata sandi: " + error.message);
    } else {
      setMessage("Mantap! Kata sandi berhasil diubah. Mengalihkan ke halaman login...");
      // Balik ke halaman utama (login) setelah 3 detik
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background efek biar tetep estetik */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Buat Kata Sandi Baru</h2>
        <p className="text-zinc-400 text-xs mb-6 font-medium leading-relaxed">
          Silakan masukkan kata sandi baru untuk akun Fancost kamu. Pastikan gampang diingat ya!
        </p>

        {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl">⚠️ {error}</div>}
        {message && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl">✅ {message}</div>}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Kata Sandi Baru</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-zinc-700 shadow-inner" 
              placeholder="Minimal 6 karakter" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-4 shadow-lg active:scale-95"
          >
            {loading ? "Memproses..." : "Simpan Kata Sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}