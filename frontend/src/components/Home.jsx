import React from 'react';
import { MessageSquareWarning, ShieldAlert, BookOpen, PhoneCall, History, Award, QrCode, Sparkles, ArrowRight, ShieldCheck, Zap, Lock, Camera } from 'lucide-react';
import TrendingTicker from './TrendingTicker';
import SafetyScore from './SafetyScore';
import CommunityMap from './CommunityMap';

export default function Home({ setTab, t, historyCount, language, score, onResetXp }) {
  const getLocalizedText = (en, hi, gu) => {
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Decorative ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 md:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            {t.homeVerifiedBadge || "Verified Safe Engine Active"}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {t.welcomeTitle}
          </h1>

          <p className="text-blue-200/90 text-sm md:text-base max-w-xl leading-relaxed">
            {t.welcomeSubtitle}
          </p>

          {/* Quick CTA Buttons inside Hero */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setTab('message')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
            >
              <MessageSquareWarning className="w-4 h-4" />
              <span>{getLocalizedText("Check Message / Screenshot", "संदेश / स्क्रीनशॉट जांचें", "મેસેજ / સ્ક્રીનશોટ ચકાસો")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setTab('upi')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{getLocalizedText("Verify UPI ID", "यूपीआई आईडी सत्यापित करें", "UPI ID ચકાસો")}</span>
            </button>
          </div>
        </div>

        {/* Right decoration badge banner */}
        <div className="md:col-span-5 relative flex justify-center max-md:hidden select-none">
          <div className="w-64 h-64 bg-blue-800/20 rounded-full flex items-center justify-center border border-blue-400/20 shadow-2xl relative">
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-25"></div>
            <ShieldCheck className="w-28 h-28 text-blue-400 opacity-90" />
          </div>
        </div>
      </div>

      {/* Quick Feature Highlights Pill Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center gap-2.5 shadow-sm transition-colors duration-300">
          <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
            {getLocalizedText("< 2s Instant AI Response", "< 2s त्वरित AI परिणाम", "< 2s તાત્કાલિક AI પરિણામ")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center gap-2.5 shadow-sm transition-colors duration-300">
          <Lock className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
            {getLocalizedText("100% Private & Secure", "100% निजी और सुरक्षित", "100% ખાનગી અને સુરક્ષિત")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center gap-2.5 shadow-sm transition-colors duration-300">
          <Camera className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
            {getLocalizedText("OCR Screenshot Reader", "ओसीआर स्क्रीनशॉट रीडर", "OCR સ્ક્રીનશોટ રીડર")}
          </p>
        </div>
      </div>

      {/* Trending Scams Scrolling Ticker Banner */}
      <TrendingTicker language={language} t={t} />

      {/* Feature Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* SMS & Screenshot Checker Card */}
        <button
          onClick={() => setTab('message')}
          className="group relative flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            {getLocalizedText("AI Scanner", "AI स्कैनर", "AI સ્કેનર")}
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 mb-5 self-start">
            <MessageSquareWarning className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {t.btnCheckSMS}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
            {t.btnCheckSMSDesc}
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
            {t.homeCardSmsAction || "Start Scanner →"}
          </div>
        </button>

        {/* UPI Checker Card */}
        <button
          onClick={() => setTab('upi')}
          className="group relative flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            {getLocalizedText("Fraud Check", "फ्रॉड जांच", "ફ્રોડ ચકાસણી")}
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 mb-5 self-start">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {t.btnCheckUPI}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
            {t.btnCheckUPIDesc}
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
            {t.homeCardUpiAction || "Check Payment ID →"}
          </div>
        </button>

        {/* Learn Scams Card */}
        <button
          onClick={() => setTab('library')}
          className="group relative flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
            {getLocalizedText("8 Modules", "8 मॉड्यूल", "8 મોડ્યુલ્સ")}
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 mb-5 self-start">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {t.btnLearnScams}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
            {t.btnLearnScamsDesc}
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
            {t.homeCardLearnAction || "Open Library →"}
          </div>
        </button>

        {/* Scam Quiz Card */}
        <button
          onClick={() => setTab('quiz')}
          className="group relative flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            {getLocalizedText("+50 XP", "+50 एक्सपी", "+50 XP")}
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 mb-5 self-start">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {t.btnPlayQuiz}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
            {t.btnPlayQuizDesc}
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
            {t.homeCardQuizAction || "Play Game →"}
          </div>
        </button>
      </div>

      {/* Gamification Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SafetyScore score={score} language={language} t={t} onResetXp={onResetXp} />
        <CommunityMap language={language} t={t} />
      </div>

      {/* Emergency Call-Out & History Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency helpline card */}
        <a
          href="tel:1930"
          className="flex items-center gap-4 bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 hover:border-red-400 rounded-3xl p-6 transition-all duration-300 group cursor-pointer shadow-sm"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">{t.helplineTitle}</span>
              <span className="text-[10px] bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">24/7</span>
            </div>
            <p className="text-slate-800 dark:text-slate-100 font-black text-lg group-hover:text-red-600 transition-colors truncate">
              {t.homeHelplineLabel || "National Cyber Helpline: 1930"}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
              {t.helplineCardDesc}
            </p>
          </div>
        </a>

        {/* History & Activity Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.navHistory || "History & Activity"}
                </span>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                  {historyCount} {historyCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base leading-snug">
                {t.recentCheckStatus.replace('{count}', historyCount)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setTab('history')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-blue-500/25 transition-all cursor-pointer flex-shrink-0 self-start sm:self-center flex items-center gap-1"
          >
            <span>{getLocalizedText("View Logs", "लॉग देखें", "લોગ જુઓ")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}

