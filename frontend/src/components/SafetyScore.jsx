import React from 'react';
import { ShieldCheck, ShieldAlert, Award, Zap } from 'lucide-react';

export default function SafetyScore({ score, language, t }) {
  // Determine Level and Progress details
  let levelName = "";
  let badgeIcon = null;
  let maxPoints = 50;
  let progressPercent = 0;
  let levelNum = 1;

  if (score <= 50) {
    levelName = language === 'hi' ? "स्तर १: शुरुआती" : language === 'gu' ? "સ્તર ૧: શિખાઉ" : "Level 1: Beginner";
    badgeIcon = <ShieldAlert className="w-8 h-8 text-amber-500 fill-amber-500/10 animate-pulse" />;
    maxPoints = 50;
    progressPercent = Math.min(100, Math.max(0, (score / 50) * 100));
    levelNum = 1;
  } else if (score <= 150) {
    levelName = language === 'hi' ? "स्तर २: जागरूक नागरिक" : language === 'gu' ? "સ્તર ૨: જાગૃત નાગરિક" : "Level 2: Scam Aware";
    badgeIcon = <ShieldCheck className="w-8 h-8 text-blue-500 fill-blue-500/15" />;
    maxPoints = 150;
    progressPercent = Math.min(100, Math.max(0, ((score - 50) / 100) * 100));
    levelNum = 2;
  } else {
    levelName = language === 'hi' ? "स्तर ३: सुरक्षा विशेषज्ञ" : language === 'gu' ? "સ્તર ૩: સુરક્ષા નિષ્ણાત" : "Level 3: Safety Expert";
    badgeIcon = <Award className="w-8 h-8 text-green-500 fill-green-500/20 animate-bounce" />;
    maxPoints = 300; // soft cap indicator
    progressPercent = Math.min(100, Math.max(0, ((score - 150) / 150) * 100));
    levelNum = 3;
  }

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
      </div>

      {/* Progress & Badge */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
        <div className="flex-shrink-0">{badgeIcon}</div>
        <div className="flex-grow space-y-1.5 text-left">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>{levelName}</span>
            <span>{score} / {maxPoints}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            {levelNum === 1 && (language === 'hi' ? 'शुरुआती स्तर। ५० अंक पर स्तर २ पर पहुंचें!' : language === 'gu' ? 'શરૂઆતી સ્તર. ૫૦ પોઇન્ટ પર સ્તર ૨ પર પહોંચો!' : 'Keep verifying messages to reach Level 2 at 50 XP!')}
            {levelNum === 2 && (language === 'hi' ? 'शानदार! १५० अंक पर स्तर ३ सुरक्षा विशेषज्ञ बनें!' : language === 'gu' ? 'સરસ! ૧૫૦ પોઇન્ટ પર સ્તર ૩ સુરક્ષા નિષ્ણાત બનો!' : 'Excellent! Reach Level 3 at 150 XP for safety expert badge.')}
            {levelNum === 3 && (language === 'hi' ? 'बधाई हो! आप ग्रामीण भारत के डिजिटल रक्षक हैं।' : language === 'gu' ? 'અભિનંદન! તમે ગ્રામીણ ભારતના ડિજિટલ રક્ષક છો.' : 'Incredible! You are a master digital protector.')}
          </p>
        </div>
      </div>
    </div>
  );
}
