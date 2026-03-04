import React, { useState } from 'react';
import { X, TrendingDown, TrendingUp, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/data-context';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
  };
}

export default function AddTransactionModal({ isOpen, onClose, editTransaction }: AddTransactionModalProps) {
  const { addTransaction, updateTransaction, categories } = useData();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
      setDescription(editTransaction.description);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [editTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const transactionData = {
      date,
      amount: Math.round(parseFloat(amount) * 100) / 100,
      category,
      description: description || category,
      type,
      status: 'completed'
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
    
    Swal.fire({
      title: 'Success!',
      text: `Transaction has been ${editTransaction ? 'updated' : 'added'} successfully.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
      confirmButtonColor: '#064c39',
    });
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

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
            <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg sm:rounded-xl rounded-t-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 pointer-events-auto max-h-[90vh] flex flex-col">
              <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-[#064c39]/5 dark:bg-emerald-500/10 p-2 rounded-lg border border-[#064c39]/10 dark:border-emerald-500/10">
                    <TrendingDown className={cn("w-5 h-5", type === 'expense' ? "text-red-500" : "text-[#064c39] dark:text-emerald-400")} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 italic">
                    {editTransaction ? 'Edit Transaction' : 'New Transaction'}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div className="overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                  {/* Type Toggle */}
                  <div className="flex p-1 bg-slate-100/80 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        className="hidden"
                        checked={type === 'expense'}
                        onChange={() => setType('expense')}
                      />
                      <div className={cn(
                        "flex items-center justify-center py-2 rounded-md transition-all font-medium text-sm",
                        type === 'expense' 
                          ? "bg-white dark:bg-slate-700 shadow-sm text-red-600 dark:text-red-400" 
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      )}>
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Expense
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="income"
                        className="hidden"
                        checked={type === 'income'}
                        onChange={() => setType('income')}
                      />
                      <div className={cn(
                        "flex items-center justify-center py-2 rounded-md transition-all font-medium text-sm",
                        type === 'income' 
                          ? "bg-white dark:bg-slate-700 shadow-sm text-[#064c39] dark:text-emerald-400" 
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      )}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Income
                      </div>
                    </label>
                  </div>

                  {/* Amount */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Amount</p>
                    <div className="relative flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-[#064c39] dark:text-emerald-400 mr-2">Rp</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-48 text-center text-4xl sm:text-5xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                      <div className="relative">
                        <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 pr-10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#064c39] dark:focus:ring-emerald-500"
                        >
                          <option value="" disabled>Select category</option>
                          {categories
                            .filter(cat => cat.type === type)
                            .map(cat => (
                              <option key={cat.id} value={cat.name}>
                                {cat.icon} {cat.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#064c39] dark:focus:ring-emerald-500"
                        />
                        <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Description (Optional)</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What was this for?"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 resize-none text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#064c39] dark:focus:ring-emerald-500"
                    />
                  </div>

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
                      className="flex-[2] py-3 px-4 rounded-lg bg-[#064c39] dark:bg-emerald-600 text-white font-semibold hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 shadow-lg shadow-[#064c39]/20 dark:shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      {editTransaction ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-[#064c39]/5 dark:bg-emerald-500/5 px-4 py-3 sm:px-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-[#064c39] dark:text-emerald-400">
                  <Info className="w-4 h-4" />
                  <p className="text-xs font-medium italic opacity-80">This transaction will be synced with your bank account automatically.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
