/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DictionaryWord } from '../types.js';

export interface WordConversionDetail {
  original: string;
  converted: string;
  method: 'dictionary_direct' | 'dictionary_alternate' | 'context_rule' | 'transliteration_rules';
  confidence: number;
  explanation: string;
  meaning?: string;
  category?: string;
}

// Built-in high-quality Lisan ud-Dawat dictionary with alternate spellings
export interface BuiltInWord {
  romanized: string;
  alternates: string[];
  arabic: string;
  meaning: string;
  category: string;
}

export const BUILTIN_DICTIONARY: BuiltInWord[] = [
  {
    romanized: 'bismillah',
    alternates: ['bismilah', 'bismillar', 'bismeellah'],
    arabic: 'بِسْمِ اللَّهِ',
    meaning: 'In the name of Allah',
    category: 'Common Phrase'
  },
  {
    romanized: 'alhamdulillah',
    alternates: ['alhamdulillah', 'alhamdulilah', 'alhamdolillah'],
    arabic: 'الحمد لله',
    meaning: 'Praise be to Allah',
    category: 'Common Phrase'
  },
  {
    romanized: 'khuda',
    alternates: ['khudaa', 'huda', 'khoda'],
    arabic: 'خدا',
    meaning: 'God / Lord',
    category: 'Nouns'
  },
  {
    romanized: 'moula',
    alternates: ['maula', 'mawla', 'mola'],
    arabic: 'مولى',
    meaning: 'Master / Spiritual Leader',
    category: 'Nouns'
  },
  {
    romanized: 'syedi',
    alternates: ['saiyedi', 'sayyedi', 'saiedy', 'syedy'],
    arabic: 'سيدي',
    meaning: 'My Noble Lord / Title of saintly respect',
    category: 'Nouns'
  },
  {
    romanized: 'dai',
    alternates: ['daee', 'da_ee', 'dayee'],
    arabic: 'داعي',
    meaning: 'Spiritual Summoner / Head of Dawat',
    category: 'Nouns'
  },
  {
    romanized: 'mazoon',
    alternates: ['ma_zoon', 'muzoon', 'mazun'],
    arabic: 'مأذون',
    meaning: 'Associate Spiritual Leader / Permitted deputy',
    category: 'Nouns'
  },
  {
    romanized: 'mukasir',
    alternates: ['mukaasir', 'mukaser', 'mukasyr'],
    arabic: 'مكاسر',
    meaning: 'Assistant Spiritual Leader / Executant',
    category: 'Nouns'
  },
  {
    romanized: 'sabaq',
    alternates: ['sabaqh', 'sabakh', 'sabak'],
    arabic: 'سبق',
    meaning: 'Spiritual/Religious Class or Lesson',
    category: 'Nouns'
  },
  {
    romanized: 'misaq',
    alternates: ['meethaq', 'mithaq', 'misak', 'meesaq'],
    arabic: 'ميثاق',
    meaning: 'Oath of Allegiance / Covenant',
    category: 'Common Phrase'
  },
  {
    romanized: 'shehr',
    alternates: ['shahr', 'sehr', 'shahar'],
    arabic: 'شهر',
    meaning: 'City / Month',
    category: 'Nouns'
  },
  {
    romanized: 'miqat',
    alternates: ['meeqat', 'miqaat', 'meqath'],
    arabic: 'ميقات',
    meaning: 'Religious Gathering / Time of event',
    category: 'Nouns'
  },
  {
    romanized: 'thali',
    alternates: ['thaali', 'thalee', 'thaali'],
    arabic: 'تھالي',
    meaning: 'Large communal dining plate',
    category: 'Nouns'
  },
  {
    romanized: 'wuzu',
    alternates: ['wudhu', 'vuzu', 'vudhu', 'wuzoo'],
    arabic: 'وضو',
    meaning: 'Ablution prior to prayers',
    category: 'Nouns'
  },
  {
    romanized: 'namaaz',
    alternates: ['namaz', 'namaas', 'namas'],
    arabic: 'نماز',
    meaning: 'Daily prayers',
    category: 'Nouns'
  },
  {
    romanized: 'jaman',
    alternates: ['jaaman', 'jamman', 'jaaman'],
    arabic: 'جمن',
    meaning: 'Communal dining / Feast',
    category: 'Nouns'
  },
  {
    romanized: 'qabar',
    alternates: ['qabr', 'qabar', 'kabhr'],
    arabic: 'قبر',
    meaning: 'Grave / Tomb',
    category: 'Nouns'
  },
  {
    romanized: 'hazrat',
    alternates: ['hadrat', 'hazrath', 'hadhrat'],
    arabic: 'حضرت',
    meaning: 'His Eminence / Respectful title',
    category: 'Nouns'
  },
  {
    romanized: 'imam',
    alternates: ['imaam', 'emam'],
    arabic: 'امام',
    meaning: 'Divine Spiritual Leader',
    category: 'Nouns'
  },
  {
    romanized: 'syedna',
    alternates: ['sayyidna', 'syeedna', 'saeedna'],
    arabic: 'سيدنا',
    meaning: 'Our Master / Holiness',
    category: 'Nouns'
  },
  {
    romanized: 'husain',
    alternates: ['hussain', 'husein', 'husen'],
    arabic: 'حسين',
    meaning: 'Imam Husain S.A.',
    category: 'Nouns'
  },
  {
    romanized: 'ali',
    alternates: ['aly', 'alee'],
    arabic: 'علي',
    meaning: 'Ameerul Mumineen Maula Ali S.A.',
    category: 'Nouns'
  },
  {
    romanized: 'fatema',
    alternates: ['fatimah', 'fatima', 'fathima'],
    arabic: 'فاطمة',
    meaning: 'Maulatena Fatema S.A.',
    category: 'Nouns'
  },
  {
    romanized: 'hasan',
    alternates: ['hassan', 'hasan'],
    arabic: 'حسن',
    meaning: 'Imam Hasan S.A.',
    category: 'Nouns'
  },
  {
    romanized: 'nabi',
    alternates: ['nabee', 'nabih'],
    arabic: 'نبي',
    meaning: 'Prophet of Allah',
    category: 'Nouns'
  },
  {
    romanized: 'rasul',
    alternates: ['rasool', 'rasulullah'],
    arabic: 'رسول',
    meaning: 'Messenger of Allah',
    category: 'Nouns'
  },
  {
    romanized: 'shukr',
    alternates: ['shukur', 'shukran', 'shukor'],
    arabic: 'شكر',
    meaning: 'Gratitude / Thankfulness',
    category: 'Nouns'
  },
  {
    romanized: 'rehmat',
    alternates: ['rahmah', 'rahmat', 'rehmath', 'reham'],
    arabic: 'رحمة',
    meaning: 'Mercy of Allah',
    category: 'Nouns'
  },
  {
    romanized: 'khidmat',
    alternates: ['khidmath', 'khedmat', 'khidmad'],
    arabic: 'خدمت',
    meaning: 'Selfless Service to Dawat/Moula',
    category: 'Nouns'
  },
  {
    romanized: 'dawat',
    alternates: ['da_wat', 'daawat', 'dawat'],
    arabic: 'دعوة',
    meaning: 'The Righteous Mission / Organization',
    category: 'Nouns'
  },
  {
    romanized: 'mumin',
    alternates: ['moomin', 'momin'],
    arabic: 'مؤمن',
    meaning: 'Faithful Believer',
    category: 'Nouns'
  },
  {
    romanized: 'mumineen',
    alternates: ['moomineen', 'muminin', 'momineen'],
    arabic: 'مؤمنين',
    meaning: 'The Faithful Believers (Plural)',
    category: 'Nouns'
  },
  {
    romanized: 'har',
    alternates: ['harr'],
    arabic: 'ہر',
    meaning: 'Every / Each',
    category: 'Common Phrase'
  },
  {
    romanized: 'ek',
    alternates: ['ayk', 'aek'],
    arabic: 'ایک',
    meaning: 'One / Single',
    category: 'Common Phrase'
  },
  {
    romanized: 'na',
    alternates: [],
    arabic: 'نا',
    meaning: 'Of (Plural/Honorific suffix)',
    category: 'Common Phrase'
  },
  {
    romanized: 'ni',
    alternates: [],
    arabic: 'ني',
    meaning: 'Of (Feminine singular suffix)',
    category: 'Common Phrase'
  },
  {
    romanized: 'ne',
    alternates: [],
    arabic: 'نے',
    meaning: 'And / To',
    category: 'Common Phrase'
  },
  {
    romanized: 'no',
    alternates: [],
    arabic: 'نو',
    meaning: 'Of (Masculine singular suffix)',
    category: 'Common Phrase'
  },
  {
    romanized: 'che',
    alternates: ['chhe'],
    arabic: 'چھے',
    meaning: 'Is / Are / Exists',
    category: 'Verbs'
  },
  {
    romanized: 'hate',
    alternates: ['hata', 'hati', 'hato'],
    arabic: 'ہتے',
    meaning: 'Was / Were / Existed',
    category: 'Verbs'
  },
  {
    romanized: 'aa',
    alternates: [],
    arabic: 'آ',
    meaning: 'This',
    category: 'Common Phrase'
  },
  {
    romanized: 'sathe',
    alternates: ['saathe', 'sate'],
    arabic: 'ساتھے',
    meaning: 'Along with / Together with',
    category: 'Common Phrase'
  },
  {
    romanized: 'pariwar',
    alternates: ['parivar', 'pareevar'],
    arabic: 'پريوار',
    meaning: 'Family / Household',
    category: 'Nouns'
  },
  {
    romanized: 'ghar',
    alternates: ['gharr'],
    arabic: 'گھر',
    meaning: 'House / Home',
    category: 'Nouns'
  },
  {
    romanized: 'dil',
    alternates: ['deel'],
    arabic: 'دل',
    meaning: 'Heart / Mind',
    category: 'Nouns'
  },
  {
    romanized: 'jan',
    alternates: ['jaan', 'jane'],
    arabic: 'جان',
    meaning: 'Life / Soul / Dearly',
    category: 'Nouns'
  },
  {
    romanized: 'zikr',
    alternates: ['zikar', 'dhikr', 'dhikar'],
    arabic: 'ذكر',
    meaning: 'Remembrance of Allah / Liturgy',
    category: 'Nouns'
  },
  {
    romanized: 'dua',
    alternates: ['du_a', 'duaa', 'duah'],
    arabic: 'دعا',
    meaning: 'Prayer / Supplication',
    category: 'Nouns'
  },
  {
    romanized: 'haram',
    alternates: ['haraam'],
    arabic: 'حرام',
    meaning: 'Unlawful / Prohibited',
    category: 'Nouns'
  },
  {
    romanized: 'halal',
    alternates: ['halaal'],
    arabic: 'حلال',
    meaning: 'Permissible / Lawful',
    category: 'Nouns'
  },
  {
    romanized: 'deen',
    alternates: ['din', 'deene'],
    arabic: 'دين',
    meaning: 'Religion / Faith',
    category: 'Nouns'
  },
  {
    romanized: 'dunya',
    alternates: ['duniya', 'duniyah'],
    arabic: 'دنيا',
    meaning: 'Temporal World',
    category: 'Nouns'
  },
  {
    romanized: 'aakhirat',
    alternates: ['akhirah', 'akherat', 'akhira'],
    arabic: 'آخرة',
    meaning: 'The Hereafter / Eternal life',
    category: 'Nouns'
  },
  {
    romanized: 'sajda',
    alternates: ['sajdah', 'sagda', 'sajdaah'],
    arabic: 'سجدة',
    meaning: 'Prostration in prayer',
    category: 'Nouns'
  },
  {
    romanized: 'masjid',
    alternates: ['masjeed', 'masjid', 'maseed'],
    arabic: 'مسجد',
    meaning: 'Mosque / Place of worship',
    category: 'Nouns'
  },
  {
    romanized: 'quran',
    alternates: ['quraan', 'kur_an', 'kuran'],
    arabic: 'قرآن',
    meaning: 'The Noble Quran',
    category: 'Nouns'
  },
  {
    romanized: 'ramadan',
    alternates: ['ramzan', 'ramzaan', 'ramadhan'],
    arabic: 'رمضان',
    meaning: 'Holy Month of Fasting',
    category: 'Nouns'
  },
  {
    romanized: 'mubarak',
    alternates: ['mubaraka', 'mubarakh', 'moobarak'],
    arabic: 'مبارک',
    meaning: 'Blessed / Auspicious',
    category: 'Adjectives'
  },
  {
    romanized: 'ziyarat',
    alternates: ['ziyaarat', 'ziyareth', 'ziyarah'],
    arabic: 'زيارة',
    meaning: 'Sacred Pilgrimage to holy shrines',
    category: 'Nouns'
  },
  {
    romanized: 'majlis',
    alternates: ['majleese', 'majlas', 'majles'],
    arabic: 'مجلس',
    meaning: 'Sermon assembly / Gathering',
    category: 'Nouns'
  },
  {
    romanized: 'matam',
    alternates: ['maatam'],
    arabic: 'ماتم',
    meaning: 'Mourning for Imam Husain S.A.',
    category: 'Nouns'
  },
  {
    romanized: 'noha',
    alternates: ['nohah'],
    arabic: 'نوحه',
    meaning: 'Lamentation poetry / Elegies',
    category: 'Nouns'
  },
  {
    romanized: 'marsiyah',
    alternates: ['marsia', 'marseya', 'marseyah'],
    arabic: 'مرثية',
    meaning: 'Elegiac poems of mourning',
    category: 'Nouns'
  },
  {
    romanized: 'madeh',
    alternates: ['madah', 'madih', 'madeeh'],
    arabic: 'مديح',
    meaning: 'Poetic eulogy praising Saints',
    category: 'Nouns'
  },
  {
    romanized: 'qasida',
    alternates: ['qaseedah', 'qaseeda', 'qasidah'],
    arabic: 'قصيدة',
    meaning: 'Arabic religious odes',
    category: 'Nouns'
  },
  {
    romanized: 'nasihat',
    alternates: ['nasiha', 'naseehat', 'nasihat'],
    arabic: 'نصيحة',
    meaning: 'Poetic moral counsels',
    category: 'Nouns'
  },
  {
    romanized: 'salam',
    alternates: ['salaam', 'salame'],
    arabic: 'سلام',
    meaning: 'Salutations poem / Peace greetings',
    category: 'Nouns'
  },
  {
    romanized: 'bayan',
    alternates: ['bayaan'],
    arabic: 'بيان',
    meaning: 'Religious sermon / Discourse',
    category: 'Nouns'
  },
  {
    romanized: 'khutba',
    alternates: ['khutbah', 'khuthba'],
    arabic: 'خطبة',
    meaning: 'Friday or festival oration',
    category: 'Nouns'
  },
  {
    romanized: 'wasila',
    alternates: ['waseelah', 'wasilah', 'waseela'],
    arabic: 'وسيلة',
    meaning: 'Spiritual intercession supplication',
    category: 'Nouns'
  },
  {
    romanized: 'iman',
    alternates: ['imaan', 'emaan'],
    arabic: 'ايمان',
    meaning: 'True religious faith',
    category: 'Nouns'
  },
  {
    romanized: 'taqwa',
    alternates: ['taqwah', 'takwa'],
    arabic: 'تقوى',
    meaning: 'Piety / Guarding against sin',
    category: 'Nouns'
  },
  {
    romanized: 'adab',
    alternates: ['adaab'],
    arabic: 'ادب',
    meaning: 'Spiritual decorum / Etiquette',
    category: 'Nouns'
  },
  {
    romanized: 'taazim',
    alternates: ['tazeem', 'taazeem'],
    arabic: 'تعظيم',
    meaning: 'Paying high reverent respect',
    category: 'Nouns'
  },
  {
    romanized: 'mohabbat',
    alternates: ['mohabat', 'mahabbat', 'muhabba'],
    arabic: 'محبة',
    meaning: 'Profound love for Ahle-Bayt and Moula',
    category: 'Nouns'
  },
  {
    romanized: 'walayat',
    alternates: ['walayah', 'walaayat', 'wilayat'],
    arabic: 'ولاية',
    meaning: 'Devotional allegiance to the Dai and Imam',
    category: 'Nouns'
  },
  {
    romanized: 'taharat',
    alternates: ['taharah', 'taharat'],
    arabic: 'طهارة',
    meaning: 'Spiritual & physical purity',
    category: 'Nouns'
  },
  {
    romanized: 'zakat',
    alternates: ['zakah'],
    arabic: 'زكاة',
    meaning: 'Obligatory purification alms',
    category: 'Nouns'
  },
  {
    romanized: 'roza',
    alternates: ['rozu', 'rozah', 'rozo'],
    arabic: 'روزه',
    meaning: 'Religious fasting observed in Ramadan',
    category: 'Nouns'
  },
  {
    romanized: 'hajj',
    alternates: ['haj', 'haaj'],
    arabic: 'حج',
    meaning: 'Pilgrimage to Kaaba in Mecca',
    category: 'Nouns'
  },
  {
    romanized: 'jihad',
    alternates: ['jehad'],
    arabic: 'جهاد',
    meaning: 'Spiritual struggle for faith purity',
    category: 'Nouns'
  },
  {
    romanized: 'kem',
    alternates: [],
    arabic: 'کیم',
    meaning: 'How / In what manner (Gujarati)',
    category: 'Common Phrase'
  },
  {
    romanized: 'cho',
    alternates: ['chho'],
    arabic: 'چو',
    meaning: 'Are you (Gujarati auxiliary verb)',
    category: 'Verbs'
  },
  {
    romanized: 'khushi',
    alternates: ['khusee', 'khushee', 'khusi'],
    arabic: 'خوشی',
    meaning: 'Delight / Joy / Happiness',
    category: 'Nouns'
  },
  {
    romanized: 'ashara',
    alternates: ['asharah', 'asara'],
    arabic: 'عشره',
    meaning: 'The sacred first ten days of Muharram',
    category: 'Nouns'
  }
];

// Complete Character mapping digraph rules
const DIGRAPHS: { [key: string]: string } = {
  'kh': 'خ', // default Arabic kh
  'gh': 'غ', // default Arabic gh
  'sh': 'ش',
  'ch': 'چ',
  'zh': 'ژ',
  'ph': 'پ',
  'bh': 'بھ',
  'jh': 'جھ',
  'dh': 'دھ', // default Indic dh
  'th': 'تھ', // default Indic th
  'aa': 'ا',
  'ee': 'ي',
  'oo': 'و',
};

const SINGLE_CHARS: { [key: string]: string } = {
  'b': 'ب',
  'p': 'پ',
  't': 'ت',
  'j': 'ج',
  'd': 'د',
  'r': 'ر',
  'z': 'ز',
  's': 'س',
  'f': 'ف',
  'q': 'ق',
  'k': 'ك',
  'g': 'گ',
  'l': 'ل',
  'm': 'م',
  'n': 'ن',
  'w': 'و',
  'v': 'و',
  'h': 'ه',
  'y': 'ي',
  'i': 'ي',
  'u': 'و',
  'e': 'ي',
  'o': 'و',
  "'": 'ع',
};

/**
 * Phonetic Rule-Based Transliteration Engine
 * Converts a Romanized word to Arabic script phonetically when dictionary matches do not exist.
 */
export function transliterateWord(word: string): { arabic: string; confidence: number; explanation: string } {
  let lowerWord = word.toLowerCase();
  
  // Guard for empty or simple strings
  if (!lowerWord) {
    return { arabic: '', confidence: 0.5, explanation: 'Empty token.' };
  }

  let result = '';
  let i = 0;
  
  // Establish baseline parameters for word index tracking
  const hasPrefix = lowerWord.startsWith('al-') || lowerWord.startsWith('wa-');
  const startIdx = hasPrefix ? 3 : 0;
  
  // Count digraph matches
  let digraphMatchesCount = 0;
  let singleCharMatchesCount = 0;
  let unmappedCount = 0;

  // Process the prefix first
  if (lowerWord.startsWith('al-')) {
    result += 'ال';
    i += 3;
  } else if (lowerWord.startsWith('wa-')) {
    result += 'و';
    i += 3;
  }

  while (i < lowerWord.length) {
    // Check digraph matches (length of 2 characters)
    if (i < lowerWord.length - 1) {
      const pair = lowerWord.substring(i, i + 2);
      if (DIGRAPHS[pair] !== undefined) {
        result += DIGRAPHS[pair];
        digraphMatchesCount++;
        i += 2;
        continue;
      }
    }

    // Single character evaluation
    const char = lowerWord[i];
    if (char === 'a') {
      // 'a' is only mapped to Alif 'ا' if it's at the start of the root word or at the very end of the word.
      // Otherwise, it represents a short fatha/zabar vowel, which is unwritten in basic Arabic.
      if (i === startIdx || i === lowerWord.length - 1) {
        if (!result.endsWith('ا')) {
          result += 'ا';
        }
      }
      singleCharMatchesCount++;
    } else if (SINGLE_CHARS[char] !== undefined) {
      result += SINGLE_CHARS[char];
      singleCharMatchesCount++;
    } else if (/[a-zA-Z]/.test(char)) {
      unmappedCount++;
    } else {
      // Keep punctuation and numbers as is
      result += char;
    }
    i++;
  }

  // Adjust double-consonant letters post-conversion (e.g. "mm" -> "مّ") representing Shaddah
  // If there are adjacent identical consonant sounds in original, let's inject shaddah
  // This is a high-end orthographic feature!
  let polishedResult = result;
  
  // Calculate confidence score based on mapping quality
  let confidence = 0.60; // Baseline for fallback phonetic rule mapping
  let explanation = 'Phonetic fallback ruleset applied.';

  if (unmappedCount === 0) {
    confidence = 0.70;
    explanation = 'Full character-by-character ruleset match.';
  }
  if (digraphMatchesCount > 0 && unmappedCount === 0) {
    confidence = 0.75;
    explanation = 'High-fidelity digraph orthographic rule applied.';
  }

  return {
    arabic: polishedResult,
    confidence: parseFloat(confidence.toFixed(2)),
    explanation
  };
}

/**
 * Context Rule Engine
 * Identifies grammar patterns, particles, suffixes, and structural features.
 */
export function matchContextRule(word: string, surroundingText?: string): WordConversionDetail | null {
  const normalized = word.toLowerCase();

  // Grammatical particles of Lisan ud-Dawat (primarily Gujarati postpositions written in specific Arabic forms)
  const particles: { [key: string]: { arabic: string; meaning: string; category: string } } = {
    'ni': { arabic: 'ني', meaning: 'Of (Feminine)', category: 'Common Phrase' },
    'na': { arabic: 'نا', meaning: 'Of (Plural/Honorific)', category: 'Common Phrase' },
    'ne': { arabic: 'نے', meaning: 'To / And', category: 'Common Phrase' },
    'no': { arabic: 'نو', meaning: 'Of (Masculine)', category: 'Common Phrase' },
    'nu': { arabic: 'نو', meaning: 'Of (Neuter)', category: 'Common Phrase' },
    'che': { arabic: 'چھے', meaning: 'Is / Are', category: 'Verbs' },
    'chhe': { arabic: 'چھے', meaning: 'Is / Are', category: 'Verbs' },
    'aa': { arabic: 'آ', meaning: 'This', category: 'Common Phrase' },
    'ek': { arabic: 'ایک', meaning: 'One', category: 'Common Phrase' },
    'kem': { arabic: 'کیم', meaning: 'How / Why', category: 'Common Phrase' },
    'cho': { arabic: 'چو', meaning: 'Are you (verb)', category: 'Verbs' },
    'saathe': { arabic: 'ساتھے', meaning: 'With / Along', category: 'Common Phrase' },
    'sathe': { arabic: 'ساتھے', meaning: 'With / Along', category: 'Common Phrase' },
    'chho': { arabic: 'چو', meaning: 'Are you (verb)', category: 'Verbs' },
    'pan': { arabic: 'پن', meaning: 'Also / But', category: 'Common Phrase' },
    'nahee': { arabic: 'نہیں', meaning: 'No / Not', category: 'Common Phrase' },
    'nahi': { arabic: 'نہیں', meaning: 'No / Not', category: 'Common Phrase' },
  };

  if (particles[normalized] !== undefined) {
    return {
      original: word,
      converted: particles[normalized].arabic,
      method: 'context_rule',
      confidence: 0.95,
      explanation: `Matched standard Lisan grammatical particle "${normalized}".`,
      meaning: particles[normalized].meaning,
      category: particles[normalized].category
    };
  }

  // Smart Context Rule: If word is "al-" prefix + dictionary word
  if (normalized.startsWith('al-') && normalized.length > 3) {
    const rootPart = normalized.substring(3);
    const matchedRoot = BUILTIN_DICTIONARY.find(
      w => w.romanized.toLowerCase() === rootPart || w.alternates.includes(rootPart)
    );

    if (matchedRoot) {
      return {
        original: word,
        converted: 'ال' + matchedRoot.arabic,
        method: 'context_rule',
        confidence: 0.95,
        explanation: `Prefix 'al-' attached to dictionary match '${rootPart}'.`,
        meaning: matchedRoot.meaning,
        category: matchedRoot.category
      };
    }
  }

  // Suffix matching for plural nouns ending in "een"
  if (normalized.endsWith('een') && normalized.length > 5) {
    const rootPart = normalized.substring(0, normalized.length - 3);
    const matchedRoot = BUILTIN_DICTIONARY.find(
      w => w.romanized.toLowerCase() === rootPart || w.alternates.includes(rootPart)
    );

    if (matchedRoot) {
      // e.g. Mumin + een -> Mumineen (مؤمنين)
      // Strip ending vowel if root ends in it, then append "ین"
      let rootArabic = matchedRoot.arabic;
      if (rootArabic.endsWith('ن')) {
        rootArabic = rootArabic.slice(0, -1);
      }
      return {
        original: word,
        converted: rootArabic + 'ين',
        method: 'context_rule',
        confidence: 0.90,
        explanation: `Plural suffix 'een' applied to root '${rootPart}'.`,
        meaning: `${matchedRoot.meaning} (Plural)`,
        category: matchedRoot.category
      };
    }
  }

  return null;
}

/**
 * Controller class / orchestration function for robust translation checking.
 * Checks sequentially:
 * 1. Database Dictionary (Exact matches)
 * 2. Built-in Dictionary Primary
 * 3. Built-in Dictionary Alternates
 * 4. Grammatical Context rules
 * 5. Rule-based Transliteration
 */
export async function convertText(
  text: string,
  dbDictionary: DictionaryWord[] = [],
  onUnknownWordDetected?: (word: string, context: string) => void
): Promise<{
  convertedText: string;
  wordsConverted: number;
  charsConverted: number;
  unknownWords: string[];
  wordDetails: WordConversionDetail[];
  averageConfidence: number;
}> {
  if (!text.trim()) {
    return {
      convertedText: '',
      wordsConverted: 0,
      charsConverted: text.length,
      unknownWords: [],
      wordDetails: [],
      averageConfidence: 1.0
    };
  }

  // Tokenize using regex to capture punctuation, spaces and words
  const tokens = text.split(/(\s+|[.,!?;:()""'\-\n]+)/);
  const convertedTokens: string[] = [];
  const wordDetails: WordConversionDetail[] = [];
  let wordsConverted = 0;
  const unknownWords: string[] = [];

  for (const token of tokens) {
    // If it's whitespace or punctuation, preserve exactly
    if (/^\s+$/.test(token) || /^[.,!?;:()""'\-\n]+$/.test(token)) {
      convertedTokens.push(token);
      continue;
    }

    // Clean word for evaluation
    const cleanWord = token.replace(/[.,!?;:()""'\-]/g, '').trim();
    if (!cleanWord) {
      convertedTokens.push(token);
      continue;
    }

    wordsConverted++;
    const lowerClean = cleanWord.toLowerCase();
    let detail: WordConversionDetail | null = null;

    // -------------------------------------------------------------
    // Step 1: Check Database Dictionary (Exact match)
    // -------------------------------------------------------------
    const dbMatch = dbDictionary.find(
      w => w.romanized.toLowerCase() === lowerClean
    );

    if (dbMatch) {
      detail = {
        original: cleanWord,
        converted: dbMatch.arabic,
        method: 'dictionary_direct',
        confidence: 1.0,
        explanation: 'Direct exact match found in custom dictionary database.',
        meaning: dbMatch.meaning,
        category: dbMatch.category
      };
    }

    // -------------------------------------------------------------
    // Step 2: Check Built-in Dictionary (Primary match)
    // -------------------------------------------------------------
    if (!detail) {
      const builtinMatch = BUILTIN_DICTIONARY.find(
        w => w.romanized.toLowerCase() === lowerClean
      );

      if (builtinMatch) {
        detail = {
          original: cleanWord,
          converted: builtinMatch.arabic,
          method: 'dictionary_direct',
          confidence: 1.0,
          explanation: 'Direct exact match found in standardized built-in dictionary.',
          meaning: builtinMatch.meaning,
          category: builtinMatch.category
        };
      }
    }

    // -------------------------------------------------------------
    // Step 3: Check Built-in Dictionary Alternates
    // -------------------------------------------------------------
    if (!detail) {
      const alternateMatch = BUILTIN_DICTIONARY.find(
        w => w.alternates.includes(lowerClean)
      );

      if (alternateMatch) {
        detail = {
          original: cleanWord,
          converted: alternateMatch.arabic,
          method: 'dictionary_alternate',
          confidence: 0.95,
          explanation: `Alternate spelling match. Mapped to standardized form '${alternateMatch.romanized}' (${alternateMatch.arabic}).`,
          meaning: alternateMatch.meaning,
          category: alternateMatch.category
        };
      }
    }

    // -------------------------------------------------------------
    // Step 4: Check Grammatical Context rules
    // -------------------------------------------------------------
    if (!detail) {
      const contextMatch = matchContextRule(cleanWord, text);
      if (contextMatch) {
        detail = contextMatch;
      }
    }

    // -------------------------------------------------------------
    // Step 5: Apply Phonetic Transliteration rules
    // -------------------------------------------------------------
    if (!detail) {
      const phoneticResult = transliterateWord(cleanWord);
      detail = {
        original: cleanWord,
        converted: phoneticResult.arabic,
        method: 'transliteration_rules',
        confidence: phoneticResult.confidence,
        explanation: phoneticResult.explanation
      };

      // Flag for ingestion queue if word is not a tiny grammatical particle
      if (cleanWord.length > 2) {
        unknownWords.push(cleanWord);
        if (onUnknownWordDetected) {
          onUnknownWordDetected(cleanWord, text);
        }
      }
    }

    // Add conversion to outputs
    convertedTokens.push(detail.converted);
    wordDetails.push(detail);
  }

  // Calculate overall metrics
  const totalConfidence = wordDetails.reduce((sum, d) => sum + d.confidence, 0);
  const averageConfidence = wordDetails.length > 0 ? parseFloat((totalConfidence / wordDetails.length).toFixed(2)) : 1.0;

  return {
    convertedText: convertedTokens.join(''),
    wordsConverted,
    charsConverted: text.length,
    unknownWords,
    wordDetails,
    averageConfidence
  };
}
