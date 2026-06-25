/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { DictionaryWord, UnknownWord, ConversionHistoryItem, AnalyticsStats, CorrectionReport, DictionaryVersion } from './src/types.js';

// Load environment variables
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Initialize in-memory fallback databases for Phase 1-5 testing
let dictionaryDb: DictionaryWord[] = [
  {
    id: '1',
    romanized: 'Bismillah',
    arabic: 'بِسْمِ اللَّهِ',
    meaning: 'In the name of Allah',
    category: 'Common Phrase',
    frequency: 100,
    dateAdded: new Date().toISOString()
  },
  {
    id: '2',
    romanized: 'khuda',
    arabic: 'خدا',
    meaning: 'God / Lord',
    category: 'Nouns',
    frequency: 85,
    dateAdded: new Date().toISOString()
  },
  {
    id: '3',
    romanized: 'shukr',
    arabic: 'شكر',
    meaning: 'Thanks / Gratitude',
    category: 'Nouns',
    frequency: 70,
    dateAdded: new Date().toISOString()
  },
  {
    id: '4',
    romanized: 'moula',
    arabic: 'مولى',
    meaning: 'Master / Spiritual Leader',
    category: 'Nouns',
    frequency: 95,
    dateAdded: new Date().toISOString()
  },
  {
    id: '5',
    romanized: 'syedi',
    arabic: 'سيدي',
    meaning: 'My Noble Lord / Title of saintly respect',
    category: 'Nouns',
    frequency: 90,
    dateAdded: new Date().toISOString()
  },
  {
    id: '6',
    romanized: 'dai',
    arabic: 'داعي',
    meaning: 'Spiritual Summoner / Head of Dawat',
    category: 'Nouns',
    frequency: 88,
    dateAdded: new Date().toISOString()
  },
  {
    id: '7',
    romanized: 'sabaq',
    arabic: 'سبق',
    meaning: 'Spiritual/Religious Class or Lesson',
    category: 'Nouns',
    frequency: 80,
    dateAdded: new Date().toISOString()
  },
  {
    id: '8',
    romanized: 'misaq',
    arabic: 'ميثاق',
    meaning: 'Oath of Allegiance / Covenant',
    category: 'Common Phrase',
    frequency: 78,
    dateAdded: new Date().toISOString()
  },
  {
    id: '9',
    romanized: 'thali',
    arabic: 'تھالي',
    meaning: 'Large communal dining plate',
    category: 'Nouns',
    frequency: 75,
    dateAdded: new Date().toISOString()
  },
  {
    id: '10',
    romanized: 'wuzu',
    arabic: 'وضو',
    meaning: 'Ablution prior to prayers',
    category: 'Nouns',
    frequency: 82,
    dateAdded: new Date().toISOString()
  },
  {
    id: '11',
    romanized: 'namaaz',
    arabic: 'نماز',
    meaning: 'Daily prayers',
    category: 'Nouns',
    frequency: 91,
    dateAdded: new Date().toISOString()
  },
  {
    id: '12',
    romanized: 'mumin',
    arabic: 'مؤمن',
    meaning: 'Faithful Believer',
    category: 'Nouns',
    frequency: 94,
    dateAdded: new Date().toISOString()
  },
  {
    id: '13',
    romanized: 'mumineen',
    arabic: 'مؤمنين',
    meaning: 'The Faithful Believers (Plural)',
    category: 'Nouns',
    frequency: 96,
    dateAdded: new Date().toISOString()
  },
  {
    id: '14',
    romanized: 'dawat',
    arabic: 'دعوة',
    meaning: 'The Righteous Mission / Organization',
    category: 'Nouns',
    frequency: 89,
    dateAdded: new Date().toISOString()
  },
  {
    id: '15',
    romanized: 'rehmat',
    arabic: 'رحمة',
    meaning: 'Mercy of Allah',
    category: 'Nouns',
    frequency: 83,
    dateAdded: new Date().toISOString()
  },
  {
    id: '16',
    romanized: 'khidmat',
    arabic: 'خدمت',
    meaning: 'Selfless Service to Dawat/Moula',
    category: 'Nouns',
    frequency: 87,
    dateAdded: new Date().toISOString()
  }
];

let unknownWordsDb: UnknownWord[] = [];
let conversionHistoryDb: ConversionHistoryItem[] = [];

let correctionReportsDb: CorrectionReport[] = [
  {
    id: 'rep1',
    romanized: 'maula',
    currentOutput: 'ماولا',
    correctArabic: 'مولى',
    explanation: 'Common alternate spelling that should standardize to the soft ya alif-maqsurah.',
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'rep2',
    romanized: 'namaz',
    currentOutput: 'نماز',
    correctArabic: 'نماز',
    explanation: 'Reported as a correct spelling check, already verified.',
    status: 'approved',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

let dictionaryVersionsDb: DictionaryVersion[] = [
  {
    id: 'ver1',
    wordId: '4',
    romanized: 'moula',
    previousArabic: 'مواى',
    newArabic: 'مولى',
    previousMeaning: 'Master / Spiritual Leader',
    newMeaning: 'Master / Spiritual Leader',
    changedBy: 'Admin (taikhumw52@gmail.com)',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    changeType: 'update'
  }
];

// Seed sample analytics data
let analyticsStats: AnalyticsStats = {
  totalConversionsCount: 4,
  dictionarySize: 16,
  unknownWordsCount: 0,
  dailyConversions: [
    { date: new Date().toISOString().split('T')[0], count: 4 }
  ],
  mostSearchedWords: [
    { word: 'bismillah', count: 12 },
    { word: 'moula', count: 8 }
  ],
  userCorrections: []
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // Middleware to check if the active user is an admin
  const checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const role = req.headers['x-user-role'];
    if (role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access Denied: Administrator role required.' });
    }
  };

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
  });

  // Dictionary Endpoints
  app.get('/api/dictionary', (req, res) => {
    const { search, category, sortBy, order } = req.query;
    let results = [...dictionaryDb];

    if (search) {
      const searchStr = (search as string).toLowerCase();
      results = results.filter(
        w =>
          w.romanized.toLowerCase().includes(searchStr) ||
          w.arabic.includes(searchStr) ||
          w.meaning.toLowerCase().includes(searchStr)
      );
    }

    if (category) {
      results = results.filter(w => w.category === category);
    }

    if (sortBy) {
      const field = sortBy as keyof DictionaryWord;
      const isAsc = order === 'asc';
      results.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return isAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    res.json(results);
  });

  app.post('/api/dictionary', checkAdmin, (req, res) => {
    const { romanized, arabic, meaning, category } = req.body;
    if (!romanized || !arabic) {
      return res.status(400).json({ error: 'Romanized word and Arabic script are required.' });
    }

    const newWord: DictionaryWord = {
      id: Math.random().toString(36).substr(2, 9),
      romanized,
      arabic,
      meaning: meaning || '',
      category: category || 'Uncategorized',
      frequency: 0,
      dateAdded: new Date().toISOString()
    };

    dictionaryDb.push(newWord);
    analyticsStats.dictionarySize = dictionaryDb.length;

    // Log Version History
    const newVersion: DictionaryVersion = {
      id: Math.random().toString(36).substr(2, 9),
      wordId: newWord.id,
      romanized: newWord.romanized,
      previousArabic: '',
      newArabic: newWord.arabic,
      previousMeaning: '',
      newMeaning: newWord.meaning,
      changedBy: 'Admin (taikhumw52@gmail.com)',
      timestamp: new Date().toISOString(),
      changeType: 'create'
    };
    dictionaryVersionsDb.unshift(newVersion);

    res.status(201).json(newWord);
  });

  app.put('/api/dictionary/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { romanized, arabic, meaning, category } = req.body;
    const index = dictionaryDb.findIndex(w => w.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Word not found' });
    }

    const original = { ...dictionaryDb[index] };

    dictionaryDb[index] = {
      ...dictionaryDb[index],
      romanized: romanized ?? dictionaryDb[index].romanized,
      arabic: arabic ?? dictionaryDb[index].arabic,
      meaning: meaning ?? dictionaryDb[index].meaning,
      category: category ?? dictionaryDb[index].category
    };

    // Log Version History
    const newVersion: DictionaryVersion = {
      id: Math.random().toString(36).substr(2, 9),
      wordId: id,
      romanized: dictionaryDb[index].romanized,
      previousArabic: original.arabic,
      newArabic: dictionaryDb[index].arabic,
      previousMeaning: original.meaning,
      newMeaning: dictionaryDb[index].meaning,
      changedBy: 'Admin (taikhumw52@gmail.com)',
      timestamp: new Date().toISOString(),
      changeType: 'update'
    };
    dictionaryVersionsDb.unshift(newVersion);

    res.json(dictionaryDb[index]);
  });

  app.delete('/api/dictionary/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const original = dictionaryDb.find(w => w.id === id);

    if (!original) {
      return res.status(404).json({ error: 'Word not found' });
    }

    dictionaryDb = dictionaryDb.filter(w => w.id !== id);
    analyticsStats.dictionarySize = dictionaryDb.length;

    // Log Version History
    const newVersion: DictionaryVersion = {
      id: Math.random().toString(36).substr(2, 9),
      wordId: id,
      romanized: original.romanized,
      previousArabic: original.arabic,
      newArabic: '',
      previousMeaning: original.meaning,
      newMeaning: '',
      changedBy: 'Admin (taikhumw52@gmail.com)',
      timestamp: new Date().toISOString(),
      changeType: 'delete'
    };
    dictionaryVersionsDb.unshift(newVersion);

    res.json({ success: true });
  });

  // Unknown Words Endpoints
  app.get('/api/unknown-words', checkAdmin, (req, res) => {
    res.json(unknownWordsDb);
  });

  app.post('/api/unknown-words', (req, res) => {
    const { word, originalSentence, suggestedTransliteration } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const existingIndex = unknownWordsDb.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    if (existingIndex !== -1) {
      unknownWordsDb[existingIndex].requestsCount += 1;
      return res.json(unknownWordsDb[existingIndex]);
    }

    const newUnknown: UnknownWord = {
      id: Math.random().toString(36).substr(2, 9),
      word,
      originalSentence: originalSentence || '',
      suggestedTransliteration: suggestedTransliteration || '',
      requestsCount: 1,
      status: 'pending',
      dateLogged: new Date().toISOString()
    };

    unknownWordsDb.push(newUnknown);
    analyticsStats.unknownWordsCount = unknownWordsDb.filter(w => w.status === 'pending').length;
    res.status(201).json(newUnknown);
  });

  app.put('/api/unknown-words/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { status, suggestedTransliteration } = req.body;
    const index = unknownWordsDb.findIndex(w => w.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Record not found' });
    }

    if (status) unknownWordsDb[index].status = status;
    if (suggestedTransliteration !== undefined) {
      unknownWordsDb[index].suggestedTransliteration = suggestedTransliteration;
    }

    analyticsStats.unknownWordsCount = unknownWordsDb.filter(w => w.status === 'pending').length;
    res.json(unknownWordsDb[index]);
  });

  // Analytics Endpoints
  app.get('/api/analytics', checkAdmin, (req, res) => {
    res.json(analyticsStats);
  });

  // History Endpoints
  app.get('/api/history', (req, res) => {
    res.json(conversionHistoryDb);
  });

  app.post('/api/history', (req, res) => {
    const { originalText, convertedText, wordCount, charCount } = req.body;
    const newItem: ConversionHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      originalText,
      convertedText,
      wordCount: wordCount || 0,
      charCount: charCount || 0,
      timestamp: new Date().toISOString()
    };
    conversionHistoryDb.unshift(newItem);
    analyticsStats.totalConversionsCount += 1;

    // Update today's conversion stats
    const todayStr = new Date().toISOString().split('T')[0];
    const statIndex = analyticsStats.dailyConversions.findIndex(c => c.date === todayStr);
    if (statIndex !== -1) {
      analyticsStats.dailyConversions[statIndex].count += 1;
    } else {
      analyticsStats.dailyConversions.push({ date: todayStr, count: 1 });
    }

    res.status(201).json(newItem);
  });

  // Correction Reports Endpoints
  app.get('/api/reports', checkAdmin, (req, res) => {
    res.json(correctionReportsDb);
  });

  app.post('/api/reports', (req, res) => {
    const { romanized, currentOutput, correctArabic, explanation } = req.body;
    if (!romanized || !correctArabic) {
      return res.status(400).json({ error: 'Romanized word and correct Arabic script are required.' });
    }

    const newReport: CorrectionReport = {
      id: Math.random().toString(36).substr(2, 9),
      romanized,
      currentOutput: currentOutput || '',
      correctArabic,
      explanation: explanation || '',
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    correctionReportsDb.unshift(newReport);
    res.status(201).json(newReport);
  });

  app.put('/api/reports/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const reportIndex = correctionReportsDb.findIndex(r => r.id === id);

    if (reportIndex === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = correctionReportsDb[reportIndex];
    report.status = status;

    if (status === 'approved') {
      // Find the word in dictionary
      const dictIndex = dictionaryDb.findIndex(
        w => w.romanized.toLowerCase() === report.romanized.toLowerCase()
      );

      if (dictIndex !== -1) {
        // Update existing word
        const original = { ...dictionaryDb[dictIndex] };
        dictionaryDb[dictIndex].arabic = report.correctArabic;

        const newVersion: DictionaryVersion = {
          id: Math.random().toString(36).substr(2, 9),
          wordId: original.id,
          romanized: original.romanized,
          previousArabic: original.arabic,
          newArabic: report.correctArabic,
          previousMeaning: original.meaning,
          newMeaning: original.meaning,
          changedBy: 'Admin (taikhumw52@gmail.com) via Feedback Approval',
          timestamp: new Date().toISOString(),
          changeType: 'update'
        };
        dictionaryVersionsDb.unshift(newVersion);
      } else {
        // Create new word
        const newWord: DictionaryWord = {
          id: Math.random().toString(36).substr(2, 9),
          romanized: report.romanized,
          arabic: report.correctArabic,
          meaning: report.explanation || 'Added via feedback approval',
          category: 'Uncategorized',
          frequency: 0,
          dateAdded: new Date().toISOString()
        };
        dictionaryDb.push(newWord);
        analyticsStats.dictionarySize = dictionaryDb.length;

        const newVersion: DictionaryVersion = {
          id: Math.random().toString(36).substr(2, 9),
          wordId: newWord.id,
          romanized: newWord.romanized,
          previousArabic: '',
          newArabic: report.correctArabic,
          previousMeaning: '',
          newMeaning: newWord.meaning,
          changedBy: 'Admin (taikhumw52@gmail.com) via Feedback Approval',
          timestamp: new Date().toISOString(),
          changeType: 'create'
        };
        dictionaryVersionsDb.unshift(newVersion);
      }
    }

    res.json(report);
  });

  // Version History Endpoints
  app.get('/api/versions', checkAdmin, (req, res) => {
    res.json(dictionaryVersionsDb);
  });

  // --- Serve Client App ---

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LisanText] Server running in ${isProd ? 'production' : 'development'} mode on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[LisanText] Failed to start server:', err);
});
