import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus, Sparkles, RefreshCw } from 'lucide-react';

export default function CommunityMap({ language, t }) {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const res = await fetch(`${baseUrl}/api/community-stats?lang=${language}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      // Sort by count descending
      const sorted = (data.states || []).sort((a, b) => b.count - a.count);
      setReports(sorted);
      setSummary(data.summary || '');
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Community stats fetch error:', err);
      setError(true);
      // fallback static data
      setReports([
        { state: 'Gujarat', count: 48, topScamType: language === 'gu' ? 'વીજળી બિલ છેતરપિંડી' : language === 'hi' ? 'बिजली बिल धोखाधड़ी' : 'Electricity Bill Scam', riskLevel: 'High', trend: 'rising' },
        { state: 'Uttar Pradesh', count: 41, topScamType: language === 'gu' ? 'કેબીસી લોટરી' : language === 'hi' ? 'केबीसी लॉटरी' : 'KBC Lottery Scam', riskLevel: 'High', trend: 'stable' },
        { state: 'Maharashtra', count: 35, topScamType: language === 'gu' ? 'રિમોટ એક્સેસ' : language === 'hi' ? 'रिमोट एक्सेस' : 'Remote Access Fraud', riskLevel: 'High', trend: 'rising' },
        { state: 'Rajasthan', count: 22, topScamType: language === 'gu' ? 'KYC છેતરપિંડી' : language === 'hi' ? 'केवाईसी धोखाधड़ी' : 'KYC Suspension SMS', riskLevel: 'Medium', trend: 'stable' },
        { state: 'Bihar', count: 18, topScamType: language === 'gu' ? 'નકલી નોકરી' : language === 'hi' ? 'नकली नौकरी' : 'Fake Job Offers', riskLevel: 'Medium', trend: 'rising' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        {/* AI badge shimmer */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 bg-purple-100 dark:bg-purple-900/30 w-28 rounded-full animate-pulse" />
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 w-2/3 rounded animate-pulse" />
        <div className="space-y-3 mt-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...reports.map(r => r.count), 50);

  const getRiskColors = (riskLevel, count) => {
    const level = riskLevel || (count > 40 ? 'High' : count > 25 ? 'Medium' : 'Low');
    if (level === 'High') return {
      bar: 'bg-gradient-to-r from-red-500 to-red-600',
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-900/40',
    };
    if (level === 'Medium') return {
      bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-900/40',
    };
    return {
      bar: 'bg-gradient-to-r from-green-400 to-emerald-500',
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-900/40',
    };
  };

  const TrendIcon = ({ trend }) => {
    if (trend === 'rising') return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
    if (trend === 'falling') return <TrendingDown className="w-3.5 h-3.5 text-green-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const riskLabel = (level) => {
    if (language === 'hi') return level === 'High' ? 'उच्च जोखिम' : level === 'Medium' ? 'मध्यम जोखिम' : 'कम जोखिम';
    if (language === 'gu') return level === 'High' ? 'ઉચ્ચ જોખમ' : level === 'Medium' ? 'મધ્યમ જોખમ' : 'ઓછું જોખમ';
    return level === 'High' ? 'High Risk' : level === 'Medium' ? 'Medium Risk' : 'Low Risk';
  };

  const trendLabel = (trend) => {
    if (language === 'hi') return trend === 'rising' ? 'बढ़ रहा' : trend === 'falling' ? 'घट रहा' : 'स्थिर';
    if (language === 'gu') return trend === 'rising' ? 'વધી રહ્યો' : trend === 'falling' ? 'ઘટી રહ્યો' : 'સ્થિર';
    return trend === 'rising' ? 'Rising' : trend === 'falling' ? 'Falling' : 'Stable';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm transition-colors duration-300 space-y-4 relative">

      {/* Gemini AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-full">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            {language === 'hi' ? 'Gemini AI द्वारा' : language === 'gu' ? 'Gemini AI દ્વારા' : 'Powered by Gemini AI'}
          </span>
        </div>
        {/* Refresh button */}
        <button
          onClick={fetchData}
          title="Refresh"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-500 rounded-xl">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {language === 'hi' ? 'कम्युनिटी रिपोर्ट मैप' : language === 'gu' ? 'કમ્યુનિટી રીપોર્ટ મેપ' : 'COMMUNITY ALERT INDEX'}
          </h4>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {language === 'hi' ? 'राज्यवार ठगी तीव्रता' : language === 'gu' ? 'રાજ્ય અનુસાર ઠગાઈ તીવ્રતા' : 'Scam Intensity by State'}
          </h3>
        </div>
      </div>

      {/* Error notice */}
      {error && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
          {language === 'hi' ? '⚠️ AI डेटा उपलब्ध नहीं, स्थानीय डेटा दिखा रहे हैं।' :
           language === 'gu' ? '⚠️ AI ડેટા ઉપલબ્ધ નથી, સ્થાનિક ડેટા બતાવી રહ્યા છીએ.' :
           '⚠️ AI data unavailable — showing local fallback data.'}
        </p>
      )}

      {/* Bar Chart */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {reports.length > 0 ? reports.map((report, idx) => {
          const pct = Math.min(100, Math.max(8, (report.count / maxCount) * 100));
          const c = getRiskColors(report.riskLevel, report.count);

          return (
            <div key={idx} className={`p-3 rounded-xl border transition-all duration-300 ${c.bg} ${c.border}`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${c.text}`}>{report.state}</span>
                    {/* Risk badge */}
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.badge}`}>
                      {riskLabel(report.riskLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <TrendIcon trend={report.trend} />
                    <span>{trendLabel(report.trend)}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {language === 'hi' ? 'मुख्य खतरा: ' : language === 'gu' ? 'મુખ્ય ખતરો: ' : 'Top threat: '}
                      {report.topScamType || 'General'}
                    </span>
                  </div>
                </div>
                <div className={`font-black text-lg tabular-nums ${c.text}`}>{report.count}</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${c.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            {language === 'hi' ? 'कोई डेटा नहीं मिला' : language === 'gu' ? 'કોઈ ડેટા મળ્યો નથી' : 'No data available'}
          </div>
        )}
      </div>

      {/* AI Summary */}
      {summary && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">
            <Sparkles className="w-3 h-3 inline mr-1 text-purple-400" />
            {summary}
          </p>
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-[10px] text-slate-400 dark:text-slate-600">
          {language === 'hi' ? `अंतिम अपडेट: ${lastUpdated.toLocaleTimeString('hi-IN')}` :
           language === 'gu' ? `છેલ્લું અપડેટ: ${lastUpdated.toLocaleTimeString('gu-IN')}` :
           `Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </p>
      )}
    </div>
  );
}
