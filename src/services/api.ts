/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DictionaryWord, UnknownWord, ConversionHistoryItem, AnalyticsStats } from '../types.js';

const API_BASE = '/api';

export async function fetchDictionary(params?: {
  search?: string;
  category?: string;
  sortBy?: keyof DictionaryWord;
  order?: 'asc' | 'desc';
}): Promise<DictionaryWord[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.sortBy) query.append('sortBy', params.sortBy);
  if (params?.order) query.append('order', params.order);

  const res = await fetch(`${API_BASE}/dictionary?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch dictionary');
  return res.json();
}

export async function addDictionaryWord(word: Partial<DictionaryWord>): Promise<DictionaryWord> {
  const res = await fetch(`${API_BASE}/dictionary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to add dictionary word');
  }
  return res.json();
}

export async function updateDictionaryWord(id: string, word: Partial<DictionaryWord>): Promise<DictionaryWord> {
  const res = await fetch(`${API_BASE}/dictionary/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update dictionary word');
  }
  return res.json();
}

export async function deleteDictionaryWord(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/dictionary/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete dictionary word');
  return res.json();
}

export async function fetchUnknownWords(): Promise<UnknownWord[]> {
  const res = await fetch(`${API_BASE}/unknown-words`);
  if (!res.ok) throw new Error('Failed to fetch unknown words');
  return res.json();
}

export async function logUnknownWord(word: {
  word: string;
  originalSentence?: string;
  suggestedTransliteration?: string;
}): Promise<UnknownWord> {
  const res = await fetch(`${API_BASE}/unknown-words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word),
  });
  if (!res.ok) throw new Error('Failed to log unknown word');
  return res.json();
}

export async function updateUnknownWord(id: string, update: {
  status?: 'pending' | 'approved' | 'rejected';
  suggestedTransliteration?: string;
}): Promise<UnknownWord> {
  const res = await fetch(`${API_BASE}/unknown-words/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error('Failed to update unknown word');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsStats> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchHistory(): Promise<ConversionHistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch conversion history');
  return res.json();
}

export async function logHistory(item: {
  originalText: string;
  convertedText: string;
  wordCount: number;
  charCount: number;
}): Promise<ConversionHistoryItem> {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to log history');
  return res.json();
}
