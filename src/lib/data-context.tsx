import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { supabase } from './supabase';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: string;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'yearly';
}

interface BudgetWithSpent extends Budget {
  spent: number;
}

interface RecurringTemplate {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  last_executed_at?: string;
  is_active: boolean;
}

interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline_date?: string;
  icon: string;
  color: string;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

interface Stats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  prevMonthlyIncome: number;
  prevMonthlyExpense: number;
  incomeTrend: number;
  expenseTrend: number;
  monthlyTrends: MonthlyTrend[];
}

interface UserProfile {
  email: string;
  name?: string;
}

interface DataContextType {
  user: UserProfile | null;
  transactions: Transaction[];
  categories: Category[];
  stats: Stats;
  budgets: BudgetWithSpent[];
  recurringTemplates: RecurringTemplate[];
  savingsGoals: SavingsGoal[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactions: (ids: string[]) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addRecurringTemplate: (template: Omit<RecurringTemplate, 'id'>) => Promise<void>;
  updateRecurringTemplate: (id: string, template: Partial<RecurringTemplate>) => Promise<void>;
  deleteRecurringTemplate: (id: string) => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringTemplates, setRecurringTemplates] = useState<RecurringTemplate[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        setUserId(null);
        setUser(null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        setUserId(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          { data: transactionsData },
          { data: categoriesData },
          { data: budgetsData },
          { data: recurringData },
          { data: goalsData }
        ] = await Promise.all([
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('categories').select('*'),
          supabase.from('budgets').select('*'),
          supabase.from('recurring_templates').select('*'),
          supabase.from('savings_goals').select('*')
        ]);

        if (transactionsData) setTransactions(transactionsData);
        if (categoriesData) setCategories(categoriesData);
        if (budgetsData) {
          const mapped = budgetsData.map((b: any) => ({
            id: b.id,
            category: b.category,
            limit: b.limit_amount,
            period: b.period,
          }));
          setBudgets(mapped);
        }
        if (recurringData) setRecurringTemplates(recurringData);
        if (goalsData) setSavingsGoals(goalsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM
    
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = prevMonth.toISOString().slice(0, 7); // YYYY-MM

    const totalBalance = transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
    const prevMonthTransactions = transactions.filter(t => t.date.startsWith(prevMonthStr));

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const monthlyExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const prevMonthlyIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const prevMonthlyExpense = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const incomeTrend = calculateTrend(monthlyIncome, prevMonthlyIncome);
    const expenseTrend = calculateTrend(monthlyExpense, prevMonthlyExpense);

    // Calculate 6-month trends
    const monthlyTrends: MonthlyTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = d.toISOString().slice(0, 7);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      
      const mTransactions = transactions.filter(t => t.date.startsWith(mStr));
      const mIncome = mTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const mExpense = mTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      monthlyTrends.push({
        month: monthLabel,
        income: mIncome,
        expense: mExpense,
        savings: mIncome - mExpense
      });
    }

    return { 
      totalBalance, 
      monthlyIncome, 
      monthlyExpense, 
      prevMonthlyIncome, 
      prevMonthlyExpense,
      incomeTrend,
      expenseTrend,
      monthlyTrends
    };
  }, [transactions]);

  const budgetsWithSpent = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0);
        
      return { ...budget, spent };
    });
  }, [budgets, transactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: userId }])
      .select()
      .single();

    if (!error && data) {
      setTransactions(prev => [data, ...prev]);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const { error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id);

    if (!error) {
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, ...transaction } : t))
      );
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const deleteTransactions = async (ids: string[]) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .in('id', ids);

    if (!error) {
      setTransactions(prev => prev.filter(t => !ids.includes(t.id)));
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, user_id: userId }])
      .select()
      .single();

    if (!error && data) {
      setCategories(prev => [...prev, data]);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    const { error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id);

    if (!error) {
      setCategories(prev =>
        prev.map(c => (c.id === id ? { ...c, ...category } : c))
      );
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('budgets')
      .insert([{ 
        category: budget.category,
        limit_amount: budget.limit,
        period: budget.period,
        user_id: userId 
      }])
      .select()
      .single();

    if (!error && data) {
      setBudgets(prev => [...prev, {
        id: data.id,
        category: data.category,
        limit: data.limit_amount,
        period: data.period
      }]);
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    const updateData: any = {};
    if (budget.category) updateData.category = budget.category;
    if (budget.limit !== undefined) updateData.limit_amount = budget.limit;
    if (budget.period) updateData.period = budget.period;

    const { error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id);

    if (!error) {
      setBudgets(prev =>
        prev.map(b => (b.id === id ? { ...b, ...budget } : b))
      );
    }
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (!error) {
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  const addRecurringTemplate = async (template: Omit<RecurringTemplate, 'id'>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('recurring_templates')
      .insert([{ ...template, user_id: userId }])
      .select()
      .single();

    if (!error && data) {
      setRecurringTemplates(prev => [...prev, data]);
    }
  };

  const updateRecurringTemplate = async (id: string, template: Partial<RecurringTemplate>) => {
    const { error } = await supabase
      .from('recurring_templates')
      .update(template)
      .eq('id', id);

    if (!error) {
      setRecurringTemplates(prev =>
        prev.map(t => (t.id === id ? { ...t, ...template } : t))
      );
    }
  };

  const deleteRecurringTemplate = async (id: string) => {
    const { error } = await supabase
      .from('recurring_templates')
      .delete()
      .eq('id', id);

    if (!error) {
      setRecurringTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([{ ...goal, user_id: userId }])
      .select()
      .single();

    if (!error && data) {
      setSavingsGoals(prev => [...prev, data]);
    }
  };

  const updateSavingsGoal = async (id: string, goal: Partial<SavingsGoal>) => {
    const { error } = await supabase
      .from('savings_goals')
      .update(goal)
      .eq('id', id);

    if (!error) {
      setSavingsGoals(prev =>
        prev.map(g => (g.id === id ? { ...g, ...goal } : g))
      );
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (!error) {
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <DataContext.Provider
      value={{
        user,
        transactions,
        categories,
        stats,
        budgets: budgetsWithSpent,
        recurringTemplates,
        savingsGoals,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        deleteTransactions,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addRecurringTemplate,
        updateRecurringTemplate,
        deleteRecurringTemplate,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}