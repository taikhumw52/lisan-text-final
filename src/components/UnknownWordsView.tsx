/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Send, Plus } from 'lucide-react';
import { UnknownWord } from '../types.js';
import { fetchUnknownWords, updateUnknownWord, addDictionaryWord } from '../services/api.js';
import { transliterateWord } from '../utils/transliteration.js';

export default function UnknownWordsView() {
  const [items, setItems] = useState<UnknownWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<UnknownWord | null>(null);

  // Suggested revision input state
  const [manualArabicInput, setManualArabicInput] = useState<string>('');
  const [manualMeaning, setManualMeaning] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<string>('Nouns');

  useEffect(() => {
    loadUnknownWords();
  }, []);

  const loadUnknownWords = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUnknownWords();
      setItems(data);
    } catch (e) {
      console.error('Failed to load unknown words queue', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item: UnknownWord) => {
    setSelectedItem(item);
    // Auto-generate suggested transliteration if empty
    const suggestion = item.suggestedTransliteration || transliterateWord(item.word).arabic;
    setManualArabicInput(suggestion);
    setManualMeaning('');
    setManualCategory('Nouns');
  };

  const handleApprove = async () => {
    if (!selectedItem || !manualArabicInput.trim()) return;

    try {
      // 1. Add directly to standardized dictionary
      await addDictionaryWord({
        romanized: selectedItem.word,
        arabic: manualArabicInput.trim(),
        meaning: manualMeaning.trim(),
        category: manualCategory,
      });

      // 2. Mark queue status as approved
      await updateUnknownWord(selectedItem.id, {
        status: 'approved',
        suggestedTransliteration: manualArabicInput.trim()
      });

      setSelectedItem(null);
      loadUnknownWords();
      alert('Word successfully approved and merged into standard Lisan Dictionary!');
    } catch (e) {
      console.error('Failed to approve unknown word', e);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this unknown word from the queue?')) return;
    try {
      await updateUnknownWord(id, { status: 'rejected' });
      setSelectedItem(null);
      loadUnknownWords();
    } catch (e) {
      console.error('Failed to reject word', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-2 text-slate-800 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Unknown Words Queue</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review unrecognized phrases or user submittals, revise their phonetic matches, and approve them to expand the dictionary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: List of pending items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-950 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-natural-border/30 dark:border-slate-800/40 bg-[#FCFCFB] dark:bg-slate-900/40 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-natural-sage dark:text-indigo-400">Queue Items</span>
              <button onClick={loadUnknownWords} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {isLoading ? (
              <div className="p-16 text-center text-slate-400 animate-pulse font-serif">Loading queue database...</div>
            ) : items.length === 0 ? (
              <div className="p-16 text-center text-slate-400 font-serif">The unknown words queue is empty! Beautifully covered.</div>
            ) : (
              <div className="divide-y divide-natural-border/20 dark:divide-slate-800/40">
                {items.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-5 hover:bg-natural-bg/30 dark:hover:bg-slate-900/30 transition-all cursor-pointer flex justify-between items-center ${
                        isSelected ? 'bg-natural-bg/50 dark:bg-slate-900/50 border-l-4 border-natural-sage' : ''
                      }`}
                    >
                      <div className="space-y-1 pr-4 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif font-bold text-base text-slate-900 dark:text-white">{item.word}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-950/40 uppercase tracking-wide">
                            {item.status}
                          </span>
                        </div>
                        {item.originalSentence && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate">
                            Context: "{item.originalSentence}"
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400">
                          Logged: {new Date(item.dateLogged).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-natural-bg dark:bg-slate-900 px-2.5 py-1 rounded-full">
                          {item.requestsCount} requests
                        </span>
                        {item.status === 'pending' && (
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                              title="Reject word"
                            >
                              <XCircle className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Action panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-md space-y-6">
              <div className="border-b border-natural-border/30 dark:border-slate-800/40 pb-4">
                <span className="text-[10px] text-natural-sage dark:text-indigo-400 uppercase tracking-wider font-bold block mb-1">Active Queue Word</span>
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">{selectedItem.word}</h3>
                {selectedItem.originalSentence && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic leading-relaxed bg-natural-bg/40 dark:bg-slate-900 p-2 rounded-xl">
                    "{selectedItem.originalSentence}"
                  </p>
                )}
              </div>

              {selectedItem.status === 'pending' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Suggested Transliteration</label>
                    <input
                      type="text"
                      value={manualArabicInput}
                      onChange={(e) => setManualArabicInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-lg font-serif text-right focus:outline-none focus:border-natural-sage focus:ring-1 focus:ring-natural-sage text-slate-800 dark:text-slate-100"
                      placeholder="e.g. مولى"
                      style={{ direction: 'rtl' }}
                    />
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[10px] text-slate-400">Review phonetic match accuracy</span>
                      <button
                        onClick={() => setManualArabicInput(transliterateWord(selectedItem.word).arabic)}
                        className="text-[10px] font-semibold text-natural-sage dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Reset to phonetic guess
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Meaning / Definition</label>
                    <input
                      type="text"
                      value={manualMeaning}
                      onChange={(e) => setManualMeaning(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                      placeholder="Add English meaning"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Word Category</label>
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                    >
                      <option value="Nouns">Nouns</option>
                      <option value="Verbs">Verbs</option>
                      <option value="Common Phrase">Common Phrase</option>
                      <option value="Adjectives">Adjectives</option>
                      <option value="Uncategorized">Uncategorized</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-natural-border/30 dark:border-slate-800/40 flex flex-col gap-2">
                    <button
                      onClick={handleApprove}
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-natural-sage/10 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Approve & Standardize
                    </button>
                    <button
                      onClick={() => handleReject(selectedItem.id)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Submittal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center py-6 bg-natural-bg/30 dark:bg-slate-900 rounded-2xl border border-dashed border-natural-border/50">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Already Actioned</p>
                    <p className="text-xs text-slate-500 mt-1">This submittal was marked as <code className="bg-natural-bg dark:bg-slate-900 px-1 rounded font-mono font-bold">{selectedItem.status}</code>.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-dashed border-natural-border dark:border-slate-800/80 text-center text-slate-400 space-y-4 shadow-sm">
              <AlertCircle className="h-10 w-10 text-natural-sage/40 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white font-serif">No Selected Submittal</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Select any unknown word from the queue list to review context, revise Arabic spelling suggestions, and approve them.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
