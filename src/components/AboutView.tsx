/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-gray-800 dark:text-gray-200">
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">About LisanText</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          LisanText is an advanced transliteration companion that converts Romanized Lisan ud-Dawat into its elegant and correct Arabic-script format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What is Lisan ud-Dawat?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Lisan ud-Dawat (لسان الدعوة) is the sacred language of the Dawoodi Bohra community. Combining elements of Classical Arabic, Persian, Urdu, and Gujarati, it is traditionally written in a distinctive cursively connected Arabic script.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">The Purpose of LisanText</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Many readers and writers today are familiar with typing Lisan ud-Dawat using English/Latin letter combinations (Romanization). LisanText bridges this gap, enabling instant, highly accurate conversions back to standard Arabic script through customizable phonetic mappings and smart dictionaries.
          </p>
        </div>
      </div>
    </div>
  );
}
