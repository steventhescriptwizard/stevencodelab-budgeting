import React, { useState } from 'react';
import { Plus, Trash2, Tag, ChevronRight } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { cn } from '@/lib/utils';

export default function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useData();
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newIcon, setNewIcon] = useState('📦');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCategory({
      name: newName.trim(),
      type: newType,
      icon: newIcon,
      color: newType === 'income' ? '#10b981' : '#3b82f6',
    });
    setNewName('');
  };

  const icons = ['🍔', '🚗', '🛍️', '🎬', '🏠', '💰', '💻', '📦', '🏥', '🎓', '✈️', '🎁'];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#064c39] dark:text-emerald-400" />
          Add New Category
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Groceries, Freelance"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#064c39] dark:focus:border-emerald-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewIcon(icon)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all border",
                    newIcon === icon 
                      ? "bg-[#064c39] border-[#064c39] text-white" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#064c39]"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#064c39] dark:bg-emerald-600 text-white rounded-lg font-bold hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 transition-colors shadow-lg shadow-[#064c39]/20"
          >
            Create Category
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 italic tracking-tight">
            <Tag className="w-5 h-5 text-red-500" />
            Expense Categories
          </h3>
          <div className="space-y-2">
            {categories.filter(c => c.type === 'expense').map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{cat.name}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 italic tracking-tight">
            <Tag className="w-5 h-5 text-[#064c39] dark:text-emerald-400" />
            Income Categories
          </h3>
          <div className="space-y-2">
            {categories.filter(c => c.type === 'income').map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{cat.name}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
