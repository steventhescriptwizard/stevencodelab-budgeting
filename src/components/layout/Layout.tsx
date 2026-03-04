import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, PieChart, Settings, Bell, Search, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/lib/theme-context';
import { useData } from '@/lib/data-context';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useData();

  const userInitials = React.useMemo(() => {
    if (!user?.name) return '??';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [user]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CreditCard, label: 'Transactions', path: '/transactions' },
    { icon: PieChart, label: 'Reports', path: '/reports' },
    { icon: Wallet, label: 'Budgets', path: '/budgets' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#064c39] dark:bg-emerald-600 p-2 rounded-lg shadow-sm">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#064c39] dark:text-emerald-400 tracking-tight">Steven Budget</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#064c39]/10 text-[#064c39] dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100/50 hover:text-[#064c39] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-[#064c39]/10 dark:bg-emerald-500/10 flex items-center justify-center text-[#064c39] dark:text-emerald-400 font-bold">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f6f8f7] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col transition-colors duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-xl md:hidden flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 flex flex-col mt-[-60px]">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 md:w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight capitalize truncate">
               {location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1]}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search data..." 
                className="pl-9 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064c39]/10 dark:focus:ring-emerald-500/20 w-48 md:w-64 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all border-transparent focus:border-slate-200 dark:focus:border-slate-600"
              />
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 md:hidden flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shadow-inner">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f6f8f7] dark:bg-slate-950 transition-colors duration-300">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
