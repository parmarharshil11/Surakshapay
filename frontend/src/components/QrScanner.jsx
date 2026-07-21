import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, ShieldCheck, AlertTriangle, ShieldX, Volume2, VideoOff, RefreshCw } from 'lucide-react';
import { speakText } from '../utils/ttsHelper';
import jsQR from 'jsqr';
import ShareCard from './ShareCard';

export default function QrScanner({ t, language, onActivityPerformed }) {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [resultUpi, setResultUpi] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const handleSpeechEnd = () => setSpeaking(false);
    window.speechSynthesis?.addEventListener?.('end', handleSpeechEnd);
    return () => {
      stopCamera();
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.removeEventListener?.('end', handleSpeechEnd);
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    setErrorMsg('');
    setResultUpi('');
    setResultUrl('');
    setCheckResult(null);
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError(t.qrCameraError || "Camera access denied. Please upload a QR image instead.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanFrame = () => {
    if (!scanning && !streamRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        stopCamera();
        handleQrResult(code.data);
      } else {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } else {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    }
  };

  const handleQrResult = (qrText) => {
    setErrorMsg('');
    
    if (qrText.startsWith('upi://pay')) {
      try {
        // Parse pa (UPI VPA) and pn (Payee Name)
        const urlObj = new URL(qrText.replace('upi://pay', 'http://dummy.com'));
        const upi = urlObj.searchParams.get('pa');
        const name = urlObj.searchParams.get('pn') || '';
        const amount = urlObj.searchParams.get('am') || '';
        
        if (upi) {
          setResultUpi(upi);
          verifyScamUpi(upi, amount, name);
        } else {
          setErrorMsg(t.qrNotFound || "No QR code detected. Try better lighting.");
        }
      } catch (err) {
        setErrorMsg("Failed to parse UPI link details.");
      }
    } else if (qrText.startsWith('http://') || qrText.startsWith('https://')) {
      setResultUrl(qrText);
    } else {
      // General parsed string check
      setResultUrl(qrText);
    }
  };

  const verifyScamUpi = async (upiVal, amountVal = '', nameVal = '') => {
    setApiLoading(true);
    setCheckResult(null);
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    try {
      const response = await fetch(`${baseUrl}/api/check-upi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          upiId: upiVal,
          amount: amountVal || '0',
          message: nameVal ? `Payee: ${nameVal}` : '',
          lang: language
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setCheckResult(data);

      if (onActivityPerformed) {
        onActivityPerformed(5); // +5 XP points for QR scanner verification
      }
    } catch (e) {
      console.error(e);
      // Offline fallback
      setCheckResult({
        score: 70,
        classification: "Scam",
        explanation: "Offline Fallback: Suspicious merchant ID. Verify detail directly before sending payments."
      });
      if (onActivityPerformed) {
        onActivityPerformed(5);
      }
    } finally {
      setApiLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            handleQrResult(code.data);
          } else {
            setErrorMsg(t.qrNotFound || "No QR code detected. Try better lighting.");
          }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // TTS speaker for result
  const handleSpeakResult = () => {
    if (!checkResult) return;

    if (speaking || ttsLoading) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setTtsLoading(false);
      return;
    }

    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    if (!window.speechSynthesis || !SpeechSynthesisUtterance) {
      alert("Voice features not supported in this browser.");
      return;
    }

    let statusText = "";
    if (checkResult.classification === 'Scam') {
      statusText = language === 'hi' ? "चेतावनी: यह यूपीआई क्यूआर कोड धोखाधड़ी है।" :
                   language === 'gu' ? "ચેતવણી: આ UPI QR કોડ છેતરપિંડી છે." :
                   "Warning: This UPI QR code is classified as a Scam.";
    } else if (checkResult.classification === 'Suspicious') {
      statusText = language === 'hi' ? "ध्यान दें: यह यूपीआई आईडी संदिग्ध है।" :
                   language === 'gu' ? "ધ્યાન આપો: આ UPI આઈડી શંકાસ્પદ છે." :
                   "Attention: This UPI ID is classified as Suspicious.";
    } else {
      statusText = language === 'hi' ? "यह यूपीआई आईडी सुरक्षित है।" :
                   language === 'gu' ? "આ UPI આઈડી સુરક્ષિત લાગે છે." :
                   "This UPI ID appears to be Safe.";
    }

    const speakContent = `${statusText} ${checkResult.explanation}`;
    speakText({
      text: speakContent,
      lang: language,
      onLoading: () => { setTtsLoading(true); setSpeaking(false); },
      onStart: () => { setTtsLoading(false); setSpeaking(true); },
      onEnd: () => { setTtsLoading(false); setSpeaking(false); },
      onError: () => { setTtsLoading(false); setSpeaking(false); }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.qrTitle || "Scan Payment QR Code"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.qrSubtitle || "Scan any UPI QR before paying to verify it's safe"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column - Scanner Screen */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
          
          {/* Video Preview viewport */}
          {scanning ? (
            <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-black border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <video 
                ref={videoRef}
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Corner Green Scanner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-48 h-48 border border-white/20">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                  
                  {/* Laser Scanning Line */}
                  <div className="w-full h-0.5 bg-green-500 opacity-60 absolute top-0 left-0 animate-pulse"></div>
                </div>
              </div>

              {/* Stop Camera Trigger */}
              <button
                onClick={stopCamera}
                className="absolute bottom-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <VideoOff className="w-4 h-4" />
                {t.qrStopCamera || "Stop Camera"}
              </button>
            </div>
          ) : (
            <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 space-y-4">
              <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              
              {cameraError && (
                <p className="text-red-500 text-xs font-bold text-center max-w-[240px]">
                  {cameraError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  {t.qrCameraBtn || "Open Camera"}
                </button>

                <label className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden" 
                  />
                  <ImageIcon className="w-4 h-4" />
                  {t.qrUploadBtn || "Upload QR Image"}
                </label>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/20">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Hidden helper Canvas for decoding */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right Column - Scan Results */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Loading API Check */}
          {apiLoading && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow animate-pulse">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {t.qrScanning || "Verifying payment ID safety..."}
              </p>
            </div>
          )}

          {/* UPI result card */}
          {checkResult && (
            <div className={`bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm space-y-6 animate-fade-in transition-colors duration-300 ${
              checkResult.classification === 'Scam' ? 'border-red-300 dark:border-red-800' :
              checkResult.classification === 'Suspicious' ? 'border-amber-300 dark:border-amber-900/50' : 'border-green-300 dark:border-green-800'
            }`}>
              
              {/* Alert Header */}
              <div className="flex items-center gap-3">
                {checkResult.classification === 'Scam' && (
                  <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                    <ShieldX className="w-6 h-6" />
                  </div>
                )}
                {checkResult.classification === 'Suspicious' && (
                  <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                {checkResult.classification === 'Safe' && (
                  <div className="p-3 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                )}
                
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    {t.qrUpiFound || "UPI ID extracted from QR:"}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 block break-all">
                    {resultUpi}
                  </span>
                  <h3 className={`text-lg font-bold mt-1 ${
                    checkResult.classification === 'Scam' ? 'text-red-600 dark:text-red-400' :
                    checkResult.classification === 'Suspicious' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {checkResult.classification === 'Scam' ? t.upiRiskScam :
                     checkResult.classification === 'Suspicious' ? t.upiRiskSusp : t.upiRiskSafe}
                  </h3>
                </div>

                {/* Speak button */}
                <button
                  type="button"
                  onClick={handleSpeakResult}
                  disabled={ttsLoading}
                  className={`ml-auto p-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50 ${
                    speaking ? 'ring-2 ring-blue-500 animate-pulse text-blue-600' : ''
                  }`}
                  title="Speak Results Aloud"
                >
                  {ttsLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confidence Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>{t.smsRiskLevel}</span>
                  <span>{t.smsConfidence}: {checkResult.score}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${checkResult.score}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      checkResult.classification === 'Scam' ? 'bg-red-500' :
                      checkResult.classification === 'Suspicious' ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Explanation text */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.upiExplanation}
                </h5>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {checkResult.explanation}
                </p>
              </div>

              {/* Warning Share Card */}
              {(checkResult.classification === 'Scam' || checkResult.classification === 'Suspicious') && (
                <ShareCard
                  classification={checkResult.classification}
                  type="QR Payment ID"
                  text={`UPI: ${resultUpi}`}
                  explanation={checkResult.explanation}
                  language={language}
                  t={t}
                />
              )}

            </div>
          )}

          {/* URL result card */}
          {resultUrl && !checkResult && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow space-y-4 animate-fade-in text-left">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    URL or Plain Text Found
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 break-all font-semibold mt-0.5">
                    {resultUrl}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                This QR Code contains text or link redirect. Never click on link redirections from unknown posters.
              </p>
              <button 
                onClick={() => setResultUrl('')}
                className="w-full py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-450 cursor-pointer"
              >
                Scan Another QR
              </button>
            </div>
          )}

          {/* Initial Waiting screen */}
          {!checkResult && !resultUrl && !apiLoading && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed p-10 rounded-2xl text-center space-y-2 transition-colors duration-300">
              <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-slate-400 dark:text-slate-400 text-sm font-semibold">
                {t.waitingForCheck || "Waiting for scan..."}
              </p>
              <p className="text-slate-400/80 dark:text-slate-500 text-xs max-w-[240px] mx-auto leading-normal">
                Point camera at a payment QR code, or upload a code image to verify UPI accounts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
