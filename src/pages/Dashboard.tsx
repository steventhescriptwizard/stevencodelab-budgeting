import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal, ShoppingBag, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AddTransactionModal from '@/components/ui/AddTransactionModal';

export default function Dashboard() {
  const { user, stats, transactions, categories, savingsGoals } = useData();
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

      {/* Savings Goals Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#064c39] dark:text-emerald-400" />
            Savings Goals
          </h3>
          <button 
            onClick={() => {/* TODO: Open Goal Modal */}}
            className="text-xs font-bold text-[#064c39] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add New Goal
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {savingsGoals.length > 0 ? (
            savingsGoals.map(goal => {
              const progress = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
              return (
                <div key={goal.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm" style={{ backgroundColor: `${goal.color}15`, color: goal.color }}>
                      {goal.icon}
                    </div>
                    <span className="text-[10px] font-extrabold text-[#064c39] dark:text-emerald-400 bg-[#064c39]/5 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {progress}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate mb-1">{goal.name}</h4>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Progress</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Rp {goal.current_amount.toLocaleString('id-ID')} / {goal.target_amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110" 
                      style={{ width: `${progress}%`, backgroundColor: goal.color }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No savings goals yet. Start saving for something special!</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-all hover:shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">Spending by Category</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">This month's breakdown</p>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Donut Chart */}
          <div className="px-6 pt-5 pb-2 min-h-[180px]">
            {spendingData.length > 0 ? (
              <div className="relative flex items-center justify-center h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="amount"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
                        borderColor: document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9',
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px -4px rgb(0 0 0 / 0.15)',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '8px 12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 leading-tight text-center px-2">{totalSpentFormatted}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-44 space-y-3">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-xs text-slate-400 font-medium">No expenses recorded yet</p>
              </div>
            )}
          </div>

          {/* Category List */}
          <div className="px-6 pb-6 space-y-1">
            {spendingData.slice(0, 4).map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-default"
              >
                {/* Color dot */}
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />

                {/* Icon + Name */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{item.name}</span>
                </div>

                {/* Bar + % */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 w-7 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-all hover:shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">Recent Transactions</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{transactions.slice(0, 5).length} latest entries</p>
            </div>
            <button className="text-xs font-bold text-[#064c39] dark:text-emerald-400 hover:text-[#064c39]/70 dark:hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#064c39]/5 dark:hover:bg-emerald-500/10">
              View All →
            </button>
          </div>

          {/* Transaction List */}
          <div className="flex-1 divide-y divide-slate-50 dark:divide-slate-800">
            {transactions.slice(0, 5).map((tx) => {
              const icon = categories.find(c => c.name === tx.category)?.icon || (tx.type === 'income' ? '💰' : '📦');
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-all group cursor-default"
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-105",
                    tx.type === 'income'
                      ? 'bg-emerald-50 dark:bg-emerald-900/30'
                      : 'bg-slate-50 dark:bg-slate-800'
                  )}>
                    {icon}
                  </div>

                  {/* Description + meta */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-snug">{tx.description}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{tx.category} · {tx.date}</p>
                  </div>

                  {/* Amount + status */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className={cn(
                      "text-sm font-bold tracking-tight",
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                    )}>
                      {tx.type === 'income' ? '+' : '−'}Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md",
                      tx.status === 'completed'
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    )}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
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