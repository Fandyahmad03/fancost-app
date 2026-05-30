"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 1. Ambil sesi login saat ini secara real-time
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    // 2. Pantau perubahan status (Login / Logout / Register)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Efek Loading Transisi yang Halus
  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // JIKA BELUM LOGIN -> Tampilkan Landing Page Agensi/SaaS Profesional
  // JIKA SUDAH LOGIN -> Bypass langsung ke Core Dashboard Finansial
  return session ? <Dashboard session={session} /> : <LandingPage />;
}