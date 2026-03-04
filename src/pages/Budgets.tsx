import React, { useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { Plus, AlertTriangle, Lightbulb, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddBudgetModal from '@/components/ui/AddBudgetModal';
import Swal from 'sweetalert2';

export default function Budgets() {
  const { budgets, categories, deleteBudget } = useData();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<{id: string, category: string, limit: number} | null>(null);

  const totals = useMemo(() => {
    const totalSet = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    return { totalSet, totalSpent };
  }, [budgets]);

  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Monthly Budget</h1>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium">{currentMonth}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span className="sr-only">Notifications</span>
            {/* Bell icon would go here */}
          </button>
          <button 
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            className="bg-[#064c39] dark:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-lg shadow-[#064c39]/20 dark:shadow-emerald-900/20"
          >
            <Plus className="w-5 h-5" />
            Set New Budget
          </button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 flex items-center justify-between relative overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="relative z-10">
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-3">Total Budget Set</p>
            <h2 className="text-4xl font-bold text-[#064c39] dark:text-emerald-400 mb-3 tracking-tight">Rp {totals.totalSet.toLocaleString('id-ID')}</h2>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded text-xs">↗ +12%</span>
              <span>from last month</span>
            </div>
          </div>
          <div className="hidden sm:block opacity-10 absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4">
             <div className="w-64 h-64 bg-[#064c39] dark:bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#064c39] dark:bg-emerald-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#064c39]/20 dark:shadow-emerald-900/20">
          <div className="relative z-10">
            <p className="text-white/70 font-medium uppercase tracking-wider text-xs mb-2">Total Spent</p>
            <h2 className="text-4xl font-bold mb-2">Rp {totals.totalSpent.toLocaleString('id-ID')}</h2>
            <div className="flex items-center gap-2 text-white/90 font-medium text-sm mt-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>On track • {30 - new Date().getDate()} days remaining</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 opacity-20">
             <div className="w-24 h-32 border-4 border-white rounded-lg flex flex-col p-2 gap-2">
                <div className="w-full h-2 bg-white rounded"></div>
                <div className="w-2/3 h-2 bg-white rounded"></div>
                <div className="w-full h-2 bg-white rounded mt-auto"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Budget Categories</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Near Limit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Exceeded</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isExceeded = percentage > 100;
            const isNearLimit = percentage > 80 && !isExceeded;
            
            return (
              <div key={budget.category} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                      budget.category.includes('Food') ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                      budget.category.includes('Transport') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      budget.category.includes('Entertainment') ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    )}>
                      {categories.find(c => c.name === budget.category)?.icon || '🛍️'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{budget.category}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Monthly Limit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Remaining</p>
                    <p className={`text-lg font-bold ${isExceeded ? 'text-red-500 dark:text-red-400' : 'text-[#064c39] dark:text-emerald-400'}`}>
                      {isExceeded ? '-' : '+'}Rp {Math.abs(budget.limit - budget.spent).toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                       <button 
                        onClick={() => {
                          setEditingBudget({ id: budget.id, category: budget.category, limit: budget.limit });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-[#064c39] dark:hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Edit Budget"
                       >
                         <Edit2 className="w-3.5 h-3.5" />
                       </button>
                       <button 
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Delete Budget?',
                            text: `Are you sure you want to delete the budget for ${budget.category}?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#ef4444',
                            cancelButtonColor: '#64748b',
                            confirmButtonText: 'Yes, delete it!',
                             background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                             color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
                           });
                          if (result.isConfirmed) {
                            await deleteBudget(budget.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Budget"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2 text-sm">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Rp {budget.spent.toLocaleString('id-ID')} <span className="font-normal text-slate-500 dark:text-slate-400">spent</span></span>
                  <span className="text-slate-500 dark:text-slate-400">Limit: Rp {budget.limit.toLocaleString('id-ID')}</span>
                </div>

                <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner mt-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 relative ${
                      isExceeded ? 'bg-red-500 dark:bg-red-400' : isNearLimit ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-500 dark:bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  {isExceeded ? (
                    <span className="text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Exceeded budget by Rp {Math.abs(budget.limit - budget.spent).toLocaleString('id-ID')}
                    </span>
                  ) : isNearLimit ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Approaching limit ({percentage.toFixed(0)}% used)
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-[10px]">✓</div>
                      Under budget by {100 - percentage}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {budgets.length === 0 && (
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <TrendingUp className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No Budgets Set Yet</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                Set monthly spending limits for your categories to keep your finances on track.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#064c39] dark:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 transition-all shadow-lg shadow-[#064c39]/10"
              >
                <Plus className="w-5 h-5" />
                Create Your First Budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Smart Tip */}
      <div className="bg-[#10221d] dark:bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl border border-slate-800">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Smart Savings Tip</h3>
          <p className="text-slate-300 leading-relaxed">
            You've spent 20% less on Food & Dining compared to last month. 
            Setting aside an extra Rp 150.000 in your Emergency Fund could reach your goal faster!
          </p>
        </div>
        <button className="bg-[#064c39] dark:bg-emerald-600 hover:bg-[#064c39]/80 dark:hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-colors border border-emerald-500/30 whitespace-nowrap">
          Apply Suggestion
        </button>
      </div>
      <AddBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }} 
        editBudget={editingBudget || undefined}
      />
    </div>
  );
}
