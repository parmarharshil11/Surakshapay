import React, { useState, useRef, useEffect } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, ShieldAlert, FileSpreadsheet, Eye, EyeOff, Calendar } from 'lucide-react';

export default function History({ t, history, onClear, setTab, language }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    if (selectedItem && detailRef.current) {
      // Small delay to ensure render is complete before scrolling
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

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="flex justify-between items-start">
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

      {/* Main Grid: List and Detail Panel */}
      {history && history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* History List */}
          <div className="md:col-span-7 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-h-[500px] overflow-y-auto transition-colors duration-300">
            {history.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              
              // Get visual color rating
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
                      ? 'border-blue-500 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/20' 
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Icon */}
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
