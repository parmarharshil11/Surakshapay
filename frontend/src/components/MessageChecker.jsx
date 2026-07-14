import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Trash2, Mic, MicOff, Volume2, Image as ImageIcon, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import DOMPurify from 'dompurify';
import ShareCard from './ShareCard';

export default function MessageChecker({ t, language, onScanComplete, onActivityPerformed }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Web Speech API States
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // OCR Screenshot scan states
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrTextConfirm, setOcrTextConfirm] = useState('');
  const [showOcrConfirm, setShowOcrConfirm] = useState(false);

  // Refs for cleanup and DOM access
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleSpeechEnd = () => setSpeaking(false);
    window.speechSynthesis?.addEventListener?.('end', handleSpeechEnd);
    return () => {
      if (window.recognitionInstance) {
        window.recognitionInstance.stop();
        window.recognitionInstance = null;
      }
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.removeEventListener?.('end', handleSpeechEnd);
    };
  }, []);

  const MOCK_TEMPLATES = {
    kyc: {
      en: "Dear customer, your bank account is suspended due to pending KYC verification. Please call bank manager at 98765-43210 immediately to update.",
      hi: "à¤ªà¥à¤°à¤¿à¤¯ à¤—à¥à¤°à¤¾à¤¹à¤•, à¤†à¤ªà¤•à¤¾ à¤¬à¥ˆà¤‚à¤• à¤–à¤¾à¤¤à¤¾ à¤²à¤‚à¤¬à¤¿à¤¤ à¤•à¥‡à¤µà¤¾à¤ˆà¤¸à¥€ à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¨ à¤•à¥‡ à¤•à¤¾à¤°à¤£ à¤¬à¤‚à¤¦ à¤•à¤° à¤¦à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾ à¤¹à¥ˆà¥¤ à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥à¤°à¤‚à¤¤ à¤¬à¥ˆà¤‚à¤• à¤®à¥ˆà¤¨à¥‡à¤œà¤° à¤•à¥‹ 98765-43210 à¤ªà¤° à¤•à¥‰à¤² à¤•à¤°à¥‡à¤‚à¥¤",
      gu: "àªªà«àª°àª¿àª¯ àª—à«àª°àª¾àª¹àª•, àª¤àª®àª¾àª°à«àª‚ àª¬à«‡àª‚àª• àª–àª¾àª¤à«àª‚ àª•à«‡àªµàª¾àª¯àª¸à«€ àªµà«‡àª°àª¿àª«àª¿àª•à«‡àª¶àª¨ àª¬àª¾àª•à«€ àª¹à«‹àªµàª¾àª¥à«€ àª¬àª‚àª§ àª•àª°àªµàª¾àª®àª¾àª‚ àª†àªµà«àª¯à«àª‚ àª›à«‡. àª…àªªàª¡à«‡àªŸ àª•àª°àªµàª¾ àª®àª¾àªŸà«‡ àª¤àª°àª¤ àªœ àª¬à«‡àª‚àª• àª®à«‡àª¨à«‡àªœàª°àª¨à«‡ 98765-43210 àªªàª° àª•à«‹àª² àª•àª°à«‹."
    },
    electricity: {
      en: "Dear customer, electricity connection will be disconnected at 9:30 PM tonight because your previous month bill was not updated. Call electricity officer 90012-34567 immediately.",
      hi: "à¤ªà¥à¤°à¤¿à¤¯ à¤—à¥à¤°à¤¾à¤¹à¤•, à¤†à¤œ à¤°à¤¾à¤¤ 9:30 à¤¬à¤œà¥‡ à¤¬à¤¿à¤œà¤²à¥€ à¤•à¤¾à¤Ÿ à¤¦à¥€ à¤œà¤¾à¤à¤—à¥€ à¤•à¥à¤¯à¥‹à¤‚à¤•à¤¿ à¤ªà¤¿à¤›à¤²à¥‡ à¤®à¤¹à¥€à¤¨à¥‡ à¤•à¤¾ à¤¬à¤¿à¤² à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤¨à¤¹à¥€à¤‚ à¤¥à¤¾à¥¤ à¤¤à¥à¤°à¤‚à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤…à¤§à¤¿à¤•à¤¾à¤°à¥€ 90012-34567 à¤ªà¤° à¤•à¥‰à¤² à¤•à¤°à¥‡à¤‚à¥¤",
      gu: "àªªà«àª°àª¿àª¯ àª—à«àª°àª¾àª¹àª•, àª†àªœà«‡ àª°àª¾àª¤à«àª°à«‡ 9:30 àªµàª¾àª—à«àª¯à«‡ àªµà«€àªœàª³à«€ àªœà«‹àª¡àª¾àª£ àª•àª¾àªªà«€ àª¨àª¾àª–àªµàª¾àª®àª¾àª‚ àª†àªµàª¶à«‡ àª•àª¾àª°àª£ àª•à«‡ àª—àª¯àª¾ àª®àª¹àª¿àª¨àª¾àª¨à«àª‚ àª¬àª¿àª² àª…àªªàª¡à«‡àªŸ àª¨àª¹à«‹àª¤à«àª‚. àª¤àª°àª¤ àªœ àªµà«€àªœàª³à«€ àª…àª§àª¿àª•àª¾àª°à«€ 90012-34567 àªªàª° àª•à«‹àª² àª•àª°à«‹."
    },
    lottery: {
      en: "Congratulations! You have won Rs. 25 Lakhs from KBC Lucky Draw. Send bank account details and photo to WhatsApp 88776-55443 to claim your prize.",
      hi: "à¤¬à¤§à¤¾à¤ˆ à¤¹à¥‹! à¤†à¤ªà¤¨à¥‡ à¤•à¥‡à¤¬à¥€à¤¸à¥€ à¤²à¤•à¥€ à¤¡à¥à¤°à¤¾ à¤¸à¥‡ â‚¹25 à¤²à¤¾à¤– à¤œà¥€à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤…à¤ªà¤¨à¤¾ à¤‡à¤¨à¤¾à¤® à¤ªà¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª 88776-55443 à¤ªà¤° à¤¬à¥ˆà¤‚à¤• à¤–à¤¾à¤¤à¤¾ à¤µà¤¿à¤µà¤°à¤£ à¤”à¤° à¤«à¥‹à¤Ÿà¥‹ à¤­à¥‡à¤œà¥‡à¤‚à¥¤",
      gu: "àª…àª­àª¿àª¨àª‚àª¦àª¨! àª¤àª®à«‡ àª•à«‡àª¬à«€àª¸à«€ àª²àª•à«€ àª¡à«àª°à«‹àª®àª¾àª‚àª¥à«€ â‚¹25 àª²àª¾àª– àªœà«€àª¤à«àª¯àª¾ àª›à«‡. àª¤àª®àª¾àª°àª¾ àª‡àª¨àª¾àª®àª¨à«‹ àª¦àª¾àªµà«‹ àª•àª°àªµàª¾ àª®àª¾àªŸà«‡ àªµà«‰àªŸà«àª¸àªàªª 88776-55443 àªªàª° àª¬à«‡àª‚àª• àª–àª¾àª¤àª¾àª¨à«€ àªµàª¿àª—àª¤à«‹ àª…àª¨à«‡ àª«à«‹àªŸà«‹ àª®à«‹àª•àª²à«‹."
    },
    job: {
      en: "Earn Rs 3000 to Rs 8000 daily from home doing simple YouTube channel likes. Free registration, no fees. Age 18+. Click link to register: http://job18.in/apply",
      hi: "à¤˜à¤° à¤¬à¥ˆà¤ à¥‡ à¤¯à¥‚à¤Ÿà¥à¤¯à¥‚à¤¬ à¤šà¥ˆà¤¨à¤² à¤²à¤¾à¤‡à¤• à¤•à¤°à¤•à¥‡ à¤°à¥‹à¤œà¤¾à¤¨à¤¾ â‚¹3000 à¤¸à¥‡ â‚¹8000 à¤•à¤®à¤¾à¤à¤‚à¥¤ à¤®à¥à¤«à¥à¤¤ à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£, à¤•à¥‹à¤ˆ à¤¶à¥à¤²à¥à¤• à¤¨à¤¹à¥€à¤‚à¥¤ à¤‰à¤®à¥à¤° 18+à¥¤ à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¤° à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤²à¤¿à¤‚à¤• à¤ªà¤° à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¥‡à¤‚: http://job18.in/apply",
      gu: "àª˜àª°à«‡ àª¬à«‡àª àª¾ àª¯à«àªŸà«àª¯à«àª¬ àªšà«‡àª¨àª² àª²àª¾àª‡àª• àª•àª°à«€àª¨à«‡ àª¦àª°àª°à«‹àªœ â‚¹3000 àª¥à«€ â‚¹8000 àª•àª®àª¾àª“. àª®àª«àª¤ àª°àªœà«€àª¸à«àªŸà«àª°à«‡àª¶àª¨, àª•à«‹àªˆ àª«à«€ àª¨àª¥à«€. àª‰àª‚àª®àª° 18+. àª°àªœà«€àª¸à«àªŸàª° àª•àª°àªµàª¾ àª®àª¾àªŸà«‡ àª²àª¿àª‚àª• àªªàª° àª•à«àª²àª¿àª• àª•àª°à«‹: http://job18.in/apply"
    }
  };

  const handleLoadTemplate = (key) => {
    const selectedTemplate = MOCK_TEMPLATES[key][language] || MOCK_TEMPLATES[key]['en'];
    setText(selectedTemplate);
    setResult(null);
  };

  const handleCheckDirect = async (inputText) => {
    const textToAnalyze = inputText || text;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setResult(null);

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    try {
      const response = await fetch(`${baseUrl}/api/check-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textToAnalyze,
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
        onActivityPerformed(5); // +5 XP points for scanning text
      }
    } catch (error) {
      console.error("Error analyzing message:", error);
      const fallbackResult = {
        score: 55,
        classification: "Suspicious",
        matchedKeywords: ["kyc", "block", "link"],
        explanation: "Offline Fallback: Suspicious text structures detected. Always verify sender identity directly before responding."
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

  const handleCheck = () => {
    handleCheckDirect(text);
  };

  // Speech Recognition (Speech-to-Text)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice features (SpeechRecognition) not supported on this browser.");
      return;
    }

    if (listening) {
      if (window.recognitionInstance) {
        window.recognitionInstance.stop();
      }
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText(transcript);
          setTimeout(() => {
            handleCheckDirect(transcript);
          }, 300);
        }
      };

      recognition.onerror = (e) => {
        console.error("Voice recognition error:", e);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      window.recognitionInstance = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech init error:", err);
      setListening(false);
    }
  };

  // Speech Synthesis (Text-to-Speech)
  const handleSpeakResult = () => {
    if (!result) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    if (!window.speechSynthesis || !SpeechSynthesisUtterance) {
      alert("Speech features are not supported in this browser.");
      return;
    }

    let resultPrefix = "";
    if (result.classification === 'Scam') {
      resultPrefix = language === 'hi' ? "à¤šà¥‡à¤¤à¤¾à¤µà¤¨à¥€: à¤¯à¤¹ à¤¸à¤‚à¤¦à¥‡à¤¶ à¤à¤• à¤¸à¥à¤•à¥ˆà¤® à¤¹à¥ˆà¥¤" :
                     language === 'gu' ? "àªšà«‡àª¤àªµàª£à«€: àª† àª®à«‡àª¸à«‡àªœ àª›à«‡àª¤àª°àªªàª¿àª‚àª¡à«€ àª›à«‡." :
                     "Warning: This message is detected as a Scam.";
    } else if (result.classification === 'Suspicious') {
      resultPrefix = language === 'hi' ? "à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤‚: à¤¯à¤¹ à¤¸à¤‚à¤¦à¥‡à¤¶ à¤¸à¤‚à¤¦à¤¿à¤—à¥à¤§ à¤¹à¥ˆà¥¤" :
                     language === 'gu' ? "àª§à«àª¯àª¾àª¨ àª†àªªà«‹: àª† àª®à«‡àª¸à«‡àªœ àª¶àª‚àª•àª¾àª¸à«àªªàª¦ àª›à«‡." :
                     "Attention: This message is classified as Suspicious.";
    } else {
      resultPrefix = language === 'hi' ? "à¤¯à¤¹ à¤¸à¤‚à¤¦à¥‡à¤¶ à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤¦à¤¿à¤– à¤°à¤¹à¤¾ à¤¹à¥ˆà¥¤" :
                     language === 'gu' ? "àª† àª®à«‡àª¸à«‡àªœ àª¸à«àª°àª•à«àª·àª¿àª¤ àª²àª¾àª—à«‡ àª›à«‡." :
                     "This message appears to be Safe.";
    }

    const speakText = `${resultPrefix} ${result.explanation}`;
    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // OCR File Reading Scanner
  const handleImageOcr = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    setOcrProgress(0);

    try {
      const ocrResult = await Tesseract.recognize(
        file,
        language === 'hi' ? 'eng+hin' : language === 'gu' ? 'eng+guj' : 'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.floor(m.progress * 100));
            }
          }
        }
      );

      const textOutput = ocrResult.data.text;
      if (textOutput && textOutput.trim()) {
        setOcrTextConfirm(textOutput);
        setShowOcrConfirm(true);
      } else {
        alert(language === 'hi' ? "à¤›à¤µà¤¿ à¤¸à¥‡ à¤•à¥‹à¤ˆ à¤ªà¤¾à¤  à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤² à¤¸à¤•à¤¾à¥¤" : language === 'gu' ? "àª›àª¬à«€àª®àª¾àª‚àª¥à«€ àª•à«‹àªˆ àª²àª–àª¾àª£ àª®àª³à«àª¯à«àª‚ àª¨àª¥à«€." : "No text found in the image.");
      }
    } catch (err) {
      console.error("OCR parse error:", err);
      alert("Failed to parse image screenshot.");
    } finally {
      setOcrLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Helper to render highlights in text with DOMPurify sanitization (XSS Fix)
  const highlightScamText = () => {
    if (!result || !result.matchedKeywords || result.matchedKeywords.length === 0) {
      const sanitizedOnly = DOMPurify.sanitize(text);
      return <div className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-100">{sanitizedOnly}</div>;
    }

    let highlighted = text;
    const sortedKeywords = [...result.matchedKeywords].sort((a, b) => b.length - a.length);

    sortedKeywords.forEach(keyword => {
      if (keyword === 'http/link') {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*)/gi;
        highlighted = highlighted.replace(urlRegex, (url) => `<span class="highlight-scam">${url}</span>`);
      } else if (keyword === 'phone number') {
        const phoneRegex = /(\+91|91)?[6-9]\d{9}/g;
        highlighted = highlighted.replace(phoneRegex, (num) => `<span class="highlight-scam">${num}</span>`);
      } else {
        const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedKeyword})`, 'gi');
        highlighted = highlighted.replace(regex, `<span class="highlight-scam">$1</span>`);
      }
    });

    const cleanHTML = DOMPurify.sanitize(highlighted, { ADD_ATTR: ['class'] });
    return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-100" />;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.smsTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.smsSubtitle}
        </p>
      </div>

      {/* Grid Inputs & Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Input box section */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
          <div className="space-y-2">
            <textarea
              aria-label={t.smsPlaceholder}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setResult(null);
              }}
              placeholder={t.smsPlaceholder}
              rows={6}
              className="w-full p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-100 text-base placeholder-slate-400"
            />
          </div>

          {/* OCR scan status */}
          {ocrLoading && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-xl flex items-center gap-3 text-xs font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span>
                {language === 'hi' ? `à¤›à¤µà¤¿ à¤¸à¥à¤•à¥ˆà¤¨ à¤•à¥€ à¤œà¤¾ à¤°à¤¹à¥€ à¤¹à¥ˆ... (${ocrProgress}%)` : 
                 language === 'gu' ? `àª›àª¬à«€ àª¸à«àª•à«‡àª¨ àª¥àªˆ àª°àª¹à«€ àª›à«‡... (${ocrProgress}%)` : 
                 `Scanning image screenshot... (${ocrProgress}%)`}
              </span>
            </div>
          )}

          {/* Bottom input toolbar */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 mt-2">
            <div className="flex gap-2">
              {/* Mic transcription button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  listening 
                    ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Voice Input"
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* OCR Image input button */}
              <label
                className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all cursor-pointer flex items-center justify-center ${
                  ocrLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Upload Screenshot"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageOcr}
                  disabled={ocrLoading}
                  className="hidden"
                />
                <span className="sr-only">{t.qrUploadBtn || "Upload QR Image"}</span>
                {ocrLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              </label>
            </div>
            
            <div className="flex gap-3">
              {text && (
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                    setResult(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.btnClear}
                </button>
              )}

              <button
                onClick={handleCheck}
                disabled={!text.trim() || loading || ocrLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {language === 'en' ? 'Analyzing...' : language === 'hi' ? 'à¤œà¤¾à¤‚à¤š à¤•à¥€ à¤œà¤¾ à¤°à¤¹à¥€ à¤¹à¥ˆ...' : 'àª¤àªªàª¾àª¸...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t.btnScan}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Templates */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {t.tryTemplates}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLoadTemplate('kyc')}
                className="text-xs text-left p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
              >
                ðŸš¨ {t.templateKyc}
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('electricity')}
                className="text-xs text-left p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
              >
                ðŸ’¡ {t.templateElectricity}
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('lottery')}
                className="text-xs text-left p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
              >
                ðŸ† {t.templateLottery}
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('job')}
                className="text-xs text-left p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-400 font-medium transition-colors hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
              >
                ðŸ’¼ {t.templateJob}
              </button>
            </div>
          </div>
        </div>

        {/* Results section */}
        <div className="md:col-span-5 space-y-4">
          {result ? (
            <div className={`bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm space-y-6 animate-fade-in transition-colors duration-300 ${
              result.classification === 'Scam' ? 'border-red-300 dark:border-red-800' :
              result.classification === 'Suspicious' ? 'border-amber-300 dark:border-amber-900/50' : 'border-green-300 dark:border-green-800'
            }`}>
              
              {/* Scan status indicator */}
              <div className="flex items-center gap-3">
                {result.classification === 'Scam' && (
                  <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                    <ShieldAlert className="w-6 h-6 animate-bounce" />
                  </div>
                )}
                {result.classification === 'Suspicious' && (
                  <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                {result.classification === 'Safe' && (
                  <div className="p-3 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t.smsScannedHeader}
                  </h4>
                  <h3 className={`text-xl font-bold ${
                    result.classification === 'Scam' ? 'text-red-600 dark:text-red-400' :
                    result.classification === 'Suspicious' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {result.classification === 'Scam' ? t.smsScamTitle :
                     result.classification === 'Suspicious' ? t.smsSuspiciousTitle : t.smsSafeTitle}
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

              {/* Confidence Gauge & Score */}
              <div className="space-y-1.5">
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
                  ></div>
                </div>
              </div>

              {/* Matched keywords */}
              {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t.smsMatchedKeywords}
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Text highlighting preview */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.textPreview || "Text Preview"}
                </h5>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-sm transition-colors duration-300">
                  {highlightScamText()}
                </div>
              </div>

              {/* Plain language explanation */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.smsExplanation}
                </h5>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Call-to-action warning banner */}
              <div className={`p-4 rounded-xl text-xs font-medium leading-relaxed ${
                result.classification === 'Scam' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/40' :
                result.classification === 'Suspicious' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40' :
                'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900/40'
              }`}>
                {result.classification === 'Scam' ? t.smsAlertCaution :
                 result.classification === 'Suspicious' ? t.smsAlertSuspicious : t.smsAlertSafe}
              </div>

              {/* Warning Share Card */}
              {(result.classification === 'Scam' || result.classification === 'Suspicious') && (
                <ShareCard
                  classification={result.classification}
                  type="SMS Message"
                  text={text}
                  explanation={result.explanation}
                  language={language}
                  t={t}
                />
              )}

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed p-10 rounded-2xl text-center space-y-2 transition-colors duration-300">
              <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-slate-400 dark:text-slate-400 text-sm font-semibold">
                {t.waitingForCheck || "Waiting for check..."}
              </p>
              <p className="text-slate-400/80 dark:text-slate-500 text-xs max-w-[240px] mx-auto leading-normal">
                Paste your message on the left or scan a screenshot/speak to get safety details instantly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OCR text confirmation modal overlay */}
      {showOcrConfirm && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {language === 'hi' ? 'à¤¸à¥à¤•à¥ˆà¤¨ à¤•à¤¿à¤ à¤—à¤ à¤ªà¤¾à¤  à¤•à¥€ à¤ªà¥à¤·à¥à¤Ÿà¤¿ à¤•à¤°à¥‡à¤‚' : language === 'gu' ? 'àª¸à«àª•à«‡àª¨ àª•àª°à«‡àª² àª²àª–àª¾àª£àª¨à«€ àªªà«àª·à«àªŸàª¿ àª•àª°à«‹' : 'Confirm Scanned Text'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {language === 'hi' ? 'à¤œà¤¾à¤‚à¤š à¤•à¤°à¤¨à¥‡ à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤¸à¤‚à¤¦à¥‡à¤¶ à¤•à¥€ à¤œà¤¾à¤‚à¤š à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤¸à¤‚à¤ªà¤¾à¤¦à¤¿à¤¤ à¤•à¤°à¥‡à¤‚:' : 
                 language === 'gu' ? 'àª¤àªªàª¾àª¸ àª¶àª°à«‚ àª•àª°àª¤àª¾ àªªàª¹à«‡àª²àª¾ àª²àª–àª¾àª£ àªšàª•àª¾àª¸à«‹ àª…àª¨à«‡ àª¸àª‚àªªàª¾àª¦àª¿àª¤ àª•àª°à«‹:' : 
                 'Review and edit the scanned text before analyzing:'}
              </p>
            </div>

            <textarea
              value={ocrTextConfirm}
              onChange={(e) => setOcrTextConfirm(e.target.value)}
              rows={6}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowOcrConfirm(false);
                  setOcrTextConfirm('');
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
              >
                {language === 'hi' ? 'à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚' : language === 'gu' ? 'àª°àª¦ àª•àª°à«‹' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setText(ocrTextConfirm);
                  setShowOcrConfirm(false);
                  handleCheckDirect(ocrTextConfirm);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                {language === 'hi' ? 'à¤œà¤¾à¤‚à¤š à¤¶à¥à¤°à¥‚ à¤•à¤°à¥‡à¤‚' : language === 'gu' ? 'àª¤àªªàª¾àª¸ àª¶àª°à«‚ àª•àª°à«‹' : 'Analyze Text'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

