import React, { useState, useRef, useEffect } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, ShieldAlert, FileSpreadsheet, Eye, EyeOff, Calendar, Search, X, Filter } from 'lucide-react';

export default function History({ t, history, onClear, setTab, language }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const detailRef = useRef(null);

  useEffect(() => {
    if (selectedItem && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [selectedItem]);

  const formatDate = (isoStr) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  const getLocalizedText = (en, hi, gu) => {
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  // Filter history logs
  const filteredHistory = (history || []).filter((item) => {
    // Type / Status filter
    if (filterType === 'message' && item.type !== 'message') return false;
    if (filterType === 'upi' && item.type !== 'upi') return false;
    if (filterType === 'reported_scam' && item.type !== 'reported_scam') return false;
    if (filterType === 'scam_only' && item.classification !== 'Scam' && item.classification !== 'Reported') return false;

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const textContent = (item.inputText || item.upiId || item.scammerDetails || item.explanation || '').toLowerCase();
    return textContent.includes(q);
  });

  // Calculate summary stats
  const totalCount = (history || []).length;
  const scamCount = (history || []).filter(i => i.classification === 'Scam' || i.classification === 'Reported').length;
  const safeCount = (history || []).filter(i => i.classification === 'Safe').length;

  const filterTabs = [
    { id: 'all', label: getLocalizedText('All Logs', 'सभी लॉग', 'બધા લોગ') },
    { id: 'scam_only', label: getLocalizedText('🚨 Scams Only', '🚨 केवल स्कैम', '🚨 ફક્ત છેતરપિંડી') },
    { id: 'message', label: getLocalizedText('💬 Messages', '💬 संदेश', '💬 સંદેશાઓ') },
    { id: 'upi', label: getLocalizedText('💳 UPI Checks', '💳 यूपीआई जांच', '💳 UPI ચકાસણી') },
    { id: 'reported_scam', label: getLocalizedText('🚨 Reports', '🚨 रिपोर्ट्स', '🚨 રિપોર્ટ્સ') },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.histTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t.histSubtitle}
          </p>
        </div>

        {history && history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-red-300 hover:text-red-600 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 cursor-pointer transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.btnHistoryClear}
          </button>
        )}
      </div>

      {history && history.length > 0 ? (
        <>
          {/* Summary Badges Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-center shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">{getLocalizedText('Total Checks', 'कुल जांच', 'કુલ ચકાસણી')}</p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{totalCount}</p>
            </div>
            <div className="bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 p-3 rounded-xl text-center shadow-sm">
              <p className="text-xs text-red-500 font-semibold">{getLocalizedText('Threats Flagged', 'खतरे पहचाने गए', 'જોખમો પકડાયા')}</p>
              <p className="text-lg font-black text-red-600 dark:text-red-400">{scamCount}</p>
            </div>
            <div className="bg-green-50/60 dark:bg-green-950/20 border border-green-200/60 dark:border-green-900/40 p-3 rounded-xl text-center shadow-sm">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">{getLocalizedText('Safe Verified', 'सुरक्षित सत्यापित', 'સુરક્ષિત ચકાસાયેલ')}</p>
              <p className="text-lg font-black text-green-600 dark:text-green-400">{safeCount}</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getLocalizedText('Search history by message, UPI ID, or scam details...', 'संदेश, यूपीआई आईडी या विवरण खोजें...', 'મેસેજ, UPI ID અથવા વિગતો દ્વારા શોધો...')}
                className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: List and Detail Panel */}
          {filteredHistory.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center space-y-2">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                {getLocalizedText('No matching history logs', 'कोई मेल खाता इतिहास नहीं मिला', 'કોઈ સંબંધિત ઇતિહાસ લોગ મળ્યો નથી')}
              </p>
              <p className="text-slate-400 text-xs">
                {getLocalizedText('Try clearing your search query or changing the category filter.', 'अपनी खोज या फ़िल्टर बदलने का प्रयास करें।', 'તમારી શોધ અથવા ફિલ્ટર બદલવાનો પ્રયાસ કરો.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* History List */}
              <div className="md:col-span-7 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-h-[500px] overflow-y-auto transition-colors duration-300">
                {filteredHistory.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  
                  const riskColor = 
                    item.classification === 'Scam' || item.classification === 'Reported' 
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40' 
                      : item.classification === 'Suspicious' 
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40' 
                        : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40';

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm' 
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-500 flex-shrink-0">
                          {item.type === 'message' && <span>💬</span>}
                          {item.type === 'upi' && <span>💳</span>}
                          {item.type === 'reported_scam' && <span>🚨</span>}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                            {item.type === 'message' ? t.histTypeSms : item.type === 'upi' ? t.histTypeUpi : t.histTypeReport}
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold truncate">
                            {item.type === 'message' ? item.inputText : 
                             item.type === 'upi' ? `₹${item.amount} to ${item.upiId}` : 
                             `Reported: ${item.scammerDetails}`}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${riskColor}`}>
                          {item.classification === 'Reported' ? (language === 'hi' ? 'रिपोर्ट किया गया' : language === 'gu' ? 'રિપોર્ટ કરેલ' : 'Reported') : 
                           item.classification === 'Scam' ? (language === 'hi' ? 'स्कैम' : language === 'gu' ? 'છેતરપિંડી' : 'Scam') : 
                           item.classification === 'Suspicious' ? (language === 'hi' ? 'संदिग्ध' : language === 'gu' ? 'શંકાસ્પદ' : 'Suspicious') : 
                           (language === 'hi' ? 'सुरक्षित' : language === 'gu' ? 'સુરક્ષિત' : 'Safe')}
                        </span>
                        <div className="text-slate-400 dark:text-slate-500">
                          {isSelected ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* History Detail Drawer/Panel */}
              <div className="md:col-span-5" ref={detailRef}>
                {selectedItem ? (
                  <div className={`bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm space-y-5 animate-fade-in transition-colors duration-300 ${
                    selectedItem.classification === 'Scam' || selectedItem.classification === 'Reported' 
                      ? 'border-red-300 dark:border-red-800' 
                      : selectedItem.classification === 'Suspicious' 
                        ? 'border-amber-300 dark:border-amber-900/50' 
                        : 'border-green-300 dark:border-green-800'
                  }`}>
                    
                    {/* Header info */}
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-bold">
                        {selectedItem.type === 'message' && "💬"}
                        {selectedItem.type === 'upi' && "💳"}
                        {selectedItem.type === 'reported_scam' && "🚨"}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {selectedItem.type === 'message' ? t.histTypeSms : selectedItem.type === 'upi' ? t.histTypeUpi : t.histTypeReport}
                        </h4>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{formatDate(selectedItem.timestamp)}</span>
                      </div>
                    </div>

                    {/* Score section */}
                    <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>{t.smsRiskLevel}</span>
                        <span className={`font-bold ${
                          selectedItem.classification === 'Scam' || selectedItem.classification === 'Reported' ? 'text-red-600 dark:text-red-400' :
                          selectedItem.classification === 'Suspicious' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                        }`}>
                          {selectedItem.classification === 'Reported' ? (language === 'hi' ? 'रिपोर्ट किया गया' : language === 'gu' ? 'રિપોર્ટ કરેલ' : 'Reported') : 
                           selectedItem.classification === 'Scam' ? (language === 'hi' ? 'स्कैम' : language === 'gu' ? 'છેતરપિંડી' : 'Scam') : 
                           selectedItem.classification === 'Suspicious' ? (language === 'hi' ? 'संदिग्ध' : language === 'gu' ? 'શંકાસ્પદ' : 'Suspicious') : 
                           (language === 'hi' ? 'सुरक्षित' : language === 'gu' ? 'સુરક્ષિત' : 'Safe')} ({selectedItem.score}%)
                        </span>
                      </div>
                    </div>

                    {/* Detailed Inputs */}
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {selectedItem.type === 'reported_scam' 
                          ? (language === 'hi' ? 'रिपोर्ट का विवरण' : language === 'gu' ? 'રિપોર્ટ વિગતો' : 'Report Details')
                          : (language === 'hi' ? 'जांचे गए विवरण' : language === 'gu' ? 'તપસેલ વિગતો' : 'Inputs Checked')
                        }
                      </h5>
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 max-h-[120px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selectedItem.type === 'message' && selectedItem.inputText}
                        {selectedItem.type === 'upi' && (
                          <div className="space-y-1 text-xs">
                            <div><strong className="text-slate-500 dark:text-slate-400">UPI ID:</strong> {selectedItem.upiId}</div>
                            <div><strong className="text-slate-500 dark:text-slate-400">Amount:</strong> ₹{selectedItem.amount}</div>
                            {selectedItem.messageContent && <div><strong className="text-slate-500 dark:text-slate-400">Note:</strong> "{selectedItem.messageContent}"</div>}
                          </div>
                        )}
                        {selectedItem.type === 'reported_scam' && (
                          <div className="space-y-1 text-xs">
                            <div><strong className="text-slate-500 dark:text-slate-400">Scammer:</strong> {selectedItem.scammerDetails}</div>
                            <div><strong className="text-slate-500 dark:text-slate-400">Story:</strong> {selectedItem.description}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {t.smsExplanation}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {selectedItem.explanation}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed p-10 rounded-2xl text-center space-y-2 transition-colors duration-300">
                    <FileSpreadsheet className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-slate-400 dark:text-slate-400 text-sm font-semibold">
                      {language === 'hi' ? 'एक आइटम चुनें' : language === 'gu' ? 'એક આઇટમ પસંદ કરો' : 'Select an item'}
                    </p>
                    <p className="text-slate-400/80 dark:text-slate-500 text-xs max-w-[200px] mx-auto leading-normal">
                      {language === 'hi' ? 'विवरण देखने के लिए बाईं ओर किसी भी चेक लॉग पर क्लिक करें।' : language === 'gu' ? 'વિશ્લેષણ જોવા માટે ડાબી બાજુના લોગ પર ક્લિક કરો.' : 'Click on any check logs on the left to see the analysis reason.'}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center shadow-sm max-w-xl mx-auto space-y-4 transition-colors duration-300">
          <Trash2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {language === 'hi' ? 'कोई इतिहास नहीं मिला' : language === 'gu' ? 'કોઈ ઇતિહાસ મળ્યો નથી' : 'No Check History Found'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {t.histEmpty}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setTab('home')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'होम पर जाएं' : language === 'gu' ? 'હોમ પૃષ્ઠ પર જાઓ' : 'Go to Home'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
