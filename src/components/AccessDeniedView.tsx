import React from 'react';
import { ShieldAlert, ArrowLeft, UserCircle, Settings } from 'lucide-react';

interface AccessDeniedViewProps {
  onNavigate: (page: string) => void;
}

export default function AccessDeniedView({ onNavigate }: AccessDeniedViewProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 animate-fade-in p-4 text-center space-y-6">
      <div className="w-20 h-20 bg-red-500/10 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto border border-red-500/20 shadow-inner">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
          403 Access Denied
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          You do not have administrative permissions to view this section.
        </p>
      </div>

      {/* Role details */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-[28px] border border-natural-border/60 dark:border-slate-800/80 max-w-md mx-auto shadow-sm text-left space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Security Information
        </h4>
        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            Your current security clearance role is: <span className="px-2 py-0.5 font-bold uppercase tracking-wider text-xs rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">User</span>
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-2">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Only Administrators can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
              <li>Access the Admin Dashboard</li>
              <li>Add, Edit, and Delete dictionary entries</li>
              <li>Review unknown word queues</li>
              <li>Import or export CSV dictionaries</li>
              <li>Inspect system-wide analytics stats</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer shadow-sm border border-slate-200/50 dark:border-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 px-5 py-2.5 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-natural-sage/10 transition-all"
        >
          <Settings className="h-4 w-4" />
          Switch Profile (Settings)
        </button>
      </div>
    </div>
  );
}
