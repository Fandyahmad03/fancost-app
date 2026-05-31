// File: src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard"; // Memanggil komponen UI utama yang kamu kirim tadi

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // 1. Cek apakah ada user yang sedang login di Supabase
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      
      if (!activeSession) {
        // 2. JIKA BELUM LOGIN: Langsung tendang balik ke halaman "/" (Halaman Login)
        router.push("/");
      } else {
        // 3. JIKA SUDAH LOGIN: Simpan datanya dan izinkan masuk
        setSession(activeSession);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  // Tampilkan loading berputar sebentar pas sistem lagi nge-cek akun
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Memeriksa Akses...</p>
        </div>
      </div>
    );
  }

  // Jika lolos pemeriksaan (sudah login), tampilkan komponen Dashboard rapih milikmu
  return <Dashboard session={session} />;
}