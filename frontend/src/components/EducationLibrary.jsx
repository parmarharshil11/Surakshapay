import React, { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Search, X, Filter } from 'lucide-react';
import SmsGuide from './SmsGuide';

export default function EducationLibrary({ t, language }) {
  const [scams, setScams] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchScams() {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
      try {
        setError(false);
        const response = await fetch(`${baseUrl}/api/scams`);
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        setScams(data);
      } catch (error) {
        console.error("Error loading scams library:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchScams();
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  // Filter scams based on search query and selected category
  const filteredScams = scams.filter((scam) => {
    // Category check
    if (selectedCategory === 'high_risk' && scam.dangerLevel !== 'High') return false;
    if (selectedCategory === 'digital_arrest' && scam.category !== 'digital_arrest') return false;
    if (selectedCategory === 'banking' && scam.category !== 'banking' && scam.id !== 'kyc_scam' && scam.id !== 'upi_collect_scam') return false;
    if (selectedCategory === 'jobs_loans' && scam.category !== 'jobs_loans' && scam.id !== 'loan_app_scam') return false;

    // Search query check across languages
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();

    const titleEn = (scam.title?.en || '').toLowerCase();
    const titleHi = (scam.title?.hi || '').toLowerCase();
    const titleGu = (scam.title?.gu || '').toLowerCase();
    const howEn = (scam.howItWorks?.en || '').toLowerCase();
    const howHi = (scam.howItWorks?.hi || '').toLowerCase();
    const howGu = (scam.howItWorks?.gu || '').toLowerCase();
    const exEn = (scam.example?.en || '').toLowerCase();

    return (
      titleEn.includes(q) || titleHi.includes(q) || titleGu.includes(q) ||
      howEn.includes(q) || howHi.includes(q) || howGu.includes(q) ||
      exEn.includes(q)
    );
  });

  const categories = [
    { id: 'all', label: language === 'hi' ? 'सभी मॉड्यूल' : language === 'gu' ? 'બધા મોડ્યુલ' : 'All Modules' },
    { id: 'high_risk', label: language === 'hi' ? '🚨 उच्च खतरा' : language === 'gu' ? '🚨 ઉચ્ચ જોખમ' : '🚨 High Threat' },
    { id: 'digital_arrest', label: language === 'hi' ? '👮 डिजिटल अरेस्ट' : language === 'gu' ? '👮 ડિજિટલ અરેસ્ટ' : '👮 Digital Arrest' },
    { id: 'banking', label: language === 'hi' ? '💳 बैंकिंग व केवाईसी' : language === 'gu' ? '💳 બેંકિંગ અને કેવાયસી' : '💳 Banking & KYC' },
    { id: 'jobs_loans', label: language === 'hi' ? '💼 लोन व जॉब्स' : language === 'gu' ? '💼 લોન અને જોબ્સ' : '💼 Jobs & Loans' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.libTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.libSubtitle}
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-normal">
            {t.errorLibraryLoad || "Could not load scam library. Check connection."}
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-10">
          <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin inline-block"></span>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Loading library...</p>
        </div>
      ) : (
        <>
          <SmsGuide language={language} />

          {/* Search & Category Filter Header */}
          <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi' ? 'स्कैम के प्रकार, कीवर्ड या उदाहरण खोजें...' :
                  language === 'gu' ? 'સ્કેમ પ્રકાર, કીવર્ડ અથવા ઉદાહરણ શોધો...' :
                  'Search scam types, keywords, or examples...'
                }
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Modules List */}
          {filteredScams.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300 text-base">
                {language === 'hi' ? 'कोई मेल खाता स्कैम मॉड्यूल नहीं मिला' : language === 'gu' ? 'કોઈ સંબંધિત સ્કેમ મોડ્યુલ મળ્યું નથી' : 'No matching scam modules found'}
              </p>
              <p className="text-slate-400 text-xs">
                {language === 'hi' ? 'कृपया अपनी खोज या श्रेणी फ़िल्टर बदलें।' : language === 'gu' ? 'કૃપા કરીને તમારી શોધ અથવા કેટેગરી ફિલ્ટર બદલો.' : 'Try adjusting your search query or category filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredScams.map((scam) => {
                const isExpanded = expandedId === scam.id;
                const title = scam.title[language] || scam.title['en'];
                const howItWorks = scam.howItWorks[language] || scam.howItWorks['en'];
                const example = scam.example[language] || scam.example['en'];
                const whatToDoList = scam.whatToDo[language] || scam.whatToDo['en'];

                return (
                  <div
                    key={scam.id}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'border-blue-500 dark:border-blue-700 ring-1 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(scam.id)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${
                          scam.dangerLevel === 'High' ? 'bg-red-50 dark:bg-red-950/30 text-red-500' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                        }`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base md:text-lg">
                            {title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              scam.dangerLevel === 'High' ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700'
                            }`}>
                              <AlertCircle className="w-3 h-3" />
                              {t.libDanger}: {scam.dangerLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 border-t border-slate-200 dark:border-slate-800 space-y-5 animate-fade-in bg-slate-50/50 dark:bg-slate-900/50">
                        
                        {/* How they trick you */}
                        <div className="space-y-1.5 pt-4">
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t.libHowWorks}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {howItWorks}
                          </p>
                        </div>

                        {/* Example message */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t.libExample}
                          </h4>
                          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-100/60 dark:border-red-900/40 p-4 rounded-xl text-slate-700 dark:text-slate-300 text-sm italic font-medium">
                            {example}
                          </div>
                        </div>

                        {/* What to do instead */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t.libWhatToDo}
                          </h4>
                          <div className="space-y-2 bg-green-50/60 dark:bg-green-950/20 border border-green-100/80 dark:border-green-900/40 p-4 rounded-xl">
                            {whatToDoList.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm leading-normal">
                                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
