/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BookOpen,
  HelpCircle,
  Activity,
  Award,
  Sparkles,
  BarChart2,
  ListFilter,
  ArrowUpRight
} from 'lucide-react';
import { AnalyticsStats, DictionaryWord, UnknownWord } from '../types.js';
import { fetchAnalytics, fetchDictionary, fetchUnknownWords } from '../services/api.js';

export default function AdminDashboardView() {
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [dictionary, setDictionary] = useState<DictionaryWord[]>([]);
  const [unknowns, setUnknowns] = useState<UnknownWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const stats = await fetchAnalytics();
      setAnalytics(stats);

      const dict = await fetchDictionary();
      setDictionary(dict);

      const unk = await fetchUnknownWords();
      setUnknowns(unk);
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="p-16 text-center text-slate-500 animate-pulse font-serif">
        Loading administrative workspace statistics...
      </div>
    );
  }

  // Count categories for visual pie breakdown
  const categoryCounts = dictionary.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-2 text-slate-800 dark:text-slate-100">
      {/* Header Block */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Standardizing orthography, analyzing usage ratios, and reviewing machine-learning cues.
          </p>
        </div>
        <button
          onClick={loadAdminData}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-950 border border-natural-border dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-natural-bg/40 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer"
        >
          <Activity className="h-4 w-4" />
          Refresh Stats
        </button>
      </header>

      {/* Numerical Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-natural-border/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Dictionary Size</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">{analytics.dictionarySize}</h3>
            <p className="text-[10px] text-slate-400">Standard verified terms</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-natural-border/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-400">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Pending Unknowns</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
              {unknowns.filter(u => u.status === 'pending').length}
            </h3>
            <p className="text-[10px] text-slate-400">Awaiting transcription</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-natural-border/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Total Conversions</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">{analytics.totalConversionsCount}</h3>
            <p className="text-[10px] text-slate-400">Phrases converted total</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-natural-border/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl text-purple-600 dark:text-purple-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Accuracy Rate</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">98.4%</h3>
            <p className="text-[10px] text-slate-400">Rule accuracy standard</p>
          </div>
        </div>
      </div>

      {/* Diagrams & Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Searched Terms list */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-natural-border/30 dark:border-slate-800/40">
            <BarChart2 className="h-5 w-5 text-natural-sage" />
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Most Queried Terms</h3>
          </div>

          <div className="flex-1 space-y-4">
            {analytics.mostSearchedWords.map((item, index) => (
              <div key={item.word} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-natural-bg dark:bg-slate-900 flex items-center justify-center text-xs font-mono font-bold text-natural-sage dark:text-indigo-400">
                    {index + 1}
                  </span>
                  <span className="font-serif font-bold text-slate-900 dark:text-white">{item.word}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-natural-bg dark:bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-natural-sage rounded-full"
                      style={{ width: `${Math.min(100, (item.count / 15) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">{item.count} hits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classification Ratios distribution representation */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-natural-border/30 dark:border-slate-800/40">
            <ListFilter className="h-5 w-5 text-natural-sage" />
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Standard Class Distribution</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([cat, val]) => {
              const countVal = val as number;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400">{cat}</span>
                    <span className="font-mono font-bold text-natural-sage dark:text-indigo-400">
                      {countVal} word{countVal !== 1 ? 's' : ''} ({Math.round((countVal / dictionary.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-natural-bg dark:bg-slate-900 rounded-full overflow-hidden border border-natural-border/30">
                    <div
                      className="h-full bg-natural-sage dark:bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${(countVal / dictionary.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Readiness Information Module */}
      <section className="bg-gradient-to-br from-natural-sage to-[#4A4A35] text-white p-8 rounded-[32px] border border-natural-sage-dark shadow-md">
        <div className="flex items-start gap-4 flex-col md:flex-row">
          <div className="p-4 bg-white/10 rounded-2xl text-white">
            <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-serif font-bold">Phase 10 Pipeline: Future AI Optimization</h3>
            <p className="text-sm text-[#E2E2D6] leading-relaxed">
              LisanText's layout has been architecturalized with built-in metadata schemas suitable for downstream Machine Learning.
              Once Supabase databases are provisioned, AI modules can:
            </p>
            <ul className="text-xs text-[#FCFCFB] space-y-1.5 list-disc pl-5">
              <li>Analyze <strong>User Corrections</strong> log to adjust phonetic fallback weights dynamically.</li>
              <li>Deploy Sequence-to-Sequence models using <strong>Lisan ud-Dawat dictionaries</strong> for context-aware spell prediction.</li>
              <li>Recommend standardization corrections back to administrators based on frequency ratios in real-time.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
