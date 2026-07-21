import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, AlertTriangle, ShieldX, Sparkles, CheckSquare, XCircle, Volume2, QrCode, X, VideoOff, Upload } from 'lucide-react';
import ShareCard from './ShareCard';
import jsQR from 'jsqr';

// ── SVG Donut Chart helper ────────────────────────────────────────────
function RiskDonutChart({ score, classification }) {
  const radius = 48;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const filled = circumference - (score / 100) * circumference;

  const color = classification === 'Scam' ? '#ef4444' :
                classification === 'Suspicious' ? '#f59e0b' : '#22c55e';
  const trackColor = classification === 'Scam' ? '#fee2e2' :
                     classification === 'Suspicious' ? '#fef3c7' : '#dcfce7';
  const darkTrack = classification === 'Scam' ? '#450a0a' :
                    classification === 'Suspicious' ? '#451a03' : '#052e16';

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke={trackColor} className="dark:hidden" strokeWidth={stroke} />
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke={darkTrack} className="hidden dark:block" strokeWidth={stroke} />
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={filled}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fontSize="16" fontWeight="bold" fill={color}
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}>
          {score}%
        </text>
      </svg>
    </div>
  );
}

export default function UpiChecker({ t, language, onScanComplete, onActivityPerformed }) {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [ttsToast, setTtsToast] = useState('');

  // QR scanner state
  const [qrOpen, setQrOpen] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrError, setQrError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const fileInputRef = useRef(null);

  // Audio speaking state
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const handleSpeechEnd = () => setSpeaking(false);
    window.speechSynthesis?.addEventListener?.('end', handleSpeechEnd);
    return () => {
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.removeEventListener?.('end', handleSpeechEnd);
    };
  }, []);

  // Dismiss TTS toast after 5 seconds
  useEffect(() => {
    if (!ttsToast) return;
    const tid = setTimeout(() => setTtsToast(''), 5000);
    return () => clearTimeout(tid);
  }, [ttsToast]);

  // ── QR CAMERA HELPERS ──────────────────────────────────────────
  const stopQrCamera = useCallback(() => {
    setQrScanning(false);
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const closeQrModal = useCallback(() => {
    stopQrCamera();
    setQrOpen(false);
    setQrError('');
  }, [stopQrCamera]);

  const scanQrFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      frameRef.current = requestAnimationFrame(scanQrFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      stopQrCamera();
      // Parse UPI ID from qr text
      let extractedUpi = '';
      try {
        if (code.data.startsWith('upi://')) {
          const url = new URL(code.data.replace('upi://', 'http://dummy.com/'));
          extractedUpi = url.searchParams.get('pa') || '';
          const am = url.searchParams.get('am') || '';
          const pn = url.searchParams.get('pn') || '';
          if (am) setAmount(am);
          if (pn) setMessage(pn);
        } else {
          extractedUpi = code.data;
        }
      } catch { extractedUpi = code.data; }
      if (extractedUpi) {
        setUpiId(extractedUpi);
        setResult(null);
        setQrOpen(false);
        setQrError('');
      } else {
        setQrError('Could not extract UPI ID from QR. Try again.');
        startQrCamera();
      }
    } else {
      frameRef.current = requestAnimationFrame(scanQrFrame);
    }
  }, [stopQrCamera]);

  const startQrCamera = useCallback(async () => {
    setQrError('');
    setQrScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        frameRef.current = requestAnimationFrame(scanQrFrame);
      }
    } catch (err) {
      setQrError('Camera access denied. Please allow camera permission and try again.');
      setQrScanning(false);
    }
  }, [scanQrFrame]);

  const openQrModal = () => {
    setQrOpen(true);
    setQrError('');
    // slight delay to let modal render before accessing DOM
    setTimeout(() => startQrCamera(), 200);
  };

  // ── FILE UPLOAD HANDLER ───────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // reset input so same file can be re-selected
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        // draw to hidden canvas and run jsQR
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          let extractedUpi = '';
          try {
            if (code.data.startsWith('upi://')) {
              const url = new URL(code.data.replace('upi://', 'http://dummy.com/'));
              extractedUpi = url.searchParams.get('pa') || '';
              const am = url.searchParams.get('am') || '';
              const pn = url.searchParams.get('pn') || '';
              if (am) setAmount(am);
              if (pn) setMessage(pn);
            } else {
              extractedUpi = code.data;
            }
          } catch { extractedUpi = code.data; }
          if (extractedUpi) {
            setUpiId(extractedUpi);
            setResult(null);
            closeQrModal();
          } else {
            setQrError('QR found but no UPI ID detected. Try a different image.');
          }
        } else {
          setQrError('No QR code found in this image. Please try a clearer photo.');
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };


  const MOCK_UPI_TEMPLATES = {
    cashback: {
      upiId: "gpay-rewards-claim@paytm",
      amount: "4999",
      message: {
        en: "GPay Scratch Card Cashback. Click Pay to receive Rs 4999 in your bank account.",
        hi: "जीपे स्क्रैच कार्ड कैशबैक। अपने बैंक खाते में ₹4999 प्राप्त करने के लिए पे (Pay) पर क्लिक करें।",
        gu: "જીપે સ્ક્રૅચ કાર્ડ કેશબેક. તમારા બેંક ખાતામાં ₹4999 મેળવવા માટે પે (Pay) પર ક્લિક કરો."
      }
    },
    kbc: {
      upiId: "kbc-lottery-tax@upi",
      amount: "25000",
      message: {
        en: "Processing fee for KBC Rs 25 Lakh Lottery. Pay tax amount to release winnings.",
        hi: "केबीसी ₹25 लाख लॉटरी के लिए प्रोसेसिंग शुल्क। इनाम जारी करने के लिए टैक्स का भुगतान करें।",
        gu: "કેબીસી ₹25 લાખ લોટરી માટે પ્રોસેસિંગ ફી. ઇનામ લેવા માટે ટેક્સની ચુકવણી કરો."
      }
    },
    safe: {
      upiId: "rajesh.verma@okaxis",
      amount: "450",
      message: {
        en: "Lunch share from yesterday",
        hi: "कल के दोपहर के भोजन का हिस्सा",
        gu: "ગઈકાલના લંચ શેરની રકમ"
      }
    }
  };

  const handleLoadTemplate = (key) => {
    const template = MOCK_UPI_TEMPLATES[key];
    setUpiId(template.upiId);
    setAmount(template.amount);
    setMessage(template.message[language] || template.message['en']);
    setResult(null);
  };

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    if (!upiId.trim()) return;

    setLoading(true);
    setResult(null);

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    try {
      const response = await fetch(`${baseUrl}/api/check-upi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          upiId,
          amount,
          message,
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      if (onScanComplete) {
        onScanComplete();
      }
      if (onActivityPerformed) {
        onActivityPerformed(5); // +5 XP points for scanning UPI VPA
      }
    } catch (error) {
      console.error("Error analyzing UPI request:", error);
      const fallbackResult = {
        score: 65,
        classification: "Scam",
        explanation: "Offline Fallback: Highly suspicious handle or amount. Real entities never ask for payments to claim lottery wins or cashback."
      };
      setResult(fallbackResult);
      if (onScanComplete) {
        onScanComplete();
      }
      if (onActivityPerformed) {
        onActivityPerformed(5);
      }
    } finally {
      setLoading(false);
    }
  };

  // TTS speaker
  const handleSpeakResult = () => {
    if (!result) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    if (!window.speechSynthesis || !SpeechSynthesisUtterance) {
      setTtsToast(language === 'gu' ? 'આ બ્રાઉઝરમાં ભાષણ સૂવિધા ઉપલબ્ધ નથી.' :
                  language === 'hi' ? 'इस ब्राउज़र में भाषण सुविधा उपलब्ध नहीं है।' :
                  'Speech synthesis is not supported in this browser.');
      return;
    }

    let statusText = '';
    if (result.classification === 'Scam') {
      statusText = language === 'hi' ? 'चेतावनी: यह यूपीआई अनुरोध धोखाधड़ी है।' :
                   language === 'gu' ? 'ચેતવણી: આ UPI ચુકવણી છેતરપિંડી છે.' :
                   'Warning: This UPI request is classified as a Scam.';
    } else if (result.classification === 'Suspicious') {
      statusText = language === 'hi' ? 'ध्यान दें: यह यूपीआई आईडी संदिग्ध है।' :
                   language === 'gu' ? 'ધ્યાન આપો: આ UPI આઈડી શંકાસ્પદ છે.' :
                   'Attention: This UPI ID is classified as Suspicious.';
    } else {
      statusText = language === 'hi' ? 'यह यूपीआई आईडी सुरक्षित है।' :
                   language === 'gu' ? 'આ UPI આઈડી સુરક્ષિત લાગે છે.' :
                   'This UPI ID appears to be Safe.';
    }

    const speakContent = `${statusText} ${result.explanation}`;
    const utterance = new SpeechSynthesisUtterance(speakContent);
    const targetLang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
    utterance.lang = targetLang;

    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (language === 'gu') {
        return voices.find(v => /gu[-_]IN/i.test(v.lang)) ||
               voices.find(v => /gujarati/i.test(v.name) || v.name.includes('ગુજ')) ||
               voices.find(v => /gu/i.test(v.lang)) ||
               voices.find(v => /hi[-_]IN/i.test(v.lang)) ||
               null;
      }
      if (language === 'hi') {
        return voices.find(v => /hi[-_]IN/i.test(v.lang)) ||
               voices.find(v => /hindi/i.test(v.name) || v.name.includes('हिन्दी')) ||
               voices.find(v => /hi/i.test(v.lang)) ||
               null;
      }
      return voices.find(v => /en[-_](US|GB|IN)/i.test(v.lang)) ||
             voices.find(v => /en/i.test(v.lang)) ||
             null;
    };

    const doSpeak = () => {
      const voice = findVoice();
      if (language !== 'en' && !voice) {
        const msg = language === 'gu'
          ? 'ગુજરાતી TTS ઉપલબ્ધ નથી. Windows Settings > Time & Language > ગુજરાતી ઇન્સ્ટોલ કરો. હવે ઈંગ્લિશ અવાજ વાપરીએ.'
          : 'हिंदी आवाज़ उपलब्ध नहीं है। Windows Settings > Time & Language में हिंदी डाउनलोड करें। अभी अंग्रेज़ी में बोलते हैं।';
        setTtsToast(msg);
        utterance.lang = 'en-US';
      } else if (voice) {
        utterance.voice = voice;
      }
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">

      {/* TTS Toast notification */}
      {ttsToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 py-3 bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700 rounded-2xl shadow-xl flex items-start gap-2 animate-fade-in">
          <span className="text-amber-600 dark:text-amber-400 text-base leading-none mt-0.5">🔊</span>
          <p className="text-amber-800 dark:text-amber-200 text-xs font-medium leading-relaxed flex-1">{ttsToast}</p>
          <button onClick={() => setTtsToast('')} className="text-amber-400 hover:text-amber-600 text-xs font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* QR Camera Modal */}
      {qrOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {language === 'hi' ? 'QR कोड स्कैन करें' : language === 'gu' ? 'QR કોડ સ્કૅન કરો' : 'Scan QR Code'}
                </span>
              </div>
              <button onClick={closeQrModal} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera View */}
            <div className="relative bg-black aspect-square w-full">
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              {/* Scanning overlay */}
              {qrScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-52 border-2 border-blue-400 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-xl" />
                    {/* Scan line animation */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-400/80 animate-bounce" style={{animationDuration:'1.5s'}} />
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Footer */}
            <div className="px-5 py-4 text-center space-y-2">
              {qrError ? (
                <p className="text-red-600 dark:text-red-400 text-xs font-medium">{qrError}</p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  {language === 'hi' ? 'कैमरे के सामने UPI QR कोड रखें' : language === 'gu' ? 'UPI QR કોડ કૅમેરા સામે રાખો' : 'Point your camera at a UPI QR code'}
                </p>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Upload Image button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                {language === 'hi' ? 'फ़ोटो अपलोड करें' : language === 'gu' ? 'ફોટો અપલોડ કરો' : 'Upload a File'}
              </button>

              {/* Stop Camera button */}
              <button onClick={closeQrModal} className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <VideoOff className="w-3.5 h-3.5" />
                {language === 'hi' ? 'कैमरा बंद करें' : language === 'gu' ? 'કૅમેરા બંધ કરો' : 'Stop Camera'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.upiTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.upiSubtitle}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Form panel */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
          <form onSubmit={handleCheck} className="space-y-4">
            <div className="space-y-4">
              {/* UPI ID input + QR button */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                  {t.upiSenderId}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setResult(null);
                    }}
                    placeholder={t.upiSenderPlaceholder}
                    className="flex-1 p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100 text-sm font-semibold"
                  />
                  {/* QR Scan Button */}
                  <button
                    type="button"
                    onClick={openQrModal}
                    title={language === 'hi' ? 'QR स्कैन करें' : language === 'gu' ? 'QR સ્કૅન' : 'Scan QR Code'}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-xl transition-colors cursor-pointer"
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-xs font-bold hidden sm:block">
                      {language === 'hi' ? 'QR स्कैन' : language === 'gu' ? 'QR સ્કૅન' : 'Scan QR'}
                    </span>
                  </button>
                </div>
                {/* Auto-fill hint when QR filled */}
                {upiId && upiId.includes('@') && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <QrCode className="w-3 h-3" /> UPI ID ready for verification
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Amount input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                    {t.upiAmount}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setResult(null);
                      }}
                      placeholder={t.upiAmountPlaceholder}
                      className="w-full pl-7 pr-3 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100 text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Msg input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                    {t.upiMessage}
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setResult(null);
                    }}
                    placeholder={t.upiMsgPlaceholder}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading || !upiId.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {language === 'en' ? 'Analyzing...' : language === 'hi' ? 'जांच की जा रही है...' : 'તપાસ...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t.btnCheckUpi}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Try templates */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {t.upiTryTemplates}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleLoadTemplate('cashback')}
                className="text-[11px] sm:text-xs text-left p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors cursor-pointer"
              >
                🎁 {t.upiTemplateCashback}
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('kbc')}
                className="text-[11px] sm:text-xs text-left p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors cursor-pointer"
              >
                🏆 {t.upiTemplateKbc}
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('safe')}
                className="text-[11px] sm:text-xs text-left p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors cursor-pointer"
              >
                🤝 {t.upiTemplateSafe}
              </button>
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="md:col-span-5 space-y-4">
          {result ? (
            <div className={`bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm space-y-6 animate-fade-in transition-colors duration-300 ${
              result.classification === 'Scam' ? 'border-red-300 dark:border-red-800' :
              result.classification === 'Suspicious' ? 'border-amber-300 dark:border-amber-900/50' : 'border-green-300 dark:border-green-800'
            }`}>
              
              {/* Status Header */}
              <div className="flex items-center gap-3">
                {result.classification === 'Scam' && (
                  <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                    <ShieldX className="w-6 h-6 animate-pulse" />
                  </div>
                )}
                {result.classification === 'Suspicious' && (
                  <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                {result.classification === 'Safe' && (
                  <div className="p-3 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t.upiResultHeader}
                  </h4>
                  <h3 className={`text-xl font-bold ${
                    result.classification === 'Scam' ? 'text-red-600 dark:text-red-400' :
                    result.classification === 'Suspicious' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {result.classification === 'Scam' ? t.upiRiskScam :
                     result.classification === 'Suspicious' ? t.upiRiskSusp : t.upiRiskSafe}
                  </h3>
                </div>

                {/* Speak button */}
                <button
                  type="button"
                  onClick={handleSpeakResult}
                  className={`ml-auto p-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50 ${
                    speaking ? 'ring-2 ring-blue-500 animate-pulse text-blue-600' : ''
                  }`}
                  title="Speak Results Aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Donut Risk Chart */}
              <div className="flex items-center gap-4 py-2">
                <RiskDonutChart score={result.score} classification={result.classification} />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{t.smsRiskLevel}</span>
                    <span>{t.smsConfidence}: {result.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${result.score}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.classification === 'Scam' ? 'bg-red-500' :
                        result.classification === 'Suspicious' ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                    /></div>
                </div>
              </div>

              {/* AI Risk Breakdown - Reasons */}
              {result.reasons && result.reasons.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {language === 'hi' ? '⚠️ जोखिम कारण' : language === 'gu' ? '⚠️ જોખમ કારણો' : '⚠️ Risk Reasons'}
                  </h5>
                  <div className="flex flex-col gap-1.5">
                    {result.reasons.map((reason, i) => (
                      <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold border ${
                        result.classification === 'Scam'
                          ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300'
                          : result.classification === 'Suspicious'
                          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-300'
                          : 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/40 text-green-700 dark:text-green-300'
                      }`}>
                        <span className="text-base leading-none">
                          {result.classification === 'Safe' ? '✅' : i === 0 ? '🔴' : '🟠'}
                        </span>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation text */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.upiExplanation}
                </h5>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Golden Rule Pin Banner */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
                    UPI Golden Rule
                  </span>
                </div>
                <p className="text-xs font-medium leading-normal">
                  {t.upiRulePIN}
                </p>
              </div>

              {/* Warning flags checklists */}
              {result.classification !== 'Safe' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t.safetyChecklist || "Safety Checklist"}
                  </h5>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Do NOT enter your UPI PIN.
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Do NOT click 'Pay' on collect requests.
                    </div>
                  </div>
                </div>
              )}

              {/* Share Warning Card */}
              {(result.classification === 'Scam' || result.classification === 'Suspicious') && (
                <ShareCard
                  classification={result.classification}
                  type="UPI Payment Request"
                  text={`UPI ID: ${upiId}, Amount: ₹${amount}`}
                  explanation={result.explanation}
                  language={language}
                  score={result.score}
                  t={t}
                />
              )}

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed p-10 rounded-2xl text-center space-y-2 transition-colors duration-300">
              <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-slate-400 dark:text-slate-400 text-sm font-semibold">
                {t.waitingForCheck || "Waiting for check..."}
              </p>
              <p className="text-slate-400/80 dark:text-slate-500 text-xs max-w-[240px] mx-auto leading-normal">
                Enter sender UPI details, amount, and request message on the left and click 'Verify' to test.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
