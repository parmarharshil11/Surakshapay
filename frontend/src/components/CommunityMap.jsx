import React, { useState, useEffect } from 'react';
import { getCommunityReports } from '../firebase';
import { MapPin, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function CommunityMap({ language, t }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getCommunityReports();
        // Sort reports by count descending for the bar chart
        const sorted = data.sort((a, b) => b.count - a.count);
        setReports(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 w-1/3 rounded"></div>
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Find max count to scale the bars
  const maxCount = Math.max(...reports.map(r => r.count), 50);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm transition-colors duration-300 space-y-4 relative">
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

      {/* Bar Chart Container */}
      <div className="space-y-4 mt-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {reports.length > 0 ? (
          reports.map((report, idx) => {
            const percentage = Math.min(100, Math.max(5, (report.count / maxCount) * 100));
            
            // Risk colors based on count
            let barColor = 'bg-green-500';
            let textColor = 'text-green-600 dark:text-green-400';
            let bgColor = 'bg-green-50 dark:bg-green-900/20';
            
            if (report.count > 40) {
              barColor = 'bg-red-500';
              textColor = 'text-red-600 dark:text-red-400';
              bgColor = 'bg-red-50 dark:bg-red-900/20';
            } else if (report.count > 25) {
              barColor = 'bg-orange-500';
              textColor = 'text-orange-600 dark:text-orange-400';
              bgColor = 'bg-orange-50 dark:bg-orange-900/20';
            } else if (report.count > 10) {
              barColor = 'bg-yellow-500';
              textColor = 'text-yellow-600 dark:text-yellow-400';
              bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
            }

            return (
              <div key={idx} className={`p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors ${bgColor}`}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className={`font-bold text-sm ${textColor}`}>
                      {report.state}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">
                      {language === 'hi' ? 'मुख्य खतरा: ' : language === 'gu' ? 'મુખ્ય ખતરો: ' : 'Top threat: '} 
                      {report.topScamType || 'General'}
                    </span>
                  </div>
                  <div className={`font-black text-lg ${textColor}`}>
                    {report.count}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200/50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            {language === 'hi' ? 'कोई डेटा नहीं मिला' : language === 'gu' ? 'કોઈ ડેટા મળ્યો નથી' : 'No data available'}
          </div>
        )}
      </div>

    </div>
  );
}
