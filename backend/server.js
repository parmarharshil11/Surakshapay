require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeMessage, analyzeUpiRequest, analyzeReportAuth, getCommunityStats, translateText, generateQuizQuestions } = require('./ai');
const { getHistory, addHistoryEntry, clearHistory } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow Vercel frontend and localhost dev server
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://surakshapay-v1.vercel.app',      // Your Vercel domain
  process.env.FRONTEND_URL,                 // Override via Render env var
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '2mb' }));


// Scam Education Library Data
const SCAMS_LIBRARY = [
  {
    id: "kyc_scam",
    title: {
      en: "Fake KYC / PAN Update Call",
      hi: "केवाईसी / पैन कार्ड अपडेट कॉल",
      gu: "કેવાયસી / પાન કાર્ડ અપડેટ કોલ"
    },
    dangerLevel: "High",
    howItWorks: {
      en: "Scammer sends a message saying your SIM or bank account is blocked, then calls you posing as an executive. They ask for your Aadhaar, PAN, and finally an OTP to 'unblock' it.",
      hi: "ठग संदेश भेजता है कि आपका सिम या बैंक खाता ब्लॉक है, फिर अधिकारी बनकर कॉल करता है। वे आपका आधार, पैन और 'अनब्लॉक' करने के लिए अंत में ओटीपी मांगते हैं।",
      gu: "ઠગ સંદેશો મોકલે છે કે તમારું સીમ અથવા બેંક ખાતું બ્લોક છે, પછી અધિકારી બનીને કોલ કરે છે. તેઓ તમારું આધાર, પાન અને 'અનબ્લોક' કરવા માટે છેલ્લે ઓટીપી માંગે છે."
    },
    example: {
      en: "\"Dear customer, your bank account is suspended due to pending KYC verification. Please call bank manager at 98765-XXXXX immediately to update.\"",
      hi: "\"प्रिय ग्राहक, आपका बैंक खाता लंबित केवाईसी सत्यापन के कारण बंद कर दिया गया है। अपडेट करने के लिए तुरंत बैंक मैनेजर को 98765-XXXXX पर कॉल करें।\"",
      gu: "\"પ્રિય ગ્રાહક, તમારું બેંક ખાતું કેવાયસી વેરિફિકેશન બાકી હોવાથી બંધ કરવામાં આવ્યું છે. અપડેટ કરવા માટે તરત જ બેંક મેનેજરને 98765-XXXXX પર કોલ કરો.\""
    },
    whatToDo: {
      en: [
        "Never share OTP, PIN, CVV, or card numbers with anyone on call.",
        "Remember that banks never call you to update KYC using personal numbers or links.",
        "If in doubt, physically visit your nearest bank branch."
      ],
      hi: [
        "कॉल पर किसी के साथ भी ओटीपी, पिन, सीवीवी या कार्ड नंबर साझा न करें।",
        "याद रखें कि बैंक कभी भी व्यक्तिगत नंबरों या लिंक्स के जरिए केवाईसी अपडेट के लिए कॉल नहीं करते।",
        "यदि कोई संदेह हो, तो अपनी नजदीकी बैंक शाखा में जाकर स्वयं पुष्टि करें।"
      ],
      gu: [
        "કોલ પર કોઈની પણ સાથે ઓટીપી, પિન, સીવીવી અથવા કાર્ડ નંબર શેર કરશો નહીં.",
        "યાદ રાખો કે બેંકો ક્યારેય વ્યક્તિગત નંબર કે લિંક દ્વારા કેવાયસી અપડેટ માટે કોલ કરતી નથી.",
        "જો કોઈ શંકા હોય, તો તમારી નજીકની બેંક શાખાની રૂબરૂ મુલાકાત લો."
      ]
    }
  },
  {
    id: "electricity_scam",
    title: {
      en: "Electricity Bill Power-Cut Scare",
      hi: "बिजली बिल भुगतान / कनेक्शन कटने का डर",
      gu: "વીજળી બિલ ચુકવણી / કનેક્શન કાપવાનો ડર"
    },
    dangerLevel: "High",
    howItWorks: {
      en: "You get an SMS warning that your power will be cut tonight due to an unpaid bill. It directs you to call a personal mobile number, where they tell you to download an app (like AnyDesk) to make a Rs 10 test payment.",
      hi: "आपको एसएमएस मिलता है कि बिल बकाया होने से आज रात बिजली काट दी जाएगी। इसमें एक व्यक्तिगत नंबर पर कॉल करने को कहा जाता है, जहां वे आपसे एनीडेस्क डाउनलोड करवाकर ₹10 का टेस्ट पेमेंट करने को कहते हैं।",
      gu: "તમને એસએમએસ મળે છે કે બિલ બાકી હોવાથી આજે રાત્રે લાઈટ કાપી નાખવામાં આવશે. તેમાં એક વ્યક્તિગત નંબર પર કોલ કરવા કહે છે, જ્યાં તેઓ એનીડેસ્ક ડાઉનલોડ કરાવીને ₹10 ની ટેસ્ટ પેમેન્ટ કરવા કહે છે."
    },
    example: {
      en: "\"Dear customer, electricity connection will be disconnected at 9:30 PM tonight because your previous month bill was not updated. Call electricity officer 90012-XXXXX immediately.\"",
      hi: "\"प्रिय ग्राहक, आज रात 9:30 बजे बिजली काट दी जाएगी क्योंकि पिछले महीने का बिल अपडेट नहीं था। तुरंत बिजली अधिकारी 90012-XXXXX पर कॉल करें।\"",
      gu: "\"પ્રિય ગ્રાહક, આજે રાત્રે 9:30 વાગ્યે વીજળી જોડાણ કાપી નાખવામાં આવશે કારણ કે ગયા મહિનાનું બિલ અપડેટ નહોતું. તરત જ વીજળી અધિકારી 90012-XXXXX પર કોલ કરો.\""
    },
    whatToDo: {
      en: [
        "Official electricity boards never send disconnection notices from individual 10-digit mobile numbers.",
        "Never download remote access apps (AnyDesk, TeamViewer) suggested by unknown callers.",
        "Pay your electricity bills only through official apps or government portals."
      ],
      hi: [
        "बिजली विभाग कभी भी व्यक्तिगत 10-अंकों वाले मोबाइल नंबरों से बिजली काटने का नोटिस नहीं भेजता है।",
        "अज्ञात कॉलर्स के कहने पर रिमोट एक्सेस ऐप (जैसे AnyDesk, TeamViewer) कभी डाउनलोड न करें।",
        "अपने बिजली बिल का भुगतान केवल आधिकारिक सरकारी पोर्टल या भरोसेमंद ऐप्स के माध्यम से करें।"
      ],
      gu: [
        "વીજળી વિભાગ ક્યારેય પણ વ્યક્તિગત 10-આંકડાવાળા મોબાઈલ નંબર પરથી કનેક્શન કાપવાની નોટિસ મોકલતો નથી.",
        "અજાણ્યા કોલર્સના કહેવા પર રીમોટ એક્સેસ એપ (જેમ કે AnyDesk, TeamViewer) ક્યારેય ડાઉનલોડ ન કરો.",
        "તમારા વીજળી બિલની ચૂકવણી ફક્ત સત્તાવાર સરકારી પોર્ટલ અથવા ભરોસાપાત્ર એપ્સ દ્વારા જ કરો."
      ]
    }
  },
  {
    id: "upi_collect_scam",
    title: {
      en: "Fake UPI Collect Request",
      hi: "फर्जी UPI पैसे प्राप्त करने का अनुरोध",
      gu: "નકલી UPI પૈસા મેળવવાની વિનંતી"
    },
    dangerLevel: "Medium",
    howItWorks: {
      en: "Scammers send a UPI 'Collect Request' on apps like PhonePe, GPay, or Paytm, accompanied by messages like 'Receive Rs 5000 cashback!' or 'Lottery prize money'. Users mistakenly type their UPI PIN, which sends money to the scammer instead of receiving it.",
      hi: "ठग फोनपे, जीपे या पेटीएम पर एक यूपीआई 'कलेक्ट रिक्वेस्ट' भेजते हैं जिसके साथ '₹5000 कैशबैक प्राप्त करें!' या 'लॉटरी इनाम' लिखा होता है। यूजर गलती से अपना पिन डाल देते हैं, जिससे पैसे उनके पास आने के बजाय चले जाते हैं।",
      gu: "ઠગ ફોનપે, જીપે કે પેટીએમ પર UPI 'કલેક્ટ રિકવેસ્ટ' મોકલે છે જેની સાથે '₹5000 કેશબેક મેળવો!' અથવા 'લોટરી ઇનામ' લખેલું હોય છે. યુઝર્સ ભૂલથી પોતાનો પિન નાખી દે છે, જેથી પૈસા આવવાના બદલે જતા રહે છે."
    },
    example: {
      en: "\"You have won Rs. 10,000 lottery from PhonePe! Click 'Pay' and enter UPI PIN to receive money instantly in your bank account.\"",
      hi: "\"आपने फोनपे से ₹10,000 की लॉटरी जीती है! अपने बैंक खाते में तुरंत पैसे प्राप्त करने के लिए 'पे' (Pay) पर क्लिक करें और यूपीआई पिन दर्ज करें।\"",
      gu: "\"તમે ફોનપે તરફથી ₹10,000 ની લોટરી જીતી છે! તમારા બેંક ખાતામાં તરત પૈસા મેળવવા માટે 'Pay' પર ક્લિક કરો અને UPI પિન દાખલ કરો.\""
    },
    whatToDo: {
      en: [
        "Remember the GOLDEN RULE: You NEVER need to enter your UPI PIN to receive money.",
        "Decline any request that asks you to click 'Pay' if you are expecting to receive money.",
        "Regularly check receiver details and transaction amounts before submitting."
      ],
      hi: [
        "गोल्डन रूल याद रखें: पैसे प्राप्त करने (Receive) के लिए कभी भी UPI पिन दर्ज करने की आवश्यकता नहीं होती है।",
        "यदि आप पैसे मिलने की उम्मीद कर रहे हैं, तो 'पे' (Pay) विकल्प मांगने वाले किसी भी अनुरोध को खारिज (Decline) कर दें।",
        "पिन डालने से पहले हमेशा प्राप्तकर्ता का नाम और राशि को ध्यान से पढ़ें।"
      ],
      gu: [
        "ગોલ્ડન રૂલ યાદ રાખો: પૈસા મેળવવા (Receive) માટે ક્યારેય UPI પિન નાખવાની જરૂર હોતી નથી.",
        "જો તમે પૈસા મળવાની આશા રાખી રહ્યા હોવ, તો 'Pay' લખેલી કોઈપણ વિનંતીને નકારી (Decline) કાઢો.",
        "પિન નાખતા પહેલા હંમેશા મેળવનારનું નામ અને રકમ ધ્યાનથી વાંચી લો."
      ]
    }
  },
  {
    id: "loan_app_scam",
    title: {
      en: "Fake Instant Loan Apps",
      hi: "फर्जी इंस्टेंट लोन ऐप ठगी",
      gu: "નકલી ઇન્સ્ટન્ટ લોન એપ છેતરપિંડી"
    },
    dangerLevel: "High",
    howItWorks: {
      en: "Advertisements offer instant loans with 'no paperwork' or credit score checks. Once you install the app, it copies your photo gallery and contact list. They disburse a tiny amount, then blackmail you by threatening to send edited photos to your friends and family.",
      hi: "विज्ञापन 'बिना दस्तावेज' या बिना सिबिल स्कोर के तुरंत लोन की पेशकश करते हैं। ऐप इंस्टॉल करते ही यह आपकी गैलरी और संपर्कों की सूची कॉपी कर लेता है। फिर वे ब्लैकमेल करके मनमाना पैसा मांगते हैं और रिश्तेदारों को कॉल करने की धमकी देते हैं।",
      gu: "જાહેરાતો 'કોઈ દસ્તાવેજ વગર' કે સિબિલ સ્કોર વગર તરત લોનની ઓફર કરે છે. એપ ઇન્સ્ટોલ કરતા જ તે તમારી ગેલેરી અને કોન્ટેક્ટ લિસ્ટ કોપી કરી લે છે. પછી તેઓ બ્લેકમેલ કરીને પૈસા પડાવે છે અને સગા-સંબંધીઓને કોલ કરવાની ધમકી આપે છે."
    },
    example: {
      en: "\"Need money urgently? Get Instant Loan up to Rs 50,000 without income proof. Click link to download app and get money in 2 minutes: http://fakeloan.apk\"",
      hi: "\"तुरंत पैसों की जरूरत है? बिना किसी आमदनी के सबूत के ₹50,000 तक का तुरंत लोन पाएं। ऐप डाउनलोड करने और 2 मिनट में पैसे पाने के लिए लिंक पर क्लिक करें: http://fakeloan.apk\"",
      gu: "\"તરત પૈસાની જરૂર છે? આવકના પુરાવા વગર ₹50,000 સુધીની ઇન્સ્ટન્ટ લોન મેળવો. એપ ડાઉનલોડ કરવા અને 2 મિનિટમાં પૈસા મેળવવા લિંક પર ક્લિક કરો: http://fakeloan.apk\""
    },
    whatToDo: {
      en: [
        "Never download loan apps from external links or untrustworthy app stores (always use Google Play Store).",
        "Check if the loan app is affiliated with a RBI-registered NBFC or Bank before applying.",
        "Do not grant unnecessary permissions like Contacts, Gallery, or Call Logs to loan applications."
      ],
      hi: [
        "बाहरी लिंक या अज्ञात स्टोर से कभी भी लोन ऐप्स डाउनलोड न करें (हमेशा गूगल प्ले स्टोर का उपयोग करें)।",
        "लोन लेने से पहले जांचें कि क्या वह ऐप आरबीआई (RBI) द्वारा पंजीकृत बैंक या गैर-बैंकिंग वित्तीय कंपनी (NBFC) से जुड़ा है।",
        "लोन ऐप्स को कॉन्टैक्ट्स (Contacts), गैलरी (Gallery) या कॉल लॉग्स (Call Logs) की अनुमति कभी न दें।"
      ],
      gu: [
        "બાહ્ય લિંક અથવા અજાણ્યા સ્ટોર્સ પરથી ક્યારેય લોન એપ્સ ડાઉનલોડ કરશો નહીં (હંમેશા ગૂગલ પ્લે સ્ટોરનો ઉપયોગ કરો).",
        "લોન લેતા પહેલા તપાસો કે તે એપ આરબીઆઈ (RBI) રજીસ્ટર્ડ બેંક અથવા NBFC સાથે જોડાયેલી છે કે નહીં.",
        "લોન એપ્સને કોન્ટેક્ટ્સ (Contacts), ગેલેરી (Gallery) અથવા કોલ લોગ્સની પરવાનગી ક્યારેય ન આપો."
      ]
    }
  },
  {
    id: "ai_impersonation_scam",
    title: {
      en: "AI Impersonation & Deepfake Scams",
      hi: "AI नकल / डीपफेक धोखाधड़ी",
      gu: "AI નકલ / ડીપફેક છેતરપિંડી"
    },
    dangerLevel: "High",
    howItWorks: {
      en: "Scammers use Artificial Intelligence to clone the voice of a family member or bank official from social media clips. They call you pretending to be that person in an emergency, asking for immediate money transfer. In more advanced attacks, they use AI-generated deepfake video calls that look and sound exactly like a real person — even a police officer or your boss — to pressure you into sending money or sharing sensitive details.",
      hi: "ठग आर्टिफिशियल इंटेलिजेंस का उपयोग करके सोशल मीडिया क्लिप से किसी परिवार के सदस्य या बैंक अधिकारी की आवाज़ की नकल करते हैं। वे उस व्यक्ति के रूप में इमरजेंसी में फोन करके तुरंत पैसे ट्रांसफर करवाते हैं। अधिक उन्नत हमलों में वे AI-जनित डीपफेक वीडियो कॉल का उपयोग करते हैं जो बिल्कुल असली लगती है — यहां तक कि पुलिस अधिकारी या आपके बॉस जैसी — आपको पैसे भेजने या संवेदनशील जानकारी साझा करने के लिए दबाव बनाने के लिए।",
      gu: "ઠગ આર્ટિફિશિયલ ઇન્ટેલિજન્સ વડે સોશ્યલ મીડિયા ક્લિપ્સ પરથી કોઈ પરિવારના સભ્ય અથવા બેંક અધિકારીના અવાજની નકલ કરે છે. તેઓ ઈમર્જન્સી ઊભી કરીને તાત્કાલિક પૈસા ટ્રાન્સફર કરાવવા ફોન કરે છે. વધુ અદ્યતન હુમલામાં, તેઓ AI-નિર્મિત ડીપફેક વીડિયો કોલ વાપરે છે જે બિલ્કુલ સાચા લાગે છે — પોલીસ અધિકારી કે તમારા બોસ જેવા — તમને પૈસા મોકલવા અથવા ગુપ્ત માહિતી શેર કરવા માટે દબાણ કરવા."
    },
    example: {
      en: "\"Hello beta, I am in a serious accident near Surat. I need Rs 50,000 transferred to this number immediately. Please don't tell anyone, I'll explain later.\" (The voice sounds exactly like your relative, but it is AI-generated.)",
      hi: "\"हेलो बेटा, मैं सूरत के पास एक गंभीर दुर्घटना में हूं। मुझे अभी इस नंबर पर ₹50,000 ट्रांसफर चाहिए। कृपया किसी को मत बताना, मैं बाद में समझाऊंगा।\" (आवाज़ बिल्कुल आपके रिश्तेदार जैसी लगती है, लेकिन यह AI द्वारा बनाई गई है।)",
      gu: "\"હેલો બેટા, હું સુરત પાસે ગંભીર અકસ્માતમાં છું. મારે હમણાં જ આ નંબર પર ₹50,000 ટ્રાન્સફર જોઈએ. કૃપા કરીને કોઈને ન કહો, હું પછી સમજાવીશ.\" (અવાજ બિલ્કુલ તમારા સગા જેવો લાગે છે, પરંતુ તે AI દ્વારા બનાવેલો છે.)"
    },
    whatToDo: {
      en: [
        "DETECT — Listen for unnatural pauses, robotic tone, or slight distortion in the voice. AI clones often struggle with emotions and regional accents.",
        "VERIFY — Always hang up and call back the person directly on their known saved number to confirm if it's really them.",
        "USE A SECRET CODE — Set up a family 'safe word' that only real family members know, to use in emergencies as verification.",
        "FREEZE THE CALL — On a video call, ask the person to wave their hand, touch their face in an unusual way, or read out a random word. Deepfakes often glitch with complex real-time movements.",
        "NEVER TRANSFER MONEY — No matter how urgent the story sounds, do not send money based solely on a call or video request. Visit or call them on a second number first.",
        "REPORT — Report AI voice/video scam calls to cybercrime.gov.in or call the national helpline 1930 immediately."
      ],
      hi: [
        "पहचानें — आवाज़ में असुदृढ़ विराम, रोबोटिक टोन या हल्की विकृति को सुनें। AI क्लोन अक्सर भावनाओं और क्षेत्रीय उच्चारण के साथ संघर्ष करते हैं।",
        "सत्यापित करें — हमेशा कॉल काटें और उस व्यक्ति को उनके ज्ञात सहेजे नंबर पर वापस कॉल करके पुष्टि करें।",
        "गुप्त कोड बनाएं — परिवार में एक 'सेफ वर्ड' तय करें जो केवल असली परिवार के सदस्य जानते हों, ताकि आपात स्थिति में सत्यापन के रूप में उपयोग हो सके।",
        "वीडियो कॉल पर — व्यक्ति को हाथ हिलाने, चेहरे को असामान्य तरीके से छूने या कोई यादृच्छिक शब्द बोलने को कहें। डीपफेक अक्सर जटिल रियल-टाइम हरकतों में गड़बड़ा जाते हैं।",
        "पैसे ट्रांसफर न करें — कहानी कितनी भी जरूरी लगे, केवल कॉल या वीडियो अनुरोध के आधार पर पैसे न भेजें। पहले दूसरे नंबर से संपर्क करें।",
        "रिपोर्ट करें — cybercrime.gov.in पर या राष्ट्रीय हेल्पलाइन 1930 पर तुरंत AI वॉयस/वीडियो स्कैम कॉल की रिपोर्ट करें।"
      ],
      gu: [
        "ઓળખો — અવાજમાં અકુદરતી વિરામ, રોબોટિક સ્વર, કે હળવી વિકૃતિ સાંભળો. AI ક્લોન ઘણી વાર ભાવ અને પ્રાદેશિક ઉચ્ચારણ સાથે ઝઝૂમે છે.",
        "ચકાસો — હંમેશા કોલ કાપીને તે વ્યક્તિને તેમના જાણીતા સેવ નંબર પર સીધા ફોન કરીને ખાતરી કરો.",
        "ગુપ્ત કોડ નક્કી કરો — પરિવારમાં એક 'સેફ વર્ડ' ઠરાવો જે ફક્ત સાચા પરિવારના સભ્ય જ જાણે, ઈમર્જન્સીમાં ચકાસણી તરીકે વાપરવા.",
        "વીડિયો કોલ પર — વ્યક્તિને હાથ હલાવવા, ચહેરાને અસામાન્ય રીતે સ્પર્શ કરવા, અથવા કોઈ રેન્ડમ શબ્દ બોલવા કહો. ડીપફેક ઘણી વાર ગૂંચવાઈ જાય છે.",
        "પૈસા ટ્રાન્સફર ન કરો — વાત ગમે તેટલી તાકીદની લાગે, ફક્ત કોલ કે વીડિયો વિનંતીના આધારે પૈસા ન મોકલો. પહેલા બીજા નંબરેથી સંપર્ક કરો.",
        "ફરિયાદ નોંધો — cybercrime.gov.in પર અથવા રાષ્ટ્રીય હેલ્પલાઈન 1930 પર AI વૉઈસ/વીડિયો સ્કૅમ કોલની તાત્કાલિક ફરિયાદ નોંધો."
      ]
    }
  }
];

// 1. Text/SMS Checker Endpoint
app.post('/api/check-message', async (req, res) => {
  const { text, lang = 'en' } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const analysis = await analyzeMessage(text, lang);
  
  // Log check to database
  const loggedEntry = addHistoryEntry({
    type: "message",
    inputText: text,
    score: analysis.score,
    classification: analysis.classification,
    matchedKeywords: analysis.matchedKeywords,
    explanation: analysis.explanation,
    lang
  });

  return res.json({
    ...analysis,
    dbId: loggedEntry ? loggedEntry.id : null,
    timestamp: loggedEntry ? loggedEntry.timestamp : new Date().toISOString()
  });
});

// 2. Fake UPI Request Detector Endpoint
app.post('/api/check-upi', async (req, res) => {
  const { upiId, amount, message = "", lang = 'en' } = req.body;
  
  if (!upiId) {
    return res.status(400).json({ error: "UPI ID is required" });
  }

  const analysis = await analyzeUpiRequest(upiId, amount, message, lang);

  // Log check to database
  const loggedEntry = addHistoryEntry({
    type: "upi",
    upiId,
    amount: parseFloat(amount) || 0,
    messageContent: message,
    score: analysis.score,
    classification: analysis.classification,
    explanation: analysis.explanation,
    lang
  });

  return res.json({
    ...analysis,
    dbId: loggedEntry ? loggedEntry.id : null,
    timestamp: loggedEntry ? loggedEntry.timestamp : new Date().toISOString()
  });
});

// 3. Scam Education Library Endpoint
app.get('/api/scams', (req, res) => {
  return res.json(SCAMS_LIBRARY);
});

// 4. Generate Dynamic Quiz Endpoint
app.get('/api/generate-quiz', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 3;
    const questions = await generateQuizQuestions(count);
    return res.json(questions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return res.status(500).json({ error: "Failed to generate quiz." });
  }
});

// 7. Community Stats (Gemini-powered) Endpoint
// Simple in-memory cache: 5-minute TTL per language
const communityCache = {};
app.get('/api/community-stats', async (req, res) => {
  const lang = req.query.lang || 'en';
  const cacheKey = `community_${lang}`;
  const now = Date.now();

  if (communityCache[cacheKey] && (now - communityCache[cacheKey].ts) < 5 * 60 * 1000) {
    return res.json({ ...communityCache[cacheKey].data, cached: true });
  }

  try {
    const data = await getCommunityStats(lang);
    communityCache[cacheKey] = { data, ts: now };
    return res.json({ ...data, cached: false });
  } catch (err) {
    console.error('Community stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch community stats' });
  }
});

// 8. On-Demand Translation Endpoint
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'text and targetLang are required' });
  }

  try {
    const translatedText = await translateText(text, targetLang);
    return res.json({ translatedText });
  } catch (err) {
    console.error('Translation error:', err);
    return res.status(500).json({ error: 'Failed to translate text' });
  }
});

// 4. Get History Endpoint
app.get('/api/history', (req, res) => {
  const history = getHistory();
  return res.json(history);
});

// 5. Clear History Endpoint
app.delete('/api/history', (req, res) => {
  const success = clearHistory();
  if (success) {
    return res.json({ success: true, message: "History cleared successfully" });
  } else {
    return res.status(500).json({ error: "Failed to clear history" });
  }
});

// 6. Simulate reporting a scam (we save it in history database as "reported")
app.post('/api/report', async (req, res) => {
  const { type, scammerDetails, description, lang = 'en' } = req.body;
  
  if (!scammerDetails || !description) {
    return res.status(400).json({ error: "Scammer details and description are required" });
  }

  // 1. Ask AI to verify if it's a real scam and generate summary
  const analysis = await analyzeReportAuth(scammerDetails, description, lang);

  // 2. Add to history
  const reportLog = addHistoryEntry({
    type: "reported_scam",
    scammerDetails,
    description,
    classification: "Reported",
    score: analysis.isAuthentic ? 100 : 0, 
    explanation: lang === 'hi' 
      ? "सफलतापूर्वक दर्ज किया गया। याद रखें: आधिकारिक शिकायत दर्ज करने के लिए टोल-फ्री 1930 नंबर डायल करें।" 
      : lang === 'gu'
      ? "સફળતાપૂર્વક નોંધણી થઈ ગઈ છે. યાદ રાખો: સત્તાવાર ફરિયાદ માટે ટોલ-ફ્રી નંબર 1930 ડાયલ કરો."
      : "Successfully simulated report. Note: For actual filing, call toll-free 1930 Cyber Helpline.",
    lang
  });

  // 3. Return response with AI summary
  return res.json({
    success: true,
    isAuthentic: analysis.isAuthentic,
    summary: analysis.summary,
    message: "Report logged locally for demo",
    dbId: reportLog ? reportLog.id : null,
    timestamp: reportLog ? reportLog.timestamp : new Date().toISOString()
  });
});

// Start express server
app.listen(PORT, () => {
  console.log(`SuRakshaPay backend running on port ${PORT}`);
});
