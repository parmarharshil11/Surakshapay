import React from 'react';
import { ShieldCheck, ShieldAlert, Award, Zap, Star, Hexagon, Crown, RotateCcw } from 'lucide-react';

export default function SafetyScore({ score, language, t, onResetXp }) {
  // Infinite Leveling Math
  const XP_PER_LEVEL = 100;
  const levelNum = Math.floor(score / XP_PER_LEVEL) + 1;
  const currentLevelXp = score % XP_PER_LEVEL;
  const maxPoints = XP_PER_LEVEL;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXp / XP_PER_LEVEL) * 100));

  // Determine localized Level Name
  const levelName = language === 'hi' ? `स्तर ${levelNum}` 
                  : language === 'gu' ? `સ્તર ${levelNum}` 
                  : `Level ${levelNum}`;

  // Badges cycle through icons and colors based on level
  const getBadge = (lvl) => {
    if (lvl === 1) return { icon: <ShieldAlert className="w-8 h-8 text-amber-500 fill-amber-500/10 animate-pulse" />, title: { en: 'Beginner', hi: 'शुरुआती', gu: 'શિખાઉ' }};
    if (lvl === 2) return { icon: <ShieldCheck className="w-8 h-8 text-blue-500 fill-blue-500/15" />, title: { en: 'Aware Citizen', hi: 'जागरूक नागरिक', gu: 'જાગૃત નાગરિક' }};
    if (lvl === 3) return { icon: <Award className="w-8 h-8 text-green-500 fill-green-500/20" />, title: { en: 'Safety Expert', hi: 'सुरक्षा विशेषज्ञ', gu: 'સુરક્ષા નિષ્ણાત' }};
    if (lvl === 4) return { icon: <Star className="w-8 h-8 text-purple-500 fill-purple-500/20 animate-bounce" />, title: { en: 'Cyber Ninja', hi: 'साइबर निंजा', gu: 'સાયબર નિન્જા' }};
    if (lvl === 5) return { icon: <Hexagon className="w-8 h-8 text-rose-500 fill-rose-500/20" />, title: { en: 'Fraud Buster', hi: 'धोखाधड़ी निवारक', gu: 'છેતરપિંડી નિવારક' }};
    // Level 6+ gets the crown
    return { icon: <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500/30 animate-pulse" />, title: { en: 'Digital Guardian', hi: 'डिजिटल रक्षक', gu: 'ડિજિટલ રક્ષક' }};
  };

  const badgeInfo = getBadge(levelNum);
  const badgeTitle = badgeInfo.title[language] || badgeInfo.title['en'];
  const fullLevelName = `${levelName}: ${badgeTitle}`;

  // Reset XP handler
  const handleReset = () => {
    const confirmMsg = language === 'hi'
      ? 'क्या आप अपना सारा XP रीसेट करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।'
      : language === 'gu'
      ? 'શું તમે તમારો બધો XP રીસેટ કરવા માંગો છો? આ ક્રિયા પૂર્વવત થઈ શકશે નહીં.'
      : 'Are you sure you want to reset all your XP? This cannot be undone.';
    if (window.confirm(confirmMsg) && onResetXp) {
      onResetXp();
    }
  };

  // Encouraging Text
  const getEncouragement = () => {
    if (levelNum === 1) return language === 'hi' ? `अगले स्तर के लिए ${XP_PER_LEVEL - currentLevelXp} अंक और चाहिए!` : language === 'gu' ? `આગલા સ્તર માટે ${XP_PER_LEVEL - currentLevelXp} પોઇન્ટ વધુ જોઈએ!` : `Need ${XP_PER_LEVEL - currentLevelXp} more XP to reach Level ${levelNum + 1}!`;
    return language === 'hi' ? `शानदार! अगले स्तर के लिए ${XP_PER_LEVEL - currentLevelXp} अंक प्राप्त करें।` : language === 'gu' ? `સરસ! આગલા સ્તર માટે ${XP_PER_LEVEL - currentLevelXp} પોઇન્ટ મેળવો.` : `Great job! Earn ${XP_PER_LEVEL - currentLevelXp} more XP for Level ${levelNum + 1}.`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm transition-colors duration-300 space-y-4">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-500 rounded-xl">
          <Zap className="w-5 h-5 fill-amber-400 text-amber-500" />
        </div>
        <div className="text-left flex-grow">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {language === 'hi' ? 'आपका सुरक्षा स्कोर' : language === 'gu' ? 'તમારો સુરક્ષા સ્કોર' : 'YOUR SAFETY SCORE'}
          </h4>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{score}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {t.xpPointsLabel || "XP Points"}
            </span>
          </div>
        </div>
        {/* Reset XP Button */}
        {onResetXp && score > 0 && (
          <button
            onClick={handleReset}
            title={language === 'hi' ? 'XP रीसेट करें' : language === 'gu' ? 'XP રીસેટ કરો' : 'Reset XP'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress & Badge */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
        <div className="flex-shrink-0">{badgeInfo.icon}</div>
        <div className="flex-grow space-y-1.5 text-left">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>{fullLevelName}</span>
            <span>{currentLevelXp} / {maxPoints}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            {getEncouragement()}
          </p>
        </div>
      </div>
    </div>
  );
}
