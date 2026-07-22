/**
 * Transliterates Gujarati script (0x0A81-0x0AE3) to Devanagari (0x0901-0x0963).
 * Allows Hindi (hi-IN) TTS engines to pronounce Gujarati phonetically with 100% clarity
 * when native Gujarati (gu-IN) voices are missing on Windows/Chrome/Mobile.
 */
export function gujaratiToDevanagari(text) {
  if (!text) return '';
  return text.replace(/[\u0A81-\u0AE3]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String.fromCharCode(code - 0x0180);
  });
}

/**
 * Sanitizes and phonetically converts text for Indian regional Text-to-Speech engines.
 * Fixes garbled pronunciation of mixed English words in Gujarati & Hindi speech.
 */
export function sanitizeTextForTTS(text, lang = 'en') {
  if (!text) return '';

  let cleaned = text;

  // Clean Markdown & formatting symbols
  cleaned = cleaned.replace(/[*#_`~>|-]/g, ' ');

  if (lang === 'gu') {
    // Phonetic replacements for Gujarati speech synthesis
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 રૂપિયા')
      .replace(/Rs\.?\s*([0-9,]+)/gi, '$1 રૂપિયા')
      .replace(/INR\s*([0-9,]+)/gi, '$1 રૂપિયા')
      .replace(/₹/g, 'રૂપિયા')

      .replace(/\bUPI\b/gi, 'યુ પી આઈ')
      .replace(/\bPIN\b/gi, 'પિન')
      .replace(/\bSMS\b/gi, 'એસેમએસ')
      .replace(/\bQR\b/gi, 'ક્યુ આર')
      .replace(/\bAPK\b/gi, 'એ પી કે')
      .replace(/\bURL\b/gi, 'યુ આર એલ')
      .replace(/\bOTP\b/gi, 'ઓ ટી પી')
      .replace(/\bKBC\b/gi, 'કે બી સી')
      .replace(/\bID\b/gi, 'આઈડી')
      .replace(/\bKYC\b/gi, 'કે વાય સી')
      .replace(/\bATM\b/gi, 'એટીએમ')

      .replace(/\bWhatsApp\b/gi, 'વોટ્સએપ')
      .replace(/\bTelegram\b/gi, 'ટેલિગ્રામ')
      .replace(/\bGoogle Pay\b/gi, 'ગૂગલ પે')
      .replace(/\bPhonePe\b/gi, 'ફોનપે')
      .replace(/\bPaytm\b/gi, 'પેટીએમ')
      .replace(/\bAnyDesk\b/gi, 'એનીડેસ્ક')
      .replace(/\bTeamViewer\b/gi, 'ટીમવ્યુઅર')
      .replace(/\bAadhaar\b/gi, 'આધાર')
      .replace(/\bCyber\b/gi, 'સાયબર')
      .replace(/\bPolice\b/gi, 'પોલીસ')
      .replace(/\bBank\b/gi, 'બેંક')
      .replace(/\bAccount\b/gi, 'એકાઉન્ટ')
      .replace(/\bMessage\b/gi, 'મેસેજ')
      .replace(/\bLink\b/gi, 'લિંક')
      .replace(/\bApp\b/gi, 'એપ')
      .replace(/\bScam\b/gi, 'છેતરપિંડી')
      .replace(/\bSafe\b/gi, 'સુરક્ષિત')
      .replace(/\bSuspicious\b/gi, 'શંકાસ્પદ')
      .replace(/\bWarning\b/gi, 'ચેતવણી')
      .replace(/\bAttention\b/gi, 'ધ્યાન આપો');
  } else if (lang === 'hi') {
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 रुपये')
      .replace(/Rs\.?\s*([0-9,]+)/gi, '$1 रुपये')
      .replace(/₹/g, 'रुपये')
      .replace(/\bUPI\b/gi, 'यू पी आई')
      .replace(/\bPIN\b/gi, 'पिन')
      .replace(/\bSMS\b/gi, 'एसएमएस')
      .replace(/\bQR\b/gi, 'क्यू आर')
      .replace(/\bAPK\b/gi, 'एपीके')
      .replace(/\bOTP\b/gi, 'ओटीपी')
      .replace(/\bWhatsApp\b/gi, 'व्हाट्सएप')
      .replace(/\bGoogle Pay\b/gi, 'गूगल पे')
      .replace(/\bPhonePe\b/gi, 'फोनपे')
      .replace(/\bPaytm\b/gi, 'पेटीएम')
      .replace(/\bAnyDesk\b/gi, 'एनीडेस्क')
      .replace(/\bCyber\b/gi, 'साइबर')
      .replace(/\bPolice\b/gi, 'पुलिस')
      .replace(/\bBank\b/gi, 'बैंक');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

let currentAudio = null;

/**
 * Stops any ongoing audio speech (both HTML5 Audio and Web Speech Synthesis).
 */
export function stopSpeech() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Dual-Engine TTS: Plays Google Network TTS Audio for Gujarati & Hindi for 100% reliable native speech,
 * with automatic fallback to Web Speech Synthesis API.
 */
export function speakText({ text, lang, onLoading, onStart, onEnd, onError, setToast }) {
  stopSpeech();

  if (!text) {
    if (onError) onError();
    return;
  }

  if (onLoading) onLoading();

  const sanitizeLang = lang === 'gu' || lang === 'hi' ? lang : 'en';
  const cleanedText = sanitizeTextForTTS(text, sanitizeLang);

  // Try Google Network Audio first for Gujarati and Hindi (gu & hi)
  if (lang === 'gu' || lang === 'hi') {
    playGoogleTTS({
      text: cleanedText,
      lang: lang === 'gu' ? 'gu' : 'hi',
      onStart,
      onEnd,
      onError: () => {
        // Fallback to Web Speech API
        playWebSpeech({ text: cleanedText, lang, onStart, onEnd, onError, setToast });
      }
    });
    return;
  }

  playWebSpeech({ text: cleanedText, lang, onStart, onEnd, onError, setToast });
}

function playGoogleTTS({ text, lang, onStart, onEnd, onError }) {
  try {
    // Truncate to first 250 characters for fast audio streaming
    const chunk = text.slice(0, 250);
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    const audioUrl = `${baseUrl}/api/tts?text=${encodeURIComponent(chunk)}&lang=${lang}`;

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    currentAudio = audio;
    audio.src = audioUrl;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn("Google TTS stream failed, falling back to Web Speech:", e);
      currentAudio = null;
      if (onError) onError();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio play blocked, falling back to Web Speech:", err);
        currentAudio = null;
        if (onError) onError();
      });
    }
  } catch (err) {
    console.warn("Google TTS init error:", err);
    currentAudio = null;
    if (onError) onError();
  }
}

function playWebSpeech({ text, lang, onStart, onEnd, onError, setToast }) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    if (setToast) setToast('Speech synthesis is not supported in this browser.');
    if (onError) onError();
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    let processedText = text;
    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'gu') {
        const nativeGu =
          voices.find((v) => /gu[-_]IN/i.test(v.lang)) ||
          voices.find((v) => /gujarati/i.test(v.name) || v.name.includes('ગુજ')) ||
          voices.find((v) => /gu/i.test(v.lang));

        if (nativeGu) return { voice: nativeGu, isNative: true };

        const hiFallback =
          voices.find((v) => /hi[-_]IN/i.test(v.lang)) ||
          voices.find((v) => /hindi/i.test(v.name) || v.name.includes('हिन्दी')) ||
          voices.find((v) => /hi/i.test(v.lang));

        if (hiFallback) return { voice: hiFallback, isNative: false, isHindiFallback: true };

        return null;
      }

      if (lang === 'hi') {
        const hiVoice =
          voices.find((v) => /hi[-_]IN/i.test(v.lang)) ||
          voices.find((v) => /hindi/i.test(v.name) || v.name.includes('हिन्दी')) ||
          voices.find((v) => /hi/i.test(v.lang));

        if (hiVoice) return { voice: hiVoice, isNative: true };
        return null;
      }

      const enVoice =
        voices.find((v) => /en[-_](IN|US|GB)/i.test(v.lang)) ||
        voices.find((v) => /en/i.test(v.lang));

      return enVoice ? { voice: enVoice, isNative: true } : null;
    };

    const executeSpeech = () => {
      const match = findVoice();

      // For Gujarati on mobile: ALWAYS transliterate Gujarati script to Devanagari when using Hindi fallback or non-native voice
      if (lang === 'gu' && (!match || match.isHindiFallback || !match.isNative)) {
        processedText = gujaratiToDevanagari(processedText);
      }

      const utterance = new SpeechSynthesisUtterance(processedText);
      utterance.rate = lang === 'gu' || lang === 'hi' ? 0.88 : 1.0;
      utterance.pitch = 1.0;

      if (match?.voice) {
        utterance.voice = match.voice;
        utterance.lang = match.voice.lang;
      } else {
        utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'hi-IN' : 'en-US';
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onended = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        if (onError) onError();
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      executeSpeech();
    } else {
      let fired = false;
      window.speechSynthesis.onvoiceschanged = () => {
        if (fired) return;
        fired = true;
        window.speechSynthesis.onvoiceschanged = null;
        executeSpeech();
      };
      setTimeout(() => {
        if (fired) return;
        fired = true;
        executeSpeech();
      }, 150);
    }
  } catch (err) {
    console.warn("Web Speech execution error:", err);
    if (onError) onError();
  }
}
