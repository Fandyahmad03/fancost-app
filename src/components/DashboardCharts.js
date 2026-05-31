import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function DashboardCharts({ isMounted, categoryChartData, methodChartData, COLORS }) {
  if (!isMounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-zinc-900/40 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-colors">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4">Berdsr. Kategori</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={categoryChartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                {categoryChartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-zinc-900/40 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-colors">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4">Cash vs Digital</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={methodChartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                {methodChartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[(i + 2) % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}