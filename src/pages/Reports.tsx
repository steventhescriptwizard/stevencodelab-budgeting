import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Share2, ArrowUpRight, ArrowDownRight, Wallet, Printer } from 'lucide-react';
import CalendarView from '@/components/ui/CalendarView';
import ReportPreviewModal from '@/components/ui/ReportPreviewModal';
import { useData } from '@/lib/data-context';

export default function Reports() {
  const { transactions, categories } = useData();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const reportData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        date: d.toISOString().split('T')[0],
        day: days[d.getDay()],
        income: 0,
        expense: 0
      };
    });

    transactions.forEach(t => {
      const dayData = last7Days.find(d => d.date === t.date);
      if (dayData) {
        if (t.type === 'income') dayData.income += t.amount;
        else dayData.expense += t.amount;
      }
    });

    return last7Days;
  }, [transactions]);

  const weeklyStats = useMemo(() => {
    const income = reportData.reduce((sum, d) => sum + d.income, 0);
    const expense = reportData.reduce((sum, d) => sum + d.expense, 0);
    return { income, expense, net: income - expense };
  }, [reportData]);

  const topSpending = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const total = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        label: name,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: categories.find(c => c.name === name)?.color || '#064c39'
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions, categories]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Weekly Financial Report</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {reportData[0]?.day}, {new Date(reportData[0]?.date).toLocaleDateString()} - {reportData[6]?.day}, {new Date(reportData[6]?.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm md:text-base">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-[#064c39]/5 dark:hover:bg-emerald-500/10 rounded-xl text-slate-600 dark:text-slate-400 transition-all shadow-sm hover:shadow-md group"
            title="Print Report"
          >
            <Printer className="w-5 h-5 group-hover:text-[#064c39] dark:group-hover:text-emerald-400 transition-colors" />
          </button>
          <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Weekly Income</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Rp {weeklyStats.income.toLocaleString('id-ID')}</h2>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold mt-2">+12.5% from last week</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Weekly Expense</span>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Rp {weeklyStats.expense.toLocaleString('id-ID')}</h2>
          <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-2">-5.2% from last week</p>
        </div>

        <div className="bg-[#064c39] dark:bg-emerald-900 rounded-2xl p-6 text-white shadow-xl shadow-[#064c39]/20 dark:shadow-emerald-900/20 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 font-medium">Net Cash Flow</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Rp {weeklyStats.net.toLocaleString('id-ID')}</h2>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-white h-full rounded-full w-[65%]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Income vs Expense</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#064c39] dark:bg-emerald-600"></div>
                <span className="text-slate-600 dark:text-slate-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-slate-600 dark:text-slate-400">Expense</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 md:h-80 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff', 
                    borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0',
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    borderWidth: '1px'
                  }}
                  itemStyle={{ color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a' }}
                />
                <Bar dataKey="income" fill="#064c39" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spending */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Top Spending</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">By categories this week</p>

          <div className="space-y-6">
            {topSpending.length > 0 ? topSpending.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">Rp {item.amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-700 relative" 
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  >
                    <div className="absolute inset-0 bg-white/10 animate-pulse-slow"></div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-10">No spending data yet for this week.</p>
            )}
          </div>

          <button className="w-full mt-8 py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            View All Categories
          </button>
        </div>
      </div>

      {/* Daily Activity Calendar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Daily Activity Calendar</h3>
        <CalendarView />
      </div>
      <ReportPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
}
