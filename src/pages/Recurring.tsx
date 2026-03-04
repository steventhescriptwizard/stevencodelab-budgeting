import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  MoreVertical, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import AddRecurringModal from '@/components/ui/AddRecurringModal';

export default function Recurring() {
  const { recurringTemplates, categories, deleteRecurringTemplate, stats } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (id: string, description: string) => {
    const result = await Swal.fire({
      title: 'Delete Recurring Transaction?',
      text: `Are you sure you want to stop the recurring transaction for "${description}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
    });

    if (result.isConfirmed) {
      await deleteRecurringTemplate(id);
      Swal.fire({
        title: 'Deleted!',
        text: 'The recurring transaction has been removed.',
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recurring Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your automated income and expenses.</p>
        </div>
        <button 
          onClick={() => {
            setEditingTemplate(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#064c39] hover:bg-[#053b2c] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#064c39]/20 dark:shadow-emerald-900/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Recurring</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {recurringTemplates.length > 0 ? (
            recurringTemplates.map((template) => (
              <div 
                key={template.id} 
                onClick={() => handleEdit(template)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-50 dark:border-slate-800",
                      template.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    )}>
                      {categories.find(c => c.name === template.category)?.icon || '📅'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{template.description}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next: {new Date(template.next_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {template.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn(
                        "font-extrabold text-lg",
                        template.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                      )}>
                        {template.type === 'income' ? '+' : '-'}Rp {template.amount.toLocaleString('id-ID')}
                      </p>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                        template.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                      )}>
                        {template.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(template.id, template.description);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-100 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">No Recurring Transactions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Set up templates for your regular bills or income.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTemplate(null);
                  setIsModalOpen(true);
                }}
                className="text-[#064c39] dark:text-emerald-400 font-bold hover:underline"
              >
                Create your first template
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#064c39] dark:bg-emerald-900 rounded-2xl p-6 text-white shadow-xl shadow-[#064c39]/20 dark:shadow-emerald-900/20 relative overflow-hidden">
            <h3 className="font-bold mb-4 relative z-10">Monthly Projection</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-xs font-medium text-white/80">Projected Savings</span>
                <span className="font-bold">Rp {(stats.monthlyIncome - stats.monthlyExpense).toLocaleString('id-ID')}</span>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-white/60 mb-1 font-medium uppercase tracking-widest">Savings Tip</p>
                <p className="text-xs leading-relaxed italic text-white/90">
                  "By automating your savings as a recurring expense, you treat your future self as the most important bill."
                </p>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              How it works
            </div>
            <p className="text-xs text-amber-800/70 dark:text-amber-400/70 leading-relaxed">
              Recurring templates are used to automatically generate transactions. On the scheduled date, the system will prompt you or handle the entry.
            </p>
          </div>
        </div>
      </div>
      <AddRecurringModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        editTemplate={editingTemplate}
      />
    </div>
  );
}
