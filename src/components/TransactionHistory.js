import { motion } from "framer-motion";

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

export default function TransactionHistory({ 
  getFilterLabel, filteredTransactions, sortedDates, groupedTransactions, 
  startEdit, deleteTransaction 
}) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800/80 shadow-xl overflow-hidden hover:border-zinc-700 transition-colors">
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
              <motion.div key={dateStr} className="space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex justify-between items-center bg-zinc-950/50 px-4 py-2 rounded-xl border border-zinc-800/50">
                  <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">{displayDate}</span>
                  <div className="flex gap-3 text-[10px] font-bold">
                    {dailyIncome > 0 && <span className="text-emerald-400">+{dailyIncome.toLocaleString('id-ID')}</span>}
                    {dailyExpense > 0 && <span className="text-rose-400">-{dailyExpense.toLocaleString('id-ID')}</span>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayTransactions.map((t) => (
                    <motion.div key={t.id} className="group flex justify-between items-center bg-zinc-950/30 hover:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800/50 transition-all" whileHover={{ scale: 1.01, x: 5 }}>
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
                          <motion.button onClick={() => startEdit(t)} className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white p-2 rounded-lg transition-colors" variants={buttonVariants} whileHover="hover" whileTap="tap">🛠️</motion.button>
                          <motion.button onClick={() => deleteTransaction(t.id)} className="text-[11px] bg-zinc-800 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-400 p-2 rounded-lg transition-colors" variants={buttonVariants} whileHover="hover" whileTap="tap">✕</motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}