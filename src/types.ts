/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DictionaryWord {
  id: string;
  romanized: string;
  arabic: string;
  meaning: string;
  category: string;
  frequency: number;
  dateAdded: string;
  alternates?: string[];
}

export type UnknownWordStatus = 'pending' | 'approved' | 'rejected';

export interface CorrectionReport {
  id: string;
  romanized: string;
  currentOutput: string;
  correctArabic: string;
  explanation: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface DictionaryVersion {
  id: string;
  wordId: string;
  romanized: string;
  previousArabic: string;
  newArabic: string;
  previousMeaning: string;
  newMeaning: string;
  changedBy: string;
  timestamp: string;
  changeType: 'create' | 'update' | 'delete';
}


export interface UnknownWord {
  id: string;
  word: string;
  originalSentence: string;
  suggestedTransliteration: string;
  requestsCount: number;
  status: UnknownWordStatus;
  dateLogged: string;
}

export interface ConversionHistoryItem {
  id: string;
  originalText: string;
  convertedText: string;
  wordCount: number;
  charCount: number;
  timestamp: string;
}

export interface DailyConversionStats {
  date: string;
  count: number;
}

export interface WordFrequencyStats {
  word: string;
  count: number;
}

export interface UserCorrectionStats {
  id: string;
  word: string;
  originalArabic: string;
  correctedArabic: string;
  timestamp: string;
}

export interface AnalyticsStats {
  totalConversionsCount: number;
  dictionarySize: number;
  unknownWordsCount: number;
  dailyConversions: DailyConversionStats[];
  mostSearchedWords: WordFrequencyStats[];
  userCorrections: UserCorrectionStats[];
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
}
