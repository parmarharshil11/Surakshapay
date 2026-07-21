import React, { useState, useEffect } from 'react';
import { PhoneCall, Globe, CheckCircle2, ShieldAlert, FileText, ExternalLink, Clock, Building2, Smartphone } from 'lucide-react';

export default function Helpline({ t, language, onScanComplete }) {
  const [scammerDetails, setScammerDetails] = useState('');
  const [description, setDescription] = useState('');
  const [scamCategory, setScamCategory] = useState('message');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const getLocalizedText = (en, hi, gu) => {
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scammerDetails.trim() || !description.trim()) return;

    setLoading(true);
    setSuccess(false);
    setSubmitError('');

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    try {
      const response = await fetch(`${baseUrl}/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: "reported_scam",
          category: scamCategory,
          scammerDetails,
          description,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setScammerDetails('');
        setDescription('');
        
        if (data.isAuthentic && data.summary && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification(language === 'hi' ? "नया स्कैम अलर्ट!" : language === 'gu' ? "નવું સ્કેમ એલર્ટ!" : "New Scam Alert!", {
              body: data.summary,
              icon: "/icons/icon-192x192.png",
              badge: "/icons/icon-192x192.png"
            });
          }
        }
        
        if (onScanComplete) {
          onScanComplete();
        }
      }
    } catch (error) {
      console.error("Error reporting scam:", error);
      setSubmitError(
        language === 'hi' 
          ? 'रिपोर्ट भेजने में विफलता। पुनः प्रयास करें।' 
          : language === 'gu' 
          ? 'રિપોર્ટ મોકલવામાં નિષ્ફળતા. ફરી પ્રયાસ કરો.' 
          : 'Failed to submit report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const emergencyContacts = [
    {
      title: getLocalizedText("National Cyber Crime Helpline", "राष्ट्रीय साइबर अपराध हेल्पलाइन", "રાષ્ટ્રીય સાયબર ક્રાઈમ હેલ્પલાઈન"),
      number: "1930",
      desc: getLocalizedText("24/7 Toll-Free Helpline for Instant Financial Fraud Response", "त्वरित वित्तीय धोखाधड़ी प्रतिक्रिया के लिए 24/7 टोल-फ्री हेल्पलाइन", "તાત્કાલિક નાણાકીય છેતરપિંડી પ્રતિસાદ માટે 24/7 ટોલ-ફ્રી હેલ્પલાઈન"),
      actionLabel: getLocalizedText("Call 1930 Now", "1930 पर तुरंत कॉल करें", "1930 પર હમણાં કોલ કરો"),
      actionUrl: "tel:1930",
      bg: "bg-gradient-to-br from-red-600 to-red-800 text-white",
      highlight: true
    },
    {
      title: getLocalizedText("National Cyber Crime Portal", "राष्ट्रीय साइबर अपराध पोर्टल", "રાષ્ટ્રીય સાયબર ક્રાઈમ પોર્ટલ"),
      number: "cybercrime.gov.in",
      desc: getLocalizedText("Official Government Portal to File Formal Complaints & Upload Evidence", "औपचारिक शिकायत दर्ज करने और साक्ष्य अपलोड करने का आधिकारिक पोर्टल", "સત્તાવાર સરકારી પોર્ટલ ફરિયાદ નોંધાવવા અને પુરાવા અપલોડ કરવા"),
      actionLabel: getLocalizedText("Report Online →", "ऑनलाइन रिपोर्ट करें →", "ઓનલાઈન રિપોર્ટ કરો →"),
      actionUrl: "https://cybercrime.gov.in",
      bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100",
      highlight: false
    },
    {
      title: getLocalizedText("Sanchar Saathi (TRAI)", "संचार साथी पोर्टल (TRAI)", "સંચાર સાથી પોર્ટલ (TRAI)"),
      number: "sancharsaathi.gov.in",
      desc: getLocalizedText("Block Lost/Stolen Mobile Phones & Report Fake SIM Connections", "खोया मोबाइल ब्लॉक करें और फर्जी सिम कनेक्शन की रिपोर्ट करें", "ખોવાયેલ મોબાઈલ બ્લોક કરો અને નકલી સિમ કનેક્શનની ફરિયાદ કરો"),
      actionLabel: getLocalizedText("Visit Sanchar Saathi →", "संचार साथी पर जाएं →", "સંચાર સાથી પર જાઓ →"),
      actionUrl: "https://sancharsaathi.gov.in",
      bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100",
      highlight: false
    },
    {
      title: getLocalizedText("RBI Banking Helpline", "आरबीआई बैंकिंग हेल्पलाइन", "આરબીઆઈ બેંકિંગ હેલ્પલાઈન"),
      number: "14440",
      desc: getLocalizedText("Reserve Bank Helpline for Banking Ombudsman & UPI Payment Disputes", "बैंकिंग लोकपाल और यूपीआई भुगतान विवादों के लिए आरबीआई हेल्पलाइन", "બેંકિંગ લોકપાલ અને UPI ચુકવણી વિવાદો માટે RBI હેલ્પલાઈન"),
      actionLabel: getLocalizedText("Call 14440", "14440 पर कॉल करें", "14440 પર કોલ કરો"),
      actionUrl: "tel:14440",
      bg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100",
      highlight: false
    }
  ];

  const goldenHourSteps = [
    getLocalizedText("Call 1930 within the first 1 hour of any unauthorized bank transaction.", "किसी भी अनधिकृत बैंक लेनदेन के पहले 1 घंटे के भीतर 1930 पर कॉल करें।", "કોઈપણ અનધિકૃત બેંક વ્યવહારના પહેલા 1 કલાકની અંદર 1930 પર કોલ કરો."),
    getLocalizedText("Inform your bank branch immediately to temporarily freeze your UPI/debit card.", "अपने यूपीआई/डेबिट कार्ड को अस्थायी रूप से फ्रीज करने के लिए तुरंत अपने बैंक को सूचित करें।", "તમારા UPI/ડેબિટ કાર્ડને અસ્થાયી રૂપે ફ્રીઝ કરવા માટે તરત તમારી બેંકને જાણ કરો."),
    getLocalizedText("Take screenshot of SMS, payment receipt, and note down scammer's UPI ID / phone number.", "एसएमएस, भुगतान रसीद का स्क्रीनशॉट लें और ठग की यूपीआई आईडी/फोन नंबर नोट करें।", "એસએમએસ, ચુકવણી રસીદનો સ્ક્રીનશોટ લો અને ઠગનો UPI ID / ફોન નંબર નોંધી લો."),
    getLocalizedText("Lodge a formal cybercrime complaint at cybercrime.gov.in with transaction details.", "लेनदेन विवरण के साथ cybercrime.gov.in पर औपचारिक साइबर अपराध शिकायत दर्ज करें।", "વ્યવહારની વિગતો સાથે cybercrime.gov.in પર ઔપચારિક સાયબર ગુનાની ફરિયાદ નોંધાવો.")
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.helpTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.helpSubtitle}
        </p>
      </div>

      {/* Emergency Contacts Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {emergencyContacts.map((contact, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-colors duration-300 ${contact.bg}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${contact.highlight ? 'text-red-200' : 'text-slate-400'}`}>
                  {contact.title}
                </span>
                {contact.highlight && (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                )}
              </div>
              <p className="text-2xl font-black tracking-tight">{contact.number}</p>
              <p className={`text-xs leading-relaxed ${contact.highlight ? 'text-red-100 font-light' : 'text-slate-500 dark:text-slate-400'}`}>
                {contact.desc}
              </p>
            </div>

            <a
              href={contact.actionUrl}
              target={contact.actionUrl.startsWith('http') ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                contact.highlight
                  ? 'bg-white text-red-700 hover:bg-red-50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <span>{contact.actionLabel}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Golden Hour Action Plan */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-6 rounded-2xl space-y-4 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base md:text-lg">
              {getLocalizedText("The 'Golden Hour' Action Checklist", "'गोल्डन आवर' एक्शन चेकलिस्ट", "'ગોલ્ડન અવર' એક્શન ચેકલિસ્ટ")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {getLocalizedText("Follow these 4 steps immediately if you suspect a financial scam", "यदि वित्तीय धोखाधड़ी का संदेह हो तो तुरंत इन 4 चरणों का पालन करें", "જો નાણાકીય છેતરપિંડીની શંકા હોય તો તરત જ આ 4 પગલાં અનુસરો")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {goldenHourSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Reporting Form Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-5 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
              {t.helpReportTitle}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
              {t.helpReportSubtitle}
            </p>
          </div>
        </div>

        {success && (
          <div className="flex items-start gap-2.5 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 text-green-800 dark:text-green-300 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold">
                {getLocalizedText('Report Submitted Successfully', 'रिपोर्ट सफलतापूर्वक दर्ज की गई', 'રિપોર્ટ સફળતાપૂર્વક મોકલ્યો')}
              </p>
              <p className="text-green-700/90 dark:text-green-400/90 mt-0.5">{t.reportSuccess}</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in">
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
              {getLocalizedText("Scam Threat Category", "स्कैम श्रेणी", "સ્કેમ શ્રેણી")}
            </label>
            <select
              value={scamCategory}
              onChange={(e) => setScamCategory(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="message">💬 SMS / WhatsApp Fraud</option>
              <option value="upi">💳 UPI Collect / QR Fraud</option>
              <option value="digital_arrest">👮 Digital Arrest & Police Video Call</option>
              <option value="jobs_loans">💼 Fake WFH Job / Loan App</option>
              <option value="other">🚨 Other Cyber Fraud</option>
            </select>
          </div>

          {/* Scammer Details */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
              {t.helpReportLabelDetails}
            </label>
            <input
              type="text"
              required
              value={scammerDetails}
              onChange={(e) => setScammerDetails(e.target.value)}
              placeholder={t.helpReportPlaceholderDetails}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-sm font-semibold"
            />
          </div>

          {/* Story/Details */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
              {t.helpReportLabelDesc}
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.helpReportPlaceholderDesc}
              rows={4}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !scammerDetails.trim() || !description.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {getLocalizedText('Submitting...', 'भेजा जा रहा है...', 'મોકલી રહ્યું છે...')}
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  {t.btnSubmitReport}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

