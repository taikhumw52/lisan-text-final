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
  History,
  FileText,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AnalyticsStats, DictionaryWord, UnknownWord, CorrectionReport, DictionaryVersion } from '../types.js';
import {
  fetchAnalytics,
  fetchDictionary,
  fetchUnknownWords,
  fetchReports,
  updateReportStatus,
  addDictionaryWord,
  updateDictionaryWord,
  deleteDictionaryWord,
  fetchVersions
} from '../services/api.js';

export default function AdminDashboardView() {
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [dictionary, setDictionary] = useState<DictionaryWord[]>([]);
  const [unknowns, setUnknowns] = useState<UnknownWord[]>([]);
  const [reports, setReports] = useState<CorrectionReport[]>([]);
  const [versions, setVersions] = useState<DictionaryVersion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sub-navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'dictionary' | 'versions'>('overview');

  // Dictionary Management states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showWordModal, setShowWordModal] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<DictionaryWord | null>(null);
  const [wordForm, setWordForm] = useState({
    romanized: '',
    arabic: '',
    meaning: '',
    category: 'Nouns',
    alternatesInput: ''
  });
  const [isSavingWord, setIsSavingWord] = useState<boolean>(false);

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

      const rpts = await fetchReports();
      setReports(rpts);

      const vers = await fetchVersions();
      setVersions(vers);
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Report resolution handler
  const handleResolveReport = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateReportStatus(id, status);
      // Reload admin data to fetch updated dictionary, reports, and version logs
      await loadAdminData();
    } catch (err) {
      console.error('Failed to update report status', err);
      alert('Failed to resolve report. Check console logs.');
    }
  };

  // Dictionary management helpers
  const handleOpenAddModal = () => {
    setEditingWord(null);
    setWordForm({
      romanized: '',
      arabic: '',
      meaning: '',
      category: 'Nouns',
      alternatesInput: ''
    });
    setShowWordModal(true);
  };

  const handleOpenEditModal = (word: DictionaryWord) => {
    setEditingWord(word);
    setWordForm({
      romanized: word.romanized,
      arabic: word.arabic,
      meaning: word.meaning,
      category: word.category,
      alternatesInput: (word.alternates || []).join(', ')
    });
    setShowWordModal(true);
  };

  const handleDeleteWord = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this word from standard dictionary databases? This action logs an audit trace.')) return;
    try {
      await deleteDictionaryWord(id);
      await loadAdminData();
    } catch (err) {
      console.error('Failed to delete word', err);
    }
  };

  const handleSaveWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordForm.romanized.trim() || !wordForm.arabic.trim()) return;
    setIsSavingWord(true);

    const wordPayload: Partial<DictionaryWord> = {
      romanized: wordForm.romanized.trim(),
      arabic: wordForm.arabic.trim(),
      meaning: wordForm.meaning.trim(),
      category: wordForm.category,
      alternates: wordForm.alternatesInput
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
    };

    try {
      if (editingWord) {
        await updateDictionaryWord(editingWord.id, wordPayload);
      } else {
        await addDictionaryWord(wordPayload);
      }
      setShowWordModal(false);
      await loadAdminData();
    } catch (err) {
      console.error('Failed to save dictionary word', err);
      alert('Error occurred while writing word payload. Check console log.');
    } finally {
      setIsSavingWord(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="p-16 text-center text-slate-500 animate-pulse font-serif">
        Loading administrative workspace statistics and version registries...
      </div>
    );
  }

  // Categories counts
  const categoryCounts = dictionary.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Filter dictionary list
  const filteredDictionary = dictionary.filter(w => {
    const matchesSearch =
      w.romanized.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.arabic.includes(searchTerm) ||
      w.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-2 text-slate-800 dark:text-slate-100">
      {/* Header Block */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Standardizing orthography, analyzing usage ratios, and auditing lexicon revisions.
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

      {/* Sub Tab Navigation */}
      <nav className="flex gap-1 border-b border-natural-border/30 dark:border-slate-800/40 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'overview'
              ? 'border-natural-sage text-natural-sage'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-natural-sage text-natural-sage'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Correction Reports
          {pendingReportsCount > 0 && (
            <span className="bg-amber-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full">
              {pendingReportsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'dictionary'
              ? 'border-natural-sage text-natural-sage'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Dictionary Manager
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'versions'
              ? 'border-natural-sage text-natural-sage'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Audit History
        </button>
      </nav>

      {/* Overview Panel Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
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
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Active Reports</p>
                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">{pendingReportsCount}</h3>
                <p className="text-[10px] text-slate-400">Awaiting moderator check</p>
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
                {analytics.mostSearchedWords.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No queried words logged yet.</p>
                ) : (
                  analytics.mostSearchedWords.map((item, index) => (
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
                  ))
                )}
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
                <h3 className="text-xl font-serif font-bold">Lexical Feedback Loops: Dynamic Learning</h3>
                <p className="text-sm text-[#E2E2D6] leading-relaxed">
                  LisanText maintains high-integrity revision telemetry tracking exact correction approvals.
                  When you approve a user suggestion in the Correction Review panel, the word is immediately integrated into our verified standard dictionary, with automatic history traces kept for auditing.
                </p>
                <div className="flex gap-4 pt-1">
                  <div className="text-xs bg-white/10 px-3.5 py-1.5 rounded-xl">
                    <span className="font-bold">Closed Review Queue:</span> Fully Managed
                  </div>
                  <div className="text-xs bg-white/10 px-3.5 py-1.5 rounded-xl">
                    <span className="font-bold">Audit Tracing:</span> 100% Comprehensive
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Sub Tab: Correction Reports */}
      {activeTab === 'reports' && (
        <section className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-natural-border/20 dark:border-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Translation Correction Suggestions</h3>
                <p className="text-xs text-slate-500">Submitted by users when encountering translation inaccuracies.</p>
              </div>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No translation correction reports logged in the workspace database.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`border p-5 rounded-2xl space-y-4 transition-all ${
                    report.status === 'pending'
                      ? 'border-amber-200 dark:border-amber-950 bg-amber-50/10 dark:bg-amber-950/5'
                      : report.status === 'approved'
                      ? 'border-emerald-100 dark:border-emerald-950 bg-emerald-50/5 dark:bg-emerald-950/5'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/5 dark:bg-slate-900/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold font-serif px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        {report.romanized}
                      </span>
                      <span className="text-xs text-slate-400">submitted {new Date(report.timestamp).toLocaleDateString()}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        report.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                          : report.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/40 dark:bg-black/10 p-4 rounded-xl text-sm border border-slate-100 dark:border-slate-900">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Output</span>
                      <p className="font-serif font-semibold text-slate-700 dark:text-slate-300">{report.currentOutput || '(No conversion available)'}</p>
                    </div>
                    <div className="space-y-1 text-right md:text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Suggested Proper Arabic</span>
                      <p className="font-serif font-bold text-lg text-emerald-600 dark:text-emerald-400" style={{ direction: 'rtl' }}>
                        {report.correctArabic}
                      </p>
                    </div>
                  </div>

                  {report.explanation && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg leading-relaxed">
                      <strong>Explanation:</strong> {report.explanation}
                    </div>
                  )}

                  {report.status === 'pending' && (
                    <div className="flex justify-end gap-3 pt-1">
                      <button
                        onClick={() => handleResolveReport(report.id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject suggestion
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'approved')}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm shadow-emerald-600/10"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve & Save to Dictionary
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Sub Tab: Dictionary Manager */}
      {activeTab === 'dictionary' && (
        <section className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-natural-border/20 dark:border-slate-800/40 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Dictionary Word Manager</h3>
              <p className="text-xs text-slate-500">Edit, add, or prune words in LisanText standard dictionary.</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Dictionary Word
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search words, Arabic, or meaning..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-natural-border/60 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-natural-border/60 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
              >
                <option value="All">All Categories</option>
                <option value="Common Phrase">Common Phrase</option>
                <option value="Nouns">Nouns</option>
                <option value="Verbs">Verbs</option>
                <option value="Adjectives">Adjectives</option>
              </select>
            </div>
          </div>

          {/* Dictionary Table */}
          {filteredDictionary.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">No matching words found.</p>
          ) : (
            <div className="overflow-x-auto border border-natural-border/30 dark:border-slate-900 rounded-2xl">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#FCFCFB] dark:bg-slate-900/60 border-b border-natural-border/30 dark:border-slate-800/40 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4">Romanized</th>
                    <th className="p-4">Arabic Script</th>
                    <th className="p-4">Meaning</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Alternates</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-border/20 dark:divide-slate-900">
                  {filteredDictionary.map((word) => (
                    <tr key={word.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-4 font-serif font-bold text-slate-900 dark:text-white">{word.romanized}</td>
                      <td className="p-4 font-serif text-lg text-emerald-600 dark:text-emerald-400" style={{ direction: 'rtl' }}>
                        {word.arabic}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{word.meaning}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full text-slate-500">
                          {word.category}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 truncate max-w-[150px]">
                        {(word.alternates || []).join(', ') || '-'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenEditModal(word)}
                            className="p-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="p-1.5 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Sub Tab: Audit History / Versions */}
      {activeTab === 'versions' && (
        <section className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-natural-border/20 dark:border-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Lexicon Revision Audit History</h3>
                <p className="text-xs text-slate-500">Complete immutable audit trail of additions, edits, and deletions in standard lists.</p>
              </div>
            </div>
          </div>

          {versions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No change log events captured in the version history table.
            </div>
          ) : (
            <div className="relative border-l border-natural-border/40 dark:border-slate-800 pl-6 ml-4 space-y-8 py-2">
              {versions.map((v) => {
                const isCreate = v.changeType === 'create';
                const isDelete = v.changeType === 'delete';
                const actionBadgeColor = isCreate
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : isDelete
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300';

                return (
                  <div key={v.id} className="relative group space-y-1.5">
                    {/* Circle timeline dot */}
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-950 border-2 border-natural-sage group-hover:scale-125 transition-transform"></div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${actionBadgeColor}`}>
                        {v.changeType}
                      </span>
                      <strong className="text-slate-800 dark:text-white font-serif">{v.romanized}</strong>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">Changed by {v.changedBy}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(v.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 p-4 rounded-xl text-xs space-y-2 max-w-2xl leading-relaxed">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Previous Value</span>
                          <span className="font-serif font-semibold text-slate-500 dark:text-slate-400">
                            {v.previousArabic ? `Arabic: ${v.previousArabic}` : '(New Term)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Updated Value</span>
                          <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {v.newArabic ? `Arabic: ${v.newArabic}` : '(Deleted Entry)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Dictionary Add/Edit Dialog Modal */}
      {showWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 max-w-md w-full rounded-3xl border border-natural-border/60 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-natural-border/20 dark:border-slate-800/40 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                  {editingWord ? 'Edit Lexicon Word' : 'Add Word to Lexicon'}
                </h3>
                <p className="text-xs text-slate-500">Update the standard vocabulary database of LisanText.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWordModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Romanized Token (Primary)</label>
                <input
                  type="text"
                  required
                  value={wordForm.romanized}
                  onChange={(e) => setWordForm({ ...wordForm, romanized: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                  placeholder="e.g. jaman"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Arabic script spelling</label>
                <input
                  type="text"
                  required
                  value={wordForm.arabic}
                  onChange={(e) => setWordForm({ ...wordForm, arabic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm text-right font-serif focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100 text-lg"
                  placeholder="e.g. جمن"
                  style={{ direction: 'rtl' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                  <select
                    value={wordForm.category}
                    onChange={(e) => setWordForm({ ...wordForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                  >
                    <option value="Common Phrase">Common Phrase</option>
                    <option value="Nouns">Nouns</option>
                    <option value="Verbs">Verbs</option>
                    <option value="Adjectives">Adjectives</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Meaning translation</label>
                  <input
                    type="text"
                    value={wordForm.meaning}
                    onChange={(e) => setWordForm({ ...wordForm, meaning: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Communal feast"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Alternate spellings (Comma separated)
                </label>
                <input
                  type="text"
                  value={wordForm.alternatesInput}
                  onChange={(e) => setWordForm({ ...wordForm, alternatesInput: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                  placeholder="e.g. jamman, jaaman"
                />
              </div>

              <div className="pt-2 border-t border-natural-border/20 dark:border-slate-800/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWordModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingWord}
                  className="px-5 py-2 bg-natural-sage hover:bg-natural-sage-hover text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-md shadow-natural-sage/10"
                >
                  {isSavingWord ? 'Saving Word...' : editingWord ? 'Save Changes' : 'Add Word'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

