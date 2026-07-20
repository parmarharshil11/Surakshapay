# SuRakshaPay — Frontend

React 19 + Vite 8 + Tailwind CSS 4 frontend for the SuRakshaPay AI financial safety app.

## 🚀 Development

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🔐 Environment Variables

Copy `.env.local.example` or create a `.env.local` file:

```env
# Backend API URL (defaults to localhost for development)
VITE_API_BASE_URL=http://localhost:5000

# Firebase (optional — app runs in local mock mode without these)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 📁 Key Files

| Path | Purpose |
|---|---|
| `src/App.jsx` | Root layout, navigation, language state |
| `src/translations.js` | All English / Hindi / Gujarati strings |
| `src/firebase.js` | Firebase init with graceful mock fallback |
| `src/components/MessageChecker.jsx` | SMS scam checker + OCR + voice I/O |
| `src/components/UpiChecker.jsx` | UPI request fraud detector |
| `src/components/QrScanner.jsx` | QR code scanner + AI analysis |
| `src/components/ScamQuiz.jsx` | Safety quiz with XP system |
| `src/components/EducationLibrary.jsx` | Scam education + SMS guide |
| `src/components/SmsGuide.jsx` | Indian SMS sender ID decoder |
| `src/components/Helpline.jsx` | Emergency contacts + scam reporter |
| `public/sw.js` | PWA service worker for push notifications |

## 🌐 Multilingual Support

The app supports **English**, **Hindi**, and **Gujarati**. All strings live in `src/translations.js`. Text-to-Speech and Speech-to-Text also switch language automatically based on the selected UI language.

## 🔒 Security

- All user-facing HTML is sanitized with **DOMPurify** before rendering to prevent XSS attacks.
- No sensitive credentials are stored in the frontend — API keys stay in the backend `.env`.
