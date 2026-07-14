const RULES = {
  KYC_BLOCK: {
    weight: 35,
    keywords: [
      "kyc", "block", "suspended", "pan card", "aadhaar", "verify identity",
      "kyc update", "update kyc", "pan card update", "account block",
      "खाता ब्लॉक", "केवाईसी", "पैन कार्ड", "आधार", "अपडेट केवाईसी", "बंद हो गया",
      "ખાતું બ્લોક", "કેવાયસી", "પાન કાર્ડ", "આધાર", "અપડેટ કેવાયસી", "બંધ થઈ ગયું",
      "block ho gaya", "kyc block", "suspend ho gaya", "pan update", "aadhar card"
    ],
    explanations: {
      en: "Banks never threaten to block your account or demand KYC/PAN updates urgently via SMS links. This is a common identity theft trick.",
      hi: "बैंक कभी भी एसएमएस लिंक के जरिए आपके खाते को ब्लॉक करने की धमकी नहीं देते या तुरंत केवाईसी/पैन अपडेट की मांग नहीं करते हैं। यह पहचान चोरी करने का एक तरीका है।",
      gu: "બેંકો ક્યારેય એસએમએસ લિંક દ્વારા તમારું ખાતું બ્લોક કરવાની ધમકી આપતી નથી કે તાત્કાલિક કેવાયસી/પાન અપડેટની માંગ કરતી નથી. આ ઓળખ ચોરી કરવાની સામાન્ય યુક્તિ છે."
    }
  },
  LOTTERY_PRIZE: {
    weight: 40,
    keywords: [
      "lottery", "won prize", "kbc", "crore", "lakh", "congratulations", "won",
      "gift card", "reward point", "cashback", "lucky draw", "prize money",
      "लॉटरी", "इनाम", "करोड़", "लाख", "कैशबैक", "बधाई हो", "लकी ड्रा",
      "લોટરી", "ઇનામ", "કરોડ", "લાખ", "કેશબેક", "અભિનંદન", "લકી ડ્રો",
      "lottery lag gayi", "prize jeeta", "inaam mila", "kbc prize"
    ],
    explanations: {
      en: "Legitimate lotteries or rewards do not contact you out of the blue, and they never ask for an upfront 'processing fee' or tax to release winnings.",
      hi: "कोई भी असली लॉटरी या इनाम अचानक आपको संपर्क नहीं करता है, और वे इनाम देने के लिए कभी भी पहले 'प्रोसेसिंग फीस' या टैक्स नहीं मांगते हैं।",
      gu: "કોઈપણ સાચી લોટરી કે ઇનામ અચાનક તમારો સંપર્ક કરતું નથી, અને તેઓ ઇનામ આપવા માટે ક્યારેય પહેલાં 'પ્રોસેસિંગ ફી' અથવા ટેક્સ માંગતા નથી."
    }
  },
  ELECTRICITY_BILL: {
    weight: 35,
    keywords: [
      "electricity bill", "power cut", "disconnected", "electricity office", 
      "light bill", "power disconnected", "bijli bill", "light cut", "unpaid bill",
      "electricity department", "official helpline", "electricity bill pending",
      "बिजली बिल", "पावर कट", "लाइट कट", "बिल बकाया", "बिजली बंद",
      "વીજળી બિલ", "લાઈટ કાપી", "પાવર કટ", "બિલ બાકી", "વીજળી બંધ"
    ],
    explanations: {
      en: "Electricity boards do not send personal SMS messages threatening disconnection tonight or ask you to call personal mobile numbers to resolve unpaid bills.",
      hi: "बिजली विभाग कभी भी निजी नंबरों से आज रात बिजली काटने की धमकी वाले व्यक्तिगत एसएमएस नहीं भेजता है, न ही बिल जमा करने के लिए किसी निजी नंबर पर कॉल करने को कहता है।",
      gu: "વીજળી બોર્ડ ક્યારેય પણ ખાનગી નંબર પરથી આજે રાત્રે કનેક્શન કાપી નાખવાની ધમકી આપતો મેસેજ મોકલતું નથી અથવા બિલ માટે કોઈ ખાનગી નંબર પર કોલ કરવા કહેતું નથી."
    }
  },
  SCREEN_SHARE: {
    weight: 40,
    keywords: [
      "anydesk", "teamviewer", "rustdesk", "screen share", "install app",
      "download app", "remote access", "any desk", "team viewer", "support agent",
      "एनीडेस्क", "स्क्रीन शेयर", "ऐप डाउनलोड", "रिमोट कंट्रोल", "ऐप इनस्टॉल",
      "એનીડેસ્ક", "સ્ક્રીન શેર", "એપ ડાઉનલોડ", "રિમોટ કંટ્રોલ", "એપ ઇન્સ્ટોલ",
      "rust desk", "download anydesk", "install support app"
    ],
    explanations: {
      en: "Scammers ask you to install screen-sharing apps like AnyDesk or TeamViewer to see your bank passwords and OTPs. Official bank agents will never ask you to install these.",
      hi: "ठग आपको AnyDesk या TeamViewer जैसे स्क्रीन-शेयरिंग ऐप डाउनलोड करने के लिए कहते हैं ताकि वे आपके पासवर्ड और ओटीपी देख सकें। बैंक अधिकारी कभी भी ऐसे ऐप डाउनलोड करने को नहीं कहते हैं।",
      gu: "ઠગ તમને AnyDesk અથવા TeamViewer જેવી સ્ક્રીન-શેરિંગ એપ્લિકેશન ડાઉનલોડ કરવા કહે છે જેથી તેઓ તમારા પાસવર્ડ અને ઓટીપી જોઈ શકે. બેંક અધિકારીઓ ક્યારેય આવી એપ્સ ડાઉનલોડ કરવા કહેતા નથી."
    }
  },
  LOAN_SCAM: {
    weight: 30,
    keywords: [
      "instant loan", "low interest", "no paperwork", "fast cash", "instant credit",
      "zero collateral", "loan approved", "micro loan", "bina security", "loan credit",
      "लोन पास", "तुरंत लोन", "कम ब्याज", "बिना पेपर", "लोन मंजूर",
      "લોન પાસ", "તરત લોન", "ઓછા વ્યાજ", "દસ્તાવેજ વગર", "લોન મંજૂર",
      "urgent loan", "easy loan", "no security loan"
    ],
    explanations: {
      en: "Be careful of fake loan apps that offer instant money with no documentation. They often charge extortionate interest rates and access your phone contacts to harass you.",
      hi: "बिना किसी दस्तावेज के तुरंत पैसे देने वाले नकली लोन ऐप्स से सावधान रहें। वे अक्सर बहुत अधिक ब्याज वसूलते हैं और आपको परेशान करने के लिए आपके संपर्कों (contacts) का गलत इस्तेमाल करते हैं।",
      gu: "કોઈપણ દસ્તાવેજ વગર તરત લોન આપતી નકલી લોન એપ્સથી સાવધાન રહો. તેઓ અતિશય વ્યાજ વસૂલે છે અને તમને હેરાન કરવા માટે તમારા ફોન કોન્ટેક્ટ્સ મેળવે છે."
    }
  },
  OTP_URGENT: {
    weight: 35,
    keywords: [
      "otp", "pin", "password", "cvv", "urgent", "immediately", "24 hours",
      "click link", "call customer care", "send otp", "share otp", "enter pin",
      "ओटीपी", "पिन", "पासवर्ड", "तुरंत", "अभी", "लिंक पर क्लिक", "कॉल करें",
      "ઓટીપી", "પિન", "પાસવર્ડ", "તરત", "હમણાં", "લિંક પર ક્લિક", "કોલ કરો",
      "call immediately", "account blocked within", "click here to unlock"
    ],
    explanations: {
      en: "Urgent demands for OTPs, PINs, or CVVs are the most common sign of a scam. No bank or organization will ever ask you to share your OTP or PIN over call or SMS.",
      hi: "ओटीपी, पिन या सीवीवी की तुरंत मांग करना ठगी का सबसे बड़ा संकेत है। कोई भी बैंक या संस्था आपसे कभी भी फोन कॉल या एसएमएस पर ओटीपी या पिन साझा करने को नहीं कहेगी।",
      gu: "ઓટીપી, પિન અથવા સીવીવીની તાત્કાલિક માંગણી એ છેતરપિંડીની સૌથી મોટી નિશાની છે. કોઈ પણ બેંક કે સંસ્થા ક્યારેય તમને ફોન કે એસએમએસ પર ઓટીપી અથવા પિન શેર કરવા કહેશે નહીં."
    }
  }
};

/**
 * Analyzes a message text for scam patterns.
 * Returns { score, classification, matchedKeywords, explanation }
 */
function analyzeMessage(text, lang = 'en') {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      classification: "Safe",
      matchedKeywords: [],
      explanation: lang === 'hi' ? "कोई संदेश नहीं दिया गया।" : lang === 'gu' ? "કોઈ સંદેશો આપ્યો નથી." : "No message provided."
    };
  }

  const cleanText = text.toLowerCase();
  let totalScore = 0;
  const matchedCategories = [];
  const matchedKeywords = [];

  // Check categories
  for (const [category, rule] of Object.entries(RULES)) {
    let categoryMatched = false;
    for (const keyword of rule.keywords) {
      if (cleanText.includes(keyword.toLowerCase())) {
        categoryMatched = true;
        // Keep track of matched keyword (prevent duplicates)
        if (!matchedKeywords.some(kw => kw.toLowerCase() === keyword.toLowerCase())) {
          matchedKeywords.push(keyword);
        }
      }
    }
    if (categoryMatched) {
      totalScore += rule.weight;
      matchedCategories.push(category);
    }
  }

  // Check for URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*)/gi;
  const hasUrl = urlRegex.test(cleanText);
  if (hasUrl) {
    totalScore += 15;
    matchedKeywords.push("http/link");
  }

  // Check for suspicious phone numbers (e.g. 10 digits or specific prefixes)
  const phoneRegex = /(\+91|91)?[6-9]\d{9}/g;
  const hasPhone = phoneRegex.test(cleanText);
  if (hasPhone) {
    totalScore += 10;
    matchedKeywords.push("phone number");
  }

  // Cap score at 100
  const finalScore = Math.min(totalScore, 100);

  // Classify risk level
  let classification = "Safe";
  if (finalScore >= 50) {
    classification = "Scam";
  } else if (finalScore >= 20) {
    classification = "Suspicious";
  }

  // Create explanation in target language
  let explanation = "";
  if (matchedCategories.length > 0) {
    explanation = matchedCategories
      .map(cat => RULES[cat].explanations[lang] || RULES[cat].explanations['en'])
      .join(" ");
  } else {
    if (hasUrl) {
      explanation = lang === 'hi' 
        ? "इस संदेश में एक बाहरी लिंक है। बिना पहचान की पुष्टि किए अनजान लिंक पर कभी भी क्लिक न करें।" 
        : lang === 'gu'
        ? "આ સંદેશામાં એક બાહ્ય લિંક છે. ઓળખની ખાતરી કર્યા વગર અજાણી લિંક્સ પર ક્યારેય ક્લિક કરશો નહીં."
        : "This message contains an external link. Never click on links in unsolicited messages.";
    } else {
      explanation = lang === 'hi' 
        ? "इस संदेश में कोई सामान्य ठगी के शब्द नहीं मिले हैं। फिर भी, अज्ञात लोगों से लेन-देन करते समय सावधान रहें।" 
        : lang === 'gu'
        ? "આ સંદેશામાં છેતરપિંડીના કોઈ સામાન્ય શબ્દો નથી મળ્યા. તેમ છતાં, અજાણ્યા લોકો સાથે વ્યવહાર કરતી વખતે સાવચેત રહો."
        : "No common scam keywords found in this message. However, always exercise caution with unknown senders.";
    }
  }

  return {
    score: finalScore,
    classification,
    matchedKeywords,
    explanation
  };
}

/**
 * Analyzes a UPI request for scams.
 * Returns { score, classification, explanation }
 */
function analyzeUpiRequest(upiId, amount, message, lang = 'en') {
  let score = 0;
  const matchedFlags = [];
  const cleanUpi = (upiId || "").toLowerCase();
  const amt = parseFloat(amount) || 0;
  const cleanMsg = (message || "").toLowerCase();

  // 1. Check suspicious handles
  const suspiciousHandles = ["lottery", "kbc", "reward", "prize", "cashback", "win", "gift", "collect", "alert", "security", "customer"];
  let hasSuspiciousHandle = false;
  for (const handle of suspiciousHandles) {
    if (cleanUpi.includes(handle)) {
      hasSuspiciousHandle = true;
    }
  }

  if (hasSuspiciousHandle) {
    score += 35;
    matchedFlags.push("suspicious_handle");
  }

  // 2. Check for suspicious words in the attachment message
  const upiScamKeywords = ["receive", "receive payment", "click to receive", "enter pin", "payout", "refund", "win", "lottery", "cashback", "prize", "प्राप्त करें", "पेमेंट पाएं", "पिन दर्ज करें", "ઇનામ", "પિન દાખલ કરો", "પૈસા મેળવો"];
  let msgScamMatched = false;
  for (const keyword of upiScamKeywords) {
    if (cleanMsg.includes(keyword)) {
      msgScamMatched = true;
    }
  }

  if (msgScamMatched) {
    score += 30;
    matchedFlags.push("scam_message");
  }

  // 3. Amount check (large amounts requested from unknown handles are higher risk)
  if (amt > 5000) {
    score += 15;
    matchedFlags.push("high_amount");
  }
  if (amt > 20000) {
    score += 10; // extra weight for very high amount
  }

  // 4. Check for common collect request phrases
  if (cleanMsg.includes("pay") || cleanMsg.includes("send") || cleanMsg.includes("debit")) {
    score += 10;
  }

  const finalScore = Math.min(score, 100);
  let classification = "Safe";
  if (finalScore >= 50) {
    classification = "Scam";
  } else if (finalScore >= 20) {
    classification = "Suspicious";
  }

  // Build explanation
  let explanation = "";
  if (classification === "Scam" || classification === "Suspicious") {
    const explanationsList = [];
    if (hasSuspiciousHandle) {
      explanationsList.push(
        lang === 'hi' 
          ? "UPI आईडी में संदेहास्पद शब्द (जैसे 'win', 'reward', 'kbc') हैं जो आमतौर पर धोखेबाज इस्तेमाल करते हैं।" 
          : lang === 'gu'
          ? "UPI આઈડીમાં શંકાસ્પદ શબ્દો (જેમ કે 'win', 'reward', 'kbc') છે જે સામાન્ય રીતે ઠગ વાપરે છે."
          : "The UPI ID contains suspicious terms (like 'win', 'reward', 'kbc') which are commonly used by scammers."
      );
    }
    if (msgScamMatched) {
      explanationsList.push(
        lang === 'hi'
          ? "संदेश में 'पैसे पाएं' या 'रिफंड' जैसी बातें लिखी हैं। याद रखें, पैसे प्राप्त करने के लिए कभी भी UPI पिन दर्ज नहीं करना पड़ता।"
          : lang === 'gu'
          ? "મેસેજમાં 'પૈસા મેળવો' અથવા 'રિફંડ' લખેલું છે. યાદ રાખો, પૈસા મેળવવા માટે ક્યારેય UPI પિન નાખવો પડતો નથી."
          : "The request message asks you to 'receive money' or 'refund'. Remember, you NEVER need to enter your UPI PIN to receive money."
      );
    }
    if (amt > 5000 && !hasSuspiciousHandle && !msgScamMatched) {
      explanationsList.push(
        lang === 'hi'
          ? "यह एक बड़ी राशि का भुगतान अनुरोध है। भुगतान करने से पहले प्राप्तकर्ता की पहचान कॉल करके सुनिश्चित करें।"
          : lang === 'gu'
          ? "આ એક મોટી રકમની ચૂકવણીની વિનંતી છે. ચૂકવણી કરતા પહેલાં મેળવનારની ઓળખ કોલ કરીને નક્કી કરો."
          : "This is a request for a significant amount of money. Double check with the recipient via phone call before paying."
      );
    }
    
    if (explanationsList.length === 0) {
      explanationsList.push(
        lang === 'hi'
          ? "यह पेमेंट अनुरोध संदिग्ध लग रहा है। कृपया किसी अनजान व्यक्ति को पैसे भेजने से बचें।"
          : lang === 'gu'
          ? "આ પેમેન્ટ વિનંતી શંકાસ્પદ લાગે છે. કૃપા કરીને કોઈ અજાણ્યા વ્યક્તિને પૈસા મોકલવાનું ટાળો."
          : "This payment request is suspicious. Please avoid sending money to unknown requesters."
      );
    }
    explanation = explanationsList.join(" ");
  } else {
    explanation = lang === 'hi'
      ? "यह अनुरोध सामान्य पैटर्न का लग रहा है। फिर भी, पैसे भेजने से पहले व्यक्ति का नाम और नंबर अवश्य जांच लें।"
      : lang === 'gu'
      ? "આ વિનંતી સામાન્ય લાગે છે. તેમ છતાં, પૈસા મોકલતા પહેલા વ્યક્તિનું નામ અને નંબર ચોક્કસ તપાસી લો."
      : "This request appears normal. However, always verify the recipient's name and identity before sending money.";
  }

  return {
    score: finalScore,
    classification,
    explanation
  };
}

module.exports = {
  analyzeMessage,
  analyzeUpiRequest,
  RULES
};
