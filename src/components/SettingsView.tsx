/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, Globe, Shield, RefreshCw, User, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types.js';

export default function SettingsView() {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'u1',
    email: 'taikhumw52@gmail.com',
    role: 'admin'
  });

  const [liveModeByDefault, setLiveModeByDefault] = useState<boolean>(true);
  const [syllableSplits, setSyllableSplits] = useState<boolean>(true);
  const [dictionarySyncInterval, setDictionarySyncInterval] = useState<string>('every_hour');

  const handleSaveSettings = () => {
    alert('User preferences and system conversion config saved locally!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2 text-slate-800 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Configure default behaviors, view authorization role privileges, and inspect sync intervals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Quick Settings items list */}
        <div className="md:col-span-2 space-y-6">
          {/* General Applet Config Card */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-natural-border/30 dark:border-slate-800/40">
              <Globe className="h-5 w-5 text-natural-sage" />
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Transliteration Engine Configuration</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Auto-Transliterate (Live Mode)</p>
                  <p className="text-xs text-slate-500">Perform conversions automatically as you type</p>
                </div>
                <input
                  type="checkbox"
                  checked={liveModeByDefault}
                  onChange={(e) => setLiveModeByDefault(e.target.checked)}
                  className="w-5 h-5 accent-natural-sage rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Syllable Split Heuristics</p>
                  <p className="text-xs text-slate-500">Apply prefixes like "wa-" and "al-" before rules</p>
                </div>
                <input
                  type="checkbox"
                  checked={syllableSplits}
                  onChange={(e) => setSyllableSplits(e.target.checked)}
                  className="w-5 h-5 accent-natural-sage rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Phonetic Standard Update Sync</p>
                <p className="text-xs text-slate-500 mb-2">Interval rate for pulling newly approved words from the Cloud repository</p>
                <select
                  value={dictionarySyncInterval}
                  onChange={(e) => setDictionarySyncInterval(e.target.value)}
                  className="w-full max-w-xs px-3.5 py-2 bg-natural-bg/50 dark:bg-slate-900 border border-natural-border/40 dark:border-slate-800/60 rounded-xl text-xs focus:outline-none focus:border-natural-sage text-slate-700 dark:text-slate-300"
                >
                  <option value="every_hour">Synchronize hourly (Recommended)</option>
                  <option value="daily">Synchronize daily</option>
                  <option value="manually">Manual sync only</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-natural-border/30 dark:border-slate-800/40 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 bg-natural-sage hover:bg-natural-sage-hover text-white rounded-xl text-xs font-semibold shadow-md shadow-natural-sage/10 transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Right column: User Profile Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-natural-border/60 dark:border-slate-800/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-natural-border/30 dark:border-slate-800/40">
              <User className="h-5 w-5 text-natural-sage" />
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">User Profile</h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Login</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{profile.email}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Security Clearance</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="h-4.5 w-4.5 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {profile.role} Profile Mode
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
