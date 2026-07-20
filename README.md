# SuRakshaPay 🛡️

**AI-Powered Financial Safety Shield for Rural India**

Built by **Harshil Parmar** & **Kush Thacker** | Hackathon 2026

---

## 🚀 Features
- 🤖 **AI-Powered Detection** using Google Gemini — not rule-based
- 💬 SMS / Message Scam Checker (with multilingual voice readout)
- 💳 UPI ID Verifier with inline QR Scanner
- 📷 QR Code Scanner (camera + file upload)
- 📚 Scam Education Library with SMS Sender ID Guide
- 🎮 Interactive Safety Quiz with XP Gamification System
- 📢 Live Community Scam Alerts (Firebase Firestore)
- 📊 State-wise Scam Threat Map
- 🌐 Multilingual: English, Hindi, Gujarati
- 🗣️ Text-to-Speech & Speech-to-Text in all 3 languages
- 🌙 Dark Mode + Mobile-First Responsive Design
- ⚡ Progressive Web App (PWA) with Service Worker

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| **Frontend**  | React 18, Vite, Tailwind CSS                 |
| **Backend**   | Node.js, Express                              |
| **AI Engine** | Google Gemini (`gemini-flash-lite-latest`) via REST API |
| **OCR**       | Tesseract.js (Hindi, Gujarati, English)       |
| **Cloud**     | Firebase Firestore, Firebase Anonymous Auth   |
| **PWA**       | Service Worker, Web Manifest                  |

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

Then start the server:
```bash
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default: `5000`) |
| `GEMINI_API_KEY` | Your Google AI Studio API key |

### Frontend (`frontend/.env.local`) *(optional)*
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL (default: `http://localhost:5000`) |
| `VITE_FIREBASE_API_KEY` | Firebase credentials (for live alerts) |

---

## 📞 Emergency Contacts
- **National Cyber Crime Helpline**: **1930**
- **Report Online**: https://cybercrime.gov.in

---

## ⚠️ Disclaimer
This is a **Hackathon MVP/Demo**. AI analysis is powered by Google Gemini and is for informational purposes. For actual cybercrime incidents, always contact the official helpline at **1930**.
