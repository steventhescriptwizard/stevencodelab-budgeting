import React, { useState, useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { Download, Filter, Search, ArrowUpRight, ArrowDownRight, Calendar, Trash2, CheckSquare, Square, Edit2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { cn } from '@/lib/utils';
import AddTransactionModal from '@/components/ui/AddTransactionModal';

export default function Transactions() {
  const { transactions, categories, deleteTransactions } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('Transaction Type');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const itemsPerPage = 10;
  
  // Default to current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = tx.date; // yyyy-MM-dd
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || tx.category === selectedCategory;
      const matchesType = selectedType === 'Transaction Type' || 
                         (selectedType === 'Income' && tx.type === 'income') ||
                         (selectedType === 'Expense' && tx.type === 'expense');
      const matchesDate = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);
      
      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, startDate, endDate]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, selectedCategory, selectedType, startDate, endDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedTransactions.map(t => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedIds.length} transactions. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete them!',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
    });

    if (result.isConfirmed) {
      await deleteTransactions(selectedIds);
      setSelectedIds([]);
      Swal.fire({
        title: 'Deleted!',
        text: 'Selected transactions have been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
        confirmButtonColor: '#064c39',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transaction History</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor and manage your financial activities.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064c39]/20 dark:focus:ring-emerald-500/20 w-full sm:w-64 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex flex-col gap-4">
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-xl">
            <span className="text-red-700 dark:text-red-400 font-medium text-sm">
              {selectedIds.length} transactions selected
            </span>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none p-0 text-sm text-slate-700 dark:text-slate-300 focus:ring-0 w-32"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none p-0 text-sm text-slate-700 dark:text-slate-300 focus:ring-0 w-32"
            />
          </div>

          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-[#064c39] dark:focus:ring-emerald-500 focus:border-[#064c39] dark:focus:border-emerald-500 block p-2.5 transition-all outline-none"
          >
            <option>All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-[#064c39] dark:focus:ring-emerald-500 focus:border-[#064c39] dark:focus:border-emerald-500 block p-2.5"
          >
            <option>Transaction Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <button className="flex items-center gap-2 text-[#064c39] dark:text-emerald-400 font-medium text-sm hover:bg-[#064c39]/5 dark:hover:bg-emerald-500/10 px-3 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-4">
                  <button 
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-[#064c39] dark:hover:text-emerald-400 transition-colors"
                  >
                    {selectedIds.length === paginatedTransactions.length && paginatedTransactions.length > 0 
                      ? <CheckSquare className="w-5 h-5 text-[#064c39] dark:text-emerald-400" /> 
                      : <Square className="w-5 h-5" />
                    }
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Description/Merchant</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Amount</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className={cn(
                    "bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors",
                    selectedIds.includes(tx.id) ? "bg-slate-50 dark:bg-slate-800/50" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleSelect(tx.id)}
                      className="text-slate-300 hover:text-[#064c39] dark:hover:text-emerald-400 transition-colors"
                    >
                      {selectedIds.includes(tx.id) 
                        ? <CheckSquare className="w-5 h-5 text-[#064c39] dark:text-emerald-400" /> 
                        : <Square className="w-5 h-5" />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700">
                      <span className="text-sm shadow-sm">{categories.find(c => c.name === tx.category)?.icon || '📦'}</span>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
                      ${tx.type === 'income' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setEditingTx(tx);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#064c39] dark:hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                      title="Edit Transaction"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">
              {filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span> to <span className="font-semibold text-slate-900 dark:text-slate-100">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span> of <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredTransactions.length}</span> transactions
          </span>
          <div className="inline-flex -space-x-px text-sm">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-4 h-9 ml-0 leading-tight text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "flex items-center justify-center px-4 h-9 leading-tight border transition-colors font-medium",
                  currentPage === i + 1
                    ? "text-white bg-[#064c39] dark:bg-emerald-600 border-[#064c39] dark:border-emerald-600"
                    : "text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center px-4 h-9 leading-tight text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTx(null);
        }} 
        editTransaction={editingTx || undefined}
      />
    </div>
  );
}
