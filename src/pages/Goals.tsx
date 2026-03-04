import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { 
  Target, 
  Plus, 
  Trash2, 
  Calendar, 
  TrendingUp,
  Award,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import AddGoalModal from '@/components/ui/AddGoalModal';

export default function Goals() {
  const { savingsGoals, deleteSavingsGoal } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const totalSaved = savingsGoals.reduce((acc, goal) => acc + goal.current_amount, 0);
  const totalTarget = savingsGoals.reduce((acc, goal) => acc + goal.target_amount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Delete Goal?',
      text: `Are you sure you want to delete your goal for "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
    });

    if (result.isConfirmed) {
      await deleteSavingsGoal(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'The goal has been removed.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Savings Goals</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and achieve your financial milestones.</p>
        </div>
        <button 
          onClick={() => {
            setEditingGoal(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#064c39] hover:bg-[#053b2c] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#064c39]/20 dark:shadow-emerald-900/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.length > 0 ? (
          savingsGoals.map((goal) => {
            const progress = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
            return (
              <div 
                key={goal.id} 
                onClick={() => handleEdit(goal)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4">
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleDelete(goal.id, goal.name);
                       }}
                       className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${goal.color}15`, color: goal.color }}>
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{goal.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Target: Rp {goal.target_amount.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved So Far</p>
                      <p className="text-lg font-extrabold text-[#064c39] dark:text-emerald-400">Rp {goal.current_amount.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-200 dark:text-slate-800 absolute -bottom-2 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        {progress}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                      style={{ width: `${progress}%`, backgroundColor: goal.color }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {goal.deadline_date ? new Date(goal.deadline_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : 'No deadline'}
                    </div>
                    <div>
                        Rp {(goal.target_amount - goal.current_amount).toLocaleString('id-ID')} left
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-100 dark:border-slate-800 text-center space-y-4 border-dashed">
             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">No Goals Defined</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Start dreaming and setting targets for your future.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingGoal(null);
                  setIsModalOpen(true);
                }}
                className="text-[#064c39] dark:text-emerald-400 font-bold hover:underline"
              >
                Create your first goal
              </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4 text-[#064c39] dark:text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="font-bold">Progress Insights</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "Small steps every day lead to big results. You're already on your way to achieving your dreams!"
              </p>
          </div>
          <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
             <div className="relative z-10 flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-lg mb-1">Total Savings Progress</h3>
                   <p className="text-white/60 text-xs">Sum of all your targets</p>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-emerald-400">Rp {totalSaved.toLocaleString('id-ID')}</p>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{overallProgress}% of total targets</p>
                </div>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-10">
                <Target className="w-32 h-32" />
             </div>
          </div>
      </div>
      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        editGoal={editingGoal}
      />
    </div>
  );
}
