<div align="center">

# 🛡️ SuRakshaPay

### AI-Powered Financial Safety Shield for Rural India

<p align="center">
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
  <img src="https://img.shields.io/badge/Multilingual-EN%20%7C%20HI%20%7C%20GU-34D399?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Tesseract.js-7-FFA500?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

> **"Protect Rural India from Financial Scams — One Message at a Time."**

Built by **Harshil Parmar** & **Kush Thacker** — Hackathon 2026

[🚀 Live Demo](https://surakshapay.vercel.app) · [🐛 Report Bug](https://github.com/parmarharshil11/Surakshapay/issues) · [💡 Request Feature](https://github.com/parmarharshil11/Surakshapay/issues)

</div>

---

## 📌 Table of Contents

- [The Problem We're Solving](#-the-problem-were-solving)
- [Features](#-features)
- [How the AI Works](#-how-the-ai-works)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Run Locally](#-run-locally)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Mobile PWA](#-mobile-pwa)
- [Emergency Contacts](#-emergency-contacts)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)

---

## 🎯 The Problem We're Solving

India has **700 million+ rural citizens**, many of whom are newly online with UPI and smartphones. In 2023 alone, India reported over **₹7,000 crore lost to cyber fraud**. Most victims are:

- 🏘️ **First-generation smartphone users** unfamiliar with digital fraud patterns
- 🗣️ **Non-English speakers** who struggle with English-only cybersecurity tools
- 📵 **Offline or low-connectivity users** who need lightweight, fast tools

**SuRakshaPay bridges this gap** — a multilingual, AI-powered safety tool that runs in any browser, requires no app installation, and analyzes suspicious messages in under 2 seconds.

---

## 🚀 Features

### 🔍 Core Detection Tools

| Feature | Description |
|---|---|
| 🤖 **AI Scam Detection** | Google Gemini AI analyzes messages with a 0-100 **Risk Score** + Color-coded breakdown |
| 💬 **SMS / Message Checker** | Paste any WhatsApp message, SMS, or email text to detect fraud instantly |
| 📸 **OCR Screenshot Scanner** | Upload any screenshot — Tesseract.js extracts the text → Gemini AI analyzes it |
| 💳 **UPI ID Verifier** | Checks if a UPI collect request is fake before you enter your PIN |
| 📷 **QR Code Scanner** | Camera + file-upload QR scanning with real-time AI fraud analysis |

### 📚 Safety & Education

| Feature | Description |
|---|---|
| 📚 **Scam Education Library** | Real examples of KYC Fraud, Electricity Scams, Fake Loans & Lottery scams |
| 🎮 **Scam Awareness Quiz** | Interactive safety quiz with XP rewards and a gamification system |
| 📢 **Live Community Alerts** | Real-time scam alerts pushed via Firebase Firestore |
| 📊 **Scam Threat Map** | State-by-state heatmap of reported scam incidents across India |

### 🌐 Accessibility & UX

| Feature | Description |
|---|---|
| 🌐 **Multilingual** | Full UI in English, Hindi and Gujarati |
| 🗣️ **Voice I/O** | Speech-to-Text input & Text-to-Speech results in all 3 languages |
| 🌙 **Dark / Light Mode** | Full adaptive dark mode with smooth transitions |
| 📱 **Mobile-First** | Bottom navigation bar optimized for one-handed use on small phones |
| ⚡ **PWA Ready** | Install as a native-like app on Android/iOS with Service Worker support |
| 🔔 **Push Notifications** | Subscribe to live scam alerts via Web Push (Android Chrome supported) |

---

## 🧠 How the AI Works

```
User Input (Text / Voice / OCR Screenshot / QR Code)
        |
        v
   +-----------+     POST /api/check-message
   | Frontend  | -----------------------------> +-----------+
   |  React    |                                |  Express  |
   |  + Vite   | <----------------------------- |  Backend  |
   +-----------+      JSON Risk Report          +-----+-----+
                                                      |
                                                      v
                                             +----------------+
                                             |  Gemini Flash  |
                                             |  (Google AI)   |
                                             +----------------+
```

The backend sends a carefully engineered **system prompt + user content** to Gemini, asking it to return a strict JSON payload:

```json
{
  "score": 95,
  "classification": "Scam",
  "matchedKeywords": ["OTP", "won Rs. 25 Lakhs", "http://fake-prize.in"],
  "reasons": [
    "Unrealistic lottery prize claim",
    "OTP requested by unknown sender",
    "Suspicious external URL present",
    "Request for sensitive bank details"
  ],
  "explanation": "This is a dangerous scam. Do NOT share your OTP or bank details."
}
```

The frontend renders this as a **color-coded Risk Breakdown**:
- 🔴 `score > 70` → **SCAM** (Red alert)
- 🟠 `score 40-70` → **Suspicious** (Amber warning)
- ✅ `score < 40` → **Safe** (Green cleared)

---

## 🏗️ System Architecture

```
surakshapay/
├── frontend/                     # React + Vite SPA
│   ├── public/
│   │   └── sw.js                 # Service Worker for Push Notifications
│   └── src/
│       ├── App.jsx               # Root: routing, mobile nav, dark mode
│       ├── firebase.js           # Firebase SDK config + Firestore helpers
│       ├── i18n.js               # Translation strings (EN / HI / GU)
│       ├── index.css             # Global styles, animations
│       └── components/
│           ├── Home.jsx          # Landing dashboard, XP score
│           ├── MessageChecker.jsx # SMS fraud detection with OCR + Voice
│           ├── UpiChecker.jsx    # UPI ID + amount verification
│           ├── QrScanner.jsx     # QR scanning via camera or file
│           ├── EducationLibrary.jsx  # Scam awareness articles
│           ├── ScamQuiz.jsx      # Gamified safety quiz
│           ├── ScamMap.jsx       # State-wise threat heatmap
│           ├── Helpline.jsx      # Emergency contacts
│           ├── History.jsx       # Check history with detail panel
│           ├── About.jsx         # App info and credits
│           ├── Menu.jsx          # Mobile overflow menu + settings
│           └── NotificationBell.jsx  # Web Push subscribe / test
│
└── backend/                      # Node.js + Express REST API
    ├── server.js                 # Main server, route handlers
    ├── ai.js                     # Gemini AI integration + prompt engineering
    └── .env                      # API keys (not committed)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite 8 | Fast SPA with hot-reload |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **Backend** | Node.js + Express 4 | REST API server |
| **AI Engine** | Google Gemini Flash Lite | Natural language scam analysis |
| **OCR** | Tesseract.js v7 | Text extraction from screenshots |
| **Database** | Firebase Firestore v12 | Real-time community scam alerts |
| **Auth** | Firebase Anonymous Auth | Stateless user identification |
| **Push Notifications** | Web Push API + Service Worker | Android Chrome alert delivery |
| **Voice** | Web Speech API | Speech-to-text & text-to-speech |
| **QR Scanning** | jsQR | In-browser QR code decoding |
| **Security** | DOMPurify | XSS sanitization of AI output |

---

## 🏃 Run Locally

### Prerequisites

- **Node.js v18+** — [Download here](https://nodejs.org/)
- **A Google Gemini API Key** — [Get one free at aistudio.google.com](https://aistudio.google.com/app/apikey)
- *(Optional)* A Firebase project for live community alerts

### Step 1 — Clone the Repository

```bash
git clone https://github.com/parmarharshil11/Surakshapay.git
cd Surakshapay
```

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:

```bash
node server.js
# Server running on http://localhost:5000
```

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

> **That's it!** The app works fully in local mode even without Firebase credentials. All core AI detection features are functional.

### Step 4 — *(Optional)* Enable Live Alerts via Firebase

Create a `.env.local` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🔐 Environment Variables

### Backend — `backend/.env` *(required)*

| Variable | Description | Default |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `GEMINI_API_KEY` | Google AI Studio API key | — |

### Frontend — `frontend/.env.local` *(optional)*

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL (default: `http://localhost:5000`) |
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### `POST /api/check-message`

**Request:**
```json
{
  "text": "Dear customer, your KYC is expiring. Share OTP to avoid account block.",
  "language": "en"
}
```

**Response:**
```json
{
  "score": 91,
  "classification": "Scam",
  "matchedKeywords": ["KYC", "OTP", "account block"],
  "reasons": ["Impersonates bank", "Urgency tactic", "Requests OTP"],
  "explanation": "This is a classic KYC fraud SMS. Banks never ask for OTP via message."
}
```

### `POST /api/check-upi`

**Request:**
```json
{
  "upiId": "cashback-reward@paytm",
  "amount": "1",
  "messageContent": "Claim your cashback now",
  "language": "en"
}
```

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scams` | Get scam education library |
| `GET` | `/api/history` | Get analysis history log |
| `DELETE` | `/api/history` | Clear history log |
| `POST` | `/api/report` | Submit a community scam report |

---

## 📱 Mobile PWA

SuRakshaPay is a fully installable **Progressive Web App (PWA)**.

**On Android Chrome:**
1. Open the live URL in Chrome
2. Tap the **"Add to Home Screen"** banner or use the browser `⋮` menu
3. The app installs as a native-like icon on your home screen
4. Push Notifications work natively via the Service Worker

**On iOS Safari:**
1. Open in Safari → Tap the Share button
2. Choose **"Add to Home Screen"**

---

## 📞 Emergency Contacts

| Contact | Details |
|---|---|
| 🚨 **National Cyber Crime Helpline** | **1930** — 24/7 Toll-Free |
| 🌐 **Report Online** | [cybercrime.gov.in](https://cybercrime.gov.in) |
| 📞 **Sanchar Saathi (TRAI)** | [sancharsaathi.gov.in](https://sancharsaathi.gov.in) |
| 🏦 **RBI Helpline** | 14440 |

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

This is a **Hackathon MVP/Demo** built for educational and demonstration purposes. AI analysis is powered by Google Gemini and is **informational guidance only**.

For actual cybercrime incidents, always contact the official helpline at **1930** or file at [cybercrime.gov.in](https://cybercrime.gov.in).

---

<div align="center">

Made with ❤️ in India by **Harshil Parmar** & **Kush Thacker**

⭐ If SuRakshaPay helped you, please give this repo a star!

</div>
