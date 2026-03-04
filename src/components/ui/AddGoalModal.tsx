import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Info, Palette, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/data-context';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  editGoal?: {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline_date?: string;
    icon: string;
    color: string;
  };
}

const COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#6366f1', // Indigo
];

const ICONS = ['🎯', '🏠', '🚗', '✈️', '🎓', '💻', '💍', '🏥', '💰', '🎁', '📱', '🚲'];

export default function AddGoalModal({ isOpen, onClose, editGoal }: AddGoalModalProps) {
  const { addSavingsGoal, updateSavingsGoal } = useData();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#10b981');

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name);
      setTargetAmount(editGoal.target_amount.toString());
      setCurrentAmount(editGoal.current_amount.toString());
      setDeadlineDate(editGoal.deadline_date || '');
      setIcon(editGoal.icon);
      setColor(editGoal.color);
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadlineDate('');
      setIcon('🎯');
      setColor('#10b981');
    }
  }, [editGoal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    const goalData = {
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      deadline_date: deadlineDate || undefined,
      icon,
      color,
    };

    if (editGoal) {
      await updateSavingsGoal(editGoal.id, goalData);
    } else {
      await addSavingsGoal(goalData);
    }
    
    onClose();
    
    Swal.fire({
      title: 'Goal Saved!',
      text: `Your goal for "${name}" has been ${editGoal ? 'updated' : 'created'}.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
    });
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
            <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md sm:rounded-xl rounded-t-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 pointer-events-auto max-h-[90vh] flex flex-col">
              <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-[#064c39]/5 dark:bg-emerald-500/10 p-2 rounded-lg" style={{ color: color }}>
                    <Target className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 italic">
                    {editGoal ? 'Edit Goal' : 'New Savings Goal'}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div className="overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Icon & Color Selection */}
                  <div className="flex flex-col items-center gap-6 mb-2">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg border-2" style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color: color }}>
                      {icon}
                    </div>
                    
                    <div className="space-y-4 w-full">
                      <div className="flex flex-wrap justify-center gap-2">
                        {ICONS.map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIcon(i)}
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110",
                              icon === i ? "bg-slate-100 dark:bg-slate-800 ring-2 ring-[#064c39] dark:ring-emerald-500" : "bg-slate-50 dark:bg-slate-800/50"
                            )}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={cn(
                              "w-6 h-6 rounded-full transition-all hover:scale-125",
                              color === c ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500" : ""
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Goal Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. New Car, Dream Vacation"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Target Amount</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                           <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Current Amount</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                           <input
                            type="number"
                            value={currentAmount}
                            onChange={(e) => setCurrentAmount(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Deadline Date (Optional)</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={deadlineDate}
                          onChange={(e) => setDeadlineDate(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-[2] py-3 px-4 rounded-xl bg-[#064c39] dark:bg-emerald-600 text-white font-bold hover:shadow-lg transition-all active:scale-95">
                      {editGoal ? 'Update Goal' : 'Create Goal'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
