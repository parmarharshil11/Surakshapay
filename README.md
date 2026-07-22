<div align="center">

<img src="frontend/public/banner.jpg" alt="DeTexSO Banner" width="100%" />

# 🛡️ DeTexSO

### Your Vernacular UPI Guard - Detection of Text & Scam Operations

<p align="center">
  <a href="https://detexso.vercel.app"><img src="https://img.shields.io/badge/🚀_Live_Demo-detexso.vercel.app-0F172A?style=for-the-badge&labelColor=1E293B" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google_Gemini-AI_Engine-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
  <img src="https://img.shields.io/badge/Multilingual-EN_|_HI_|_GU-34D399?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Tesseract.js-7-FFA500?style=flat-square" />
  <img src="https://img.shields.io/badge/License-ISC-green?style=flat-square" />
</p>

> **"Protect Rural India from Financial Scams — One Message at a Time."**

Built by **Harshil Parmar** & **Kush Thacker** — Hackathon 2026

[🚀 Live Demo](https://detexso.vercel.app) · [🐛 Report Bug](https://github.com/parmarharshil11/DeTexSO/issues) · [💡 Request Feature](https://github.com/parmarharshil11/DeTexSO/issues)

</div>

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Mobile PWA Installation](#-mobile-pwa-installation)
- [Emergency Contacts](#-emergency-contacts)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#%EF%B8%8F-disclaimer)

---

## 🎯 The Problem

India has **700 million+ rural citizens**, many of whom are newly online with UPI and smartphones. In 2023 alone, India reported over **₹7,000 crore lost to cyber fraud**. Most victims are:

| Who's affected | Why they're vulnerable |
|---|---|
| 🏘️ **First-generation smartphone users** | Unfamiliar with digital fraud patterns like phishing, fake UPI collects |
| 🗣️ **Non-English speakers** | Most cybersecurity tools are English-only |
| 📵 **Low-connectivity users** | Need lightweight, offline-ready tools — not heavy apps |
| 👴 **Senior citizens & pensioners** | Targeted by KYC scams, digital arrest hoaxes, pension fraud |

**DeTexSO bridges this gap** — a multilingual, AI-powered safety tool that runs in any browser, requires no app installation, and analyzes suspicious messages in under 2 seconds.

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INPUT                               │
│   Text  ·  Voice  ·  Screenshot (OCR)  ·  QR Code  ·  UPI ID    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   React 19 Frontend   │
                 │   (Vite 8 + Tailwind) │
                 └───────────┬───────────┘
                             │  POST /api/check-message
                             │  POST /api/check-upi
                             ▼
                 ┌───────────────────────┐
                 │  Express 4 Backend    │
                 │  (Node.js REST API)   │
                 └───────────┬───────────┘
                             │  Engineered System Prompt
                             │  + User Content
                             ▼
                 ┌───────────────────────┐
                 │   Google Gemini AI    │
                 │   (Flash Lite Model)  │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │  Structured JSON      │
                 │  Risk Report          │
                 └───────────────────────┘
```

**AI Output Example:**

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

**Risk Score Color Coding:**

| Score Range | Status | Indicator |
|---|---|---|
| `> 70` | 🔴 **SCAM** | Red alert — do not engage |
| `40 – 70` | 🟠 **Suspicious** | Amber warning — proceed with caution |
| `< 40` | ✅ **Safe** | Green — likely legitimate |

---

## 🚀 Features

### 🔍 Core AI Detection

| Feature | Description |
|---|---|
| 🤖 **AI Scam Detection** | Google Gemini analyzes messages and returns a 0–100 **Risk Score** with a color-coded breakdown |
| 💬 **SMS / Message Checker** | Paste any WhatsApp, SMS, or email text to detect fraud instantly |
| 📸 **OCR Screenshot Scanner** | Upload a screenshot — Tesseract.js extracts text → Gemini AI analyzes it |
| 💳 **UPI ID Verifier** | Validate UPI collect requests before entering your PIN — checks ID patterns, amount, and context |
| 📷 **QR Code Scanner** | Scan via camera or file upload with real-time AI fraud analysis of decoded content |

### 📚 Safety & Education

| Feature | Description |
|---|---|
| 📚 **Scam Education Library** | Real-world examples covering KYC Fraud, Digital Arrest, Deepfake Calls, Job Scams, Pension Fraud & more |
| 🎮 **AI-Generated Safety Quiz** | Dynamic quiz questions generated by Gemini with XP rewards and gamification |
| 📢 **Live Community Alerts** | Real-time scam alerts pushed via Firebase Firestore |
| 📊 **Community Threat Map** | AI-generated state-by-state scam incident data across India |
| 🏆 **Safety Score** | Persistent XP score synced via Firebase — earn points by checking messages and completing quizzes |

### 🌐 Accessibility & UX

| Feature | Description |
|---|---|
| 🌐 **Trilingual UI** | Full interface in English, Hindi, and Gujarati — including AI responses |
| 🗣️ **Voice Input / Output** | Speech-to-Text input + dual-engine TTS (Web Speech API + Google Translate proxy) in all 3 languages |
| 🌙 **Dark / Light Mode** | Persisted theme with flicker-free page loads |
| 📱 **Mobile-First Design** | Bottom navigation bar optimized for one-handed use on small phones |
| ⚡ **PWA Installable** | Install as a native-like app on Android/iOS with Service Worker support |
| 🔔 **Push Notifications** | Subscribe to live scam alerts via Web Push (Android Chrome) |
| ⚖️ **Disclaimer Modal** | First-run modal with trilingual legal disclaimer and language selector |
| 📤 **Share Cards** | Generate shareable scam alert cards to warn friends and family |

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React + Vite | 19 + 8 | Fast SPA with HMR |
| **Styling** | Tailwind CSS | 4 | Utility-first responsive design |
| **Animations** | Framer Motion | 11 | Smooth micro-animations and transitions |
| **Icons** | Lucide React | 0.414 | Consistent icon system |
| **Backend** | Node.js + Express | 18+ / 4 | REST API server |
| **AI Engine** | Google Gemini Flash Lite | `@google/genai` 2.12 | NLP-powered scam analysis, quiz generation, translation |
| **OCR** | Tesseract.js | 7 | Text extraction from screenshots |
| **QR Decoding** | jsQR | 1.4 | In-browser QR code parsing |
| **Database** | Firebase Firestore | — | Real-time community alerts + safety scores |
| **Auth** | Firebase Anonymous Auth | — | Stateless user identification |
| **Push** | Web Push API + Service Worker | — | Alert delivery |
| **Voice** | Web Speech API + Google TTS Proxy | — | Speech-to-text & text-to-speech |
| **Security** | DOMPurify | 3.4 | XSS sanitization of AI-generated HTML |
| **History** | JSON file store | — | Local analysis history (last 50 entries) |
| **Linting** | OxLint | 1.71 | Fast Rust-based JavaScript linter |

---

## 📁 Project Structure

```
detexso/
├── .gitignore                        # Git ignore rules
├── render.yaml                       # Render.com backend deployment config
├── README.md
│
├── backend/                          # Node.js + Express REST API
│   ├── server.js                     # Route handlers, CORS, scam library data
│   ├── ai.js                        # Gemini AI integration + prompt engineering
│   ├── db.js                        # JSON file-based history storage
│   ├── history.json                  # Persisted analysis logs (auto-generated)
│   ├── package.json
│   └── .env                         # API keys (not committed)
│
└── frontend/                         # React 19 + Vite 8 SPA
    ├── index.html                    # Entry HTML with SEO meta, OG tags, theme script
    ├── vite.config.js                # Vite configuration
    ├── vercel.json                   # Vercel deployment + SPA rewrites
    ├── .env.production               # Production backend URL
    ├── package.json
    │
    ├── public/
    │   ├── banner.jpg                # Project banner image
    │   ├── favicon.svg               # App favicon
    │   ├── icons.svg                 # SVG icon sprite
    │   └── sw.js                     # Service Worker for Push Notifications
    │
    └── src/
        ├── main.jsx                  # React DOM entry point
        ├── App.jsx                   # Root: routing, nav, dark mode, disclaimer
        ├── App.css                   # Component-specific styles
        ├── index.css                 # Global styles and animations
        ├── firebase.js               # Firebase SDK config + Firestore helpers
        ├── translations.js           # i18n translation strings (EN / HI / GU)
        │
        ├── utils/
        │   └── ttsHelper.js          # Dual-engine TTS helper (Web Speech + Google proxy)
        │
        └── components/
            ├── Home.jsx              # Landing dashboard with XP score
            ├── MessageChecker.jsx    # SMS fraud detection + OCR + Voice I/O
            ├── UpiChecker.jsx        # UPI ID + amount verification
            ├── QrScanner.jsx         # QR scanning via camera or file upload
            ├── EducationLibrary.jsx  # Scam awareness articles
            ├── ScamQuiz.jsx          # Gamified AI-generated safety quiz
            ├── CommunityMap.jsx      # AI-generated state-wise threat data
            ├── Helpline.jsx          # Emergency contacts and reporting
            ├── History.jsx           # Check history with detail panels
            ├── About.jsx             # App info, credits, and version
            ├── Menu.jsx              # Mobile overflow menu + settings
            ├── SafetyScore.jsx       # XP score display and progress
            ├── ShareCard.jsx         # Shareable scam alert card generator
            ├── SmsGuide.jsx          # SMS safety educational guide
            ├── TrendingTicker.jsx    # Scrolling trending scam alerts
            ├── NotificationBell.jsx  # Web Push subscribe / test bell
            └── DisclaimerModal.jsx   # First-run legal disclaimer modal
```

---

## 🏃 Getting Started

### Prerequisites

| Requirement | Details |
|---|---|
| **Node.js** | v18 or later — [Download](https://nodejs.org/) |
| **Gemini API Key** | Free from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Firebase** *(optional)* | Only needed for community alerts & safety score sync |

### 1. Clone the Repository

```bash
git clone https://github.com/parmarharshil11/DeTexSO.git
cd DeTexSO
```

### 2. Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
node server.js
# ✅ DeTexSO backend running on http://localhost:5000
```

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

> **That's it!** All core AI detection features work out of the box — no Firebase setup needed for local development.

### 4. *(Optional)* Enable Firebase Features

To activate live community alerts and cross-device safety score sync, create a `.env.local` file inside `frontend/`:

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
| `FRONTEND_URL` | Allowed CORS origin override | — |
| `NODE_ENV` | Environment mode | `development` |

### Frontend — `frontend/.env.local` *(optional)*

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend URL | `http://localhost:5000` |
| `VITE_FIREBASE_API_KEY` | Firebase project API key | — |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | — |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | — |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | — |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | — |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | — |

### Frontend — `frontend/.env.production`

| Variable | Description | Value |
|---|---|---|
| `VITE_API_BASE_URL` | Production backend URL | `https://detexso-final.onrender.com` |

---

## 📡 API Reference

**Base URL:** `http://localhost:5000` (dev) · `https://detexso-final.onrender.com` (prod)

### Core Detection

#### `POST /api/check-message`

Analyzes a text message for scam indicators.

<details>
<summary>📋 Request / Response</summary>

**Request:**
```json
{
  "text": "Dear customer, your KYC is expiring. Share OTP to avoid account block.",
  "lang": "en"
}
```

**Response:**
```json
{
  "score": 91,
  "classification": "Scam",
  "matchedKeywords": ["KYC", "OTP", "account block"],
  "reasons": ["Impersonates bank", "Urgency tactic", "Requests OTP"],
  "explanation": "This is a classic KYC fraud SMS. Banks never ask for OTP via message.",
  "dbId": "check_1721234567890_abc123def",
  "timestamp": "2026-07-22T12:00:00.000Z"
}
```
</details>

#### `POST /api/check-upi`

Evaluates a UPI collect request for fraud patterns.

<details>
<summary>📋 Request / Response</summary>

**Request:**
```json
{
  "upiId": "cashback-reward@paytm",
  "amount": "1",
  "message": "Claim your cashback now",
  "lang": "en"
}
```

**Response:** Same risk-score structure as `/api/check-message`.
</details>

### Education & Community

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scams` | Scam education library (multilingual) |
| `GET` | `/api/generate-quiz?count=3` | AI-generated quiz questions (default: 3) |
| `GET` | `/api/community-stats?lang=en` | AI-generated community threat data (cached 5 min) |

### Translation & Voice

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/translate` | On-demand AI translation (`text` + `targetLang`) |
| `GET` | `/api/tts?text=hello&lang=en` | Google Translate TTS proxy (returns audio/mpeg stream) |

### History & Reporting

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/history` | Retrieve analysis history (last 50 entries) |
| `DELETE` | `/api/history` | Clear all history entries |
| `POST` | `/api/report` | Submit a community scam report (`scammerDetails` + `description`) |

---

## 🚀 Deployment

DeTexSO uses a split deployment architecture:

| Component | Platform | Config File |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | `frontend/vercel.json` |
| **Backend** | [Render](https://render.com) | `render.yaml` |

### Deploy Frontend to Vercel

1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Set the **Root Directory** to `frontend`
3. Framework will auto-detect as **Vite**
4. No environment variables needed (production URL is baked into `.env.production`)

### Deploy Backend to Render

1. Import the repo on [render.com](https://render.com)
2. Render auto-detects the `render.yaml` blueprint:
   - **Region:** Singapore (closest to India)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
3. Set `GEMINI_API_KEY` manually in the Render dashboard

---

## 📱 Mobile PWA Installation

DeTexSO is a fully installable **Progressive Web App**.

**Android (Chrome):**
1. Visit [detexso.vercel.app](https://detexso.vercel.app) in Chrome
2. Tap **"Add to Home Screen"** from the banner or `⋮` menu
3. The app installs with a native icon — push notifications work natively

**iOS (Safari):**
1. Open in Safari → Tap the **Share** button
2. Choose **"Add to Home Screen"**

---

## 📞 Emergency Contacts

If you or someone you know has been scammed, act immediately:

| Contact | Details |
|---|---|
| 🚨 **National Cyber Crime Helpline** | **1930** — 24/7 Toll-Free |
| 🌐 **Online Reporting Portal** | [cybercrime.gov.in](https://cybercrime.gov.in) |
| 📞 **Sanchar Saathi (TRAI)** | [sancharsaathi.gov.in](https://sancharsaathi.gov.in) |
| 🏦 **RBI Helpline** | **14440** |

> ⚡ **Time is critical.** The first 24 hours after a financial scam are the most important for recovery. Call **1930** immediately.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes (use [conventional commits](https://www.conventionalcommits.org/)):
   ```bash
   git commit -m "feat: add voice support for Tamil language"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request against `main`

### Development Tips

- Run the backend in watch mode: `npm run dev` (auto-restarts on file changes)
- Lint the frontend: `npm run lint` (uses OxLint)
- Translations live in `frontend/src/translations.js` — add new languages there

---

## 📄 License

This project is licensed under the **ISC License** — see the [package.json](backend/package.json) for details.

---

## ⚠️ Disclaimer

This is a **Hackathon MVP/Demo** built for educational and demonstration purposes.

- AI analysis is powered by Google Gemini and provides **informational guidance only** — it is not a substitute for professional legal or financial advice.
- DeTexSO does **not** store, transmit, or share any personal financial data.
- For actual cybercrime incidents, always contact the official helpline at **1930** or file a report at [cybercrime.gov.in](https://cybercrime.gov.in).

---

<div align="center">

Made with ❤️ in India by **[Harshil Parmar](https://github.com/parmarharshil11)** & **[Kush Thacker](https://github.com/thackerkush)**

⭐ If DeTexSO helped you, please give this repo a star!

</div>
