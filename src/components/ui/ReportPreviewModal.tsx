import React from 'react';
import { X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '@/lib/data-context';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportPreviewModal({ isOpen, onClose }: ReportPreviewModalProps) {
  const { stats, transactions } = useData();

  const handlePrint = () => {
    window.print();
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm no-print"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 pointer-events-auto flex flex-col transition-colors">
              {/* Header - No Print */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 no-print">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Report Preview</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-[#064c39] hover:bg-[#064c39]/90 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Save PDF
                  </button>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 md:p-8 custom-scrollbar">
                {/* A4 Paper Simulation */}
                <div
                  id="printable-content"
                  className="bg-white text-slate-900 mx-auto shadow-lg p-6 md:p-12 max-w-[210mm] min-h-[297mm] relative"
                >
                  {/* Report Header */}
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h1 className="text-3xl font-bold text-[#064c39] mb-2">Financial Report</h1>
                      <p className="text-slate-500">Generated on {format(new Date(), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-xl text-slate-900">Steven Budget</h3>
                      <p className="text-slate-500 text-sm">Personal Finance Management</p>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="grid grid-cols-3 gap-6 mb-12">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1 font-medium italic">Total Income</p>
                      <p className="text-xl md:text-2xl font-bold text-emerald-600">Rp {stats.monthlyIncome.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1 font-medium italic">Total Expense</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">Rp {stats.monthlyExpense.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1 font-medium italic">Net Balance</p>
                      <p className="text-xl md:text-2xl font-bold text-[#064c39]">Rp {stats.totalBalance.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="mb-12">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Recent Transactions</h3>
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-200">
                          <th className="py-3 font-semibold uppercase tracking-wider text-xs">Date</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-xs">Description</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-xs">Category</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-xs text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transactions.length > 0 ? (
                          transactions.slice(0, 15).map((t, i) => (
                            <tr key={t.id || i}>
                              <td className="py-3 text-slate-600 whitespace-nowrap">
                                {format(new Date(t.date), 'dd MMM yyyy')}
                              </td>
                              <td className="py-3 font-semibold text-slate-900">{t.description}</td>
                              <td className="py-3 text-slate-600">
                                <span className="bg-slate-100 px-2.5 py-1 rounded text-xs font-medium border border-slate-200">{t.category}</span>
                              </td>
                              <td className={cn(
                                "py-3 text-right font-bold",
                                t.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                              )}>
                                {t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-500 italic">No transactions found for this period.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-12 left-12 right-12 text-center border-t border-slate-200 pt-6">
                    <p className="text-slate-400 text-sm">This is a computer-generated document. No signature is required.</p>
                    <p className="text-slate-400 text-xs mt-1">Steven Budget • www.stevenbudget.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
