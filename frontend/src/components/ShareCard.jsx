import React from 'react';
import { Share2, Download, ExternalLink } from 'lucide-react';

export default function ShareCard({ classification, type, text, explanation, language, t }) {
  
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, 600, 420);

    // Visual border based on classification
    ctx.strokeStyle = classification === 'Scam' ? '#ef4444' : '#fbbf24';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 590, 410);

    // Header branding
    ctx.fillStyle = '#10b981'; // Safety Green
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('🛡️ SuRakshaPay Safety Alert', 40, 50);

    // Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText("Rural India's Financial Safety Assistant", 40, 75);

    // Divider line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 90);
    ctx.lineTo(560, 90);
    ctx.stroke();

    // Alert Details Section
    ctx.fillStyle = classification === 'Scam' ? '#f87171' : '#fcd34d';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`🚨 Warning: ${classification.toUpperCase()}`, 40, 125);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Category: ${type}`, 40, 155);

    // Warning Explanation wrapping helper
    const wrapText = (txt, x, y, maxWidth, lineHeight) => {
      const words = txt.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    };

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Why was this flagged?', 40, 195);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px sans-serif';
    wrapText(explanation, 40, 220, 520, 22);

    // Footer message
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText('Dial 1930 immediately to report financial cyber crime to the government.', 40, 360);
    ctx.fillText('Verify suspicious texts and UPI handles at SuRakshaPay.', 40, 380);

    // Trigger download
    const link = document.createElement('a');
    link.download = 'suraksha_safety_alert.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareWhatsApp = () => {
    const alertHeader = classification === 'Scam' ? "🚨 *SCAM ALERT by SuRakshaPay* 🚨" : "⚠️ *SUSPICIOUS MESSAGE ALERT* ⚠️";
    const body = language === 'hi'
      ? `सावधान! सुरक्षापे (SuRakshaPay) ने इस संदेश में खतरा पाया है:\n\n*विवरण:* "${text.slice(0, 100)}..." \n\n*विश्लेषण:* ${explanation}\n\n📞 अगर आपके साथ धोखाधड़ी हुई है, तो तुरंत *1930* पर कॉल करें।`
      : language === 'gu'
      ? `સાવધ રહો! સુરક્ષાપે (SuRakshaPay) એ આ લખાણમાં જોખમ પકડ્યું છે:\n\n*વિગત:* "${text.slice(0, 100)}..." \n\n*વિશ્લેષણ:* ${explanation}\n\n📞 જો તમારી સાથે છેતરપિંડી થઈ હોય, તો તરત જ *1930* પર કોલ કરો.`
      : `Warning! SuRakshaPay detected a financial scam threat:\n\n*Details:* "${text.slice(0, 100)}..." \n\n*Analysis:* ${explanation}\n\n📞 Call *1930* immediately if you fell for a digital payment scam.`;

    const encodedText = encodeURIComponent(`${alertHeader}\n\n${body}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 transition-colors duration-300">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-xs uppercase tracking-wider">
        <Share2 className="w-4 h-4 text-blue-500" />
        <span>
          {language === 'hi' ? 'सुरक्षा चेतावनी साझा करें' : language === 'gu' ? 'સુરક્ષા ચેતવણી શેર કરો' : 'Share Safety Warning'}
        </span>
      </div>
      
      <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">
        {language === 'hi' ? 'इस संदेश के खतरे के बारे में अपने परिवार और दोस्तों को व्हाट्सएप पर सचेत करें या चेतावनी छवि डाउनलोड करें।' : 
         language === 'gu' ? 'આ જોખમ વિશે તમારા પરિવાર અને મિત્રોને વોટ્સએપ પર સાવચેત કરો અથવા ઈમેજ ડાઉનલોડ કરો.' : 
         'Alert your family and friends about this specific threat on WhatsApp or download the warning card.'}
      </p>

      <div className="grid grid-cols-2 gap-3 pt-1.5">
        <button
          onClick={handleDownloadImage}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'कार्ड डाउनलोड करें' : language === 'gu' ? 'કાર્ડ ડાઉનલોડ કરો' : 'Download Card'}</span>
        </button>
        <button
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'व्हाट्सएप साझा' : language === 'gu' ? 'વોટ્સએપ શેર' : 'Share to WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
}
