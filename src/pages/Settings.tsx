import React, { useState, useMemo } from 'react';
import { Bell, AlertTriangle, XCircle, BarChart3, Clock, CheckCircle2, AlertCircle, Tag, Plus, ReceiptText } from 'lucide-react';
import CategoryManager from '@/components/ui/CategoryManager';
import { useData } from '@/lib/data-context';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { transactions } = useData();
  const [toggles, setToggles] = useState({
    earlyWarning: true,
    criticalAlert: true,
    budgetExceeded: true,
    weeklySummary: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activityLog = useMemo(() => {
    return transactions.slice(0, 5).map((tx, idx) => ({
      id: tx.id,
      type: tx.type === 'income' ? 'success' : 'info',
      title: tx.type === 'income' ? 'Income Received' : 'Expense Recorded',
      message: `${tx.description} - ${tx.type === 'income' ? '+' : '-'}Rp ${tx.amount.toLocaleString('id-ID')} in ${tx.category}`,
      time: new Date(tx.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      icon: tx.type === 'income' ? CheckCircle2 : ReceiptText,
      color: tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-500 dark:text-blue-400',
      bg: tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
    }));
  }, [transactions]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings & Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your categories, notifications, and review your activity history.</p>
      </div>

      {/* Category Management Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[#064c39] dark:text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 italic tracking-tight">Categories</h2>
        </div>
        <CategoryManager />
      </section>

      {/* Threshold Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/50 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#064c39] dark:text-emerald-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">Threshold Management</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Early Warning</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Notify me when 80% of budget is reached</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('earlyWarning')}
              className={`w-12 h-6 rounded-full transition-colors relative ${toggles.earlyWarning ? 'bg-[#064c39] dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${toggles.earlyWarning ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Critical Alert</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Notify me when 95% of budget is reached</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('criticalAlert')}
              className={`w-12 h-6 rounded-full transition-colors relative ${toggles.criticalAlert ? 'bg-[#064c39] dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${toggles.criticalAlert ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Budget Exceeded</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Notify me when budget exceeds 100%</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('budgetExceeded')}
              className={`w-12 h-6 rounded-full transition-colors relative ${toggles.budgetExceeded ? 'bg-[#064c39] dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${toggles.budgetExceeded ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#064c39]/10 dark:bg-emerald-500/10 rounded-lg text-[#064c39] dark:text-emerald-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Weekly Summary Reports</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Receive a consolidated weekly recap of all spending</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('weeklySummary')}
              className={`w-12 h-6 rounded-full transition-colors relative ${toggles.weeklySummary ? 'bg-[#064c39] dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${toggles.weeklySummary ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Real-time Activity Log</h3>
          </div>
          <button className="text-[#064c39] dark:text-emerald-400 text-sm font-medium hover:underline">Clear History</button>
        </div>

        <div className="space-y-4">
          {activityLog.map((log) => (
            <div key={log.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4 transition-all hover:shadow-md group">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                log.bg, log.color
              )}>
                <log.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{log.title}</h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{log.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  {log.message.split(' ').map((word, i) => {
                    if (word.includes('Rp') || word.includes('%') || !isNaN(parseFloat(word.replace('Rp', '')))) {
                      return <span key={i} className={`font-bold ${log.color}`}>{word} </span>;
                    }
                    if (['Entertainment', 'Food', '&', 'Dining', 'Transportation', 'Utilities'].includes(word.replace(/[^a-zA-Z&]/g, ''))) {
                      return <span key={i} className="font-semibold text-slate-800 dark:text-slate-200">{word} </span>;
                    }
                    return <span key={i}>{word} </span>;
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-[#064c39] dark:text-emerald-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Load More Activity
        </button>
      </div>
    </div>
  );
}
