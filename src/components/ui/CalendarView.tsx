import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CalendarView() {
  const { transactions } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getDayTransactions = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return transactions.filter(t => t.date === dateStr);
  };

  const selectedDayTransactions = getDayTransactions(selectedDate);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
      {/* Calendar Section */}
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dayTransactions = getDayTransactions(day);
            const hasIncome = dayTransactions.some(t => t.type === 'income');
            const hasExpense = dayTransactions.some(t => t.type === 'expense');
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "h-14 rounded-xl flex flex-col items-center justify-center relative transition-all border border-transparent",
                  !isCurrentMonth && "text-slate-300 dark:text-slate-600 bg-slate-50/30 dark:bg-slate-800/20 opacity-50",
                  isCurrentMonth && "text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800",
                  isSelected && "bg-[#064c39]/5 dark:bg-emerald-500/10 border-[#064c39]/20 dark:border-emerald-500/30 text-[#064c39] dark:text-emerald-400 font-bold shadow-sm ring-1 ring-[#064c39]/10",
                  isToday(day) && !isSelected && "bg-slate-100/80 dark:bg-slate-800 font-bold text-[#064c39] dark:text-emerald-400"
                )}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                <div className="flex gap-0.5 mt-1">
                  {hasIncome && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  {hasExpense && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Activity Sidebar */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 w-full md:w-80 p-6 flex flex-col">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
          {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Daily Activity</p>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {selectedDayTransactions.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {selectedDayTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{tx.description}</span>
                    <span className={cn(
                      "font-bold text-sm",
                      tx.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{tx.category}</span>
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center mb-3">
                <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm">No transactions for this day.</p>
            </div>
          )}
        </div>

        {selectedDayTransactions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Total Spent</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Rp {selectedDayTransactions
                  .filter(t => t.type === 'expense')
                  .reduce((acc, curr) => acc + curr.amount, 0)
                  .toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
