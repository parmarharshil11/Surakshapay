import React from 'react';
import { ShieldCheck, Info, Cpu, Users } from 'lucide-react';

export default function About({ t, language }) {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.aboutTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.aboutSubtitle}
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Mission Statement */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {t.aboutHeading1}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-450 text-sm leading-relaxed">
              {t.aboutBody1}
            </p>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-red-600 uppercase tracking-wider">
            {language === 'hi' ? '🚨 डिजिटल साक्षरता अंतर' : language === 'gu' ? '🚨 ડિજિટલ સાક્ષરતા તફાવત' : '🚨 The Digital Literacy Gap'}
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {t.aboutHeading2}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-450 text-sm leading-relaxed">
              {t.aboutBody2}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-green-600 uppercase tracking-wider">
            {language === 'hi' ? '🛡️ ग्रामीण भारत के लिए सुरक्षा' : language === 'gu' ? '🛡️ ગ્રામીણ ભારત માટે સુરક્ષા' : '🛡️ Safety for Rural India'}
          </div>
        </div>

      </div>

      {/* Core Technology & Hackathon Pitch */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
        
        <div className="relative z-10 space-y-4 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold tracking-tight">
            {language === 'hi' ? 'जजों का सारांश और पिच नोट्स' : language === 'gu' ? 'જજ સારાંશ અને પિચ વિગતો' : 'Judges Summary & Pitch Notes'}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t.aboutHackathonStatement}
          </p>
          <div className="pt-4 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
              <Cpu className="w-4 h-4 text-blue-450" />
              {language === 'hi' ? 'नियम-आधारित स्थानीय मिलान' : language === 'gu' ? 'નિયમ-આધારિત સ્થાનિક ચકાસણી' : 'Rule-Based Local Matching'}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
              <Users className="w-4 h-4 text-green-450" />
              {language === 'hi' ? 'अंग्रेजी, हिंदी और गुजराती' : language === 'gu' ? 'અંગ્રેજી, હિન્દી અને ગુજરાતી' : 'English, Hindi & Gujarati (i18n)'}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
              {language === 'hi' ? '⚡ मोबाइल-अनुकूल' : language === 'gu' ? '⚡ મોબાઇલ-અનુકૂળ' : '⚡ Mobile-First Responsive'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
