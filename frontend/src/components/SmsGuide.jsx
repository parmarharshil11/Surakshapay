import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export default function SmsGuide({ language }) {
  const [expanded, setExpanded] = useState(false);

  const t = {
    en: {
      title: "Master Guide: How to Read SMS Sender IDs",
      subtitle: "Learn how to spot real vs fake messages instantly in India",
      sec1Title: "1. The Standard Format",
      sec1Text: "In India, official SMS sender IDs generally follow this format:",
      tblPart: "Part",
      tblMeaning: "Meaning",
      tblExample: "Example",
      opMeaning: "Telecom operator & circle (routing code). Tells you which network delivered it.",
      regMeaning: "Registered sender name (company or organization).",
      typeMeaning: "Type of message (Government, Service, Promotional).",
      sec2Title: "2. Meaning of the Last Letter",
      govTitle: "-G = Government",
      govDesc: "Messages from government departments.",
      govEx: "Ex: DOT, UIDAI, Election Commission.",
      srvTitle: "-S = Service",
      srvDesc: "Transaction alerts, OTPs, bank alerts, order updates.",
      srvEx: "Ex: BT-INDBNK-S (Indian Bank alert)",
      proTitle: "-P = Promotional",
      proDesc: "Advertisements, offers, discounts, loans.",
      proEx: "Ex: Shopping offers, sale alerts.",
      genTitle: "Genuine Bank SMS",
      gen1: "Sent from a registered ID (AX-ICICIB, BT-INDBNK)",
      gen2: "Mentions account number (partially hidden)",
      gen3: "Shows exact amount, date, time & reference",
      gen4: "NEVER asks for OTP, PIN, CVV, or Password",
      exLabel: "Example",
      genExText: "A/c **9035 debited Rs.40.00 on 13-Jul-26 via UPI. If not done by you, contact customer care.",
      scamTitle: "Scam SMS",
      scam1: "Says 'Your account will be blocked.'",
      scam2: "Asks you to click a suspicious link.",
      scam3: "Uses spelling mistakes or poor English.",
      scam4: "Comes from an unknown personal 10-digit mobile number.",
      scamExText: "Dear Customer, your bank account is blocked. Click abc-bank-update.xyz to verify immediately.",
      goldenLabel: "Golden Rule",
      goldenText: "A real bank will never ask you for your OTP, UPI PIN, ATM PIN, CVV, or password through SMS or a phone call."
    },
    hi: {
      title: "मास्टर गाइड: SMS सेंडर ID कैसे पढ़ें",
      subtitle: "भारत में असली और नकली मैसेज तुरंत पहचानना सीखें",
      sec1Title: "1. मानक प्रारूप (Standard Format)",
      sec1Text: "भारत में आधिकारिक SMS सेंडर ID आमतौर पर इस प्रारूप में होते हैं:",
      tblPart: "भाग (Part)",
      tblMeaning: "अर्थ (Meaning)",
      tblExample: "उदाहरण (Example)",
      opMeaning: "टेलीकॉम ऑपरेटर और सर्कल (रूटिंग कोड)। यह बताता है कि मैसेज किस नेटवर्क ने डिलीवर किया।",
      regMeaning: "पंजीकृत प्रेषक का नाम (कंपनी या संगठन)।",
      typeMeaning: "मैसेज का प्रकार (सरकारी, सेवा, प्रचारात्मक)।",
      sec2Title: "2. आखिरी अक्षर का अर्थ",
      govTitle: "-G = सरकारी (Government)",
      govDesc: "सरकारी विभागों के मैसेज।",
      govEx: "उदा: DOT, UIDAI, चुनाव आयोग।",
      srvTitle: "-S = सेवा (Service)",
      srvDesc: "लेनदेन अलर्ट, OTP, बैंक अलर्ट, ऑर्डर अपडेट।",
      srvEx: "उदा: BT-INDBNK-S (इंडियन बैंक अलर्ट)",
      proTitle: "-P = प्रचारात्मक (Promotional)",
      proDesc: "विज्ञापन, ऑफर, छूट, ऋण।",
      proEx: "उदा: शॉपिंग ऑफर, सेल अलर्ट।",
      genTitle: "असली बैंक SMS",
      gen1: "पंजीकृत ID से भेजा गया (AX-ICICIB, BT-INDBNK)",
      gen2: "खाता संख्या का उल्लेख (आंशिक रूप से छिपा हुआ)",
      gen3: "सटीक राशि, दिनांक, समय और संदर्भ दिखाता है",
      gen4: "OTP, PIN, CVV, या पासवर्ड कभी नहीं मांगता",
      exLabel: "उदाहरण",
      genExText: "A/c **9035 debited Rs.40.00 on 13-Jul-26 via UPI. If not done by you, contact customer care.",
      scamTitle: "फर्जी (Scam) SMS",
      scam1: "कहता है 'आपका खाता ब्लॉक कर दिया जाएगा।'",
      scam2: "किसी संदिग्ध लिंक पर क्लिक करने को कहता है।",
      scam3: "स्पेलिंग की गलतियाँ या खराब भाषा का उपयोग करता है।",
      scam4: "किसी अज्ञात 10-अंकीय मोबाइल नंबर से आता है।",
      scamExText: "Dear Customer, your bank account is blocked. Click abc-bank-update.xyz to verify immediately.",
      goldenLabel: "सुनहरा नियम (Golden Rule)",
      goldenText: "असली बैंक SMS या फोन कॉल के जरिए कभी भी आपसे आपका OTP, UPI PIN, ATM PIN, CVV या पासवर्ड नहीं मांगेगा।"
    },
    gu: {
      title: "માસ્ટર ગાઇડ: SMS સેન્ડર ID કેવી રીતે વાંચવા",
      subtitle: "ભારતમાં અસલી અને નકલી મેસેજ તરત જ ઓળખતા શીખો",
      sec1Title: "1. પ્રમાણભૂત ફોર્મેટ (Standard Format)",
      sec1Text: "ભારતમાં સત્તાવાર SMS સેન્ડર ID સામાન્ય રીતે આ ફોર્મેટમાં હોય છે:",
      tblPart: "ભાગ (Part)",
      tblMeaning: "અર્થ (Meaning)",
      tblExample: "ઉદાહરણ (Example)",
      opMeaning: "ટેલિકોમ ઓપરેટર અને સર્કલ (રૂટિંગ કોડ). મેસેજ કયા નેટવર્કે પહોંચાડ્યો તે જણાવે છે.",
      regMeaning: "નોંધાયેલ પ્રેષકનું નામ (કંપની અથવા સંસ્થા).",
      typeMeaning: "મેસેજનો પ્રકાર (સરકારી, સેવા, પ્રમોશનલ).",
      sec2Title: "2. છેલ્લા અક્ષરનો અર્થ",
      govTitle: "-G = સરકારી (Government)",
      govDesc: "સરકારી વિભાગોના મેસેજ.",
      govEx: "ઉદા: DOT, UIDAI, ચૂંટણી પંચ.",
      srvTitle: "-S = સેવા (Service)",
      srvDesc: "ટ્રાન્ઝેક્શન એલર્ટ, OTP, બેંક એલર્ટ, ઓર્ડર અપડેટ્સ.",
      srvEx: "ઉદા: BT-INDBNK-S (ઇન્ડિયન બેંક એલર્ટ)",
      proTitle: "-P = પ્રમોશનલ (Promotional)",
      proDesc: "જાહેરાતો, ઑફર્સ, ડિસ્કાઉન્ટ, લોન.",
      proEx: "ઉદા: શોપિંગ ઑફર્સ, સેલ એલર્ટ.",
      genTitle: "અસલી બેંક SMS",
      gen1: "નોંધાયેલ ID પરથી મોકલેલ (AX-ICICIB, BT-INDBNK)",
      gen2: "એકાઉન્ટ નંબરનો ઉલ્લેખ કરે છે (આંશિક રીતે છુપાયેલ)",
      gen3: "ચોક્કસ રકમ, તારીખ, સમય અને સંદર્ભ દર્શાવે છે",
      gen4: "OTP, PIN, CVV, અથવા પાસવર્ડ ક્યારેય માંગતી નથી",
      exLabel: "ઉદાહરણ",
      genExText: "A/c **9035 debited Rs.40.00 on 13-Jul-26 via UPI. If not done by you, contact customer care.",
      scamTitle: "નકલી (Scam) SMS",
      scam1: "કહે છે 'તમારું એકાઉન્ટ બ્લોક કરવામાં આવશે.'",
      scam2: "શંકાસ્પદ લિંક પર ક્લિક કરવાનું કહે છે.",
      scam3: "જોડણીની ભૂલો અથવા ખરાબ ભાષાનો ઉપયોગ કરે છે.",
      scam4: "અજાણ્યા 10-અંકના મોબાઈલ નંબર પરથી આવે છે.",
      scamExText: "Dear Customer, your bank account is blocked. Click abc-bank-update.xyz to verify immediately.",
      goldenLabel: "સુવર્ણ નિયમ (Golden Rule)",
      goldenText: "અસલી બેંક SMS અથવા ફોન કૉલ દ્વારા ક્યારેય પણ તમારી પાસેથી તમારો OTP, UPI PIN, ATM PIN, CVV અથવા પાસવર્ડ માંગશે નહીં."
    }
  };

  const l = t[language] || t['en'];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-950 border border-blue-800 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 text-left mb-8">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-800/50 rounded-2xl text-blue-300 border border-blue-700/50">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-xl md:text-2xl tracking-tight">
              {l.title}
            </h3>
            <p className="text-blue-200/80 text-sm mt-1">
              {l.subtitle}
            </p>
          </div>
        </div>
        <div className="bg-blue-800/50 p-2 rounded-full">
          {expanded ? (
            <ChevronUp className="w-6 h-6 text-blue-300" />
          ) : (
            <ChevronDown className="w-6 h-6 text-blue-300" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-8 md:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 animate-fade-in text-slate-800 dark:text-slate-200">
          
          <div className="pt-6 space-y-8">
            
            {/* The Format */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {l.sec1Title}
              </h4>
              <p className="text-sm md:text-base leading-relaxed">
                {l.sec1Text}
                <span className="inline-block mx-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                  XX-CompanyCode-X
                </span>
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">{l.tblPart}</th>
                      <th className="px-4 py-3 text-left font-bold">{l.tblMeaning}</th>
                      <th className="px-4 py-3 text-left font-bold">{l.tblExample}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">JG / BT / CP</td>
                      <td className="px-4 py-3 leading-relaxed">{l.opMeaning}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs">JG</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">DOTGUJ / INDBNK</td>
                      <td className="px-4 py-3 leading-relaxed">{l.regMeaning}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs">INDBNK</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">-G, -S, -P</td>
                      <td className="px-4 py-3 leading-relaxed">{l.typeMeaning}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs">-S</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Message Types */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {l.sec2Title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <span className="font-mono font-bold text-xl text-blue-600 dark:text-blue-400 block mb-2">{l.govTitle}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{l.govDesc}</p>
                  <p className="text-xs font-semibold text-slate-500">{l.govEx}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <span className="font-mono font-bold text-xl text-green-600 dark:text-green-400 block mb-2">{l.srvTitle}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{l.srvDesc}</p>
                  <p className="text-xs font-semibold text-slate-500">{l.srvEx}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <span className="font-mono font-bold text-xl text-amber-600 dark:text-amber-400 block mb-2">{l.proTitle}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{l.proDesc}</p>
                  <p className="text-xs font-semibold text-slate-500">{l.proEx}</p>
                </div>
              </div>
            </div>

            {/* Real vs Fake */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              
              {/* Genuine */}
              <div className="bg-green-50/50 dark:bg-green-950/10 p-5 md:p-6 rounded-3xl border border-green-200 dark:border-green-900/40 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-lg text-green-800 dark:text-green-400">{l.genTitle}</h4>
                </div>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> {l.gen1}</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> {l.gen2}</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> {l.gen3}</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> {l.gen4}</li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-slate-900 border border-green-100 dark:border-green-900/30 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{l.exLabel}</span>
                  <p className="text-sm font-medium">{l.genExText}</p>
                </div>
              </div>

              {/* Scam */}
              <div className="bg-red-50/50 dark:bg-red-950/10 p-5 md:p-6 rounded-3xl border border-red-200 dark:border-red-900/40 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h4 className="font-bold text-lg text-red-800 dark:text-red-400">{l.scamTitle}</h4>
                </div>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> {l.scam1}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> {l.scam2}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> {l.scam3}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> {l.scam4}</li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{l.exLabel}</span>
                  <p className="text-sm font-medium">{l.scamExText}</p>
                </div>
              </div>

            </div>

            {/* Golden Rule */}
            <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-center shadow-md border border-slate-800">
              <span className="text-amber-400 font-black tracking-widest uppercase text-xs mb-2 block">{l.goldenLabel}</span>
              <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
                {l.goldenText}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
