import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, getDocs, collection, onSnapshot } from 'firebase/firestore';

// Standard Firebase config - reads from Vite env or uses placeholders
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app, auth, db;
let isMock = false;

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_")) {
  isMock = true;
  console.log("Firebase credentials not configured. Running in local fallback/mock mode.");
  
  // Create mock auth
  auth = {
    currentUser: { uid: "local_demo_user" },
    signInAnonymously: () => Promise.resolve({ user: { uid: "local_demo_user" } }),
    onAuthStateChanged: (callback) => {
      callback({ uid: "local_demo_user" });
      return () => {};
    }
  };
  
  // Create mock database references
  db = { isMock: true };
} else {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase init failed, switching to mock mode:", e);
    isMock = true;
    auth = {
      currentUser: { uid: "local_demo_user" },
      signInAnonymously: () => Promise.resolve({ user: { uid: "local_demo_user" } }),
      onAuthStateChanged: (callback) => {
        callback({ uid: "local_demo_user" });
        return () => {};
      }
    };
    db = { isMock: true };
  }
}

// Wrapper functions for document fetches so components don't have to check if it's mock
export async function getTrendingScams() {
  const staticTrending = [
    {
      id: "fact_1",
      title: {
        en: "💡 Fact: Official bank websites usually end with .bank.in (e.g. sbi.bank.in). Always check the URL!",
        hi: "💡 तथ्य: आधिकारिक बैंक वेबसाइटें अक्सर .bank.in पर समाप्त होती हैं। URL की जाँच करें!",
        gu: "💡 હકીકત: સત્તાવાર બેંક વેબસાઇટ્સ વારંવાર .bank.in પર સમાપ્ત થાય છે. URL ચકાસો!"
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_2",
      title: {
        en: "💡 Fact: Calls starting with 1600 are genuine transactional and service calls from banks.",
        hi: "💡 तथ्य: 1600 से शुरू होने वाले कॉल बैंकों से वास्तविक सेवा कॉल हैं।",
        gu: "💡 હકીકત: 1600 નંબરથી શરૂ થતા કોલ બેંકોના સત્તાવાર સેવા કોલ છે."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_3",
      title: {
        en: "💡 Fact: Genuine bank SMS messages come from registered sender IDs like AX-SBIUPI. Avoid trusting random mobile numbers.",
        hi: "💡 तथ्य: असली बैंक SMS AX-SBIUPI जैसे पंजीकृत सेंडर ID से आते हैं।",
        gu: "💡 હકીકત: અસલી બેંક SMS AX-SBIUPI જેવા નોંધાયેલ સેન્ડર ID થી આવે છે."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_4",
      title: {
        en: "💡 Fact: Dial 1930 immediately if money has been stolen through online fraud.",
        hi: "💡 तथ्य: यदि ऑनलाइन धोखाधड़ी के माध्यम से पैसे चोरी हो गए हैं तो तुरंत 1930 डायल करें।",
        gu: "💡 હકીકત: જો ઓનલાઈન છેતરપિંડી દ્વારા પૈસા ચોરાઈ ગયા હોય તો તરત જ 1930 ડાયલ કરો."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_5",
      title: {
        en: "💡 Fact: Report online fraud, phishing, hacking at the National Portal: https://cybercrime.gov.in",
        hi: "💡 तथ्य: राष्ट्रीय पोर्टल cybercrime.gov.in पर ऑनलाइन धोखाधड़ी की रिपोर्ट करें।",
        gu: "💡 હકીકત: રાષ્ટ્રીય પોર્ટલ cybercrime.gov.in પર ઓનલાઈન છેતરપિંડીની જાણ કરો."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_6",
      title: {
        en: "💡 Fact: Banks NEVER ask for your OTP, ATM PIN, CVV, or UPI PIN.",
        hi: "💡 तथ्य: बैंक कभी भी आपका OTP, ATM PIN, CVV या UPI PIN नहीं मांगते हैं।",
        gu: "💡 હકીકત: બેંકો ક્યારેય તમારો OTP, ATM PIN, CVV અથવા UPI PIN માંગતી નથી."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_7",
      title: {
        en: "💡 Fact: You enter your UPI PIN ONLY when you are paying. Receiving money does NOT require it.",
        hi: "💡 तथ्य: आप केवल पैसे भेजते समय अपना UPI PIN दर्ज करते हैं, प्राप्त करते समय कभी नहीं।",
        gu: "💡 હકીકત: તમે માત્ર પૈસા મોકલતી વખતે જ તમારો UPI PIN દાખલ કરો છો, મેળવતી વખતે ક્યારેય નહીં."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_8",
      title: {
        en: "💡 Fact: Check for HTTPS and a padlock icon in your browser before logging in.",
        hi: "💡 तथ्य: विवरण दर्ज करने से पहले हमेशा HTTPS और पैडलॉक आइकन की जाँच करें।",
        gu: "💡 હકીકત: વિગતો દાખલ કરતા પહેલા હંમેશા HTTPS અને પેડલોક આઇકન તપાસો."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_9",
      title: {
        en: "💡 Fact: Download banking apps ONLY from official Google Play Store or Apple App Store.",
        hi: "💡 तथ्य: केवल आधिकारिक प्ले स्टोर या ऐप स्टोर से बैंकिंग ऐप डाउनलोड करें।",
        gu: "💡 હકીકત: ફક્ત સત્તાવાર પ્લે સ્ટોર અથવા એપ સ્ટોર પરથી બેંકિંગ એપ્સ ડાઉનલોડ કરો."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_10",
      title: {
        en: "💡 Fact: Never install unknown screen-sharing apps like AnyDesk, TeamViewer, or RustDesk.",
        hi: "💡 तथ्य: AnyDesk या TeamViewer जैसे अज्ञात स्क्रीन-शेयरिंग ऐप कभी इंस्टॉल न करें।",
        gu: "💡 હકીકત: AnyDesk અથવા TeamViewer જેવી અજાણી સ્ક્રીન-શેરિંગ એપ્સ ક્યારેય ઇન્સ્ટોલ કરશો નહીં."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_11",
      title: {
        en: "💡 Fact: Genuine Government emails end with .gov.in or .nic.in.",
        hi: "💡 तथ्य: आधिकारिक सरकारी ईमेल .gov.in या .nic.in पर समाप्त होते हैं।",
        gu: "💡 હકીકત: સત્તાવાર સરકારી ઈમેલ .gov.in અથવા .nic.in પર સમાપ્ત થાય છે."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_12",
      title: {
        en: "💡 Fact: Enable Two-Factor Authentication (2FA) for extra security on your accounts.",
        hi: "💡 तथ्य: अतिरिक्त सुरक्षा के लिए टू-फैक्टर ऑथेंटिकेशन (2FA) सक्षम करें।",
        gu: "💡 હકીકત: વધારાની સુરક્ષા માટે ટુ-ફેક્ટર ઓથેન્ટિકેશન (2FA) સક્ષમ કરો."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_13",
      title: {
        en: "💡 Fact: If you rarely use contactless payments, disable NFC/tap-to-pay in your banking app.",
        hi: "💡 तथ्य: अतिरिक्त सुरक्षा के लिए टैप-टू-पे (NFC) को बैंकिंग ऐप में बंद किया जा सकता है।",
        gu: "💡 હકીકત: વધારાની સુરક્ષા માટે બેંકિંગ એપમાં ટેપ-ટુ-પે (NFC) બંધ કરી શકાય છે."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_14",
      title: {
        en: "💡 Fact: Fake links often create fake urgency like 'Your bank account will be blocked'.",
        hi: "💡 तथ्य: फर्जी लिंक अक्सर 'खाता ब्लॉक कर दिया जाएगा' जैसी झूठी तात्कालिकता पैदा करते हैं।",
        gu: "💡 હકીકત: નકલી લિંક્સ ઘણીવાર 'એકાઉન્ટ બ્લોક થઈ જશે' જેવી ખોટી ઉતાવળ ઉભી કરે છે."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "fact_15",
      title: {
        en: "💡 Easy Rule: STOP before clicking, THINK if suspicious, VERIFY using official channels.",
        hi: "💡 आसान नियम: क्लिक करने से पहले रुकें, सोचें, और आधिकारिक स्रोतों से सत्यापित करें (STOP-THINK-VERIFY)।",
        gu: "💡 સરળ નિયમ: ક્લિક કરતા પહેલા થોભો, વિચારો, અને સત્તાવાર માધ્યમોથી ચકાસો (STOP-THINK-VERIFY)."
      },
      region: { en: "Cyber Safety", hi: "साइबर सुरक्षा", gu: "સાઇબર સુરક્ષા" },
      date: "2026-07-12"
    },
    {
      id: "alert_4",
      title: {
        en: "Remote Access Apps Scams: Frauds asking to download AnyDesk or TeamViewer.",
        hi: "रिमोट एक्सेस ऐप ठगी: ठग AnyDesk या TeamViewer डाउनलोड करने को कहते हैं।",
        gu: "રિમોટ એક્સેસ એપ્સની છેતરપિંડી: ઠગો AnyDesk અથવા TeamViewer ડાઉનલોડ કરવા કહે છે."
      },
      region: { en: "Maharashtra", hi: "महाराष्ट्र", gu: "મહારાષ્ટ્ર" },
      date: "2026-07-06"
    },
    {
      id: "alert_5",
      title: {
        en: "PM Kisan Yojana Scams: Fake websites asking for Aadhaar and banking details.",
        hi: "पीएम किसान योजना ठगी: आधार और बैंक विवरण मांगने वाली फर्जी वेबसाइटें सक्रिय।",
        gu: "પીએમ કિસાન યોજના ફ્રોડ: આધાર અને બેંક વિગતો માંગતી નકલી વેબસાઇટ્સથી સાવચેત."
      },
      region: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश", gu: "ઉત્તર પ્રદેશ" },
      date: "2026-07-07"
    }
  ];

  if (isMock) {
    return staticTrending;
  }

  try {
    const fetchPromise = getDocs(collection(db, "trendingScams"));
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 5000));
    const qSnap = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (qSnap.empty) {
      // Seed Firestore with static data for active alerts if empty
      for (const alert of staticTrending) {
        await setDoc(doc(db, "trendingScams", alert.id), alert);
      }
      return staticTrending;
    }
    return qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore read error, loading local static alerts:", error);
    return staticTrending;
  }
}

export async function getUserSafetyScore(uid) {
  if (isMock) {
    return parseInt(localStorage.getItem(`suraksha_score_${uid}`) || "0", 10);
  }

  try {
    const fetchPromise = getDoc(doc(db, "users", uid));
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 5000));
    const docSnap = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (docSnap.exists()) {
      return docSnap.data().safetyScore || 0;
    } else {
      await setDoc(doc(db, "users", uid), { safetyScore: 0 });
      return 0;
    }
  } catch (error) {
    console.error("Firestore read score error:", error);
    return parseInt(localStorage.getItem(`suraksha_score_${uid}`) || "0", 10);
  }
}

export async function updateUserSafetyScore(uid, incrementAmount) {
  if (isMock) {
    const current = parseInt(localStorage.getItem(`suraksha_score_${uid}`) || "0", 10);
    const next = current + incrementAmount;
    localStorage.setItem(`suraksha_score_${uid}`, next);
    return next;
  }

  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    let next = incrementAmount;
    if (docSnap.exists()) {
      next = (docSnap.data().safetyScore || 0) + incrementAmount;
      await updateDoc(userDocRef, { safetyScore: next });
    } else {
      await setDoc(userDocRef, { safetyScore: next });
    }
    localStorage.setItem(`suraksha_score_${uid}`, next); // keep local cache in sync
    return next;
  } catch (error) {
    console.error("Firestore write score error:", error);
    const current = parseInt(localStorage.getItem(`suraksha_score_${uid}`) || "0", 10);
    const next = current + incrementAmount;
    localStorage.setItem(`suraksha_score_${uid}`, next);
    return next;
  }
}

export async function getCommunityReports() {
  const staticReports = [
    { state: "Gujarat", count: 42, color: "bg-red-500", topScamType: "Electricity Cut Threat" },
    { state: "Uttar Pradesh", count: 35, color: "bg-red-400", topScamType: "KBC Sweepstakes" },
    { state: "Maharashtra", count: 28, color: "bg-amber-500", topScamType: "Remote Access Apps" },
    { state: "Rajasthan", count: 19, color: "bg-amber-400", topScamType: "KYC Suspension SMS" },
    { state: "Bihar", count: 12, color: "bg-green-500", topScamType: "Fake Job Offers" }
  ];

  if (isMock) {
    return staticReports;
  }

  try {
    const fetchPromise = getDocs(collection(db, "communityReports"));
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 5000));
    const qSnap = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (qSnap.empty) {
      for (const report of staticReports) {
        await setDoc(doc(db, "communityReports", report.state), report);
      }
      return staticReports;
    }
    return qSnap.docs.map(doc => doc.data());
  } catch (e) {
    return staticReports;
  }
}

export function subscribeToAlerts(callback) {
  if (isMock) {
    return () => {};
  }
  try {
    return onSnapshot(collection(db, "trendingScams"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          callback(change.doc.data());
        }
      });
    });
  } catch (error) {
    console.error("onSnapshot alerts register error:", error);
    return () => {};
  }
}

export { auth, db, isMock };
