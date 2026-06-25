/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Trash2, RefreshCw, Check, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { DictionaryWord, ConversionHistoryItem } from '../types.js';
import { fetchDictionary, logHistory, fetchHistory, logUnknownWord, submitReport } from '../services/api.js';
import { convertText } from '../utils/transliteration.js';

export default function ConverterView() {
  const [input, setInput] = useState<string>('Ya saiyyedi wa maulaya khuz biyadi...');
  const [output, setOutput] = useState<string>('يا سيدي و مولاي خذ بيدي...');
  const [liveMode, setLiveMode] = useState<boolean>(true);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [dictionary, setDictionary] = useState<DictionaryWord[]>([]);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [wordDetails, setWordDetails] = useState<any[]>([]);
  const [averageConfidence, setAverageConfidence] = useState<number>(1.0);
  const [detectedUnknowns, setDetectedUnknowns] = useState<string[]>([]);
  const conversionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Correction report state
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportRomanized, setReportRomanized] = useState<string>('');
  const [reportCurrentOutput, setReportCurrentOutput] = useState<string>('');
  const [reportCorrectArabic, setReportCorrectArabic] = useState<string>('');
  const [reportExplanation, setReportExplanation] = useState<string>('');
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Load Dictionary and Conversion History on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dictData = await fetchDictionary();
      setDictionary(dictData);
      const histData = await fetchHistory();
      setHistory(histData);
    } catch (e) {
      console.error('Failed to load converter dependencies', e);
    }
  };

  // Perform full conversion
  const handleConvert = async (textToConvert: string) => {
    if (!textToConvert.trim()) {
      setOutput('');
      setDetectedUnknowns([]);
      return;
    }
    setIsConverting(true);

    try {
      const result = await convertText(textToConvert, dictionary, async (word, context) => {
        // Send unknown word to the queue in the background
        try {
          await logUnknownWord({
            word,
            originalSentence: context,
            suggestedTransliteration: ''
          });
        } catch (e) {
          // Ignore background logging errors
        }
      });

      setOutput(result.convertedText);
      setWordDetails(result.wordDetails);
      setAverageConfidence(result.averageConfidence);
      setDetectedUnknowns(result.unknownWords || []);

      // Log to conversion history
      if (textToConvert !== 'Ya saiyyedi wa maulaya khuz biyadi...') {
        await logHistory({
          originalText: textToConvert,
          convertedText: result.convertedText,
          wordCount: result.wordsConverted,
          charCount: result.charsConverted,
        });
        // Reload history
        const histData = await fetchHistory();
        setHistory(histData);
      }
    } catch (error) {
      console.error('Conversion failed', error);
    } finally {
      setIsConverting(false);
    }
  };

  // Live Mode Conversion logic with debouncing
  useEffect(() => {
    if (liveMode) {
      if (conversionTimeout.current) {
        clearTimeout(conversionTimeout.current);
      }
      conversionTimeout.current = setTimeout(() => {
        handleConvert(input);
      }, 300);
    }
    return () => {
      if (conversionTimeout.current) clearTimeout(conversionTimeout.current);
    };
  }, [input, liveMode, dictionary]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setDetectedUnknowns([]);
  };

  const openReportDialog = (word?: string, currentArabic?: string) => {
    setReportRomanized(word || '');
    setReportCurrentOutput(currentArabic || '');
    setReportCorrectArabic('');
    setReportExplanation('');
    setReportSuccess(false);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportRomanized.trim() || !reportCorrectArabic.trim()) return;
    setIsReporting(true);
    try {
      await submitReport({
        romanized: reportRomanized.trim(),
        currentOutput: reportCurrentOutput.trim(),
        correctArabic: reportCorrectArabic.trim(),
        explanation: reportExplanation.trim()
      });
      setReportSuccess(true);
    } catch (err) {
      console.error('Failed to submit correction report', err);
    } finally {
      setIsReporting(false);
    }
  };

  // Calculate metrics
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Upper Header Block */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Lisan Converter</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Translate Romanized text to Arabic script effortlessly.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white dark:bg-slate-950 p-1 rounded-full border border-natural-border dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setLiveMode(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                liveMode
                  ? 'bg-natural-sage text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Live Mode
            </button>
            <button
              onClick={() => setLiveMode(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !liveMode
                  ? 'bg-natural-sage text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Manual
            </button>
          </div>
          {!liveMode && (
            <button
              onClick={() => handleConvert(input)}
              disabled={isConverting}
              className="flex items-center gap-2 px-5 py-2.5 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-full font-medium transition-all shadow-md shadow-natural-sage/20 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isConverting ? 'animate-spin' : ''}`} />
              Convert
            </button>
          )}
        </div>
      </header>

      {/* Large Input/Output Workspace Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[420px]">
        {/* Input Card */}
        <div className="flex flex-col bg-white dark:bg-slate-950 rounded-[32px] shadow-sm border border-natural-border/60 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-natural-border/40 dark:border-slate-800/60 flex justify-between items-center bg-[#FCFCFB] dark:bg-slate-900/40">
            <span className="text-xs font-bold uppercase tracking-widest text-natural-sage dark:text-indigo-400">Romanized Input</span>
            {input && (
              <button
                onClick={handleClear}
                className="text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Text
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-8 text-lg font-serif text-slate-700 dark:text-slate-200 bg-transparent resize-none focus:outline-none leading-relaxed min-h-[280px]"
            placeholder="Enter text (e.g. Khuda ni rehmat, moula, shukr...)"
          />
          <div className="p-5 flex gap-6 text-xs text-slate-400 dark:text-slate-500 border-t border-natural-border/30 dark:border-slate-800/40">
            <span>Words: <strong className="text-slate-600 dark:text-slate-300">{wordCount}</strong></span>
            <span>Characters: <strong className="text-slate-600 dark:text-slate-300">{charCount}</strong></span>
          </div>
        </div>

        {/* Output Card */}
        <div className="flex flex-col bg-natural-sage dark:bg-slate-950 rounded-[32px] shadow-lg overflow-hidden border border-natural-sage-dark dark:border-slate-800">
          <div className="p-5 border-b border-[#6A6A50] dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E2E2D6] dark:text-indigo-400">Arabic Script</span>
            {output && (
              <button
                onClick={handleCopy}
                className="px-4 py-1.5 bg-white/10 dark:bg-slate-800 text-white rounded-full text-xs font-medium hover:bg-white/20 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Output'}
              </button>
            )}
          </div>
          <div
            className="flex-1 p-8 text-3xl text-white font-serif leading-loose text-right"
            style={{ direction: 'rtl' }}
          >
            {output || <span className="text-white/40 text-lg font-sans">Arabic transliterated script will appear here...</span>}
          </div>
          {detectedUnknowns.length > 0 && (
            <div className="mx-5 mb-4 p-3.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl flex items-center gap-2.5 text-white animate-fade-in">
              <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />
              <p className="text-xs">
                {detectedUnknowns.length === 1 ? (
                  <span>Unknown word <strong>'{detectedUnknowns[0]}'</strong> has been submitted for review.</span>
                ) : (
                  <span><strong>{detectedUnknowns.length}</strong> unknown words were sent for review.</span>
                )}
              </p>
            </div>
          )}
          <div className="p-5 bg-natural-sage-dark dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-[#E2E2D6] dark:text-slate-400 font-medium">
                {liveMode ? 'Live mapping active' : 'Manual mode'} • Standard V4.2
              </span>
            </div>
            {isConverting && <span className="text-[10px] text-white/60 animate-pulse">Transliterating...</span>}
          </div>
        </div>
      </div>

      {/* Found an incorrect translation? Banner */}
      {output && (
        <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif">Found an incorrect translation?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Help improve LisanText. Submit a correction suggestion for our administrator review queue.</p>
            </div>
          </div>
          <button
            onClick={() => openReportDialog()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            Report / Suggest Correction
          </button>
        </div>
      )}

      {/* Detailed Confidence and Word Breakdown Analysis */}
      {wordDetails.length > 0 && (
        <section className="bg-white dark:bg-slate-950 p-6 rounded-[24px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-natural-border/30 dark:border-slate-800/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Transliteration Quality Report</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Word-by-word source and confidence mapping analysis.</p>
              </div>
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Confidence:</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-lg font-bold ${
                  averageConfidence >= 0.90 ? 'text-emerald-600 dark:text-emerald-400' :
                  averageConfidence >= 0.70 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500'
                }`}>
                  {Math.round(averageConfidence * 100)}%
                </span>
                <span className="text-xs text-slate-400">
                  ({averageConfidence >= 0.90 ? 'Excellent' : averageConfidence >= 0.70 ? 'Good' : 'Needs Verification'})
                </span>
              </div>
            </div>
          </div>

          {/* Word Analysis Chips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordDetails.map((detail, index) => {
              const methodColor = 
                detail.method === 'dictionary_direct' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300' :
                detail.method === 'dictionary_alternate' ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900 text-teal-800 dark:text-teal-300' :
                detail.method === 'context_rule' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-300' :
                'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/60 text-amber-800 dark:text-amber-300';

              const methodLabel =
                detail.method === 'dictionary_direct' ? 'Direct Dictionary' :
                detail.method === 'dictionary_alternate' ? 'Alternate Spelling' :
                detail.method === 'context_rule' ? 'Context Match' :
                'Phonetic Rules';

              return (
                <div 
                  key={index} 
                  className={`flex flex-col p-4 rounded-2xl border transition-all hover:shadow-sm ${methodColor}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold font-serif tracking-tight truncate max-w-[120px]" title={detail.original}>
                      {detail.original}
                    </span>
                    <span className="text-xl font-bold font-serif" style={{ direction: 'rtl' }}>
                      {detail.converted}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                    <span className="opacity-75">{methodLabel}</span>
                    <span>{Math.round(detail.confidence * 100)}% Match</span>
                  </div>

                  <p className="mt-1.5 text-xs opacity-80 leading-normal line-clamp-2">
                    {detail.explanation}
                  </p>

                  {(detail.meaning) && (
                    <div className="mt-2 pt-2 border-t border-current/10 text-xs flex flex-col gap-0.5 opacity-90">
                      <div>
                        <strong className="opacity-75">Meaning:</strong> {detail.meaning}
                      </div>
                      {detail.category && (
                        <div>
                          <strong className="opacity-75">Category:</strong> {detail.category}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex justify-end">
                    <button
                      onClick={() => openReportDialog(detail.original, detail.method === 'transliteration_rules' ? '' : detail.converted)}
                      className="text-[10px] font-bold uppercase tracking-wider opacity-75 hover:opacity-100 flex items-center gap-1 transition-all cursor-pointer bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1 rounded-lg"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Report Error
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom Conversion History Panel */}
      <section className="bg-white dark:bg-slate-950 p-6 rounded-[24px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5 border-b border-natural-border/30 dark:border-slate-800/40 pb-3">
          <Clock className="h-5 w-5 text-natural-sage" />
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Recent Conversions</h2>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-slate-400 py-3 text-center">Your recent translation history will be saved here.</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setInput(item.originalText);
                  setOutput(item.convertedText);
                }}
                className="flex justify-between items-center p-3.5 hover:bg-natural-bg/50 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-natural-border/30"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate font-serif">{item.originalText}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.wordCount} words
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-serif font-bold text-natural-sage dark:text-indigo-400" style={{ direction: 'rtl' }}>
                    {item.convertedText.length > 25 ? item.convertedText.substring(0, 25) + '...' : item.convertedText}
                  </span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 bg-natural-sage text-white px-2 py-0.5 rounded-full transition-opacity">
                    Load
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Suggest Correction Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-950 max-w-md w-full rounded-3xl border border-natural-border/60 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-natural-border/20 dark:border-slate-800/40 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Suggest Correction</h3>
                <p className="text-xs text-slate-500">Submit a translation correction for admin review.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">Correction Logged!</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thank you! Your translation suggestion has been saved in the Administrator Review queue.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportSuccess(false);
                  }}
                  className="mt-4 px-4 py-2 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Romanized Word</label>
                  <input
                    type="text"
                    required
                    value={reportRomanized}
                    onChange={(e) => setReportRomanized(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                    placeholder="e.g. moula"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Current Output</label>
                    <input
                      type="text"
                      value={reportCurrentOutput}
                      onChange={(e) => setReportCurrentOutput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                      placeholder="e.g. مواى"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Correct Arabic Script</label>
                    <input
                      type="text"
                      required
                      value={reportCorrectArabic}
                      onChange={(e) => setReportCorrectArabic(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-sm text-right font-serif focus:outline-none focus:border-natural-sage text-slate-800 dark:text-slate-100"
                      placeholder="e.g. مولى"
                      style={{ direction: 'rtl' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Optional Explanation</label>
                  <textarea
                    value={reportExplanation}
                    onChange={(e) => setReportExplanation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-natural-border dark:border-slate-800 bg-transparent text-xs resize-none focus:outline-none focus:border-natural-sage h-20 text-slate-800 dark:text-slate-100"
                    placeholder="Explain why this correction is correct..."
                  />
                </div>

                <div className="pt-2 border-t border-natural-border/20 dark:border-slate-800/40">
                  <button
                    type="submit"
                    disabled={isReporting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-natural-sage hover:bg-natural-sage-hover text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-md shadow-natural-sage/10"
                  >
                    {isReporting ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
