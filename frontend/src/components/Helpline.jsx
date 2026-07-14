import React, { useState } from 'react';
import { PhoneCall, Globe, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';

export default function Helpline({ t, language, onScanComplete }) {
  const [scammerDetails, setScammerDetails] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scammerDetails.trim() || !description.trim()) return;

    setLoading(true);
    setSuccess(false);
    setSubmitError('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: "reported_scam",
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: National Helpline Information */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Cybercrime Helpline Card */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full text-white">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-200">
                  {t.helpCardTitle}
                </h4>
                <a
                  href="tel:1930"
                  className="text-2xl sm:text-3xl font-black hover:underline cursor-pointer block mt-0.5"
                >
                  {t.helpCardPhone}
                </a>
              </div>
            </div>
            <p className="text-sm font-light text-red-100 leading-relaxed">
              {t.helpCardInstruction}
            </p>
          </div>

          {/* Web portal Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {t.helpFilingTitle}
              </h3>
            </div>
            
            <div className="space-y-3.5 pt-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.helpStep1}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.helpStep2}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.helpStep3}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Demo reporting form */}
        <div className="md:col-span-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full">
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
                    {language === 'hi' ? 'सफलतापूर्वक रिपोर्ट किया गया (डेमो)' : language === 'gu' ? 'રિપોર્ટ સફળતાપૂર્વક મોકલ્યો (ડેમો)' : 'Reported Successfully (Demo)'}
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

            <div className="space-y-4">
              {/* Target caller details */}
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
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100 text-sm font-semibold"
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
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading || !scammerDetails.trim() || !description.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {language === 'hi' ? 'लोड हो रहा है...' : language === 'gu' ? 'લોડ થઈ રહ્યું છે...' : 'Loading...'}
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
    </div>
  );
}
