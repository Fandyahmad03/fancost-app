// File: src/components/Dashboard.js
"use client";

import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useDashboardLogic } from "@/hooks/useDashboardLogic";

// IMPORT KOMPONEN ANAK
import AboutPage from "./AboutPage"; 
import BudgetSection from "./BudgetSection";
import TransactionForm from "./TransactionForm";
import DashboardCharts from "./DashboardCharts";
import TransactionHistory from "./TransactionHistory";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

export default function Dashboard({ session }) {
  // PANGGIL JURUS ULTIMATE CUSTOM HOOK
  const logic = useDashboardLogic(session);

  if (logic.showAbout) return <AboutPage onClose={() => logic.setShowAbout(false)} />;

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans relative pb-12 selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div className="flex items-center gap-2.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <motion.div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]" whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }} transition={{ duration: 0.3 }}>
              <span className="text-black text-[10px] font-black">F</span>
            </motion.div>
            <span className="text-xl font-black text-white tracking-tight">FANCOST<motion.span className="text-cyan-400" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>.</motion.span></span>
          </motion.div>
          
          <motion.div className="flex items-center gap-3 md:gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <motion.button onClick={() => logic.setShowAbout(true)} className="text-zinc-400 hover:text-cyan-400 text-[10px] font-black uppercase tracking-widest transition-colors" whileHover={{ scale: 1.05 }}>Tentang</motion.button>
            <motion.button onClick={() => supabase.auth.signOut()} className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 text-zinc-400 hover:text-white px-3 md:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all" variants={buttonVariants} whileHover="hover" whileTap="tap">Keluar</motion.button>
          </motion.div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <motion.main className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* COMPONENT: BUDGET SECTION */}
        <BudgetSection 
          monthlyBudget={logic.monthlyBudget} inputBudget={logic.inputBudget} inputDays={logic.inputDays}
          handleBudgetChange={logic.handleBudgetChange} setInputDays={logic.setInputDays} handleSaveBudget={logic.handleSaveBudget}
          progressBarColor={logic.progressBarColor} budgetPercentage={logic.budgetPercentage} remainingBudget={logic.remainingBudget}
          calculatedRemainingDays={logic.calculatedRemainingDays} targetDays={logic.targetDays} dailyQuota={logic.dailyQuota} alertTextColor={logic.alertTextColor}
        />

        {/* TAB FILTER */}
        <motion.div className="flex bg-zinc-900/40 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800/80 overflow-x-auto gap-1 no-scrollbar" variants={itemVariants}>
          {[{ id: "all", label: "Semua" }, { id: "day", label: "Per Hari" }, { id: "week", label: "Per Minggu" }, { id: "month", label: "Per Bulan" }, { id: "3months", label: "Per 3 Bulan" }, { id: "year", label: "Per Tahun" }].map((tab) => (
            <motion.button key={tab.id} onClick={() => logic.setTimeFilter(tab.id)} className={`flex-1 whitespace-nowrap text-center py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${logic.timeFilter === tab.id ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white"}`} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* REKAP SALDO KAS */}
        <motion.div className="grid grid-cols-3 gap-3" variants={itemVariants}>
          <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 text-center md:text-left hover:border-zinc-700 transition-colors">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate mb-1">Kas Netto ({logic.getFilterLabel()})</p>
            <motion.p className={`text-sm md:text-lg font-black truncate ${logic.totalBalance >= 0 ? "text-white" : "text-amber-500"}`} animate={{ scale: logic.totalBalance >= 0 ? 1 : [1, 1.05, 1], transition: { duration: 0.3 } }}>Rp {logic.totalBalance.toLocaleString("id-ID")}</motion.p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 text-center md:text-left hover:border-zinc-700 transition-colors">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate mb-1">Pemasukan ({logic.getFilterLabel()})</p>
            <p className="text-sm md:text-lg font-black text-emerald-400 truncate">+Rp {logic.totalIncome.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 text-center md:text-left hover:border-zinc-700 transition-colors">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate mb-1">Pengeluaran ({logic.getFilterLabel()})</p>
            <p className="text-sm md:text-lg font-black text-rose-400 truncate">-Rp {logic.totalExpense.toLocaleString("id-ID")}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COMPONENT: FORM TRANSAKSI */}
          <TransactionForm 
            handleSubmitTransaction={logic.handleSubmitTransaction} editingId={logic.editingId}
            title={logic.title} setTitle={logic.setTitle} amount={logic.amount} handleAmountChange={logic.handleAmountChange}
            addQuickAmount={logic.addQuickAmount} setAmount={logic.setAmount} type={logic.type} setType={logic.setType}
            category={logic.category} setCategory={logic.setCategory} paymentMethod={logic.paymentMethod}
            setPaymentMethod={logic.setPaymentMethod} transactionDate={logic.transactionDate} setTransactionDate={logic.setTransactionDate}
          />

          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            {/* COMPONENT: CHARTS */}
            {logic.filteredTransactions.filter(t => t.type === 'expense').length > 0 && (
              <DashboardCharts 
                isMounted={logic.isMounted} categoryChartData={logic.categoryChartData} 
                methodChartData={logic.methodChartData} COLORS={logic.COLORS} 
              />
            )}

            {/* COMPONENT: RIWAYAT TRANSAKSI */}
            <TransactionHistory 
              getFilterLabel={logic.getFilterLabel} filteredTransactions={logic.filteredTransactions}
              sortedDates={logic.sortedDates} groupedTransactions={logic.groupedTransactions}
              startEdit={logic.startEdit} deleteTransaction={logic.deleteTransaction}
            />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}