import React, { useState, useEffect } from 'react';
import { Shield, Home as HomeIcon, MessageSquare, AlertTriangle, BookOpen, HelpCircle, History as HistoryIcon, Info, Sun, Moon, Award, QrCode, Menu as MenuIcon } from 'lucide-react';
import translations from './translations';
import Home from './components/Home';
import MessageChecker from './components/MessageChecker';
import UpiChecker from './components/UpiChecker';
import EducationLibrary from './components/EducationLibrary';
import Helpline from './components/Helpline';
import History from './components/History';
import About from './components/About';
import ScamQuiz from './components/ScamQuiz';
import QrScanner from './components/QrScanner';
import NotificationBell from './components/NotificationBell';
import DisclaimerModal from './components/DisclaimerModal';
import Menu from './components/Menu';
import { auth, getUserSafetyScore, updateUserSafetyScore } from './firebase';

function App() {
  const [tab, setTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  
  // Safety score state
  const [score, setScore] = useState(0);

  // Sync Dark Mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Register push Alert Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);

  // Auth anonymous sign-in & score loading
  useEffect(() => {
    async function initAuthAndScore() {
      try {
        if (auth && auth.signInAnonymously) {
          const credentials = await auth.signInAnonymously();
          const uid = credentials.user?.uid || 'local_demo_user';
          const safetyScore = await getUserSafetyScore(uid);
          setScore(safetyScore);
        }
      } catch (error) {
        console.error("Firebase auth/score load error:", error);
      }
    }
    initAuthAndScore();
  }, []);

  // Callback to increase safety score
  const handleActivityPerformed = async (points) => {
    try {
      const uid = auth?.currentUser?.uid || 'local_demo_user';
      const nextScore = await updateUserSafetyScore(uid, points);
      setScore(nextScore);
    } catch (e) {
      console.error("Failed to update safety score:", e);
    }
  };

  // Callback to reset safety score to zero
  const handleResetXp = async () => {
    try {
      const uid = auth?.currentUser?.uid || 'local_demo_user';
      localStorage.setItem(`suraksha_score_${uid}`, '0');
      setScore(0);
    } catch (e) {
      console.error("Failed to reset safety score:", e);
    }
  };

  // Fetch history on load
  const fetchHistory = async () => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const response = await fetch(`${baseUrl}/api/history`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    const confirmMsg = language === 'hi' 
      ? 'क्या आप अपना स्थानीय डेमो इतिहास मिटाना चाहते हैं?' 
      : language === 'gu' 
      ? 'શું તમે તમારો સ્થાનિક તપાસ ઇતિહાસ સાફ કરવા માંગો છો?' 
      : 'Are you sure you want to clear your local demo history?';

    if (!window.confirm(confirmMsg)) {
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/history`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      fetchHistory();
    } catch (error) {
      console.error("Error clearing history:", error);
      setHistory([]); // clear local state on failure
    }
  };

  // Get current active translation dictionary
  const t = translations[language] || translations['en'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Global Hackathon Disclaimer Modal */}
      <DisclaimerModal language={language} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-blue-900 text-white shadow-md border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <button 
            onClick={() => setTab('home')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="Go to Home"
          >
            <div className="p-1.5 bg-blue-700/60 rounded-xl border border-blue-500/30">
              <Shield className="w-6 h-6 text-green-400 fill-green-400/20" />
            </div>
            <div className="text-left">
              <span className="text-xl font-black tracking-tight block">{t.brandName}</span>
              <span className="text-[10px] text-blue-200/90 font-medium -mt-1 block max-sm:hidden">{t.tagline}</span>
            </div>
          </button>

          {/* Controls: Notification Bell + Dark Mode + i18n */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Notification Bell alert toggle */}
            <NotificationBell language={language} t={t} />

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 sm:p-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white transition-colors cursor-pointer border border-blue-750"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="flex bg-blue-950 p-0.5 sm:p-1 rounded-xl border border-blue-800">
              <button
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                aria-pressed={language === 'hi'}
                className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('gu')}
                aria-pressed={language === 'gu'}
                className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'gu' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-300 hover:text-white'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation Subbar (Desktop Only) */}
      <nav className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 overflow-x-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2 min-w-max">
          <button
            onClick={() => setTab('home')}
            aria-current={tab === 'home' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'home' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            {t.navHome}
          </button>
          <button
            onClick={() => setTab('message')}
            aria-current={tab === 'message' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'message' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {t.navMessage}
          </button>
          <button
            onClick={() => setTab('upi')}
            aria-current={tab === 'upi' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'upi' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {t.navUpi}
          </button>

          <button
            onClick={() => setTab('library')}
            aria-current={tab === 'library' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'library' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.navLibrary}
          </button>
          <button
            onClick={() => setTab('quiz')}
            aria-current={tab === 'quiz' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'quiz' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            {t.navQuiz}
          </button>
          <button
            onClick={() => setTab('helpline')}
            aria-current={tab === 'helpline' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'helpline' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {t.navHelpline}
          </button>
          <button
            onClick={() => setTab('history')}
            aria-current={tab === 'history' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'history' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            {t.navHistory}
          </button>
          <button
            onClick={() => setTab('about')}
            aria-current={tab === 'about' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              tab === 'about' 
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            {t.navAbout}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pb-8">
        {tab === 'home' && (
          <Home 
            setTab={setTab} 
            t={t} 
            historyCount={history.length} 
            language={language}
            score={score}
            onResetXp={handleResetXp}
          />
        )}
        {tab === 'message' && (
          <MessageChecker 
            t={t} 
            language={language} 
            onScanComplete={fetchHistory} 
            onActivityPerformed={handleActivityPerformed}
          />
        )}
        {tab === 'upi' && (
          <UpiChecker 
            t={t} 
            language={language} 
            onScanComplete={fetchHistory} 
            onActivityPerformed={handleActivityPerformed}
          />
        )}
        {tab === 'qr' && (
          <QrScanner 
            t={t} 
            language={language} 
            onActivityPerformed={handleActivityPerformed}
          />
        )}
        {tab === 'library' && <EducationLibrary t={t} language={language} />}
        {tab === 'quiz' && (
          <ScamQuiz 
            t={t} 
            language={language} 
            onActivityPerformed={handleActivityPerformed}
          />
        )}
        {tab === 'helpline' && <Helpline t={t} language={language} onScanComplete={fetchHistory} />}
        {tab === 'history' && <History t={t} history={history} onClear={handleClearHistory} setTab={setTab} language={language} />}
        {tab === 'about' && <About t={t} language={language} />}
        {tab === 'menu' && <Menu setTab={setTab} t={t} />}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-lg z-50 transition-colors duration-300">
        <div className="flex justify-around items-center h-16 px-2">
          <button
            onClick={() => setTab('home')}
            aria-current={tab === 'home' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-[22%] h-12 rounded-2xl transition-all ${
              tab === 'home' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <HomeIcon className={`w-5 h-5 mb-0.5 ${tab === 'home' ? 'fill-blue-100 dark:fill-blue-900/50' : ''}`} />
            <span className="text-[10px] font-medium leading-tight">{t.navHome}</span>
          </button>
          
          <button
            onClick={() => setTab('message')}
            aria-current={tab === 'message' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-[22%] h-12 rounded-2xl transition-all ${
              tab === 'message' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className={`w-5 h-5 mb-0.5 ${tab === 'message' ? 'fill-blue-100 dark:fill-blue-900/50' : ''}`} />
            <span className="text-[10px] font-medium leading-tight">{t.btnCheckSMS}</span>
          </button>
          
          <button
            onClick={() => setTab('upi')}
            aria-current={tab === 'upi' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-[22%] h-12 rounded-2xl transition-all ${
              tab === 'upi' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className={`w-5 h-5 mb-0.5 ${tab === 'upi' ? 'fill-blue-100 dark:fill-blue-900/50' : ''}`} />
            <span className="text-[10px] font-medium leading-tight">{t.btnCheckUPI}</span>
          </button>

          <button
            onClick={() => setTab('menu')}
            aria-current={tab === 'menu' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center w-[22%] h-12 rounded-2xl transition-all ${
              tab === 'menu' || ['library', 'quiz', 'helpline', 'history', 'about'].includes(tab) ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <MenuIcon className={`w-5 h-5 mb-0.5 ${tab === 'menu' || ['library', 'quiz', 'helpline', 'history', 'about'].includes(tab) ? 'fill-blue-100 dark:fill-blue-900/50' : ''}`} />
            <span className="text-[10px] font-medium leading-tight">Menu</span>
          </button>
        </div>
      </nav>



      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-center py-6 pb-28 md:pb-6 border-t border-slate-800 dark:border-slate-900 text-xs mt-12 transition-colors duration-300 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300 dark:text-slate-400">
            {t.footerText}
          </p>
          <p>© {new Date().getFullYear()} SuRakshaPay. All Rights Reserved. Hackathon MVP.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
