// File: src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthPage from "@/components/AuthPage"; // Import file yang baru dibuat
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Kalau tidak ada session (belum login), tampilkan halaman form merah-merah tadi
  if (!session) {
    return <AuthPage />;
  }

  // Kalau sudah login, tampilkan Dashboard Fancost
  return <Dashboard session={session} />;
}