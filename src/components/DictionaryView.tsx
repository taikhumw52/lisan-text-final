/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Upload, Filter, X, Save } from 'lucide-react';
import { DictionaryWord } from '../types.js';
import { fetchDictionary, addDictionaryWord, updateDictionaryWord, deleteDictionaryWord } from '../services/api.js';

export default function DictionaryView() {
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof DictionaryWord>('romanized');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<DictionaryWord | null>(null);
  const [romanizedInput, setRomanizedInput] = useState<string>('');
  const [arabicInput, setArabicInput] = useState<string>('');
  const [meaningInput, setMeaningInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('Nouns');

  // CSV Import States
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [csvContent, setCsvContent] = useState<string>('');
  const [csvError, setCsvError] = useState<string>('');

  const categories = ['Common Phrase', 'Nouns', 'Verbs', 'Adjectives', 'Uncategorized'];

  useEffect(() => {
    loadDictionary();
  }, [search, selectedCategory, sortBy, sortOrder]);

  const loadDictionary = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDictionary({
        search,
        category: selectedCategory || undefined,
        sortBy,
        order: sortOrder,
      });
      setWords(data);
    } catch (e) {
      console.error('Failed to load dictionary words', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingWord(null);
    setRomanizedInput('');
    setArabicInput('');
    setMeaningInput('');
    setCategoryInput('Nouns');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (word: DictionaryWord) => {
    setEditingWord(word);
    setRomanizedInput(word.romanized);
    setArabicInput(word.arabic);
    setMeaningInput(word.meaning);
    setCategoryInput(word.category);
    setIsModalOpen(true);
  };

  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!romanizedInput.trim() || !arabicInput.trim()) return;

    try {
      if (editingWord) {
        await updateDictionaryWord(editingWord.id, {
          romanized: romanizedInput.trim(),
          arabic: arabicInput.trim(),
          meaning: meaningInput.trim(),
          category: categoryInput,
        });
      } else {
        await addDictionaryWord({
          romanized: romanizedInput.trim(),
          arabic: arabicInput.trim(),
          meaning: meaningInput.trim(),
          category: categoryInput,
        });
      }
      setIsModalOpen(false);
      loadDictionary();
    } catch (e) {
      console.error('Error saving word', e);
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dictionary entry?')) return;
    try {
      await deleteDictionaryWord(id);
      loadDictionary();
    } catch (e) {
      console.error('Failed to delete word', e);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    let headers = 'ID,Romanized,Arabic,Meaning,Category,Frequency,DateAdded\n';
    let rows = words.map(w => 
      `"${w.id}","${w.romanized.replace(/"/g, '""')}","${w.arabic.replace(/"/g, '""')}","${w.meaning.replace(/"/g, '""')}","${w.category}","${w.frequency}","${w.dateAdded}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'lisantext_dictionary_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import Parser
  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    setCsvError('');
    if (!csvContent.trim()) return;

    try {
      const lines = csvContent.split('\n');
      let successCount = 0;

      for (const line of lines) {
        if (!line.trim() || line.startsWith('Romanized') || line.startsWith('ID')) {
          continue; // skip empty lines & headers
        }

        // Extremely simple CSV parser parsing: Romanized,Arabic,Meaning,Category
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          const romanized = parts[0];
          const arabic = parts[1];
          const meaning = parts[2] || '';
          const category = parts[3] || 'Uncategorized';

          if (romanized && arabic) {
            await addDictionaryWord({ romanized, arabic, meaning, category });
            successCount++;
          }
        }
      }

      setIsCsvModalOpen(false);
      setCsvContent('');
      loadDictionary();
      alert(`Successfully imported ${successCount} words into dictionary!`);
    } catch (err) {
      setCsvError('Parsing failed. Ensure your CSV has columns: Romanized, Arabic, Meaning, Category');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Lisan Dictionary</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Search and manage words, meanings, and standardized Lisan spellings</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-950 border border-natural-border dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-natural-bg/40 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-950 border border-natural-border dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-natural-bg/40 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-natural-sage/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Word
          </button>
        </div>
      </div>

      {/* Searching / Filtering / Sorting Controls Bar */}
      <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-natural-border/60 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search words by romanized, Arabic, or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-natural-bg/50 dark:bg-slate-900 border border-natural-border/40 dark:border-slate-800/60 rounded-xl text-sm focus:outline-none focus:border-natural-sage dark:focus:border-indigo-400 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-natural-bg/50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-natural-border/40 dark:border-slate-800/60 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm focus:outline-none text-slate-700 dark:text-slate-300 cursor-pointer pr-1"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sorters */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof DictionaryWord)}
            className="bg-natural-bg/50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-natural-border/40 dark:border-slate-800/60 text-sm focus:outline-none text-slate-700 dark:text-slate-300 cursor-pointer w-full sm:w-auto"
          >
            <option value="romanized">Sort by Romanized</option>
            <option value="dateAdded">Sort by Date Added</option>
            <option value="frequency">Sort by Usage Frequency</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-natural-bg/50 dark:bg-slate-900 rounded-xl border border-natural-border/40 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-xs font-semibold cursor-pointer"
          >
            {sortOrder === 'asc' ? '▲ ASC' : '▼ DESC'}
          </button>
        </div>
      </div>

      {/* Dictionary Listings */}
      <div className="bg-white dark:bg-slate-950 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-500 animate-pulse font-serif">Loading dictionary database...</div>
        ) : words.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-serif">No dictionary terms matching your parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-natural-border/30 dark:border-slate-800/50 bg-[#FCFCFB] dark:bg-slate-900/30 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                  <th className="py-4 px-6 font-semibold">Romanized</th>
                  <th className="py-4 px-6 text-right font-semibold">Arabic Script</th>
                  <th className="py-4 px-6 font-semibold">Meaning</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold text-center">Frequency</th>
                  <th className="py-4 px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-natural-border/20 dark:divide-slate-800/40">
                {words.map((word) => (
                  <tr key={word.id} className="hover:bg-natural-bg/20 dark:hover:bg-slate-900/20 transition-all">
                    <td className="py-4.5 px-6 font-serif font-bold text-slate-900 dark:text-white">{word.romanized}</td>
                    <td className="py-4.5 px-6 text-right text-2xl font-serif text-natural-sage dark:text-indigo-400" style={{ direction: 'rtl' }}>
                      {word.arabic}
                    </td>
                    <td className="py-4.5 px-6 text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xs truncate">{word.meaning || '—'}</td>
                    <td className="py-4.5 px-6">
                      <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-full uppercase bg-natural-sage-light dark:bg-slate-900 text-natural-sage dark:text-indigo-400 border border-natural-border/30 dark:border-slate-800/50">
                        {word.category}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-center text-xs text-slate-500 font-mono">{word.frequency} searches</td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(word)}
                          className="p-1.5 text-slate-400 hover:text-natural-sage dark:hover:text-indigo-400 hover:bg-natural-bg/50 dark:hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
                          title="Edit Entry"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWord(word.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer"
                          title="Delete Entry"
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
      </div>

      {/* CRUD Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-[32px] border border-natural-border dark:border-slate-800 p-8 shadow-2xl animate-fade-in text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-natural-bg dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">
              {editingWord ? 'Edit Dictionary Word' : 'Add New Standard Word'}
            </h3>

            <form onSubmit={handleSaveWord} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Romanized Spellings</label>
                <input
                  type="text"
                  required
                  value={romanizedInput}
                  onChange={(e) => setRomanizedInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage focus:ring-1 focus:ring-natural-sage text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Moula"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Standard Arabic Script</label>
                <input
                  type="text"
                  required
                  value={arabicInput}
                  onChange={(e) => setArabicInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-lg font-serif text-right focus:outline-none focus:border-natural-sage focus:ring-1 focus:ring-natural-sage text-slate-800 dark:text-slate-100"
                  placeholder="e.g. مولى"
                  style={{ direction: 'rtl' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Meaning / Translation</label>
                <input
                  type="text"
                  value={meaningInput}
                  onChange={(e) => setMeaningInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage focus:ring-1 focus:ring-natural-sage text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Master / Spiritual Guide"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Classification Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-natural-border/30 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-natural-bg/50 dark:bg-slate-900 border border-natural-border/40 dark:border-slate-800 hover:bg-natural-bg dark:hover:bg-slate-800/60 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-natural-sage/10"
                >
                  <Save className="h-4 w-4" />
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCsvModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-[32px] border border-natural-border dark:border-slate-800 p-8 shadow-2xl animate-fade-in text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setIsCsvModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-natural-bg dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3">
              CSV Batch Word Import
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Paste comma-separated rows. Formats must follow: <code className="bg-natural-bg dark:bg-slate-900 px-1.5 py-0.5 rounded text-natural-sage font-mono">Romanized, Arabic, Meaning, Category</code>.
            </p>

            <form onSubmit={handleImportCsv} className="space-y-4">
              <textarea
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Moula, مولى, Master, Nouns&#10;Bismillah, بِسْمِ اللَّهِ, In the name of Allah, Common Phrase"
                className="w-full h-48 px-4 py-3 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs font-mono focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
              />

              {csvError && <p className="text-xs text-rose-500">{csvError}</p>}

              <div className="pt-3 flex justify-end gap-3 border-t border-natural-border/30 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 bg-natural-bg/50 dark:bg-slate-900 border border-natural-border/40 dark:border-slate-800 hover:bg-natural-bg dark:hover:bg-slate-800/60 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-natural-sage/10"
                >
                  Parse & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
