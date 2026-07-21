import React, { useState } from 'react';
import { Info, Shield } from 'lucide-react';

export default function DisclaimerModal({ language }) {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('disclaimer_accepted') !== 'true';
  });

  const handleAccept = () => {
    localStorage.setItem('disclaimer_accepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-400/40 dark:bg-slate-800/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 text-slate-800 dark:text-slate-100">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
            <Info className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {language === 'hi' ? 'महत्वपूर्ण सूचना' : language === 'gu' ? 'મહત્વપૂર્ણ સૂચના' : 'Important Disclaimer'}
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            {language === 'hi'
              ? 'AI द्वारा दिए गए परिणामों पर आँख बंद करके भरोसा न करें। यह ऐप केवल शैक्षिक और जागरूकता उद्देश्यों के लिए है।'
              : language === 'gu'
              ? 'AI દ્વારા આપવામાં આવેલા પરિણામો પર આંધળો વિશ્વાસ ન કરો. આ એપ્લિકેશન માત્ર શૈક્ષણિક અને જાગૃતિના હેતુ માટે છે.'
              : 'The results given by the AI must not be trusted blindly. This application is for educational and awareness purposes only.'}
          </p>

          <div className="p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex gap-3">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-blue-900 dark:text-blue-200 text-sm font-medium">
              {language === 'hi'
                ? 'मदद और मार्गदर्शन के लिए संबंधित अधिकारियों से संपर्क करें। राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर कॉल करें और अपनी शिकायत दर्ज करें।'
                : language === 'gu'
                ? 'મદદ અને માર્ગદર્શન માટે સંબંધિત અધિકારીઓનો સંપર્ક કરો. રાષ્ટ્રીય સાયબર ક્રાઈમ હેલ્પલાઈન 1930 પર કૉલ કરો અને તમારી ફરિયાદ નોંધાવો.'
                : 'Contact the respective authorities for help and guidance by calling the National Cyber Crime Helpline 1930 and register your complain.'}
            </p>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            {language === 'hi'
              ? 'डेवलपर्स इस प्लेटफॉर्म के उपयोग से होने वाले किसी भी नुकसान या परिणाम के लिए ज़िम्मेदार नहीं हैं।'
              : language === 'gu'
              ? 'ડેવલપર્સ આ પ્લેટફોર્મના ઉપયોગથી થતા કોઈપણ નુકસાન અથવા પરિણામો માટે જવાબદાર નથી.'
              : 'The developers aren\'t responsible for any actions taken or consequences resulting from the use of this platform.'}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={handleAccept}
          className="mt-8 w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >
          {language === 'hi' ? 'मैं समझता/समझती हूँ' : language === 'gu' ? 'હું સમજુ છું' : 'I Understand'}
        </button>

      </div>
    </div>
  );
}
