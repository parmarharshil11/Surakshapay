// Using standard fetch for Google Gemini API to avoid dependency issues

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
 * Returns { score, classification, matchedKeywords, explanation }
 */
async function analyzeMessage(text, lang = 'en') {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      classification: "Safe",
      matchedKeywords: [],
      explanation: "No message text provided."
    };
  }

  const prompt = `
You are a highly advanced financial fraud detection AI for a rural Indian safety app called SuRakshaPay.
Analyze the following SMS message and determine if it is a Scam, Suspicious, or Safe.
The user's preferred language for the explanation is: ${lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English'}.

Respond strictly with a JSON object in this exact format:
{
  "score": <number between 0 and 100 indicating danger level>,
  "classification": <must be exactly "Scam", "Suspicious", or "Safe">,
  "matchedKeywords": [<array of suspicious words found in the message, in the original language>],
  "explanation": <detailed, helpful explanation in the user's preferred language explaining why it is safe or dangerous and what they should do>
}

Message to analyze:
"${text}"
`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("AI Analysis Error (Message):", error.message);
    // Fallback if AI fails
    return {
      score: 50,
      classification: "Suspicious",
      matchedKeywords: [],
      explanation: lang === 'hi' ? "हम अभी इस संदेश की जांच नहीं कर पा रहे हैं। कृपया सतर्क रहें और अनजान लिंक पर क्लिक न करें।" :
                   lang === 'gu' ? "અમે અત્યારે આ મેસેજની તપાસ કરી શકતા નથી. કૃપા કરીને સાવચેત રહો અને અજાણી લિંક પર ક્લિક કરશો નહીં." :
                   "We couldn't analyze this message right now. Please be cautious and avoid clicking unknown links."
    };
  }
}

/**
 * Analyzes a UPI request using Google Gemini AI.
 */
async function analyzeUpiRequest(upiId, amount, message = "", lang = 'en') {
  const cleanUpi = upiId.toLowerCase().trim();
  
  const prompt = `
You are a highly advanced financial fraud detection AI for a rural Indian safety app called SuRakshaPay.
Analyze the following UPI Payment Request (Collect Request) and determine if it is a Scam, Suspicious, or Safe.
The user's preferred language for the explanation is: ${lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English'}.

UPI Request Details:
- Sender VPA / UPI ID: ${cleanUpi}
- Requested Amount: ₹${amount}
- Attached Message: ${message}

Respond strictly with a JSON object in this exact format:
{
  "score": <number between 0 and 100 indicating danger level>,
  "classification": <must be exactly "Scam", "Suspicious", or "Safe">,
  "matchedKeywords": [<array of suspicious words found in the UPI details>],
  "explanation": <detailed, helpful explanation in the user's preferred language explaining why this UPI request is safe or dangerous. If it's a scam, remind them that PIN is only used for SENDING money, never receiving.>
}
`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("AI Analysis Error (UPI):", error.message);
    // Fallback if AI fails
    return {
      score: 50,
      classification: "Suspicious",
      matchedKeywords: [],
      explanation: lang === 'hi' ? "हम अभी इस यूपीआई की जांच नहीं कर पा रहे हैं। कृपया पैसे भेजने से पहले प्राप्तकर्ता की पहचान कर लें।" :
                   lang === 'gu' ? "અમે અત્યારે આ UPI ની તપાસ કરી શકતા નથી. કૃપા કરીને પૈસા મોકલતા પહેલા મેળવનારની ઓળખ કરી લો." :
                   "We couldn't analyze this UPI request right now. Please verify the receiver before entering your PIN."
    };
  }
}

module.exports = {
  analyzeMessage,
  analyzeUpiRequest
};
