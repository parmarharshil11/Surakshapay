import React from 'react';
import { Info, ShieldCheck, Check, X, Globe, PhoneCall, AlertOctagon, Sparkles } from 'lucide-react';

export default function DisclaimerModal({ isOpen, onClose, language, setLanguage }) {
  if (!isOpen) return null;

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    try {
      localStorage.setItem('suraksha_language', langCode);
    } catch (e) {
      console.error("Failed to save language preference:", e);
    }
  };

  const handleAccept = () => {
    try {
      localStorage.setItem('disclaimer_accepted', 'true');
      localStorage.setItem('suraksha_language', language);
    } catch (e) {
      console.error("Failed to save disclaimer acceptance:", e);
    }
    if (onClose) onClose();
  };

  const languages = [
    { code: 'en', label: 'English', sub: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', sub: 'Gujarati', flag: '🇮🇳' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/80 dark:border-slate-800 relative my-6 text-left transition-all duration-300 overflow-hidden">
        
        {/* Top Decorative Gradient Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500"></div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Close Icon Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close Disclaimer Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Village-Friendly Language Selection Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Globe className="w-4 h-4 text-blue-500 animate-spin-slow" />
                <span>
                  {language === 'hi' ? 'भाषा चुनें (Select Language)' : language === 'gu' ? 'ભાષા પસંદ કરો (Select Language)' : 'Select Language'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md">
                3 Regional Languages
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {languages.map((item) => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleLanguageSelect(item.code)}
                    className={`py-3 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.03] ring-2 ring-blue-400/40'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50/60 dark:hover:bg-slate-700/50 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{item.flag}</span>
                      <span>{item.label}</span>
                    </div>
                    {isSelected ? (
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full text-white font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Selected
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-60 font-normal">{item.sub}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Title Header */}
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                {language === 'hi'
                  ? 'महत्वपूर्ण सूचना और उपयोग की शर्तें'
                  : language === 'gu'
                  ? 'મહત્વપૂર્ણ સૂચના અને ઉપયોગની શરતો'
                  : 'Important Disclaimer & Terms'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {language === 'hi'
                  ? 'SuRakshaPay प्लेटफॉर्म सुरक्षा दिशानिर्देश'
                  : language === 'gu'
                  ? 'SuRakshaPay પ્લેટફોર્મ સુરક્ષા માર્ગદર્શિકા'
                  : 'Official platform safety & usage guidelines'}
              </p>
            </div>
          </div>

          {/* Content Body with Visual Cards */}
          <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed max-h-[50vh] overflow-y-auto pr-1.5 custom-scrollbar">
            
            {/* Card 1: AI Advisory Scope */}
            <div className="p-4 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300 text-xs">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {language === 'hi' ? 'AI शैक्षिक उपकरण' : language === 'gu' ? 'AI શૈક્ષણિક સાધન' : 'AI Educational Tool'}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                {language === 'hi'
                  ? 'SuRakshaPay एक AI-संचालित शैक्षिक और जागरूकता उपकरण है। AI द्वारा दिए गए परिणाम, जोखिम स्कोर और विश्लेषण केवल संभावित अनुमान हैं। इन्हें अंतिम कानूनी, वित्तीय या साइबर सुरक्षा गारंटी न माना जाए।'
                  : language === 'gu'
                  ? 'SuRakshaPay એ AI-સંચાલિત શૈક્ષણિક અને જાગૃતિનું સાધન છે. AI દ્વારા આપવામાં આવેલા પરિણામો, જોખમ સ્કોર અને વિશ્લેષણ માત્ર અંદાજિત છે. તેને આખરી કાનૂની, નાણાકીય કે સાયબર સુરક્ષા ખાતરી ન માનવી.'
                  : 'SuRakshaPay is an AI-powered educational and awareness platform. Analysis results, risk scores, and classifications generated by Artificial Intelligence are probabilistic estimates and must NOT be treated as absolute guarantees or legal/financial advice.'}
              </p>
            </div>

            {/* Card 2: Emergency Cyber Crime Helpline 1930 */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/20 border border-red-200/80 dark:border-red-900/40 rounded-2xl flex gap-3 items-center">
              <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md shrink-0">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-300">
                    {language === 'hi' ? 'राष्ट्रीय हेल्प लाइन' : language === 'gu' ? 'રાષ્ટ્રીય હેલ્પલાઈન' : 'Emergency Helpline'}
                  </span>
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-black rounded-md shadow-sm">
                    Dial 1930
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-xs font-medium leading-snug">
                  {language === 'hi'
                    ? 'साइबर धोखाधड़ी होने पर तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।'
                    : language === 'gu'
                    ? 'સાયબર છેતરપિંડી થતાં તરત જ 1930 પર કોલ કરો અથવા cybercrime.gov.in પર ફરિયાદ નોંધાવો.'
                    : 'If victimized by cyber fraud, immediately dial 1930 or register your report at cybercrime.gov.in.'}
                </p>
              </div>
            </div>

            {/* Card 3: Non-Liability & Disclaimer Details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 rounded-2xl space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {language === 'hi' ? 'दायित्व की सीमा (Limitation of Liability)' : language === 'gu' ? 'જવાબદારીની મર્યાદા (Limitation of Liability)' : 'Limitation of Liability'}
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {language === 'hi'
                  ? 'डेवलपर्स, निर्माता और ऑपरेटर इस प्लेटफ़ॉर्म के उपयोग या इस पर की गई कार्रवाई से होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं होंगे। SuRakshaPay एक स्वतंत्र प्लेटफॉर्म है और किसी भी बैंक या सरकारी संस्था से संबद्ध नहीं है।'
                  : language === 'gu'
                  ? 'ડેવલપર્સ, ઉત્પાદકો અને ઓપરેટરો આ પ્લેટફોર્મના ઉપયોગથી કે તેના આધારે લીધેલા પગલાંથી થતા કોઈપણ નુકસાન માટે જવાબદાર રહેશે નહીં. SuRakshaPay એક સ્વતંત્ર પ્લેટફોર્મ છે અને કોઈ બેંક કે સરકારી સંસ્થા સાથે જોડાયેલ નથી.'
                  : 'The developers, creators, and platform operators shall not be held liable for any direct, indirect, financial loss, or consequences arising from the use of or reliance upon this application. SuRakshaPay is an independent hackathon MVP and is not affiliated with any official banking or government institution.'}
              </p>
            </div>

          </div>

          {/* Large Hero Action Button */}
          <button
            type="button"
            onClick={handleAccept}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <ShieldCheck className="w-6 h-6 text-green-300" />
            <span>
              {language === 'hi' ? 'मैं समझता/समझती हूँ (I Understand)' : language === 'gu' ? 'હું સમજુ છું (I Understand)' : 'I Understand & Accept'}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}
