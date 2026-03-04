import React, { useState } from 'react';
import { Wallet, ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setError('Check your email for the confirmation link!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] border border-slate-200 dark:border-slate-800">
        
        {/* Left Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#064c39] dark:bg-emerald-600 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#064c39] dark:text-emerald-400">Steven Budget</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              {isSignUp ? 'Create your account to get started.' : 'Welcome back! Please enter your details.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#064c39]/20 dark:focus:ring-emerald-500/20 focus:border-[#064c39] dark:focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-12 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#064c39]/20 dark:focus:ring-emerald-500/20 focus:border-[#064c39] dark:focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className={cn(
                "text-sm font-medium p-3 rounded-lg flex items-center gap-2",
                error.includes('confirmation') ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              )}>
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#064c39] dark:text-emerald-600 focus:ring-[#064c39] dark:focus:ring-emerald-600 bg-white dark:bg-slate-800" />
                <span className="text-slate-600 dark:text-slate-400">Remember for 30 days</span>
              </label>
              <button type="button" className="text-[#064c39] dark:text-emerald-400 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#064c39] dark:bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-[#064c39]/90 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#064c39]/20 dark:shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#064c39] dark:text-emerald-400 font-bold hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up for free'}
            </button>
          </div>
        </div>

        {/* Right Side - Image/Decoration */}
        <div className="hidden md:block relative bg-[#064c39] dark:bg-slate-950 p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#064c39]/80 to-[#064c39]/90 dark:from-slate-900/90 dark:to-slate-950/90"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            <div>
              <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
                New Feature: AI Insights
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Master your money with smart analytics.
              </h2>
              <p className="text-emerald-100 dark:text-slate-300 text-lg">
                Join thousands of users who are taking control of their financial future with Steven Budget.
              </p>
            </div>

            {/* Floating Cards Animation */}
            <div className="relative h-64 w-full">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute top-0 right-0 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl text-slate-900 dark:text-slate-100 w-64 transform rotate-6 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Balance</p>
                    <p className="font-bold">Rp 12,450,000</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 w-[75%] h-full rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl text-slate-900 dark:text-slate-100 w-56 transform -rotate-3 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Budget</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">On Track</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[40, 70, 45, 90, 60, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-t-sm relative group">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-sm transition-all duration-500"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
