import React, { useState } from 'react';
import { Shield, KeyRound, Mail, UserPlus, LogIn, AlertCircle, Sparkles, Database } from 'lucide-react';
import { authService, isSupabaseConfigured } from '../lib/supabase.js';
import { UserProfile } from '../types.js';

interface AuthViewProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { user, error: loginError } = await authService.signIn(email, password);
        if (loginError) {
          setError(loginError);
        } else {
          // Fetch the completed profile (which fetches the role)
          const profile = await authService.getCurrentProfile();
          if (profile) {
            onAuthSuccess(profile);
          } else {
            setError('Failed to fetch user profile.');
          }
        }
      } else {
        const { user, error: signupError } = await authService.signUp(email, password, role);
        if (signupError) {
          setError(signupError);
        } else {
          setSuccessMsg(
            isSupabaseConfigured
              ? 'Registration successful! Please check your email for verification, then sign in.'
              : 'Registration successful! Automatically logged into your new account.'
          );
          
          if (!isSupabaseConfigured) {
            // In mock mode, we auto-login on signup
            setTimeout(async () => {
              const profile = await authService.getCurrentProfile();
              if (profile) onAuthSuccess(profile);
            }, 1000);
          } else {
            setIsLogin(true);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to quickly log in with pre-seeded mock credentials
  const handleMockQuickLogin = async (mockEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, error: loginError } = await authService.signIn(mockEmail, 'password');
      if (loginError) {
        setError(loginError);
      } else {
        const profile = await authService.getCurrentProfile();
        if (profile) onAuthSuccess(profile);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-fade-in p-2 text-slate-800 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-natural-sage/10 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-natural-sage dark:text-indigo-400 mx-auto shadow-sm">
            <KeyRound className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLogin 
              ? 'Sign in to access your dashboard, converter, and settings' 
              : 'Join LisanText to customize transcribing and submit feedback'}
          </p>
        </div>

        {/* Database Mode Status Badge */}
        <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
          isSupabaseConfigured 
            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
            : 'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300'
        }`}>
          <Database className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              {isSupabaseConfigured ? 'Real Supabase Configured' : 'Interactive Sandbox Fallback'}
            </p>
            <p className="text-[11px] leading-relaxed mt-0.5 opacity-85">
              {isSupabaseConfigured
                ? 'Connecting to your live PostgreSQL database on Supabase. Security roles are fully synced.'
                : 'Keys are missing in env. Running in persistent sandboxed mode. You can create accounts and switch roles instantly!'}
            </p>
          </div>
        </div>

        {/* Errors / Success Alerts */}
        {error && (
          <div className="p-3.5 bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-start gap-2.5 text-xs">
            <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-natural-bg/40 dark:bg-slate-900 border border-natural-border/60 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-natural-sage focus:ring-1 focus:ring-natural-sage"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-natural-bg/40 dark:bg-slate-900 border border-natural-border/60 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-natural-sage focus:ring-1 focus:ring-natural-sage"
              />
            </div>
          </div>

          {/* Role selector on Signup only */}
          {!isLogin && (
            <div className="space-y-2 pt-1 animate-fade-in">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-natural-sage" />
                Select Security Access Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    role === 'user'
                      ? 'bg-natural-sage/10 border-natural-sage text-natural-sage dark:text-indigo-400 dark:border-indigo-500'
                      : 'border-natural-border/60 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  Regular User Role
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500'
                      : 'border-natural-border/60 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  Administrator Role
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">
                {role === 'admin' 
                  ? '⚠️ Admin users can add/edit/delete words, review submitted correction reports, view stats, and import CSV.' 
                  : '✔️ Regular users can run phonetic conversions, search definitions, and submit typo correction reports.'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-natural-sage hover:bg-natural-sage-hover disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-sm font-bold shadow-md shadow-natural-sage/10 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Toggle Form Mode */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-natural-sage dark:text-indigo-400 font-semibold hover:underline"
          >
            {isLogin ? "Don't have an account yet? Register here" : 'Already have an account? Sign in here'}
          </button>
        </div>

        {/* Mock Sandbox Helper */}
        {!isSupabaseConfigured && (
          <div className="pt-4 border-t border-natural-border/30 dark:border-slate-800/40 space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 text-center">
              Quick Sandbox Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleMockQuickLogin('admin@example.com')}
                disabled={isLoading}
                className="py-2 px-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-[11px] font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer"
              >
                Log in as Admin
              </button>
              <button
                type="button"
                onClick={() => handleMockQuickLogin('user@example.com')}
                disabled={isLoading}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Log in as User
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Supabase API Key Help Box */}
      <div className="mt-5 p-5 bg-slate-50 dark:bg-slate-900/40 border border-natural-border/40 dark:border-slate-800 rounded-[24px] space-y-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Database className="h-4 w-4 text-natural-sage" />
          How to connect real Supabase Auth?
        </h4>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Open the AI Studio <strong>Settings</strong> (or Secrets panel), and define these environment variables with your Supabase credentials:
        </p>
        <pre className="text-[10px] font-mono bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-natural-border/20 dark:border-slate-800 overflow-x-auto text-slate-600 dark:text-slate-300">
          VITE_SUPABASE_URL=your-supabase-url{"\n"}
          VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
        </pre>
        <p className="text-[10px] leading-normal text-slate-400">
          The applet will automatically detect them and securely initialize the live Supabase Auth and Database profiles!
        </p>
      </div>
    </div>
  );
}
