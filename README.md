# MediKiosk — AI-Powered Clinical History & Medical Records Digitization Platform

## 🚀 Quick Start (1-Click Run)
Double click **`Start_MediKiosk.bat`** to start the local server and automatically open the application at:
👉 **`http://localhost:8000`**

---

## 📁 Files Included
- **`index.html`** — Single-page HTML shell loaded with Tailwind CSS, React 18, Babel, Lucide icons, `html2pdf.js`, and `qrcode.js`.
- **`app.jsx`** — Main React application containing all 13 interactive screens, strict NLP symptom extractor, 10 AYUSH aspects, audio TTS/STT, timeline view, and clinical verification engine.
- **`server.py`** — Python HTTP server serving the kiosk on port 8000.
- **`Start_MediKiosk.bat`** — Double-click Windows batch launcher.

---

## 🌿 Key Features
1. **Unconditional 10 Ayurvedic Aspects (Dashavidha Pariksha)**: Prominently featured across Screen 10 (AI Clinical Summary), Screen 11 (Clinical Review & Sign Off), and Screen 12 (Summary Verified).
2. **Strict NLP Clinical Symptom Parser**: Isolates true medical conditions (Headache, Acidity, Fever, Cough, etc.) instead of conversational phrases.
3. **Multi-Language Speech & Voice Recognition**: Supports 9 Indian languages with audio replay buttons and Web Speech API.
4. **Interactive Timeline**: EHR-style chronological feed of past prescriptions and lab reports.
5. **PDF & Print Export**: 1-click download of verified summary reports.
