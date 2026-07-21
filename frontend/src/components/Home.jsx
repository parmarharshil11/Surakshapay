import React from 'react';
import { MessageSquareWarning, ShieldAlert, BookOpen, PhoneCall, History, Award, QrCode } from 'lucide-react';
import TrendingTicker from './TrendingTicker';
import SafetyScore from './SafetyScore';
import CommunityMap from './CommunityMap';

export default function Home({ setTab, t, historyCount, language, score, onResetXp }) {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 md:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            {t.homeVerifiedBadge || "Verified Safe Engine Active"}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {t.welcomeTitle}
          </h1>
          <p className="text-blue-200/90 text-sm md:text-base max-w-xl leading-relaxed">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Right decoration banner */}
        <div className="md:col-span-5 relative flex justify-center max-md:hidden select-none">
          <div className="w-64 h-64 bg-blue-800/40 rounded-full flex items-center justify-center border border-blue-500/20 animate-pulse-ring">
            <Award className="w-28 h-28 text-white opacity-85 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Trending Scams Scrolling Ticker Banner */}
      <TrendingTicker language={language} t={t} />

      {/* Feature Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SMS Checker Card */}
        <button
          onClick={() => setTab('message')}
          className="group flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
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
          className="group flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
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
          className="group flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
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
          className="group flex flex-col text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
        >
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

      {/* Gamification Dashboard widgets side-by-side rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safety Score levels progression widget */}
        <SafetyScore score={score} language={language} t={t} onResetXp={onResetXp} />

        {/* Community Scam Threat Bar Chart */}
        <CommunityMap language={language} t={t} />
      </div>

      {/* Emergency Call-Out & History Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency helpline card (Removed infinite bounce on PhoneCall icon) */}
        <div className="flex items-center gap-5 bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 rounded-2xl p-6 transition-colors duration-300">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              {t.helplineTitle}
            </h4>
            <p className="text-slate-700 dark:text-slate-200 font-bold text-lg md:text-xl">
              {t.homeHelplineLabel || "National Cyber Helpline: 1930"}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              {t.helplineCardDesc}
            </p>
          </div>
        </div>

        {/* History card summary */}
        <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-300">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.navHistory}
            </h4>
            <p className="text-slate-700 dark:text-slate-200 font-bold text-lg">
              {t.recentCheckStatus.replace('{count}', historyCount)}
            </p>
            <button
              onClick={() => setTab('history')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-750 underline font-medium cursor-pointer"
            >
              {t.homeViewHistory || "View verification log"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
