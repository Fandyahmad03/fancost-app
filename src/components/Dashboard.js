"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import AboutPage from "./AboutPage"; // <-- PASTIKAN NAMA FILE DAN LOKASINYA BENAR

export default function Dashboard({ session }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // State untuk navigasi halaman About
  const [showAbout, setShowAbout] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Makan/Minum");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const [timeFilter, setTimeFilter] = useState("all"); 

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [targetDays, setTargetDays] = useState(30);
  const [budgetStartDate, setBudgetStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputBudget, setInputBudget] = useState("");
  const [inputDays, setInputDays] = useState("");

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const COLORS = ['#22d3ee', '#6366f1', '#3b82f6', '#10b981', '#f43f5e'];

  useEffect(() => {
    setIsMounted(true);
    if (session) {
      fetchTransactions(session.user.id);
      fetchBudget(session.user.id);
    }
  }, [session]);

  const fetchTransactions = async (userId) => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (data) setTransactions(data);
  };

  const fetchBudget = async (userId) => {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("month", currentMonthStr)
      .single();

    if (data) {
      setMonthlyBudget(Number(data.amount));
      setInputBudget(data.amount.toString());
      setTargetDays(data.target_days || 30);
      setInputDays((data.target_days || 30).toString());
      setBudgetStartDate(data.start_date || new Date().toISOString().split('T')[0]);
    }
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const cleanBudget = parseFloat(inputBudget.replace(/\D/g, ""));
    const cleanDays = parseInt(inputDays);

    if (!cleanBudget || !cleanDays) return alert("Masukkan nominal saldo dan target hari yang valid!");
    const todayDate = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from("budgets")
      .upsert({ 
        user_id: session.user.id, 
        month: currentMonthStr, 
        amount: cleanBudget,
        target_days: cleanDays,
        start_date: todayDate
      }, { onConflict: 'user_id,month' });

    if (!error) {
      setMonthlyBudget(cleanBudget);
      setTargetDays(cleanDays);
      setBudgetStartDate(todayDate);
      alert("Aturan jatah harian berhasil dikunci! 🔒");
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.toString().replace(/\D/g, ""));
    if (!title || !cleanAmount) return alert("Isi nama dan nominalnya dulu bos!");

    const payload = {
      user_id: session.user.id,
      title,
      amount: cleanAmount,
      type,
      category: type === "expense" ? category : "Pemasukan",
      payment_method: paymentMethod,
      transaction_date: transactionDate,
    };

    if (editingId) {
      const { error } = await supabase.from("transactions").update(payload).eq("id", editingId);
      if (!error) { alert("Transaksi Berhasil Diperbarui! 📝"); setEditingId(null); }
    } else {
      const { error } = await supabase.from("transactions").insert([payload]);
      if (error) alert("Gagal simpan data: " + error.message);
    }

    setTitle("");
    setAmount("");
    fetchTransactions(session.user.id);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setTitle(t.title);
    setAmount(t.amount.toString());
    setType(t.type);
    setCategory(t.category);
    setPaymentMethod(t.payment_method);
    setTransactionDate(t.transaction_date);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Yakin mau hapus?")) return;
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) fetchTransactions(session.user.id);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (timeFilter === "all") return true;
    
    const [tYear, tMonth, tDay] = t.transaction_date.split('-').map(Number);
    const tDate = new Date(tYear, tMonth - 1, tDay);
    tDate.setHours(0,0,0,0);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const todayMidnight = new Date(currentYear, currentMonth, currentDay);

    const diffTime = todayMidnight.getTime() - tDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (timeFilter === "day") return tYear === currentYear && tMonth === (currentMonth + 1) && tDay === currentDay;
    if (timeFilter === "week") return diffDays >= 0 && diffDays < 7;
    if (timeFilter === "month") return tMonth === (currentMonth + 1) && tYear === currentYear;
    if (timeFilter === "3months") return diffDays >= 0 && diffDays < 90;
    if (timeFilter === "year") return tYear === currentYear;
    return true;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalBalance = totalIncome - totalExpense;

  const getFilterLabel = () => {
    switch (timeFilter) {
      case "day": return "Hari Ini";
      case "week": return "Minggu Ini";
      case "month": return "Bulan Ini";
      case "3months": return "3 Bulan Ini";
      case "year": return "Tahun Ini";
      default: return "Semua";
    }
  };

  const totalExpenseAll = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const todayObj = new Date(); todayObj.setHours(0,0,0,0);
  const startObj = new Date(budgetStartDate); startObj.setHours(0,0,0,0);
  const elapsedDays = Math.floor((todayObj - startObj) / (1000 * 60 * 60 * 24));
  const calculatedRemainingDays = Math.max(1, targetDays - elapsedDays);

  const budgetPercentage = monthlyBudget > 0 ? (totalExpenseAll / monthlyBudget) * 100 : 0;
  const remainingBudget = monthlyBudget - totalExpenseAll;
  const dailyQuota = remainingBudget > 0 ? remainingBudget / calculatedRemainingDays : 0;

  let progressBarColor = "bg-emerald-500"; let alertTextColor = "text-emerald-400";
  if (budgetPercentage >= 51 && budgetPercentage <= 80) { progressBarColor = "bg-amber-500"; alertTextColor = "text-amber-400"; }
  else if (budgetPercentage > 80) { progressBarColor = "bg-rose-500"; alertTextColor = "text-rose-400"; }

  const expensesByCategory = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Number(t.amount); return acc; }, {});
  const categoryChartData = Object.keys(expensesByCategory).map(key => ({ name: key, value: expensesByCategory[key] }));

  const expensesByMethod = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => { acc[t.payment_method] = (acc[t.payment_method] || 0) + Number(t.amount); return acc; }, {});
  const methodChartData = Object.keys(expensesByMethod).map(key => ({ name: key, value: expensesByMethod[key] }));

  const handleAmountChange = (e) => setAmount(e.target.value.replace(/\D/g, ""));
  const handleBudgetChange = (e) => setInputBudget(e.target.value.replace(/\D/g, ""));
  const addQuickAmount = (val) => setAmount((prev) => ((Number(prev.toString().replace(/\D/g, "")) || 0) + val).toString());

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.transaction_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));


  // ==========================================
  // JIKA SHOW ABOUT TRUE, TAMPILKAN ABOUT PAGE
  // ==========================================
  if (showAbout) {
    return <AboutPage onClose={() => setShowAbout(false)} />;
  }

  // ==========================================
  // JIKA SHOW ABOUT FALSE, TAMPILKAN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans relative pb-12 selection:bg-cyan-500/30 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="text-black text-[10px] font-black">F</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">FANCOST<span className="text-cyan-400">.</span></span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setShowAbout(true)} className="text-zinc-400 hover:text-cyan-400 text-[10px] font-black uppercase tracking-widest transition-colors">Tentang</button>
            <button onClick={() => supabase.auth.signOut()} className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 text-zinc-400 hover:text-white px-3 md:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Keluar</button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
              <span>🎯</span> Smart Budgeting & Alarm
            </h2>
            <form onSubmit={handleSaveBudget} className="flex gap-2 w-full md:w-auto">
              <input type="text" value={inputBudget ? Number(inputBudget).toLocaleString("id-ID") : ""} onChange={handleBudgetChange} placeholder="Limit Nominal (Rp)" className="px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-cyan-400 font-bold w-full md:w-40 outline-none" required />
              <input type="number" value={inputDays} onChange={(e) => setInputDays(e.target.value)} placeholder="Hari" className="px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white w-20 outline-none text-center" min="1" required />
              <button type="submit" className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Kunci</button>
            </form>
          </div>

          {monthlyBudget > 0 && (
            <div className="space-y-3">
              <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800/50 overflow-hidden">
                <div className={`h-full ${progressBarColor} transition-all duration-500`} style={{ width: `${Math.min(100, budgetPercentage)}%` }}></div>
              </div>
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 flex justify-between items-center gap-2">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sisa Anggaran <span className="text-cyan-400 text-sm ml-1">Rp {Math.max(0, remainingBudget).toLocaleString("id-ID")}</span></p>
                  <p className="text-[10px] text-zinc-500 mt-1">Tersisa {calculatedRemainingDays} hari lagi dari target {targetDays} hari.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jatah Harian:</p>
                  <p className={`text-base md:text-lg font-black mt-0.5 ${alertTextColor}`}>Rp {Math.round(dailyQuota).toLocaleString("id-ID")} <span className="text-[10px] text-zinc-500 font-normal">/ hari</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex bg-zinc-900/40 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800/80 overflow-x-auto gap-1 no-scrollbar">
          {[
            { id: "all", label: "Semua" },
            { id: "day", label: "Per Hari" },
            { id: "week", label: "Per Minggu" },
            { id: "month", label: "Per Bulan" },
            { id: "3months", label: "Per 3 Bulan" },
            { id: "year", label: "Per Tahun" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setTimeFilter(tab.id)} className={`flex-1 whitespace-nowrap text-center py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === tab.id ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 text-center md:text-left">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate mb-1">Kas Netto ({getFilterLabel()})</p>
            <p className={`text-sm md:text-lg font-black truncate ${totalBalance >= 0 ? "text-white" : "text-amber-500"}`}>Rp {totalBalance.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 text-center md:text-left">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate mb-1">Pemasukan ({getFilterLabel()})</p>
            <p className="text-sm md:text-lg font-black text-emerald-400 truncate">+Rp {totalIncome.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 text-center md:text-left">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate mb-1">Pengeluaran ({getFilterLabel()})</p>
            <p className="text-sm md:text-lg font-black text-rose-400 truncate">-Rp {totalExpense.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-800/80 shadow-xl h-fit">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {editingId ? "Edit Transaksi" : "Catat Transaksi"}
            </h2>
            <form onSubmit={handleSubmitTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button type="button" onClick={() => setType("expense")} className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${type === "expense" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}>Keluar</button>
                <button type="button" onClick={() => setType("income")} className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${type === "income" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}>Masuk</button>
              </div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Catatan Singkat" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none transition-colors" required />
              <div>
                <input type="text" value={amount ? Number(amount.toString().replace(/\D/g, "")).toLocaleString("id-ID") : ""} onChange={handleAmountChange} placeholder="Nominal (Rp)" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-cyan-400 font-black focus:border-cyan-500 outline-none transition-colors" required />
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                  {[5000, 10000, 20000, 50000].map((val) => (
                    <button key={val} type="button" onClick={() => addQuickAmount(val)} className="text-[10px] font-bold bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 px-3 py-1.5 rounded-lg text-zinc-300 transition-colors">+{val/1000}rb</button>
                  ))}
                  <button type="button" onClick={() => setAmount("")} className="text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg ml-auto transition-colors">Reset</button>
                </div>
              </div>
              {type === "expense" && (
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none">
                  <option value="Makan/Minum">🍔 Makan/Minum</option>
                  <option value="Kos/Listrik">⚡ Kos/Listrik</option>
                  <option value="Tugas Kuliah">📚 Tugas Kuliah</option>
                  <option value="Self-Reward">☕ Self-Reward</option>
                  <option value="Transportasi">🏍️ Transportasi</option>
                </select>
              )}
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none">
                <option value="Cash">💵 Cash</option>
                <option value="QRIS">📱 QRIS / E-Wallet</option>
              </select>
              
              <input 
                type="date" 
                value={transactionDate} 
                onChange={(e) => setTransactionDate(e.target.value)} 
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none"
                style={{ colorScheme: "dark" }}
                required 
              />
              
              <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-colors mt-2">{editingId ? "Simpan Perubahan" : "Simpan Transaksi"}</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {filteredTransactions.filter(t => t.type === 'expense').length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/40 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4">Berdsr. Kategori</h3>
                  <div className="h-44">
                    {isMounted && (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                          <Pie data={categoryChartData} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value" stroke="none">
                            {categoryChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                          <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4">Cash vs Digital</h3>
                  <div className="h-44">
                    {isMounted && (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                          <Pie data={methodChartData} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value" stroke="none">
                            {methodChartData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                          <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800/80 shadow-xl overflow-hidden">
              <div className="p-5 bg-zinc-950/50 border-b border-zinc-800/50 flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Log Riwayat ({getFilterLabel()})</h2>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-bold px-3 py-1 border border-cyan-500/20 rounded-full">{filteredTransactions.length} item</span>
              </div>
              
              <div className="p-5 space-y-6 max-h-[550px] overflow-y-auto no-scrollbar">
                {sortedDates.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">Belum ada catatan transaksi.</div>
                ) : (
                  sortedDates.map((dateStr) => {
                    const dayTransactions = groupedTransactions[dateStr];
                    const dailyExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
                    const dailyIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);

                    const [y, m, d] = dateStr.split('-').map(Number);
                    let displayDate = new Date(y, m - 1, d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                    
                    if (dateStr === new Date().toISOString().split('T')[0]) displayDate = "Hari Ini";
                    else if (dateStr === new Date(Date.now() - 86400000).toISOString().split('T')[0]) displayDate = "Kemarin";

                    return (
                      <div key={dateStr} className="space-y-3">
                        <div className="flex justify-between items-center bg-zinc-950/50 px-4 py-2 rounded-xl border border-zinc-800/50">
                          <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">{displayDate}</span>
                          <div className="flex gap-3 text-[10px] font-bold">
                            {dailyIncome > 0 && <span className="text-emerald-400">+{dailyIncome.toLocaleString('id-ID')}</span>}
                            {dailyExpense > 0 && <span className="text-rose-400">-{dailyExpense.toLocaleString('id-ID')}</span>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {dayTransactions.map((t) => (
                            <div key={t.id} className="group flex justify-between items-center bg-zinc-950/30 hover:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800/50 transition-all">
                              <div className="flex items-center gap-4 max-w-[65%]">
                                <div className={`w-1 h-8 rounded-full shrink-0 ${t.type === 'income' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                                <div className="space-y-1 truncate">
                                  <p className="font-bold text-xs text-zinc-100 truncate">{t.title}</p>
                                  <div className="flex items-center gap-2 text-[9px] font-black tracking-widest uppercase">
                                    <span className="text-zinc-500">{t.payment_method === 'Cash' ? 'Cash' : 'QRIS'}</span>
                                    {t.type === 'expense' && (
                                      <>
                                        <span className="text-zinc-700">•</span>
                                        <span className="text-cyan-500">{t.category}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <span className={`text-xs md:text-sm font-black tracking-tight ${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                                  {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                                </span>
                                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button onClick={() => startEdit(t)} className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white p-2 rounded-lg transition-colors">🛠️</button>
                                  <button onClick={() => deleteTransaction(t.id)} className="text-[11px] bg-zinc-800 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-400 p-2 rounded-lg transition-colors">✕</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}