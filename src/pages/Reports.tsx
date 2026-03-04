import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download, Filter, Wallet, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon, Printer, Share2 } from 'lucide-react';
import CalendarView from '@/components/ui/CalendarView';
import ReportPreviewModal from '@/components/ui/ReportPreviewModal';
import { useData } from '@/lib/data-context';

export default function Reports() {
  const { transactions, categories, stats } = useData();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Income</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">Rp {stats.monthlyIncome.toLocaleString('id-ID')}</h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Current Month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Expense</p>
          <h3 className="text-2xl font-bold text-red-500 dark:text-red-400 tracking-tight">Rp {stats.monthlyExpense.toLocaleString('id-ID')}</h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Current Month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Net Savings</p>
          <h3 className={`text-2xl font-bold tracking-tight ${stats.monthlyIncome - stats.monthlyExpense >= 0 ? 'text-[#064c39] dark:text-emerald-400' : 'text-amber-500'}`}>
            Rp {(stats.monthlyIncome - stats.monthlyExpense).toLocaleString('id-ID')}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Current Month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Savings Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {stats.monthlyIncome > 0 ? Math.round(((stats.monthlyIncome - stats.monthlyExpense) / stats.monthlyIncome) * 100) : 0}%
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">of total income</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Financial Trends</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Income vs Expenses (Last 6 Months)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Expense</span>
              </div>
            </div>
          </div>
          
          <div className="h-72 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9'} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip 
                  cursor={{ stroke: '#064c39', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff', 
                    borderColor: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    borderWidth: '1px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`]}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
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
