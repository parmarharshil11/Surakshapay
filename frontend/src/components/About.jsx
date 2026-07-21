import React from 'react';
import { ShieldCheck, Info, Cpu, Users, Zap, Globe, HeartHandshake, PhoneCall, Code, Sparkles, AlertOctagon } from 'lucide-react';

export default function About({ t, language }) {
  const getLocalizedText = (en, hi, gu) => {
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  const impactStats = [
    {
      value: "700M+",
      label: getLocalizedText("Rural Citizens Targeted", "ग्रामीण नागरिक लक्ष्य", "ગ્રામીણ નાગરિકો લક્ષ્ય"),
      sub: getLocalizedText("First-time smartphone users", "पहली बार स्मार्टफोन उपयोगकर्ता", "પ્રથમ વખત સ્માર્ટફોન યુઝર્સ"),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40"
    },
    {
      value: "₹7,000 Cr+",
      label: getLocalizedText("Annual Cyber Fraud Loss", "वार्षिक साइबर धोखाधड़ी नुकसान", "વાર્ષિક સાયબર છેતરપિંડી નુકસાન"),
      sub: getLocalizedText("Reported in India (2023)", "भारत में दर्ज (2023)", "ભારતમાં નોંધાયેલ (2023)"),
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40"
    },
    {
      value: "< 2s",
      label: getLocalizedText("AI Detection Speed", "AI पहचान की गति", "AI ચકાસણીની ઝડપ"),
      sub: getLocalizedText("Powered by Gemini Flash", "जेमिनी फ्लैश द्वारा संचालित", "જેમિની ફ્લેશ દ્વારા સંચાલિત"),
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40"
    },
    {
      value: "3 Languages",
      label: getLocalizedText("Regional Support", "क्षेत्रीय भाषा सहायता", "પ્રાદેશિક ભાષા સપોર્ટ"),
      sub: getLocalizedText("English, Hindi & Gujarati", "अंग्रेजी, हिंदी और गुजराती", "અંગ્રેજી, હિન્દી અને ગુજરાતી"),
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40"
    }
  ];

  const pillars = [
    {
      icon: Cpu,
      title: getLocalizedText("Google Gemini AI Engine", "गूगल जेमिनी AI इंजन", "ગૂગલ જેમિની AI એન્જિન"),
      desc: getLocalizedText("Contextual fraud reasoning, keyword detection, and 0-100 risk score evaluation.", "प्रासंगिक धोखाधड़ी विश्लेषण, कीवर्ड पहचान और 0-100 जोखिम स्कोर।", "સંદર્ભિત છેતરપિંડી પૃથ્થકરણ, કીવર્ડ ઓળખ અને 0-100 જોખમ સ્કોર."),
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: Globe,
      title: getLocalizedText("Voice & Speech I/O", "वॉयस और स्पीच इनपुट/आउटपुट", "વૉઇસ અને સ્પીચ ઈનપુટ/આઉટપુટ"),
      desc: getLocalizedText("Built-in Speech-to-Text and Text-to-Speech for low-literacy rural users.", "कम साक्षरता वाले ग्रामीण उपयोगकर्ताओं के लिए स्पीच-टू-टेक्स्ट व टेक्स्ट-टू-स्पीच।", "ઓછી સાક્ષરતા ધરાવતા ગ્રામીણ વપરાશકર્તાઓ માટે સ્પીચ-ટુ-ટેક્સ્ટ અને સ્પીચ."),
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      icon: Zap,
      title: getLocalizedText("OCR Screenshot Scanner", "स्क्रीनशॉट ओसीआर स्कैनर", "સ્ક્રીનશોટ OCR સ્કેનર"),
      desc: getLocalizedText("Extracts text from WhatsApp screenshots using Tesseract.js in Hindi, Gujarati & English.", "टेसेरैक्ट.जेएस का उपयोग करके व्हाट्सएप स्क्रीनशॉट से टेक्स्ट निकालता है।", "ટેસેરેક્ટ.js નો ઉપયોગ કરીને વોટ્સએપ સ્ક્રીનશોટમાંથી ટેક્સ્ટ મેળવે છે."),
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      icon: ShieldCheck,
      title: getLocalizedText("PWA & Community Alerts", "PWA और सामुदायिक अलर्ट", "PWA અને સમુદાય અલર્ટ"),
      desc: getLocalizedText("Progressive Web App with Web Push notifications and real-time Firestore scam tracking.", "वेब पुश नोटिफिकेशन और रियल-टाइम फायरस्टोर स्कैम ट्रैकिंग के साथ PWA।", "વેબ પુશ નોટિફિકેશન અને રિયલ-ટાઇમ ફાયરસ્ટોર સ્કેમ ટ્રેકિંગ સાથે PWA."),
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/20"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-left">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-6 md:p-10 rounded-3xl shadow-xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{getLocalizedText("Hackathon 2026 Innovation", "हैकाथॉन 2026 नवाचार", "હેકાથોન 2026 ઇનોવેશન")}</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          {t.aboutTitle || "About SuRakshaPay"}
        </h2>
        <p className="text-blue-200/90 text-sm md:text-base max-w-2xl leading-relaxed">
          {t.aboutSubtitle || "Protecting rural India from digital payment fraud through accessible, multilingual AI."}
        </p>
      </div>

      {/* Impact Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactStats.map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${stat.bg} transition-colors duration-300 space-y-1`}>
            <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{stat.label}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Grid: Mission & Approach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mission Statement */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {t.aboutHeading1}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t.aboutBody1}
            </p>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
            <span>🚨</span>
            <span>{getLocalizedText("The Digital Literacy Gap", "डिजिटल साक्षरता का अंतर", "ડિજિટલ સાક્ષરતા તફાવત")}</span>
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {t.aboutHeading2}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t.aboutBody2}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-2">
            <span>🛡️</span>
            <span>{getLocalizedText("Safety for Rural India", "ग्रामीण भारत के लिए सुरक्षा", "ગ્રામીણ ભારત માટે સુરક્ષા")}</span>
          </div>
        </div>

      </div>

      {/* Technology Pillars */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-500" />
          <span>{getLocalizedText("Core Technology Pillars", "मुख्य प्रौद्योगिकी स्तंभ", "મુખ્ય ટેકનોલોજી સ્તંભો")}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex gap-4 items-start transition-colors duration-300">
                <div className={`p-3 rounded-xl ${pillar.bg} ${pillar.color} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{pillar.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meet the Builders / Team Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xl">
              {getLocalizedText("Meet the Builders", "निर्माताओं से मिलें", "નિર્માતાઓને મળો")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {getLocalizedText("Engineered for Hackathon 2026", "हैकाथॉन 2026 के लिए निर्मित", "હેકાથોન 2026 માટે બનાવેલ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
              HP
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">Harshil Parmar</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{getLocalizedText("AI & Full-Stack Architect", "AI और फुल-स्टैक आर्किटेक्ट", "AI અને ફુલ-સ્ટોક આર્કિટેક્ટ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
              KT
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">Kush Thacker</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{getLocalizedText("Frontend & UI/UX Specialist", "फ्रंटएंड और UI/UX विशेषज्ञ", "ફ્રન્ટએન્ડ અને UI/UX નિષ્ણાત")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500 text-white rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              {getLocalizedText("National Cyber Crime Helpline", "राष्ट्रीय साइबर अपराध हेल्पलाइन", "રાષ્ટ્રીય સાયબર ક્રાઈમ હેલ્પલાઈન")}
            </p>
            <p className="text-slate-800 dark:text-slate-100 font-black text-lg">
              Dial 1930 (Toll-Free, 24/7)
            </p>
          </div>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          {getLocalizedText("Report Online →", "ऑनलाइन रिपोर्ट करें →", "ઓનલાઈન રિપોર્ટ કરો →")}
        </a>
      </div>

    </div>
  );
}

