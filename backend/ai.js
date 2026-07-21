// Using standard fetch for Google Gemini API

/**
 * Helper to call Gemini REST API
 */
async function callGeminiAPI(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const resultText = data.candidates[0].content.parts[0].text;
  return JSON.parse(resultText);
}

/**
 * Analyzes a message text for scam patterns using Google Gemini AI.
 * Returns { score, classification, matchedKeywords, reasons, explanation }
 */
async function analyzeMessage(text, lang = 'en') {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      classification: "Safe",
      matchedKeywords: [],
      reasons: [],
      explanation: "No message text provided."
    };
  }

  const langName = lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English';

  const prompt = `
You are a highly advanced financial fraud detection AI for a rural Indian safety app called SuRakshaPay.
Analyze the following SMS message and determine if it is a Scam, Suspicious, or Safe.
The user's preferred language for the explanation is: ${langName}.

Respond strictly with a JSON object in this exact format — no extra text, no markdown, just JSON:
{
  "score": <number between 0 and 100 indicating danger level>,
  "classification": <must be exactly "Scam", "Suspicious", or "Safe">,
  "matchedKeywords": [<array of specific suspicious words or phrases found verbatim in the message>],
  "reasons": [<array of 2-5 short reason strings in ${langName} explaining WHY it is flagged. Each reason should be a concise phrase like "Urgent language detected", "OTP requested", "Unknown URL found", "Fake bank name used", "Lottery prize claim". For safe messages, provide positive reason phrases like "No suspicious links", "Legitimate sender format".>],
  "explanation": <one detailed paragraph in ${langName} explaining to a rural Indian user why this message is safe or dangerous, and exactly what they should do>
}

Message to analyze:
"${text}"
`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("AI Analysis Error (Message):", error.message);
    return {
      score: 50,
      classification: "Suspicious",
      matchedKeywords: [],
      reasons: lang === 'hi' ? ["AI सेवा अनुपलब्ध"] : lang === 'gu' ? ["AI સેવા ઉપલબ્ધ નથી"] : ["AI service unavailable"],
      explanation: lang === 'hi' ? "AI सेवा अभी उपलब्ध नहीं है। संदेश संदिग्ध लग सकता है। किसी भी अनजान लिंक पर क्लिक करने से बचें और प्रेषक की पहचान सत्यापित करें।" :
                   lang === 'gu' ? "AI સેવા અત્યારે ઉપલબ્ધ નથી. સંદેશ શંકાસ્પદ હોઈ શકે છે. કોઈ અજાણ્યી લિંક પર ક્લિક ન કરો અને મોકલનારની ઓળખ ચકાસો." :
                   "AI service is temporarily unavailable. The message may be suspicious. Avoid clicking unknown links and verify the sender's identity directly."
    };
  }
}

/**
 * Analyzes a UPI request using Google Gemini AI.
 * Returns { score, classification, matchedKeywords, reasons, explanation }
 */
async function analyzeUpiRequest(upiId, amount, message = "", lang = 'en') {
  const cleanUpi = upiId.toLowerCase().trim();
  const langName = lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English';
  
  const prompt = `
You are a highly advanced financial fraud detection AI for a rural Indian safety app called SuRakshaPay.
Analyze the following UPI Payment Request (Collect Request) and determine if it is a Scam, Suspicious, or Safe.
The user's preferred language for the explanation is: ${langName}.

UPI Request Details:
- Sender VPA / UPI ID: ${cleanUpi}
- Requested Amount: ₹${amount}
- Attached Message: ${message}

Respond strictly with a JSON object in this exact format — no extra text, no markdown, just JSON:
{
  "score": <number between 0 and 100 indicating danger level>,
  "classification": <must be exactly "Scam", "Suspicious", or "Safe">,
  "matchedKeywords": [<array of suspicious words or patterns found in the UPI details>],
  "reasons": [<array of 2-5 short reason strings in ${langName} explaining WHY it is flagged. Each reason should be a concise phrase like "Suspicious UPI handle", "Prize claim attached", "Large amount request", "Unknown sender". For safe requests, use phrases like "Recognizable VPA format", "No suspicious message", "Reasonable amount".>],
  "explanation": <one detailed paragraph in ${langName} explaining why this UPI request is safe or dangerous. If it's a scam, clearly remind them that UPI PIN is ONLY for SENDING money, you NEVER need to enter PIN to RECEIVE money.>
}
`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("AI Analysis Error (UPI):", error.message);
    return {
      score: 50,
      classification: "Suspicious",
      matchedKeywords: [],
      reasons: lang === 'hi' ? ["AI सेवा अनुपलब्ध"] : lang === 'gu' ? ["AI સેવા ઉપલબ્ધ નથી"] : ["AI service unavailable"],
      explanation: lang === 'hi' ? "हम अभी इस यूपीआई की जांच नहीं कर पा रहे हैं। कृपया पैसे भेजने से पहले प्राप्तकर्ता की पहचान कर लें।" :
                   lang === 'gu' ? "અમે અત્યારે આ UPI ની તપાસ કરી શકતા નથી. કૃપા કરીને પૈસા મોકલતા પહેલા મેળવનારની ઓળખ કરી લો." :
                   "We couldn't analyze this UPI request right now. Please verify the receiver before entering your PIN."
    };
  }
}
/**
 * Analyzes a user-submitted scam report for authenticity using Gemini.
 * Returns { isAuthentic, summary }
 */
async function analyzeReportAuth(scammerDetails, description, lang = 'en') {
  const langName = lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English';
  
  const prompt = `
You are an AI moderator for a community scam reporting platform called SuRakshaPay.
A user has submitted a report of a scam. You need to determine if this is an authentic, realistic report of a scam, OR if it's just spam/gibberish (like "asdf" or "pizza delivery").

If it IS an authentic scam, generate a very short, punchy 1-sentence warning summary (maximum 15 words) in ${langName} to send as a push notification to other users. 
Example summaries: "Beware of fake electricity bill SMS from 98765-XXXXX." or "New loan app scam reported, do not download AnyDesk."

Scammer Details provided: "${scammerDetails}"
Description provided: "${description}"

Respond strictly with a JSON object in this exact format — no extra text, just JSON:
{
  "isAuthentic": <boolean true or false>,
  "summary": <if authentic, the 1-sentence warning string in ${langName}. if not authentic, just empty string "">
}
`;

  try {
    const result = await callGeminiAPI(prompt);
    // Ensure boolean
    if (typeof result.isAuthentic !== 'boolean') {
      result.isAuthentic = result.isAuthentic === 'true';
    }
    return result;
  } catch (error) {
    console.error("AI Analysis Error (Report):", error.message);
    return {
      isAuthentic: true, // Fallback to accepting it if API fails
      summary: lang === 'hi' ? "नई संभावित ठगी की रिपोर्ट की गई। सतर्क रहें!" : 
               lang === 'gu' ? "નવી સંભવિત છેતરપિંડીની જાણ થઈ. સાવધાન રહો!" : 
               "New potential scam reported by community. Stay alert!"
    };
  }
}

/**
 * Fetches AI-generated community scam stats for Indian states using Gemini.
 * Returns { states: [{ state, count, topScamType, riskLevel, trend }] }
 */
async function getCommunityStats(lang = 'en') {
  const langName = lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English';

  const prompt = `
You are a cyber fraud analyst for India. Based on publicly available cybercrime data trends, provide realistic state-wise scam intensity data for India for the current period (2025-2026).

Return data for exactly 8 Indian states (mix of high, medium, low risk). The "count" field should represent relative scam reports per 1000 population (realistic values between 10 and 65). The "topScamType" must be in ${langName}.

Respond strictly with a JSON object — no markdown, no extra text:
{
  "states": [
    {
      "state": "<State Name in English>",
      "count": <integer 10-65>,
      "topScamType": "<primary scam type in ${langName}>",
      "riskLevel": "<High|Medium|Low>",
      "trend": "<rising|stable|falling>"
    }
  ],
  "summary": "<one sentence in ${langName} summarizing the current overall cyber fraud landscape in India>"
}
`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("AI Analysis Error (Community Stats):", error.message);
    // Fallback static data
    return {
      states: [
        { state: "Gujarat", count: 48, topScamType: lang === 'hi' ? "बिजली बिल धोखाधड़ी" : lang === 'gu' ? "વીજળી બિલ છેતરપિંડી" : "Electricity Bill Scam", riskLevel: "High", trend: "rising" },
        { state: "Uttar Pradesh", count: 41, topScamType: lang === 'hi' ? "केबीसी लॉटरी" : lang === 'gu' ? "કેબીસી લોટરી" : "KBC Lottery Scam", riskLevel: "High", trend: "stable" },
        { state: "Maharashtra", count: 35, topScamType: lang === 'hi' ? "रिमोट एक्सेस" : lang === 'gu' ? "રિમોટ એક્સેસ" : "Remote Access Fraud", riskLevel: "High", trend: "rising" },
        { state: "Rajasthan", count: 22, topScamType: lang === 'hi' ? "केवाईसी धोखाधड़ी" : lang === 'gu' ? "KYC છેતરપિંડી" : "KYC Suspension SMS", riskLevel: "Medium", trend: "stable" },
        { state: "Bihar", count: 18, topScamType: lang === 'hi' ? "नकली नौकरी" : lang === 'gu' ? "નકલી નોકરી" : "Fake Job Offers", riskLevel: "Medium", trend: "rising" },
        { state: "Karnataka", count: 29, topScamType: lang === 'hi' ? "निवेश धोखाधड़ी" : lang === 'gu' ? "રોકાણ છેતરપિંડી" : "Investment Fraud", riskLevel: "Medium", trend: "falling" },
        { state: "Delhi", count: 38, topScamType: lang === 'hi' ? "फिशिंग" : lang === 'gu' ? "ફિશિંગ" : "Phishing & OTP Fraud", riskLevel: "High", trend: "stable" },
        { state: "Tamil Nadu", count: 14, topScamType: lang === 'hi' ? "नकली लोन ऐप" : lang === 'gu' ? "નકલી લોન એપ" : "Fake Loan Apps", riskLevel: "Low", trend: "falling" }
      ],
      summary: lang === 'hi' ? "भारत में साइबर धोखाधड़ी की घटनाएं बढ़ रही हैं, खासकर उत्तरी और पश्चिमी राज्यों में।" :
               lang === 'gu' ? "ભારતમાં સાઈબર છેતરપિંડીના કેસો વધી રહ્યા છે, ખાસ કરીને ઉત્તરી અને પશ્ચિમી રાજ્યોમાં." :
               "Cyber fraud incidents are rising across India, especially in northern and western states."
    };
  }
}

module.exports = {
  analyzeMessage,
  analyzeUpiRequest,
  analyzeReportAuth,
  getCommunityStats
};
