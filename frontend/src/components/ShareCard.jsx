import React, { useState } from 'react';
import { Share2, Download, ExternalLink, Copy, Check } from 'lucide-react';

export default function ShareCard({ classification, type, text, explanation, language, t, score }) {
  const [copied, setCopied] = useState(false);

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
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  const getAlertBodyText = () => {
    const alertHeader = classification === 'Scam'
      ? getLocalizedText('🚨 *SCAM ALERT by DeTexSO* 🚨', '🚨 *DeTexSO स्कैम चेतावनी* 🚨', '🚨 *DeTexSO કૌભાંડ ચેતવણી* 🚨')
      : getLocalizedText('⚠️ *SUSPICIOUS MESSAGE ALERT* ⚠️', '⚠️ *संदिग्ध संदेश चेतावनी* ⚠️', '⚠️ *શંકાસ્પદ સંદેશ ચેતવણી* ⚠️');

    const riskInfo = score !== undefined ? `\n*${getLocalizedText('Risk Level', 'जोखिम स्तर', 'જોખમ સ્તર')}:* ${getRiskLabel(score, language)}` : '';

    const body = language === 'hi'
      ? `सावधान! DeTexSO ने इस संदेश में खतरा पाया है:${riskInfo}\n\n*विवरण:* "${text.slice(0, 100)}..." \n\n*विश्लेषण:* ${explanation}\n\n📞 धोखाधड़ी हुई हो तो तुरंत *1930* पर कॉल करें।`
      : language === 'gu'
      ? `સાવધ! DeTexSO એ આ સંદેશમાં જોખમ શોધ્યું:${riskInfo}\n\n*વિગત:* "${text.slice(0, 100)}..." \n\n*વિશ્લેષણ:* ${explanation}\n\n📞 છેતરપિંડી થઈ હોય તો *1930* પર તરત કોલ કરો.`
      : `Warning! DeTexSO detected a financial scam threat:${riskInfo}\n\n*Details:* "${text.slice(0, 100)}..." \n\n*Analysis:* ${explanation}\n\n📞 Call *1930* immediately if you fell for a digital payment scam.`;

    return `${alertHeader}\n\n${body}`;
  };

  const handleCopyAlert = () => {
    const fullText = getAlertBodyText();
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  };

  const handleDownloadImage = () => {
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
    ctx.fillText('\uD83D\uDEE1\uFE0F DeTexSO', 30, 38);

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
      const riskLbl = getRiskLabel(score, language);
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
    wrapText(explanation, 30, 225, 560, 22);

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
        'Verify suspicious messages & UPI handles at DeTexSO.',
        'संदिग्ध संदेश और UPI की जांच DeTexSO पर करें।',
        'સંદિગ્ધ સંદેશ અને UPI ની ચકાસણી DeTexSO પર કરો.'
      ), 30, 430
    );

    // Language watermark
    ctx.fillStyle = '#334155';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Report language: ${language === 'hi' ? 'हिंदी' : language === 'gu' ? 'ગુજરાતી' : 'English'}`, 480, 450);

    const link = document.createElement('a');
    link.download = 'detexso_safety_alert.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareWhatsApp = () => {
    const fullText = getAlertBodyText();
    const encodedText = encodeURIComponent(fullText);
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

      {/* Risk label preview */}
      {score !== undefined && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border ${
          classification === 'Scam'
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-300'
        }`}>
          <span>⚠️</span>
          <span>{getRiskLabel(score, language)}</span>
        </div>
      )}

      <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
        {language === 'hi' ? 'इस संदेश के खतरे के बारे में परिवार और दोस्तों को व्हाट्सएप पर सचेत करें या चेतावनी कार्ड डाउनलोड करें।' :
         language === 'gu' ? 'આ જોખમ વિશે પરિવાર અને મિત્રોને વૉટ્સએપ પર સાવચેત કરો અથવા ઈમેજ ડાઉનલોડ કરો.' :
         'Alert your family and friends about this threat on WhatsApp or download the warning card.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5">
        <button
          onClick={handleCopyAlert}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
            copied
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'hi' ? 'कॉपी हो गया!' : language === 'gu' ? 'કોપી થઈ ગયું!' : 'Copied!') : (language === 'hi' ? 'पाठ कॉपी करें' : language === 'gu' ? 'ટેક્સ્ટ કોપી કરો' : 'Copy Text')}</span>
        </button>

        <button
          onClick={handleDownloadImage}
          className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'कार्ड डाउनलोड' : language === 'gu' ? 'કાર્ડ ડાઉનલોડ' : 'Download Card'}</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'व्हाट्सएप शेयर' : language === 'gu' ? 'વૉટ્સએપ શેર' : 'Share to WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
}
