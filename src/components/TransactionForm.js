import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

const pulseVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 0px 20px rgba(34, 211, 238, 0.4)",
    transition: { duration: 0.3, yoyo: Infinity }
  },
  tap: { scale: 0.98 }
};

export default function TransactionForm({
  handleSubmitTransaction, editingId, title, setTitle, amount, handleAmountChange, 
  addQuickAmount, setAmount, type, setType, category, setCategory, 
  paymentMethod, setPaymentMethod, transactionDate, setTransactionDate
}) {
  return (
    <motion.div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-800/80 shadow-xl h-fit" variants={itemVariants}>
      <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 text-zinc-400 flex items-center gap-2">
        <motion.span className="w-2 h-2 rounded-full bg-cyan-400" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        {editingId ? "Edit Transaksi" : "Catat Transaksi"}
      </h2>
      <form onSubmit={handleSubmitTransaction} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button type="button" onClick={() => setType("expense")} className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${type === "expense" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}>Keluar</button>
          <button type="button" onClick={() => setType("income")} className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${type === "income" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}>Masuk</button>
        </div>
        
        <motion.input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Catatan Singkat" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none transition-colors" required whileFocus={{ scale: 1.03 }} />
        
        <div>
          <motion.input type="text" value={amount ? Number(amount.toString().replace(/\D/g, "")).toLocaleString("id-ID") : ""} onChange={handleAmountChange} placeholder="Nominal (Rp)" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-cyan-400 font-black focus:border-cyan-500 outline-none transition-colors" required whileFocus={{ scale: 1.03 }} />
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {[5000, 10000, 20000, 50000].map((val) => (
              <motion.button key={val} type="button" onClick={() => addQuickAmount(val)} className="text-[10px] font-bold bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 px-3 py-1.5 rounded-lg text-zinc-300 transition-colors" variants={buttonVariants} whileHover="hover" whileTap="tap">+{val/1000}rb</motion.button>
            ))}
            <motion.button type="button" onClick={() => setAmount("")} className="text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg ml-auto transition-colors" variants={buttonVariants} whileHover="hover" whileTap="tap">Reset</motion.button>
          </div>
        </div>

        {type === "expense" && (
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none hover:border-zinc-600 transition-colors">
            <option value="Makan/Minum">🍔 Makan/Minum</option>
            <option value="Kos/Listrik">⚡ Kos/Listrik</option>
            <option value="Tugas Kuliah">📚 Tugas Kuliah</option>
            <option value="Self-Reward">☕ Self-Reward</option>
            <option value="Transportasi">🏍️ Transportasi</option>
          </select>
        )}
        
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none hover:border-zinc-600 transition-colors">
          <option value="Cash">💵 Cash</option>
          <option value="QRIS">📱 QRIS / E-Wallet</option>
        </select>
        
        <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none hover:border-zinc-600 transition-colors" style={{ colorScheme: "dark" }} required />
        
        <motion.button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-colors mt-2" variants={pulseVariants} whileHover="hover" whileTap="tap">{editingId ? "Simpan Perubahan" : "Simpan Transaksi"}</motion.button>
      </form>
    </motion.div>
  );
}