import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, ShoppingBag, Utensils, Car, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AddTransactionModal from '@/components/ui/AddTransactionModal';

export default function Dashboard() {
  const { user, stats, transactions, categories } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate dynamic spending data
  const spendingData = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalExpense === 0) return [];

    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => {
      const category = categories.find(c => c.name === name);
      return {
        name,
        value: Math.round((value / totalExpense) * 100),
        amount: value,
        color: category?.color || '#94a3b8',
        icon: category?.icon || '📦'
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const totalSpentFormatted = React.useMemo(() => {
    const total = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(total);
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, <span className="text-[#064c39] dark:text-emerald-400">{user?.name}!</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Here's your financial status for today.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#064c39] dark:bg-emerald-600 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#064c39]/20 dark:shadow-emerald-900/30 active:scale-95 whitespace-nowrap group"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#064c39] dark:bg-emerald-900 rounded-2xl p-6 text-white shadow-xl shadow-[#064c39]/20 dark:shadow-emerald-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/80 font-medium uppercase tracking-wider text-xs mb-2">Total Balance</p>
            <h3 className="text-4xl font-bold mb-4">Rp {stats.totalBalance.toLocaleString('id-ID')}</h3>
            <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
              <TrendingUp className="w-3 h-3" />
              <span>All-time balance</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Income</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Rp {stats.monthlyIncome.toLocaleString('id-ID')}</h3>
          <p className={cn(
            "text-sm font-bold mt-2 flex items-center gap-1",
            stats.incomeTrend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
          )}>
            {stats.incomeTrend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(stats.incomeTrend).toFixed(1)}% vs last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Expense</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Rp {stats.monthlyExpense.toLocaleString('id-ID')}</h3>
          <p className={cn(
            "text-sm font-bold mt-2 flex items-center gap-1",
            stats.expenseTrend <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
          )}>
            {stats.expenseTrend <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            {Math.abs(stats.expenseTrend).toFixed(1)}% vs last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Spending by Category</h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-64 sm:h-80 w-full min-h-[250px] relative flex items-center justify-center">
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke={document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Amount']}
                    contentStyle={{ 
                      backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff', 
                      borderColor: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      borderWidth: '1px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <ShoppingBag className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">No expenses recorded for this period.</p>
              </div>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {spendingData.map((item) => (
              <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{item.value}% of total</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#064c39] dark:text-emerald-400">
                  Rp {item.amount.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
            <button className="text-[#064c39] dark:text-emerald-400 text-sm font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border border-white/50 dark:border-slate-700/50",
                    tx.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}>
                    {categories.find(c => c.name === tx.category)?.icon || (tx.type === 'income' ? '💰' : '📦')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{tx.description}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    tx.status === 'completed' ? 'text-slate-400 dark:text-slate-500' : 'text-amber-500 dark:text-amber-400'
                  }`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Goal / Comparison Banner */}
      {(() => {
        const currentSavings = stats.monthlyIncome - stats.monthlyExpense;
        const prevSavings = stats.prevMonthlyIncome - stats.prevMonthlyExpense;
        const savingsDiff = currentSavings - prevSavings;
        const isBetter = savingsDiff >= 0;

        return (
          <div className="bg-[#064c39]/5 dark:bg-emerald-900/20 rounded-2xl p-6 border border-[#064c39]/10 dark:border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-[#064c39]/10 dark:hover:bg-emerald-900/30">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shrink-0 transform hover:scale-110 transition-transform",
                isBetter ? "bg-[#064c39] dark:bg-emerald-600 shadow-[#064c39]/20 dark:shadow-emerald-900/40" : "bg-amber-500 dark:bg-amber-600 shadow-amber-500/20 dark:shadow-amber-900/40"
              )}>
                {isBetter ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {isBetter 
                    ? `You've saved Rp ${Math.abs(savingsDiff).toLocaleString('id-ID')} more than last month!` 
                    : `You've saved Rp ${Math.abs(savingsDiff).toLocaleString('id-ID')} less than last month.`
                  }
                </h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                  {isBetter 
                    ? "\"Great job on managing your expenses. Keep it up!\"" 
                    : "\"Don't worry, try adjusting your budget for next week.\""
                  }
                </p>
              </div>
            </div>
            <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#064c39] dark:text-emerald-400 px-6 py-2.5 rounded-xl font-bold hover:bg-[#064c39]/5 dark:hover:bg-emerald-500/10 transition-all shadow-sm hover:shadow-md active:scale-95 group">
              Review Budget
              <Plus className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        );
      })()}

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
