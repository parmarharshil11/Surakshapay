import React from 'react';
import { Info, Shield, Check, X, Globe } from 'lucide-react';

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
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-8 text-left transition-colors duration-300">
        
        {/* Optional Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Village-Friendly Language Selection Bar */}
        <div className="mb-6 p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>
              {language === 'hi' ? 'अपनी पसंदीदा भाषा चुनें' : language === 'gu' ? 'તમારી પસંદગીની ભાષા પસંદ કરો' : 'Select Preferred Language'}
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
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-base leading-none">{item.flag}</span>
                  <span>{item.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 text-slate-800 dark:text-slate-100">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400">
            <Info className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {language === 'hi'
                ? 'महत्वपूर्ण सूचना और उपयोग की शर्तें'
                : language === 'gu'
                ? 'મહત્વપૂર્ણ સૂચના અને ઉપયોગની શરતો'
                : 'Important Disclaimer & Terms'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? 'कृपया आगे बढ़ने से पहले पढ़ें' : language === 'gu' ? 'કૃપા કરીને આગળ વધતા પહેલા વાંચો' : 'Please read carefully before proceeding'}
            </p>
          </div>
        </div>

        {/* Professional & Legal Copy Body */}
        <div className="space-y-3.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          <p className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            {language === 'hi'
              ? 'SuRakshaPay एक AI-संचालित शैक्षिक और जागरूकता उपकरण है। AI द्वारा दिए गए परिणाम, जोखिम स्कोर और विश्लेषण केवल संभावित अनुमान हैं। इन्हें अंतिम कानूनी, वित्तीय या साइबर सुरक्षा गारंटी न माना जाए।'
              : language === 'gu'
              ? 'SuRakshaPay એ AI-સંચાલિત શૈક્ષણિક અને જાગૃતિનું સાધન છે. AI દ્વારા આપવામાં આવેલા પરિણામો, જોખમ સ્કોર અને વિશ્લેષણ માત્ર અંદાજિત છે. તેને આખરી કાનૂની, નાણાકીય કે સાયબર સુરક્ષા ખાતરી ન માનવી.'
              : 'SuRakshaPay is an AI-powered educational and awareness platform. Analysis results, risk scores, and classifications generated by Artificial Intelligence are probabilistic estimates and must NOT be treated as absolute guarantees or legal/financial advice.'}
          </p>

          <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded-xl flex gap-3 items-start">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-900 dark:text-blue-200 text-xs font-semibold leading-normal">
              {language === 'hi'
                ? 'आधिकारिक सहायता के लिए या यदि आप साइबर धोखाधड़ी के शिकार हुए हैं, तो तुरंत राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 डायल करें और cybercrime.gov.in पर अपनी शिकायत दर्ज करें।'
                : language === 'gu'
                ? 'સત્તાવાર મદદ માટે અથવા જો તમે સાયબર છેતરપિંડીનો ભોગ બન્યા હોવ, તો તરત જ રાષ્ટ્રીય સાયબર ક્રાઈમ હેલ્પલાઈન 1930 ડાયલ કરો અને cybercrime.gov.in પર તમારી ફરિયાદ નોંધાવો.'
                : 'For emergency assistance or if you suspect cyber fraud, call the official National Cyber Crime Helpline 1930 immediately or register your complaint at cybercrime.gov.in.'}
            </p>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            {language === 'hi'
              ? 'दायित्व की सीमा: डेवलपर्स, निर्माता और ऑपरेटर इस प्लेटफ़ॉर्म के उपयोग या इस पर की गई कार्रवाई से होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं होंगे। SuRakshaPay एक स्वतंत्र प्लेटफॉर्म है और किसी भी बैंक या सरकारी संस्था से संबद्ध नहीं है।'
              : language === 'gu'
              ? 'જવાબદારીની મર્યાદા: ડેવલપર્સ, ઉત્પાદકો અને ઓપરેટરો આ પ્લેટફોર્મના ઉપયોગથી કે તેના આધારે લીધેલા પગલાંથી થતા કોઈપણ નુકસાન માટે જવાબદાર રહેશે નહીં. SuRakshaPay એક સ્વતંત્ર પ્લેટફોર્મ છે અને કોઈ બેંક કે સરકારી સંસ્થા સાથે જોડાયેલ નથી.'
              : 'Limitation of Liability: The developers, creators, and platform operators shall not be held liable for any direct, indirect, financial loss, or consequences arising from the use of or reliance upon this application. SuRakshaPay is an independent project and is not affiliated with any official banking or government institution.'}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAccept}
          className="mt-6 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{language === 'hi' ? 'मैं समझता/समझती हूँ' : language === 'gu' ? 'હું સમજુ છું' : 'I Understand & Accept'}</span>
        </button>

      </div>
    </div>
  );
}
