# SuRakshaPay 🛡️

**AI-Powered Financial Safety Shield for Rural India**

Built by **Harshil Parmar** & **Kush Thacker** | Hackathon 2026

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 **AI Scam Detection** | Google Gemini AI analyzes messages and UPI requests with a Risk Score + Detailed Reasons |
| 💬 **SMS/Message Checker** | Paste any WhatsApp, SMS, or call text to detect fraud instantly |
| 📸 **OCR Screenshot Scanner** | Upload a screenshot — Tesseract.js extracts text → Gemini AI analyzes it automatically |
| 💳 **UPI ID Verifier** | Check if a UPI collect request is fake before entering your PIN |
| 📷 **QR Code Scanner** | Camera + file upload QR scanning with AI fraud analysis |
| 📚 **Scam Education Library** | Real scam examples (KYC, Electricity, Loan, Lottery) + SMS Sender ID guide |
| 🎮 **Scam Quiz** | Interactive safety quiz with XP gamification system |
| 📢 **Live Community Alerts** | Real-time scam alerts via Firebase Firestore |
| 📊 **Scam Threat Map** | State-wise scam report heatmap |
| 🌐 **Multilingual** | English, Hindi (हिन्दी), Gujarati (ગુજરાતી) |
| 🗣️ **Voice I/O** | Text-to-Speech & Speech-to-Text in all 3 languages |
| 🌙 **Dark Mode** | Full dark mode + Mobile-First Responsive Design |
| ⚡ **PWA** | Progressive Web App with Service Worker |

---

## 🧠 How the AI Works

When a message or UPI ID is submitted (typed, voice input, or OCR-scanned screenshot), it is sent to the backend which calls **Google Gemini AI** (`gemini-flash-lite-latest`). The AI returns:

```json
{
  "score": 95,
  "classification": "Scam",
  "matchedKeywords": ["OTP", "won Rs. 25 Lakhs", "http://fake-prize.in"],
  "reasons": [
    "Unrealistic lottery prize claim",
    "OTP requested",
    "Suspicious external URL",
    "Request for sensitive bank details"
  ],
  "explanation": "This is a dangerous scam. Do NOT share your OTP or bank details..."
}
```

The UI renders the `reasons` as a color-coded **Risk Breakdown** list (🔴/🟠 for dangers, ✅ for safe signals).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Backend** | Node.js, Express 4 |
| **AI Engine** | Google Gemini (`gemini-flash-lite-latest`) via REST API |
| **OCR** | Tesseract.js v7 (Hindi, Gujarati, English) |
| **Cloud** | Firebase Firestore v12, Firebase Anonymous Auth |
| **PWA** | Service Worker, Web Manifest |
| **Security** | DOMPurify (XSS sanitization) |

---

## 🏃 Run Locally

### Prerequisites
- Node.js v18+
- A Google Gemini API Key from [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
node server.js
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`) — **required**
| Variable | Description | Default |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `GEMINI_API_KEY` | Google AI Studio API key | — |

### Frontend (`frontend/.env.local`) — *optional, for Firebase live features*
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL (default: `http://localhost:5000`) |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

> **Note:** Firebase credentials are optional. Without them, the app runs in local mock mode and all core AI detection features still work perfectly.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/check-message` | Analyze SMS/message text for scam |
| `POST` | `/api/check-upi` | Analyze UPI ID + amount + message |
| `GET` | `/api/scams` | Get scam education library |
| `GET` | `/api/history` | Get analysis history log |
| `DELETE` | `/api/history` | Clear history log |
| `POST` | `/api/report` | Log a reported scam |

---

## 📞 Emergency Contacts
- **National Cyber Crime Helpline**: **1930** (24/7, Toll-Free)
- **Report Online**: https://cybercrime.gov.in

---

## ⚠️ Disclaimer
This is a **Hackathon MVP/Demo**. AI analysis is powered by Google Gemini and is for informational/educational purposes only. For actual cybercrime incidents, always contact the official helpline at **1930** or visit https://cybercrime.gov.in.
