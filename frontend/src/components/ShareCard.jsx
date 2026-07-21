import React, { useState, useEffect } from 'react';
import { Share2, Download, ExternalLink, ChevronDown, Loader2 } from 'lucide-react';

export default function ShareCard({ classification, type, text, explanation, language, t, score }) {
  // Allow user to choose report language independently of app language
  const [reportLang, setReportLang] = useState(language || 'en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedExplanation, setTranslatedExplanation] = useState(explanation);

  useEffect(() => {
    if (reportLang === language || reportLang === 'en') {
      setTranslatedExplanation(explanation);
      return;
    }
    const fetchTranslation = async () => {
      setIsTranslating(true);
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
      try {
        const res = await fetch(`${baseUrl}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: explanation, targetLang: reportLang })
        });
        if (res.ok) {
          const data = await res.json();
          setTranslatedExplanation(data.translatedText || explanation);
        }
      } catch (err) {
        console.error('Translation error:', err);
        setTranslatedExplanation(explanation);
      } finally {
        setIsTranslating(false);
      }
    };
    fetchTranslation();
  }, [reportLang, explanation, language]);

  // Descriptive risk label based on score
  const getRiskLabel = (score, lang) => {
    const pct = score || 0;
    if (lang === 'hi') {
      if (pct >= 75) return `उच्च जोखिम (${pct}%)`;
      if (pct >= 40) return `मध्यम जोखिम (${pct}%)`;
      return `कम जोखिम (${pct}%)`;
    }
    if (lang === 'gu') {
      if (pct >= 75) return `ઉચ્ચ જોખમ (${pct}%)`;
      if (pct >= 40) return `મધ્યમ જોખમ (${pct}%)`;
      return `ઓછું જોખમ (${pct}%)`;
    }
    if (pct >= 75) return `High Risk (${pct}%)`;
    if (pct >= 40) return `Moderate Risk (${pct}%)`;
    return `Low Risk (${pct}%)`;
  };

  const getLocalizedText = (en, hi, gu) => {
    if (reportLang === 'hi') return hi;
    if (reportLang === 'gu') return gu;
    return en;
  };

  const handleDownloadImage = () => {
    if (isTranslating) return; // Wait for translation to finish


    const canvas = document.createElement('canvas');
    canvas.width = 620;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 460);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 620, 460);

    // Color border based on classification
    const accentColor = classification === 'Scam' ? '#ef4444' : '#fbbf24';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(4, 4, 612, 452, 12);
    ctx.stroke();

    // Accent top bar
    ctx.fillStyle = accentColor + '33';
    ctx.fillRect(4, 4, 612, 54);

    // Header branding
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('\uD83D\uDEE1\uFE0F SuRakshaPay', 30, 38);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText(
      getLocalizedText(
        "Rural India's Financial Safety Assistant",
        'भारत का ग्रामीण वित्तीय सुरक्षा सहायक',
        'ભારતનો ગ્રામ્ય નાણાકીય સુરક્ષા સહાયક'
      ),
      220, 38
    );

    // Divider
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 68);
    ctx.lineTo(590, 68);
    ctx.stroke();

    // Classification badge
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 20px sans-serif';
    const classLabel = getLocalizedText(
      `\uD83D\uDEA8 ${classification === 'Scam' ? 'SCAM DETECTED' : 'SUSPICIOUS MESSAGE'}`,
      `\uD83D\uDEA8 ${classification === 'Scam' ? 'धोखाधड़ी पकड़ी गई' : 'संदिग्ध संदेश'}`,
      `\uD83D\uDEA8 ${classification === 'Scam' ? 'છેતરપિંડી પકડાઈ' : 'શંકાસ્પદ સંદેશ'}`
    );
    ctx.fillText(classLabel, 30, 105);

    // Risk label with percentage
    if (score !== undefined) {
      const riskLbl = getRiskLabel(score, reportLang);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`\u26A0\uFE0F ${getLocalizedText('Risk Level', 'जोखिम स्तर', 'જોખમ સ્તર')}: ${riskLbl}`, 30, 132);
    }

    // Category
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${getLocalizedText('Type', 'प्रकार', 'પ્રકાર')}: ${type}`, 30, 160);

    // Divider
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 175);
    ctx.lineTo(590, 175);
    ctx.stroke();

    // Analysis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(getLocalizedText('Why was this flagged?', 'यह क्यों खतरनाक है?', 'આ શા માટે ખતરનાક છે?'), 30, 200);

    // Explanation text wrapping
    const wrapText = (txt, x, y, maxWidth, lineHeight, maxLines = 6) => {
      const words = txt.split(' ');
      let line = '';
      let lineCount = 0;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
          lineCount++;
          if (lineCount >= maxLines) {
            ctx.fillText(line + '...', x, y);
            return;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    };

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px sans-serif';
    wrapText(translatedExplanation, 30, 225, 560, 22);

    // Footer divider
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 385);
    ctx.lineTo(590, 385);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#475569';
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText(
      getLocalizedText(
        'Dial 1930 immediately to report financial cybercrime.',
        '1930 पर तुरंत कॉल करके साइबर अपराध की रिपोर्ट करें।',
        'સાઈબર અપરાધ નોંધવા 1930 પર તરત કોલ કરો.'
      ), 30, 410
    );
    ctx.fillText(
      getLocalizedText(
        'Verify suspicious messages & UPI handles at SuRakshaPay.',
        'संदिग्ध संदेश और UPI की जांच SuRakshaPay पर करें।',
        'સંદિગ્ધ સંદેશ અને UPI ની ચકાસણી SuRakshaPay પર કરો.'
      ), 30, 430
    );

    // Language watermark
    ctx.fillStyle = '#334155';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Report language: ${reportLang === 'hi' ? 'हिंदी' : reportLang === 'gu' ? 'ગુજરાતી' : 'English'}`, 480, 450);

    const link = document.createElement('a');
    link.download = 'suraksha_safety_alert.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareWhatsApp = () => {
    if (isTranslating) return;

    const alertHeader = classification === 'Scam'
      ? getLocalizedText('🚨 *SCAM ALERT by SuRakshaPay* 🚨', '🚨 *सुरक्षापे स्कैम चेतावनी* 🚨', '🚨 *સુરક્ષાપે કૌભાંડ ચેતવણી* 🚨')
      : getLocalizedText('⚠️ *SUSPICIOUS MESSAGE ALERT* ⚠️', '⚠️ *संदिग्ध संदेश चेतावनी* ⚠️', '⚠️ *શંકાસ્પદ સંદેશ ચેતવણી* ⚠️');

    const riskInfo = score !== undefined ? `\n*${getLocalizedText('Risk Level', 'जोखिम स्तर', 'જોખમ સ્તર')}:* ${getRiskLabel(score, reportLang)}` : '';

    const body = reportLang === 'hi'
      ? `सावधान! SuRakshaPay ने इस संदेश में खतरा पाया है:${riskInfo}\n\n*विवरण:* "${text.slice(0, 100)}..." \n\n*विश्लेषण:* ${translatedExplanation}\n\n📞 धोखाधड़ी हुई हो तो तुरंत *1930* पर कॉल करें।`
      : reportLang === 'gu'
      ? `સાવધ! SuRakshaPay એ આ સંદેશમાં જોખમ શોધ્યું:${riskInfo}\n\n*વિગત:* "${text.slice(0, 100)}..." \n\n*વિશ્લેષણ:* ${translatedExplanation}\n\n📞 છેતરપિંડી થઈ હોય તો *1930* પર તરત કોલ કરો.`
      : `Warning! SuRakshaPay detected a financial scam threat:${riskInfo}\n\n*Details:* "${text.slice(0, 100)}..." \n\n*Analysis:* ${translatedExplanation}\n\n📞 Call *1930* immediately if you fell for a digital payment scam.`;

    const encodedText = encodeURIComponent(`${alertHeader}\n\n${body}`);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-xs uppercase tracking-wider">
          <Share2 className="w-4 h-4 text-blue-500" />
          <span>
            {language === 'hi' ? 'सुरक्षा चेतावनी साझा करें' : language === 'gu' ? 'સુરક્ષા ચેતવણી શેર કરો' : 'Share Safety Warning'}
          </span>
        </div>
      </div>

      {/* Language selector for report */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          {language === 'hi' ? 'रिपोर्ट भाषा चुनें' : language === 'gu' ? 'રિપોર્ટ ભાષા પસંદ કરો' : 'Report Language'}
        </label>
        <div className="relative">
          <select
            value={reportLang}
            onChange={(e) => setReportLang(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 हिंदी (Hindi)</option>
            <option value="gu">🇮🇳 ગુજરાતી (Gujarati)</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Risk label preview */}
      {score !== undefined && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border ${
          classification === 'Scam'
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-300'
        }`}>
          <span>⚠️</span>
          <span>{getRiskLabel(score, reportLang)}</span>
        </div>
      )}

      <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
        {language === 'hi' ? 'इस संदेश के खतरे के बारे में परिवार और दोस्तों को व्हाट्सएप पर सचेत करें या चेतावनी कार्ड डाउनलोड करें।' :
         language === 'gu' ? 'આ જોખમ વિશે પરિવાર અને મિત્રોને વૉટ્સએપ પર સાવચેત કરો અથવા ઈમેજ ડાઉનલોડ કરો.' :
         'Alert your family and friends about this threat on WhatsApp or download the warning card.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1.5">
        <button
          onClick={handleDownloadImage}
          disabled={isTranslating}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isTranslating ? (language === 'hi' ? 'अनुवाद कर रहे...' : language === 'gu' ? 'અનુવાદ થઈ રહ્યું...' : 'Translating...') : (language === 'hi' ? 'कार्ड डाउनलोड' : language === 'gu' ? 'કાર્ડ ડાઉનલોડ' : 'Download Card')}</span>
        </button>
        <button
          onClick={handleShareWhatsApp}
          disabled={isTranslating}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
          <span>{isTranslating ? (language === 'hi' ? 'अनुवाद कर रहे...' : language === 'gu' ? 'અનુવાદ થઈ રહ્યું...' : 'Translating...') : (language === 'hi' ? 'व्हाट्सएप शेयर' : language === 'gu' ? 'વૉટ્સએપ શેર' : 'Share to WhatsApp')}</span>
        </button>
      </div>
    </div>
  );
}
