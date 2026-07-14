import React, { useEffect, useState } from 'react';
import { getTrendingScams } from '../firebase';
import { ShieldAlert } from 'lucide-react';

export default function TrendingTicker({ language, t }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getTrendingScams();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="w-full h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-red-50 dark:bg-red-950/20 border-y border-red-200 dark:border-red-900/30 py-3 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Live Indicator Alert badge */}
        <span className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 dark:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm relative z-10">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span>{language === 'hi' ? 'ताज़ा अलर्ट' : language === 'gu' ? 'નવા એલર્ટ' : 'LIVE ALERT'}</span>
        </span>

        {/* Marquee wrapper */}
        <div className="flex-grow overflow-hidden relative w-full flex items-center">
          <div className="flex gap-12 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
            {alerts.map((item, idx) => {
              const title = item.title[language] || item.title['en'];
              return (
                <span key={idx} className={`${title.startsWith('💡') ? 'text-blue-600 dark:text-blue-400' : 'text-red-700 dark:text-red-400'} font-bold text-xs sm:text-sm flex items-center gap-1`}>
                  {!title.startsWith('💡') && '⚠️ '} {title} <span className="text-[10px] text-slate-400 font-medium ml-2">({item.date})</span>
                </span>
              );
            })}
            {/* Duplicated alerts list to enable seamless marquee loop */}
            {alerts.map((item, idx) => {
              const title = item.title[language] || item.title['en'];
              return (
                <span key={`dup-${idx}`} className={`${title.startsWith('💡') ? 'text-blue-600 dark:text-blue-400' : 'text-red-700 dark:text-red-400'} font-bold text-xs sm:text-sm flex items-center gap-1`}>
                  {!title.startsWith('💡') && '⚠️ '} {title} <span className="text-[10px] text-slate-400 font-medium ml-2">({item.date})</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
