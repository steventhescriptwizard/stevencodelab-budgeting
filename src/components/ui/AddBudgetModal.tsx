import React, { useState, useEffect } from 'react';
import { X, Target, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/data-context';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editBudget?: {
    id: string;
    category: string;
    limit: number;
  };
}

export default function AddBudgetModal({ isOpen, onClose, editBudget }: AddBudgetModalProps) {
  const { addBudget, updateBudget, budgets, categories } = useData();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (editBudget) {
      setAmount(editBudget.limit.toString());
      setCategory(editBudget.category);
    } else {
      setAmount('');
      setCategory('');
    }
  }, [editBudget, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const limit = parseFloat(amount);
    
    if (editBudget) {
      await updateBudget(editBudget.id, { limit, category, period });
    } else {
      // Check if budget for this category already exists
      const existing = budgets.find(b => b.category === category && b.period === period);
      if (existing) {
        Swal.fire({
          title: 'Already exists!',
          text: `A ${period} budget for ${category} already exists. Please edit that one instead.`,
          icon: 'warning',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
          confirmButtonColor: '#064c39',
        });
        return;
      }
      await addBudget({ category, limit, period });
    }
    
    onClose();
    
    Swal.fire({
      title: 'Success!',
      text: `Budget for ${category} has been ${editBudget ? 'updated' : 'set'} successfully.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
    });
  };

  const availableCategories = categories.filter(c => c.type === 'expense');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#064c39]/20 dark:bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md sm:rounded-xl rounded-t-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 pointer-events-auto flex flex-col">
              <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-[#064c39]/5 dark:bg-emerald-500/10 p-2 rounded-lg border border-[#064c39]/10 dark:border-emerald-500/10">
                    <Target className="w-5 h-5 text-[#064c39] dark:text-emerald-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 italic">
                    {editBudget ? 'Edit Budget' : 'New Budget'}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-center">Monthly Limit</p>
                  <div className="relative flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#064c39] dark:text-emerald-400 mr-2">Rp</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-48 text-center text-4xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={!!editBudget}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#064c39] dark:focus:ring-emerald-500 disabled:opacity-50"
                    >
                      <option value="" disabled>Select category</option>
                      {availableCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Period</label>
                    <div className="flex p-1 bg-slate-100/80 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setPeriod('monthly')}
                        className={cn(
                          "flex-1 py-2 rounded-md transition-all font-medium text-sm",
                          period === 'monthly' 
                            ? "bg-white dark:bg-slate-700 shadow-sm text-[#064c39] dark:text-emerald-400" 
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod('yearly')}
                        className={cn(
                          "flex-1 py-2 rounded-md transition-all font-medium text-sm",
                          period === 'yearly' 
                            ? "bg-white dark:bg-slate-700 shadow-sm text-[#064c39] dark:text-emerald-400" 
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                </div>

                {!editBudget && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-3 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      Setting a budget will help you track your spending for this category. You'll receive alerts if you exceed the limit.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 px-4 rounded-lg bg-[#064c39] dark:bg-emerald-600 text-white font-semibold hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 shadow-lg shadow-[#064c39]/20 dark:shadow-emerald-900/20 transition-all"
                  >
                    {editBudget ? 'Save Changes' : 'Set Budget'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
