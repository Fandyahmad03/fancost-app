import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

export default function BudgetSection({
  monthlyBudget, inputBudget, inputDays, handleBudgetChange, setInputDays,
  handleSaveBudget, progressBarColor, budgetPercentage, remainingBudget,
  calculatedRemainingDays, targetDays, dailyQuota, alertTextColor
}) {
  return (
    <motion.div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-5 shadow-xl space-y-4" variants={itemVariants}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
          <span>🎯</span> Smart Budgeting & Alarm
        </h2>
        <form onSubmit={handleSaveBudget} className="flex gap-2 w-full md:w-auto">
          <input type="text" value={inputBudget ? Number(inputBudget).toLocaleString("id-ID") : ""} onChange={handleBudgetChange} placeholder="Limit Nominal (Rp)" className="px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-cyan-400 font-bold w-full md:w-40 outline-none" required />
          <input type="number" value={inputDays} onChange={(e) => setInputDays(e.target.value)} placeholder="Hari" className="px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white w-20 outline-none text-center" min="1" required />
          <motion.button type="submit" className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors" variants={buttonVariants} whileHover="hover" whileTap="tap">Kunci</motion.button>
        </form>
      </div>

      {monthlyBudget > 0 && (
        <div className="space-y-3">
          <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800/50 overflow-hidden">
            <motion.div className={`h-full ${progressBarColor}`} style={{ width: `${Math.min(100, budgetPercentage)}%` }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, budgetPercentage)}%` }} transition={{ duration: 1, ease: "easeOut" }}></motion.div>
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
    </motion.div>
  );
}