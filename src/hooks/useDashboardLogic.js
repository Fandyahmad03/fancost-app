// File: src/hooks/useDashboardLogic.js
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useDashboardLogic(session) {
  const [isMounted, setIsMounted] = useState(false);
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
      fetchTransactions();
      fetchBudget();
    }
  }, [session]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
  };

  const fetchBudget = async () => {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", session?.user?.id)
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
    const { error } = await supabase.from("budgets").upsert({ 
      user_id: session.user.id, month: currentMonthStr, amount: cleanBudget, target_days: cleanDays, start_date: todayDate
    }, { onConflict: 'user_id,month' });

    if (!error) {
      setMonthlyBudget(cleanBudget); setTargetDays(cleanDays); setBudgetStartDate(todayDate);
      alert("Aturan jatah harian berhasil dikunci! 🔒");
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.toString().replace(/\D/g, ""));
    if (!title || !cleanAmount) return alert("Isi nama dan nominalnya dulu bos!");

    const payload = {
      user_id: session.user.id, title, amount: cleanAmount, type, 
      category: type === "expense" ? category : "Pemasukan", 
      payment_method: paymentMethod, transaction_date: transactionDate,
    };

    if (editingId) {
      const { error } = await supabase.from("transactions").update(payload).eq("id", editingId);
      if (!error) { alert("Transaksi Berhasil Diperbarui! 📝"); setEditingId(null); }
    } else {
      const { error } = await supabase.from("transactions").insert([payload]);
      if (error) alert("Gagal simpan data: " + error.message);
    }
    setTitle(""); setAmount(""); fetchTransactions();
  };

  const startEdit = (t) => {
    setEditingId(t.id); setTitle(t.title); setAmount(t.amount.toString());
    setType(t.type); setCategory(t.category); setPaymentMethod(t.payment_method);
    setTransactionDate(t.transaction_date);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Yakin mau hapus?")) return;
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) fetchTransactions();
  };

  // --- LOGIKA KALKULASI & FILTER ---
  const filteredTransactions = transactions.filter((t) => {
    if (timeFilter === "all") return true;
    const [tYear, tMonth, tDay] = t.transaction_date.split('-').map(Number);
    const tDate = new Date(tYear, tMonth - 1, tDay); tDate.setHours(0,0,0,0);
    const today = new Date();
    const diffDays = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));

    if (timeFilter === "day") return tYear === today.getFullYear() && tMonth === (today.getMonth() + 1) && tDay === today.getDate();
    if (timeFilter === "week") return diffDays >= 0 && diffDays < 7;
    if (timeFilter === "month") return tMonth === (today.getMonth() + 1) && tYear === today.getFullYear();
    if (timeFilter === "3months") return diffDays >= 0 && diffDays < 90;
    if (timeFilter === "year") return tYear === today.getFullYear();
    return true;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalBalance = totalIncome - totalExpense;

  const getFilterLabel = () => {
    switch (timeFilter) {
      case "day": return "Hari Ini"; case "week": return "Minggu Ini";
      case "month": return "Bulan Ini"; case "3months": return "3 Bulan Ini";
      case "year": return "Tahun Ini"; default: return "Semua";
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
    groups[date].push(transaction); return groups;
  }, {});
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

  const handleAmountChangeDirect = (val) => setAmount(val);
  const handleDaysChangeDirect = (val) => setInputDays(val);

  return {
    isMounted, showAbout, setShowAbout, editingId, title, setTitle, amount, setAmount,
    type, setType, category, setCategory, paymentMethod, setPaymentMethod,
    transactionDate, setTransactionDate, timeFilter, setTimeFilter, monthlyBudget,
    targetDays, budgetStartDate, inputBudget, inputDays, setInputDays, COLORS,
    handleSaveBudget, handleSubmitTransaction, startEdit, deleteTransaction,
    filteredTransactions, totalIncome, totalExpense, totalBalance, getFilterLabel,
    calculatedRemainingDays, budgetPercentage, remainingBudget, dailyQuota,
    progressBarColor, alertTextColor, categoryChartData, methodChartData,
    handleAmountChange, handleBudgetChange, addQuickAmount, sortedDates, groupedTransactions
  };
}