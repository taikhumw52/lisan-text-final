/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  RefreshCw,
  BookOpen,
  FileQuestion,
  LayoutDashboard,
  Settings,
  Info,
  Sun,
  Moon,
  Menu,
  X,
  Globe
} from 'lucide-react';

import HomeView from './components/HomeView.js';
import ConverterView from './components/ConverterView.js';
import DictionaryView from './components/DictionaryView.js';
import UnknownWordsView from './components/UnknownWordsView.js';
import AdminDashboardView from './components/AdminDashboardView.js';
import SettingsView from './components/SettingsView.js';
import AboutView from './components/AboutView.js';

type Page = 'home' | 'converter' | 'dictionary' | 'unknown' | 'admin' | 'settings' | 'about';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [dictionarySize, setDictionarySize] = useState<number>(4); // Fallback seed size for Phase 1

  // Synchronize Dark Mode Class with standard HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch real-time dictionary size from analytical endpoints
  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data && typeof data.dictionarySize === 'number') {
          setDictionarySize(data.dictionarySize);
        }
      })
      .catch(() => {
        // Fallback or ignore in case server is reloading
      });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setMobileMenuOpen(false);
  };

  // Nav Item layout configuration
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'converter', label: 'Converter', icon: RefreshCw },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'unknown', label: 'Unknown Words', icon: FileQuestion },
    { id: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  // Render the currently selected page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'converter':
        return <ConverterView />;
      case 'dictionary':
        return <DictionaryView />;
      case 'unknown':
        return <UnknownWordsView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-natural-bg dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-950 border-r border-natural-border dark:border-slate-800 p-6 fixed h-full z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-natural-sage rounded-xl flex items-center justify-center text-white font-serif text-xl shadow-md">
            L
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">LisanText</span>
            <div className="text-[10px] text-natural-sage dark:text-indigo-400 font-bold uppercase tracking-wider">Transliteration</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-natural-bg dark:bg-slate-900 text-natural-sage dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-natural-sage dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Dictionary Stats Card */}
        <div className="mb-6 bg-natural-bg dark:bg-slate-900/60 p-5 rounded-3xl border border-natural-border/40 dark:border-slate-800">
          <p className="text-[10px] text-natural-sage dark:text-indigo-400 uppercase tracking-widest font-bold mb-1">Dictionary Size</p>
          <p className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{dictionarySize.toLocaleString()}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Words verified</p>
        </div>

        {/* Theme Toggle in Footer */}
        <div className="pt-4 border-t border-natural-border dark:border-slate-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
          >
            <div className="flex items-center gap-3.5">
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-natural-sage" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className="w-8 h-4 bg-slate-200 dark:bg-slate-800 rounded-full relative flex items-center p-0.5">
              <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-150 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Mobile Header / Navigation */}
        <header className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-950 border-b border-natural-border dark:border-slate-800 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-natural-sage rounded-lg flex items-center justify-center text-white font-serif text-lg">
              L
            </div>
            <span className="text-lg font-serif font-bold text-slate-800 dark:text-white tracking-tight">LisanText</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-[#F5F5F0] dark:hover:bg-slate-900 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-natural-sage" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-[#F5F5F0] dark:hover:bg-slate-900 transition-all"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Body */}
            <nav className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white dark:bg-slate-950 p-6 shadow-2xl animate-slide-in">
              <div className="flex items-center gap-3 px-2 mb-8 justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-natural-sage rounded-lg flex items-center justify-center text-white font-serif text-lg">
                    L
                  </div>
                  <span className="text-lg font-serif font-bold text-slate-800 dark:text-white tracking-tight">LisanText</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-natural-bg dark:bg-slate-900 text-natural-sage dark:text-indigo-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Stats Card */}
              <div className="mt-auto bg-natural-bg dark:bg-slate-900/60 p-4 rounded-2xl border border-natural-border/40 dark:border-slate-800">
                <p className="text-[10px] text-natural-sage dark:text-indigo-400 uppercase tracking-widest font-bold mb-0.5">Dictionary Size</p>
                <p className="text-xl font-serif font-bold text-slate-900 dark:text-white">{dictionarySize.toLocaleString()}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Words verified</p>
              </div>
            </nav>
          </div>
        )}

        {/* Main Workspace Frame */}
        <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
