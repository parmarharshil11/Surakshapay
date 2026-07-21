import React, { useState, useEffect } from 'react';
import { Award, AlertCircle, CheckCircle2, XCircle, Volume2, RotateCcw, ShieldCheck, ArrowRight, Zap, Sparkles, RefreshCw } from 'lucide-react';

const DEFAULT_QUIZ_SCENARIOS = [
  {
    id: 1,
    scenario: {
      en: "You get a WhatsApp message: 'Congratulations! You won ₹25 Lakhs from KBC. Call bank manager at 98765-43210 to claim.' What is this?",
      hi: "आपको व्हाट्सएप पर एक संदेश मिलता है: 'बधाई हो! आपने केबीसी से ₹25 लाख जीते हैं। दावा करने के लिए बैंक मैनेजर को 98765-43210 पर कॉल करें।' यह क्या है?",
      gu: "તમને વોટ્સએપ પર મેસેજ મળે છે: 'અભિનંદન! તમે કેબીસી તરફથી ₹25 લાખ જીત્યા છે. મેળવવા માટે બેંક મેનેજરને 98765-43210 પર કોલ કરો.' આ શું છે?"
    },
    options: [
      {
        type: "scam",
        label: {
          en: "Scam: Authentic lotteries never ask you to call random mobile numbers to claim.",
          hi: "स्कैम: असली लॉटरी कभी भी दावा करने के लिए रैंडम मोबाइल नंबरों पर कॉल करने को नहीं कहती।",
          gu: "છેતરપિંડી: સાચી લોટરી ક્યારેય અજાણ્યા નંબર પર કોલ કરીને પૈસા લેવા નથી કહેતી."
        }
      },
      {
        type: "safe",
        label: {
          en: "Safe: This is a official government sweepstakes offer.",
          hi: "सुरक्षित: यह एक आधिकारिक सरकारी लॉटरी ऑफर है।",
          gu: "સુરક્ષિત: આ એક સરકારી સત્તાવાર ઓફર છે."
        }
      }
    ],
    correctAnswer: "scam",
    explanation: {
      en: "This is a lottery scam. Fraudsters use famous names like KBC to steal your personal information and advance fees.",
      hi: "यह एक लॉटरी फ्रॉड है। जालसाज आपके निजी विवरण और अग्रिम शुल्क चुराने के लिए केबीसी जैसे लोकप्रिय नामों का उपयोग करते हैं।",
      gu: "આ લોટરી ફ્રોડ છે. ઠગો તમારી અંગત વિગતો ચોરવા માટે કેબીસી જેવા પ્રખ્યાત નામોનો ઉપયોગ કરે છે."
    }
  },
  {
    id: 2,
    scenario: {
      en: "Someone calls claiming your electricity connection will be cut in 30 minutes unless you download 'AnyDesk' to verify your bill payment. What should you do?",
      hi: "कोई फोन करके कहता है कि 30 मिनट में आपकी बिजली काट दी जाएगी, जब तक कि आप बिल भुगतान सत्यापित करने के लिए 'AnyDesk' डाउनलोड नहीं करते। आप क्या करेंगे?",
      gu: "કોઈ ફોન કરીને કહે છે કે જો તમે બિલ જમા કરાવવા 'AnyDesk' ડાઉનલોડ નહીં કરો તો 30 મિનિટમાં વીજળી કાપી નાખવામાં આવશે. તમે શું કરશો?"
    },
    options: [
      {
        type: "scam",
        label: {
          en: "Hang up: Electricity boards never ask you to download remote access apps.",
          hi: "फोन काट दें: बिजली बोर्ड कभी भी आपको रिमोट एक्सेस ऐप डाउनलोड करने के लिए नहीं कहता।",
          gu: "ફોન કાપી નાખો: વીજળી બોર્ડ ક્યારેય રીમોટ એક્સેસ એપ ડાઉનલોડ કરવા નથી કહેતું."
        }
      },
      {
        type: "safe",
        label: {
          en: "Download the app: It is a helper app required by government service agents.",
          hi: "ऐप डाउनलोड करें: यह सरकारी सेवा एजेंटों द्वारा आवश्यक एक सहायक ऐप है।",
          gu: "એપ ડાઉનલોડ કરો: આ સરકારી સહાયક કર્મચારીઓ માટે જરૂરી એપ છે."
        }
      }
    ],
    correctAnswer: "scam",
    explanation: {
      en: "AnyDesk, TeamViewer, and RustDesk let scammers see your mobile screen and steal banking passwords. Never install them on caller requests.",
      hi: "AnyDesk, TeamViewer और RustDesk जैसी ऐप्स ठगों को आपकी मोबाइल स्क्रीन देखने और बैंकिंग पासवर्ड चुराने की अनुमति देती हैं। किसी के कहने पर इन्हें डाउनलोड न करें।",
      gu: "AnyDesk કે TeamViewer જેવી એપ્સથી ઠગ તમારા ફોનની સ્ક્રીન જોઈ શકે છે અને બેંકના પાસવર્ડ ચોરી શકે છે. ફોન પર કહેવાથી આવી કોઈ એપ ડાઉનલોડ ન કરો."
    }
  },
  {
    id: 3,
    scenario: {
      en: "To receive ₹2,000 cashback reward on Google Pay or PhonePe, you need to type your UPI PIN. Is this safe?",
      hi: "गूगल पे या फोनपे पर ₹2,000 का कैशबैक इनाम प्राप्त करने के लिए, आपको अपना UPI PIN दर्ज करना होगा। क्या यह सुरक्षित है?",
      gu: "ગૂગલ પે અથવા ફોનપે પર ₹૨,૦૦૦ નું કેશબેક મેળવવા માટે, તમારે તમારો UPI PIN નાખવો પડશે. શું આ સુરક્ષિત છે?"
    },
    options: [
      {
        type: "safe",
        label: {
          en: "Safe: The UPI PIN acts as a secure identity verification to process cash transfers.",
          hi: "सुरक्षित: नकद ट्रांसफर को पूरा करने के लिए यूपीआई पिन एक सुरक्षित पहचान सत्यापन के रूप में कार्य करता है।",
          gu: "સુરક્ષિત: કેશબેક જમા કરવા માટે યુપીઆઈ પિન એક વેરિફિકેશન તરીકે કામ કરે છે."
        }
      },
      {
        type: "scam",
        label: {
          en: "Scam: UPI PIN is ONLY entered to send money. You NEVER need to type a PIN to receive rewards.",
          hi: "स्कैम: यूपीआई पिन केवल पैसे भेजने के लिए दर्ज किया जाता है। इनाम प्राप्त करने के लिए पिन की कभी आवश्यकता नहीं होती।",
          gu: "છેતરપિંડી: UPI PIN ફક્ત પૈસા મોકલવા માટે જ નાખવાનો હોય છે. પૈસા મેળવવા માટે ક્યારેય પિન નાખવો પડતો નથી."
        }
      }
    ],
    correctAnswer: "scam",
    explanation: {
      en: "Entering your UPI PIN automatically sends money OUT of your bank account. Scammers send fake 'collect requests' mimicking reward claims to trick you.",
      hi: "यूपीआई पिन दर्ज करने से आपके बैंक खाते से पैसे तुरंत कट जाते हैं। जालसाज आपको ठगने के लिए कैशबैक का नाटक करके फर्जी 'पैसे कलेक्ट करने के अनुरोध' भेजते हैं।",
      gu: "UPI PIN નાખવાથી તમારા ખાતામાંથી પૈસા કપાઈ જાય છે. ઠગો તમને લલચાવવા માટે નકલી કેશબેક રિકવેસ્ટ મોકલે છે."
    }
  },
  {
    id: 4,
    scenario: {
      en: "You receive a video call from someone in a police uniform claiming your Aadhaar is linked to illegal parcel. They demand ₹50,000 via UPI to avoid arrest. What is this?",
      hi: "आपको पुलिस की वर्दी में किसी व्यक्ति का वीडियो कॉल आता है जो दावा करता है कि आपका आधार अवैध पार्सल से जुड़ा है। वे गिरफ्तारी से बचने के लिए यूपीआई के जरिए ₹50,000 मांगते हैं। यह क्या है?",
      gu: "તમને પોલીસના ગણવેશમાં એક વીડિયો કોલ મળે છે જે દાવો કરે છે કે તમારું આધાર નકલી પાર્સલ સાથે જોડાયેલ છે. તેઓ ધરપકડથી બચવા ₹૫૦,૦૦૦ માંગે છે. આ શું છે?"
    },
    options: [
      {
        type: "scam",
        label: {
          en: "Digital Arrest Scam: Real police never conduct court trials or demand money via video calls.",
          hi: "डिजिटल अरेस्ट स्कैम: असली पुलिस कभी भी वीडियो कॉल पर पूछताछ या पैसे की मांग नहीं करती।",
          gu: "ડિજિટલ એરેસ્ટ છેતરપિંડી: સાચી પોલીસ ક્યારેય વીડિયો કોલ પર નાણાંની માંગ કરતી નથી."
        }
      },
      {
        type: "safe",
        label: {
          en: "Safe: This is the official Cyber Crime digital court proceeding.",
          hi: "सुरक्षित: यह आधिकारिक साइबर अपराध डिजिटल अदालती कार्यवाही है।",
          gu: "સુરક્ષિત: આ સાયબર ક્રાઈમની સત્તાવાર ડિજિટલ પ્રક્રિયા છે."
        }
      }
    ],
    correctAnswer: "scam",
    explanation: {
      en: "This is a 'Digital Arrest' extortion scam. Indian Law Enforcement officers never issue arrest warrants or accept fine payments via WhatsApp video calls.",
      hi: "यह 'डिजिटल अरेस्ट' जबरन वसूली का घोटाला है। भारतीय पुलिस कभी भी व्हाट्सएप वीडियो कॉल के माध्यम से जुर्माना या पैसे स्वीकार नहीं करती है।",
      gu: "આ 'ડિજિટલ એરેસ્ટ' ફ્રોડ છે. ભારતીય પોલીસ ક્યારેય વોટ્સએપ વીડિયો કોલ પર ઓનલાઈન દંડ વસૂલતી નથી."
    }
  },
  {
    id: 5,
    scenario: {
      en: "Your friend Rajesh sends a UPI payment request for ₹450 with a note 'Dinner share'. Is this a scam?",
      hi: "आपका दोस्त राजेश ₹450 का एक यूपीआई पेमेंट अनुरोध भेजता है जिसमें 'दोपहर के भोजन का हिस्सा' लिखा है। क्या यह एक घोटाला है?",
      gu: "તમારો મિત્ર રાજેશ 'લંચ શેર' ની વિગત સાથે ₹૪૫૦ ની UPI પેમેન્ટ રિકવેસ્ટ મોકલે છે. શું આ છેતરપિંડી છે?"
    },
    options: [
      {
        type: "safe",
        label: {
          en: "Safe: This is a normal peer-to-peer share request from a known contact.",
          hi: "सुरक्षित: यह एक परिचित व्यक्ति द्वारा भेजा गया सामान्य बिल-शेयरिंग अनुरोध है।",
          gu: "સુરક્ષિત: આ જાણીતા વ્યક્તિ તરફથી સામાન્ય બિલ શેર કરવાની વિનંતી છે."
        }
      },
      {
        type: "scam",
        label: {
          en: "Scam: All peer collect requests are digital traps and must be reported immediately.",
          hi: "स्कैम: सभी व्यक्तिगत कलेक्ट अनुरोध डिजिटल जाल होते हैं और तुरंत रिपोर्ट किए जाने चाहिए।",
          gu: "છેતરપિંડી: તમામ પર્સનલ વિનંતીઓ ફ્રોડ હોય છે અને રિપોર્ટ કરવી જોઈએ."
        }
      }
    ],
    correctAnswer: "safe",
    explanation: {
      en: "UPI allows friends to send request notifications to split bills. If you recognize the sender and requested amount, it is safe to proceed.",
      hi: "यूपीआई दोस्तों को बिल बांटने के लिए अनुरोध सूचनाएं भेजने की अनुमति देता है। यदि आप भेजने वाले और मांगी गई राशि को पहचानते हैं, तो यह सुरक्षित है।",
      gu: "UPI મિત્રોને બિલ વહેંચવા માટે રિકવેસ્ટ મોકલવાની મંજૂરી આપે છે. જો તમે મોકલનારને અને રકમને જાણો છો, તો તે સુરક્ષિત છે."
    }
  }
];

export default function ScamQuiz({ t, language, onActivityPerformed }) {
  const [scenarios, setScenarios] = useState(DEFAULT_QUIZ_SCENARIOS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const handleSpeechEnd = () => setSpeaking(false);
    window.speechSynthesis?.addEventListener?.('end', handleSpeechEnd);
    return () => {
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.removeEventListener?.('end', handleSpeechEnd);
    };
  }, []);

  const playSound = (isCorrect) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn("AudioContext block:", e);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setShowExplanation(true);
    const correct = answer === scenarios[currentIdx].correctAnswer;
    playSound(correct);

    if (correct) {
      setScore(prev => prev + 1);
      setSessionXp(prev => prev + 10);
      if (onActivityPerformed) {
        onActivityPerformed(10);
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      let bonus = 10;
      if (score === scenarios.length) {
        bonus = 50;
      } else if (score >= 3) {
        bonus = 30;
      }
      setSessionXp(prev => prev + bonus);
      if (onActivityPerformed) {
        onActivityPerformed(bonus);
      }
      setQuizFinished(true);
    }
  };

  const fetchAiQuiz = async () => {
    setIsGenerating(true);
    setQuizFinished(false);
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/generate-quiz?count=4`);
      if (response.ok) {
        const newQuestions = await response.json();
        if (newQuestions && newQuestions.length > 0) {
          setScenarios(newQuestions);
        }
      }
    } catch (e) {
      console.error("Failed to generate AI quiz, falling back to default.", e);
      setScenarios(DEFAULT_QUIZ_SCENARIOS);
    } finally {
      setCurrentIdx(0);
      setSelectedAnswer(null);
      setScore(0);
      setSessionXp(0);
      setShowExplanation(false);
      setIsGenerating(false);
    }
  };

  const handleSpeakExplanation = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    if (!window.speechSynthesis || !SpeechSynthesisUtterance) {
      alert("Voice features not supported in this browser.");
      return;
    }

    const currentScenario = scenarios[currentIdx];
    const explanationText = currentScenario.explanation[language] || currentScenario.explanation['en'];
    const utterance = new SpeechSynthesisUtterance(explanationText);
    const targetLang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith(language.toLowerCase()));
    
    if (!voice && language === 'gu') {
      voice = voices.find(v => v.name.toLowerCase().includes('gujarati') || v.name.includes('ગુજરાતી'));
    }
    if (!voice && language === 'hi') {
      voice = voices.find(v => v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी'));
    }

    if (voices.length > 0 && !voice && language !== 'en' && navigator.userAgent.includes('Windows')) {
      alert(language === 'gu' 
        ? "Windows PC માં ગુજરાતી અવાજ (TTS) ઇન્સ્ટોલ કરેલ નથી. કૃપા કરીને Windows Settings > Time & Language માં જઈને 'Gujarati' ભાષા ડાઉનલોડ કરો." 
        : "Windows PC में हिंदी आवाज़ (TTS) इंस्टॉल नहीं है। कृपया Windows Settings > Time & Language में जाकर 'Hindi' भाषा डाउनलोड करें।");
    }

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const getButtonClass = (option) => {
    const isSelected = selectedAnswer === option.type;
    const isCorrect = option.type === scenarios[currentIdx].correctAnswer;

    if (selectedAnswer === null) {
      return "border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-800 dark:text-slate-100 hover:border-blue-500";
    }

    if (isCorrect) {
      return "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-bold";
    }
    if (isSelected) {
      return "bg-red-500/10 border-red-500 text-red-750 dark:text-red-400 font-bold";
    }
    return "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60";
  };

  if (quizFinished) {
    let feedback = "";
    let rating = "";
    if (score === scenarios.length) {
      feedback = language === 'hi' ? "उत्कृष्ट! आप ऑनलाइन ठगी के खिलाफ एक सुरक्षा ढाल हैं।" :
                 language === 'gu' ? "અદ્ભુત! તમે ઓનલાઈન છેતરપિંડી સામે રક્ષક છો." :
                 "Incredible! You have perfect mastery over digital safety protocols.";
      rating = "Cyber Guard 🛡️";
    } else if (score >= 3) {
      feedback = language === 'hi' ? "अच्छा प्रयास! आप अधिकांश सामान्य स्कैम को पहचानते हैं।" :
                 language === 'gu' ? "ખૂબ સરસ! તમે મોટાભાગની છેતરપિંડી ઓળખો છો." :
                 "Great job! You recognized most cyber threats correctly.";
      rating = "Alert Citizen ⚡";
    } else {
      feedback = language === 'hi' ? "अभ्यास की आवश्यकता है। सुरक्षित रहने के लिए हमारे नियम पढ़ें।" :
                 language === 'gu' ? "વધુ અભ્યાસની જરૂર છે. સાવચેત રહેવા અમારા સુરક્ષા નિયમો વાંચો." :
                 "We recommend studying our safety rules to protect your digital banking.";
      rating = "Needs Practice 📚";
    }

    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-6 animate-fade-in transition-colors duration-300">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200 dark:border-green-800/40">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'क्विज़ पूरा हुआ!' : language === 'gu' ? 'ક્વિઝ પૂર્ણ થઈ!' : 'Quiz Completed!'}
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-900/40">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span>{rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-center">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">
              {language === 'hi' ? 'सही उत्तर' : language === 'gu' ? 'સાચા ઉત્તર' : 'Score'}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {score} / {scenarios.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-center">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">
              {language === 'hi' ? 'अर्जित एक्सपी' : language === 'gu' ? 'મેળવેલ એક્સપી' : 'Session XP'}
            </span>
            <span className="text-2xl font-black text-amber-500">
              +{sessionXp} XP
            </span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          {feedback}
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={fetchAiQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {language === 'hi' ? 'फिर से खेलें' : language === 'gu' ? 'ફરી રમો' : 'Play Again'}
          </button>
        </div>
      </div>
    );
  }

  const current = scenarios[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / scenarios.length) * 100);

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl shadow-md text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {language === 'hi' ? 'नए AI प्रश्न तैयार किए जा रहे हैं...' : language === 'gu' ? 'નવા AI પ્રશ્નો તૈયાર થઈ રહ્યા છે...' : 'Generating new AI scenarios...'}
          </h3>
          <p className="text-slate-500 text-sm">
            {language === 'hi' ? 'Gemini AI आपके लिए नए स्कैम परिदृश्य तैयार कर रहा है।' : language === 'gu' ? 'Gemini AI તમારા માટે નવા સ્કેમ દૃશ્યો તૈયાર કરી રહ્યું છે.' : 'Gemini AI is crafting fresh scam scenarios for you.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* Progress & Tracker Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2 transition-colors duration-300">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? `प्रश्न ${currentIdx + 1} / ${scenarios.length}` : 
             language === 'gu' ? `પ્રશ્ન ${currentIdx + 1} / ${scenarios.length}` : 
             `Question ${currentIdx + 1} of ${scenarios.length}`}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAiQuiz}
              className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'hi' ? 'नया AI क्विज़' : language === 'gu' ? 'નવું AI ક્વિઝ' : 'Generate AI Quiz'}</span>
            </button>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>+{sessionXp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Fill Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Scenario card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-md space-y-6 transition-colors duration-300">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl flex-shrink-0 mt-0.5">
              <Zap className="w-5 h-5 fill-blue-500 text-blue-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {current.scenario[language] || current.scenario['en']}
            </h3>
          </div>
        </div>

        {/* Option select choices */}
        <div className="space-y-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelect(opt.type)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 border rounded-2xl text-sm font-semibold text-left leading-relaxed transition-all flex items-start gap-3 ${
                selectedAnswer === null ? 'cursor-pointer' : ''
              } ${getButtonClass(opt)}`}
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs mt-0.5 font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt.label[language] || opt.label['en']}</span>
            </button>
          ))}
        </div>

        {/* Dynamic explanation panel */}
        {showExplanation && (
          <div className="p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 animate-fade-in relative">
            <div className="flex items-center gap-2">
              {selectedAnswer === current.correctAnswer ? (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'hi' ? 'सही उत्तर!' : language === 'gu' ? 'સાચો ઉત્તર!' : 'Correct Answer'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'hi' ? 'गलत उत्तर' : language === 'gu' ? 'ખોટો ઉત્તર' : 'Incorrect Answer'}</span>
                </div>
              )}

              {/* Speaker TTS button */}
              <button
                type="button"
                onClick={handleSpeakExplanation}
                className={`ml-auto p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50 ${
                  speaking ? 'ring-2 ring-blue-500 animate-pulse text-blue-600' : ''
                }`}
                title="Read Explanation Aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {t.smsExplanation}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {current.explanation[language] || current.explanation['en']}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
              >
                <span>{language === 'hi' ? 'अगला प्रश्न' : language === 'gu' ? 'આગળનો પ્રશ્ન' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
