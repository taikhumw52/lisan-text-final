/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HomeViewProps {
  onNavigate: (page: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-10 animate-fade-in py-4">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome to <span className="text-natural-sage dark:text-indigo-400">LisanText</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          A premium transliteration companion designed to convert Romanized Lisan ud-Dawat into proper, beautiful Arabic-script.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <button
          onClick={() => onNavigate('converter')}
          className="flex flex-col items-center p-8 bg-white dark:bg-slate-950 rounded-[32px] shadow-sm border border-natural-border/60 dark:border-slate-800 hover:border-natural-sage dark:hover:border-natural-sage hover:shadow-md transition-all text-center group cursor-pointer"
        >
          <div className="p-4 bg-natural-sage-light dark:bg-slate-900 rounded-2xl text-natural-sage dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🔄</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">Lisan Converter</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Convert Romanized text to Arabic script in real-time.
          </p>
        </button>

        <button
          onClick={() => onNavigate('dictionary')}
          className="flex flex-col items-center p-8 bg-white dark:bg-slate-950 rounded-[32px] shadow-sm border border-natural-border/60 dark:border-slate-800 hover:border-natural-sage dark:hover:border-natural-sage hover:shadow-md transition-all text-center group cursor-pointer"
        >
          <div className="p-4 bg-natural-sage-light dark:bg-slate-900 rounded-2xl text-natural-sage dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
            <span className="text-2xl">📖</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">Lisan Dictionary</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Search, filter, and discover correct spellings & meanings.
          </p>
        </button>

        <button
          onClick={() => onNavigate('about')}
          className="flex flex-col items-center p-8 bg-white dark:bg-slate-950 rounded-[32px] shadow-sm border border-natural-border/60 dark:border-slate-800 hover:border-natural-sage dark:hover:border-natural-sage hover:shadow-md transition-all text-center group cursor-pointer"
        >
          <div className="p-4 bg-natural-sage-light dark:bg-slate-900 rounded-2xl text-natural-sage dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
            <span className="text-2xl">ℹ️</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">About LisanText</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Learn about transliteration standards, phonetic mappings, and more.
          </p>
        </button>
      </div>
    </div>
  );
}
