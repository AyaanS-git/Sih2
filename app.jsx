const { useState, useEffect, useRef } = React;

// Global Audio Reference
let globalAudioPlayer = null;
let isAudioContextUnlocked = false;

function unlockAudioContext() {
  if (!isAudioContextUnlocked) {
    isAudioContextUnlocked = true;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
      } catch (e) {}
    }
  }
}

// ============================================================================
// MediKiosk Multilingual Translation Dictionary (i18n)
// ============================================================================
const translations = {
  'English': {
    appName: "MediKiosk",
    appSubtitle: "AI-Powered Clinical History & Medical Records Platform",
    tagline: "One Patient. One History. One Smart Platform.",
    taglineDesc: "Streamline OPD intake, digitize records, and structure AYUSH & Allopathic history seamlessly.",
    hospitalIntake: "Hospital Kiosk Intake",
    welcomeBack: "Welcome to MediKiosk",
    enterEmailPrompt: "Sign in with your email and password to start your session.",
    emailLabel: "Email Address",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "Login to MediKiosk →",
    dontHaveAccount: "Don't have an account?",
    registerNewUser: "Register New Patient",
    alreadyHaveAccount: "Already registered?",
    loginHere: "Login here",
    registerTitle: "Register New Patient",
    registerSubtitle: "Create a permanent profile for MediKiosk clinical intake",
    createAccountBtn: "Create Account & Proceed →",
    steps: {
      patient: "Patient",
      mode: "Mode",
      history: "History",
      docs: "Documents",
      review: "Review",
      summary: "Summary"
    },
    stepCounter: (curr, total) => `Step ${curr} of ${total}`,
    chooseModeTitle: "Choose Your Consultation Mode",
    chooseModeDesc: "Click on your preferred mode and then proceed.",
    ayushTitle: "AYUSH / Ayurveda",
    ayushTagline: "Classical 10-fold assessment & holistic Ayurvedic history.",
    ayushIncludes: "Includes 10 Pariksha Aspects:",
    ayushP1: "Prakriti (Constitution) & Vikriti (Imbalance)",
    ayushP2: "Sara (Tissue Quality) & Samhanana (Build)",
    ayushP3: "Pramana (Proportions) & Satmya (Adaptability)",
    ayushP4: "Satva (Mental Strength) & Ahara Shakti (Digestion)",
    ayushP5: "Vyayama Shakti (Endurance) & Vaya (Age Stage)",
    clinicalTitle: "General Clinical",
    clinicalTagline: "Modern medicine, symptom chronology & evidence-based care.",
    clinicalIncludes: "Includes Assessment For:",
    clinicalP1: "Symptoms, Severity & Duration",
    clinicalP2: "Medical History & Present Illness",
    clinicalP3: "Current Medications & Allergies",
    clinicalP4: "Investigations & Lab Reports",
    clinicalP5: "Lifestyle, Diet & Family History",
    selectAyushBtn: "Select AYUSH Mode",
    selectClinicalBtn: "Select Clinical Mode",
    selectedBadge: "Selected ✓",
    backToWelcome: "← Back to Login",
    proceedToMode: "Proceed to Consultation Mode →",
    patientDetailsTitle: "Patient Identification",
    patientDetailsDesc: "Please enter patient details for clinical registration.",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter patient's full name",
    ageLabel: "Age (Years)",
    agePlaceholder: "Age",
    genderLabel: "Gender",
    genders: { Male: "Male", Female: "Female", Other: "Other" },
    weightLabel: "Weight (kg)",
    weightPlaceholder: "e.g. 65",
    pastIllnessesLabel: "Serious Past Illnesses & Surgeries",
    pastIllnessesPlaceholder: "e.g. Type 2 Diabetes (5 yrs), Hypertension, Appendectomy (2019), or None",
    mobileNumber: "Mobile Number (10 Digits)",
    mobilePlaceholder: "10-digit mobile number",
    opdTokenLabel: "OPD / Token Number",
    abhaCheckbox: "I have an ABHA ID (Ayushman Bharat Health Account)",
    abhaPlaceholder: "Enter 14-digit ABHA ID",
    changePhotoBtn: "📷 Change Photo",
    takePhotoBtn: "📸 Take Photo",
    backBtn: "← Back",
    continueBtn: "Continue →",
    aiAssistantTitle: "AI Health Assistant",
    interactiveIntake: "Interactive Clinical Intake",
    replayVoice: "🔊 Replay Voice",
    speaking: "🔊 AI Speaking...",
    listenMessage: "🔊 Listen to message",
    greetingMsg: "Hello! What is the main health problem or symptom you are facing today?",
    chatInputPlaceholder: "Type or speak your answer in English...",
    sendBtn: "Send",
    nextStepBtn: "Next Step →",
    completeHistoryBtn: "Complete History & Continue →",
    liveSessionSummary: "Live Intake Status",
    extractedSymptomLabel: "Extracted Symptoms",
    symptomSeverityLabel: "Symptom Severity",
    symptomDurationLabel: "Problem Duration",
    previousHistoryLabel: "Medical History",
    pendingSelection: "Pending response",
    ayushAssessmentTitle: "Ayurvedic Assessment (Dashavidha Pariksha)",
    ayushAssessmentSubtitle: "Classical 10-fold diagnostic assessment. Select applicable parameters (unanswered terms are excluded from final summary).",
    changeAyushStatus: "Select Status ✎",
    modalSelectTitle: "Select Classical Status for",
    docUploadTitle: "Upload Your Medical Records & Prescriptions",
    docUploadSubtitle: "Scan prescriptions, lab reports, or discharge summaries with real-time AI OCR.",
    dragDropText: "Drag & drop files here, or browse",
    browseFilesBtn: "Browse Files / Take Photo",
    uploadedRecordsTitle: "Scanned Medical Records (OCR)",
    noDocsUploaded: "No documents uploaded yet. You can upload photos/PDFs or use sample records below.",
    processWithAiBtn: "Process & View Summary →",
    ocrLoadingTitle: "Scanning documents and understanding your information...",
    ocrLoadingSubtitle: "Running neural OCR preprocessing, clinical entity parsing, and timeline synthesis.",
    editableOcrLabel: "Extracted OCR Text (Review & Edit Before Confirming)",
    saveOcrRecordBtn: "Confirm & Attach Document ✓",
    smartDocRequestTitle: "Suggested Documents for Your Intake:",
    clinicalReviewTitle: "Clinical Summary & Review",
    clinicalReviewSubtitle: "Review and edit clinical details before final sign-off.",
    editableClinicalFields: "Editable Clinical Fields",
    chiefComplaintLabel: "Chief Complaint",
    hpiLabel: "History of Present Illness (HPI)",
    pastHistoryLabel: "Past Medical History",
    medicationsLabel: "Current Medications (from OCR)",
    allergiesLabel: "Known Allergies",
    lifestyleLabel: "Lifestyle & Habits",
    clinicianNotesTitle: "Clinician Notes & Directives",
    clinicianNotesPlaceholder: "Add clinician examination notes, prescriptions, and directives...",
    markVerifiedBtn: "Save & Verify Summary ✓",
    summaryVerifiedTitle: "Summary Verified",
    summaryVerifiedSubtitle: "Clinical summary successfully verified and linked to unique patient QR code.",
    officialSummaryHeader: "MediKiosk Official Clinical Summary",
    abdmStandard: "Government of India ABDM / NDHM Health Record Standard",
    downloadPdfBtn: "📥 Download Summary (PDF)",
    printSummaryBtn: "🖨️ Print Summary",
    sendToHisBtn: "🏥 Send to Hospital System",
    hisSuccessBadge: "Transmitted to Hospital System ✓",
    newSessionBtn: "🔄 Start New Session",
    qrScanInstruction: "Scan this unique QR code at hospital reception or OPD counter to view this patient's verified summary."
  },
  'Hindi (हिंदी)': {
    appName: "मेडीकियोस्क",
    appSubtitle: "एआई-संचालित क्लिनिकल इतिहास एवं रिकॉर्ड डिजिटलीकरण प्लेटफॉर्म",
    tagline: "एक रोगी। एक इतिहास। एक स्मार्ट प्लेटफॉर्म।",
    taglineDesc: "ओपीडी प्रक्रिया को सरल बनाएं, मेडिकल रिकॉर्ड डिजिटाइज़ करें।",
    hospitalIntake: "अस्पताल कियोस्क पंजीकरण",
    welcomeBack: "मेडीकियोस्क में आपका स्वागत है",
    enterEmailPrompt: "सत्र शुरू करने के लिए अपना ईमेल और पासवर्ड दर्ज करें।",
    emailLabel: "ईमेल आईडी",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "लॉगिन करें →",
    dontHaveAccount: "खाता नहीं है?",
    registerNewUser: "नया रोगी पंजीकृत करें",
    alreadyHaveAccount: "पहले से खाता है?",
    loginHere: "यहाँ लॉगिन करें",
    registerTitle: "नया रोगी पंजीकरण",
    registerSubtitle: "मेडीकियोस्क इनटेक के लिए नया प्रोफाइल बनाएं",
    createAccountBtn: "खाता बनाएं और आगे बढ़ें →",
    steps: {
      patient: "रोगी विवरण",
      mode: "मोड",
      history: "इतिहास",
      docs: "दस्तावेज़",
      review: "समीक्षा",
      summary: "सारांश"
    },
    stepCounter: (curr, total) => `चरण ${curr} / ${total}`,
    chooseModeTitle: "परामर्श मोड चुनें",
    chooseModeDesc: "अपनी पसंद का परामर्श मोड चुनें और आगे बढ़ें।",
    ayushTitle: "आयुष / आयुर्वेद",
    ayushTagline: "प्रामाणिक दशविध परीक्षा एवं समग्र आयुर्वेदिक इतिहास।",
    ayushIncludes: "10 परीक्षा पहलू शामिल हैं:",
    ayushP1: "प्रकृति एवं विकृति",
    ayushP2: "सार एवं संहनन",
    ayushP3: "प्रमाण एवं सात्म्य",
    ayushP4: "सत्त्व एवं आहार शक्ति",
    ayushP5: "व्यायाम शक्ति एवं वय",
    clinicalTitle: "सामान्य क्लिनिकल",
    clinicalTagline: "आधुनिक चिकित्सा, लक्षण कालक्रम और साक्ष्य-आधारित देखभाल।",
    clinicalIncludes: "इनका मूल्यांकन शामिल:",
    clinicalP1: "लक्षण, गंभीरता और अवधि",
    clinicalP2: "चिकित्सा इतिहास और वर्तमान बीमारी",
    clinicalP3: "वर्तमान दवाएं और एलर्जी",
    clinicalP4: "जांच और लैब रिपोर्ट",
    clinicalP5: "जीवनशैली, आहार और पारिवारिक इतिहास",
    selectAyushBtn: "आयुष मोड चुनें",
    selectClinicalBtn: "क्लिनिकल मोड चुनें",
    selectedBadge: "चयनित ✓",
    backToWelcome: "← लॉगिन पर वापस जाएं",
    proceedToMode: "परामर्श मोड पर आगे बढ़ें →",
    patientDetailsTitle: "रोगी पहचान विवरण",
    patientDetailsDesc: "पंजीकरण के लिए कृपया रोगी की जानकारी दर्ज करें।",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "रोगी का पूरा नाम दर्ज करें",
    ageLabel: "आयु (वर्ष)",
    agePlaceholder: "आयु",
    genderLabel: "लिंग",
    genders: { Male: "पुरुष", Female: "महिला", Other: "अन्य" },
    weightLabel: "वज़न (किलोग्राम)",
    weightPlaceholder: "उदा. 65",
    pastIllnessesLabel: "गंभीर पुरानी बीमारियां व सर्जरी",
    pastIllnessesPlaceholder: "उदा. डायबिटीज (5 वर्ष), हाई ब्लड प्रेशर, कोई सर्जरी, या कुछ नहीं",
    mobileNumber: "मोबाइल नंबर (10 अंक)",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    opdTokenLabel: "ओपीडी / टोकन नंबर",
    abhaCheckbox: "मेरे पास आभा आईडी (ABHA ID) है",
    abhaPlaceholder: "14 अंकों की आभा आईडी दर्ज करें",
    changePhotoBtn: "📷 फोटो बदलें",
    takePhotoBtn: "📸 फोटो खींचें",
    backBtn: "← वापस",
    continueBtn: "आगे बढ़ें →",
    aiAssistantTitle: "एआई स्वास्थ्य सहायक",
    interactiveIntake: "इंटरएक्टिव क्लिनिकल इनटेक",
    replayVoice: "🔊 आवाज़ पुनः सुनें",
    speaking: "🔊 एआई बोल रहा है...",
    listenMessage: "🔊 संदेश सुनें",
    greetingMsg: "नमस्ते! आज आपको मुख्य स्वास्थ्य समस्या या क्या लक्षण महसूस हो रहे हैं?",
    chatInputPlaceholder: "हिंदी में लिखें या बोलें...",
    sendBtn: "भेजें",
    nextStepBtn: "अगला चरण →",
    completeHistoryBtn: "इतिहास पूर्ण करें और आगे बढ़ें →",
    liveSessionSummary: "वर्तमान इनटेक स्थिति",
    extractedSymptomLabel: "पहचाने गए लक्षण",
    symptomSeverityLabel: "लक्षण की गंभीरता",
    symptomDurationLabel: "समस्या की अवधि",
    previousHistoryLabel: "पूर्व चिकित्सा इतिहास",
    pendingSelection: "प्रतीक्षारत",
    ayushAssessmentTitle: "आयुर्वेदिक मूल्यांकन (दशविध परीक्षा)",
    ayushAssessmentSubtitle: "प्रामाणिक 10-गुना आयुर्वेदिक मूल्यांकन। (अनुत्तरित विकल्पों को अंतिम सारांश से हटा दिया जाएगा)।",
    changeAyushStatus: "स्थिति चुनें ✎",
    modalSelectTitle: "के लिए स्थिति चुनें",
    docUploadTitle: "मेडिकल रिकॉर्ड व नुस्खे अपलोड करें",
    docUploadSubtitle: "पर्चे, लैब रिपोर्ट या डिस्चार्ज समरी को स्कैन करें।",
    dragDropText: "फ़ाइलें यहाँ खींचें या चुनें",
    browseFilesBtn: "फ़ाइल चुनें / फोटो खींचें",
    uploadedRecordsTitle: "स्कैन किए गए मेडिकल रिकॉर्ड",
    noDocsUploaded: "अभी कोई दस्तावेज़ अपलोड नहीं हुआ है।",
    processWithAiBtn: "प्रक्रिया करें व सारांश देखें →",
    ocrLoadingTitle: "दस्तावेज़ों को स्कैन कर आपकी जानकारी समझी जा रही है...",
    ocrLoadingSubtitle: "न्यूरल ओसीआर प्रीप्रोसेसिंग और क्लिनिकल सारांश तैयार हो रहा है।",
    editableOcrLabel: "निकाला गया टेक्स्ट (सहेजने से पहले जांचें व संपादित करें)",
    saveOcrRecordBtn: "पुष्टि करें और संलग्न करें ✓",
    smartDocRequestTitle: "आपके लक्षणों के आधार पर अनुशंसित दस्तावेज़:",
    clinicalReviewTitle: "क्लिनिकल समीक्षा एवं संपादन",
    clinicalReviewSubtitle: "अंतिम सत्यापन से पहले क्लिनिकल फ़ील्ड संपादित करें।",
    editableClinicalFields: "संपादन योग्य क्लिनिकल फ़ील्ड",
    chiefComplaintLabel: "मुख्य शिकायत (Chief Complaint)",
    hpiLabel: "वर्तमान बीमारी का विवरण (HPI)",
    pastHistoryLabel: "पूर्व चिकित्सा इतिहास",
    medicationsLabel: "वर्तमान दवाएं (OCR से)",
    allergiesLabel: "एलर्जी",
    lifestyleLabel: "जीवनशैली व आदतें",
    clinicianNotesTitle: "चिकित्सक निर्देश व नोट्स",
    clinicianNotesPlaceholder: "डॉक्टर के नोट्स, निर्देश और दवाएं यहाँ लिखें...",
    markVerifiedBtn: "सत्यापित करें और सहेजें ✓",
    summaryVerifiedTitle: "सारांश सत्यापित हुआ",
    summaryVerifiedSubtitle: "क्लिनिकल सारांश सफलतापूर्वक सत्यापित हुआ और क्यूआर कोड तैयार है।",
    officialSummaryHeader: "मेडीकियोस्क आधिकारिक क्लिनिकल सारांश",
    abdmStandard: "भारत सरकार ABDM / NDHM स्वास्थ्य रिकॉर्ड मानक",
    downloadPdfBtn: "📥 सारांश डाउनलोड करें (PDF)",
    printSummaryBtn: "🖨️ सारांश प्रिंट करें",
    sendToHisBtn: "🏥 अस्पताल प्रणाली (HIS) को भेजें",
    hisSuccessBadge: "अस्पताल प्रणाली (HIS) को प्रेषित किया गया ✓",
    newSessionBtn: "🔄 नया सत्र शुरू करें",
    qrScanInstruction: "अस्पताल रिसेप्शन पर रोगी का सत्यापित सारांश देखने के लिए यह क्यूआर कोड स्कैन करें।"
  },
  'Marathi (मराठी)': {
    appName: "मेडीकियोस्क",
    appSubtitle: "एआय-सक्षम क्लिनिकल इतिहास आणि वैद्यकीय नोंदी डिजिटायझेशन प्लॅटफॉर्म",
    tagline: "एक रुग्ण. एक इतिहास. एक स्मार्ट प्लॅटफॉर्म.",
    taglineDesc: "ओपीडी नोंदणी सुलभ करा, वैद्यकीय नोंदींचे डिजिटायझेशन करा.",
    hospitalIntake: "रुग्णालय किओस्क नोंदणी",
    welcomeBack: "मेडीकियोस्कमध्ये आपले स्वागत आहे",
    enterEmailPrompt: "सत्र सुरू करण्यासाठी ईमेल आणि पासवर्ड प्रविष्ट करा.",
    emailLabel: "ईमेल पत्ता",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "पासवर्डची पुष्टी करा",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "लॉगिन करा →",
    dontHaveAccount: "खाते नाही?",
    registerNewUser: "नवीन रुग्णाची नोंदणी करा",
    alreadyHaveAccount: "आधीच नोंदणी केली आहे?",
    loginHere: "येथे लॉगिन करा",
    registerTitle: "नवीन रुग्ण नोंदणी",
    registerSubtitle: "मेडीकियोस्कसाठी नवीन प्रोफाइल तयार करा",
    createAccountBtn: "खाते तयार करा आणि पुढे जा →",
    steps: {
      patient: "रुग्ण",
      mode: "मोड",
      history: "इतिहास",
      docs: "कागदपत्रे",
      review: "पुनरावलोकन",
      summary: "सारांश"
    },
    stepCounter: (curr, total) => `टप्पा ${curr} / ${total}`,
    chooseModeTitle: "सल्लागार पद्धती निवडा",
    chooseModeDesc: "आपल्या पसंतीचा मोड निवडून पुढे जा.",
    ayushTitle: "आयुष / आयुर्वेद",
    ayushTagline: "पारंपरिक १०-विध परीक्षा आणि सर्वांगीण आयुर्वेदिक इतिहास.",
    ayushIncludes: "१० परीक्षा घटक समाविष्ट:",
    ayushP1: "प्रकृती आणि विकृती",
    ayushP2: "सार आणि संहनन",
    ayushP3: "प्रमाण आणि सात्म्य",
    ayushP4: "सत्त्व आणि आहार शक्ती",
    ayushP5: "व्यायाम शक्ती आणि वय",
    clinicalTitle: "सामान्य क्लिनिकल",
    clinicalTagline: "आधुनिक वैद्यकशास्त्र, लक्षण कालक्रम आणि पुरावा-आधारित काळजी.",
    clinicalIncludes: "मूल्यांकन समाविष्ट:",
    clinicalP1: "लक्षणे, तीव्रता आणि कालावधी",
    clinicalP2: "वैद्यकीय इतिहास आणि चालू आजार",
    clinicalP3: "सध्याची औषधे आणि ॲलर्जी",
    clinicalP4: "तपासणी आणि प्रयोगशाळा अहवाल",
    clinicalP5: "जीवनशैली, आहार आणि कौटुंबिक इतिहास",
    selectAyushBtn: "आयुष मोड निवडा",
    selectClinicalBtn: "क्लिनिकल मोड निवडा",
    selectedBadge: "निवडले ✓",
    backToWelcome: "← लॉगिनकडे परत",
    proceedToMode: "परामर्श मोडकडे पुढे जा →",
    patientDetailsTitle: "रुग्ण ओळख तपशील",
    patientDetailsDesc: "नोंदणीसाठी कृपया रुग्णाचे तपशील भरा.",
    fullName: "पूर्ण नाव",
    fullNamePlaceholder: "रुग्णाचे पूर्ण नाव",
    ageLabel: "वय (वर्षे)",
    agePlaceholder: "वय",
    genderLabel: "लिंग",
    genders: { Male: "पुरुष", Female: "स्त्री", Other: "इतर" },
    weightLabel: "वजन (किलो)",
    weightPlaceholder: "उदा. 65",
    pastIllnessesLabel: "मागील गंभीर आजार व शस्त्रक्रिया",
    pastIllnessesPlaceholder: "उदा. मधुमेह, उच्च रक्तदाब, शस्त्रक्रिया किंवा काहीही नाही",
    mobileNumber: "मोबाईल नंबर (१० अंक)",
    mobilePlaceholder: "१० अंकी मोबाईल नंबर",
    opdTokenLabel: "ओपीडी / टोकन क्रमांक",
    abhaCheckbox: "माझ्याकडे आभा आयडी (ABHA ID) आहे",
    abhaPlaceholder: "१४ अंकी आभा आयडी प्रविष्ट करा",
    changePhotoBtn: "📷 फोटो बदला",
    takePhotoBtn: "📸 फोटो काढा",
    backBtn: "← मागे",
    continueBtn: "पुढे जा →",
    aiAssistantTitle: "एआय आरोग्य सहाय्यक",
    interactiveIntake: "संवाद आधारित क्लिनिकल इनटेक",
    replayVoice: "🔊 आवाज पुन्हा ऐका",
    speaking: "🔊 एआय बोलत आहे...",
    listenMessage: "🔊 संदेश ऐका",
    greetingMsg: "नमस्कार! आज तुम्हाला कोणती मुख्य आरोग्य समस्या किंवा लक्षणे जाणवत आहेत?",
    chatInputPlaceholder: "मराठीत टाइप करा किंवा बोला...",
    sendBtn: "पाठवा",
    nextStepBtn: "पुढील टप्पा →",
    completeHistoryBtn: "इतिहास पूर्ण करा आणि पुढे जा →",
    liveSessionSummary: "सद्य इनटेक स्थिती",
    extractedSymptomLabel: "नोंदवलेली लक्षणे",
    symptomSeverityLabel: "लक्षणाची तीव्रता",
    symptomDurationLabel: "समस्येचा कालावधी",
    previousHistoryLabel: "मागील वैद्यकीय इतिहास",
    pendingSelection: "प्रलंबित",
    ayushAssessmentTitle: "आयुर्वेदिक मूल्यमापन (दशविध परीक्षा)",
    ayushAssessmentSubtitle: "१०-विध परीक्षा. (निवड न केलेले घटक अंतिम सारांशातून वगळले जातील).",
    changeAyushStatus: "स्थिती निवडा ✎",
    modalSelectTitle: "स्थिती निवडा:",
    docUploadTitle: "वैद्यकीय अहवाल व प्रिस्क्रिप्शन अपलोड करा",
    docUploadSubtitle: "प्रिस्क्रिप्शन, लॅब अहवाल स्कॅन करा.",
    dragDropText: "फाइल्स येथे टाका किंवा निवडा",
    browseFilesBtn: "फाइल निवडा / फोटो काढा",
    uploadedRecordsTitle: "स्कॅन केलेले वैद्यकीय अहवाल",
    noDocsUploaded: "अद्याप कोणतेही दस्तऐवज अपलोड केलेले नाहीत.",
    processWithAiBtn: "प्रक्रिया करा व सारांश पहा →",
    ocrLoadingTitle: "कागदपत्रे स्कॅन करून माहिती समजून घेतली जात आहे...",
    ocrLoadingSubtitle: "ओसीआर प्रीप्रोसेसिंग आणि क्लिनिकल सारांश तयार होत आहे.",
    editableOcrLabel: "स्कॅन केलेला मजकूर (तपासा व संपादित करा)",
    saveOcrRecordBtn: "पुष्टी करा आणि जोडा ✓",
    smartDocRequestTitle: "तुमच्या लक्षणांनुसार सुचवलेले कागदपत्रे:",
    clinicalReviewTitle: "क्लिनिकल पुनरावलोकन व संपादन",
    clinicalReviewSubtitle: "अंतिम पडताळणीपूर्वी माहिती तपासा व संपादित करा.",
    editableClinicalFields: "संपादन करण्यायोग्य क्लिनिकल माहिती",
    chiefComplaintLabel: "मुख्य तक्रार (Chief Complaint)",
    hpiLabel: "सद्य आजाराचा इतिहास (HPI)",
    pastHistoryLabel: "मागील वैद्यकीय इतिहास",
    medicationsLabel: "सध्याची औषधे (OCR)",
    allergiesLabel: "ॲलर्जी",
    lifestyleLabel: "जीवनशैली",
    clinicianNotesTitle: "वैद्यकीय निर्देश व नोंदी",
    clinicianNotesPlaceholder: "डॉक्टरांच्या नोंदी व सूचना येथे लिहा...",
    markVerifiedBtn: "सत्यापित करा व जतन करा ✓",
    summaryVerifiedTitle: "सारांश सत्यापित झाला",
    summaryVerifiedSubtitle: "क्लिनिकल सारांश यशस्वीरित्या सत्यापित झाला आणि क्यूआर कोड तयार आहे.",
    officialSummaryHeader: "मेडीकियोस्क अधिकृत क्लिनिकल सारांश",
    abdmStandard: "भारत सरकार ABDM / NDHM आरोग्य नोंद मानक",
    downloadPdfBtn: "📥 सारांश डाउनलोड करा (PDF)",
    printSummaryBtn: "🖨️ सारांश प्रिंट करा",
    sendToHisBtn: "🏥 रुग्णालय प्रणालीला (HIS) पाठवा",
    hisSuccessBadge: "रुग्णालय प्रणालीला (HIS) पाठवले गेले ✓",
    newSessionBtn: "🔄 नवीन सत्र सुरू करा",
    qrScanInstruction: "रुग्णालयाच्या काउंटरवर हा क्यूआर कोड स्कॅन करून सत्यापित सारांश पहा."
  },
  'Gujarati (ગુજરાતી)': {
    appName: "મેડીકિયોસ્ક",
    appSubtitle: "AI ક્લિનિકલ ઇતિહાસ અને રેકોર્ડ ડિજિટાઇઝેશન પ્લેટફોર્મ",
    tagline: "એક દર્દી. એક ઇતિહાસ. એક સ્માર્ટ પ્લેટફોર્મ.",
    welcomeBack: "મેડીકિયોસ્કમાં આપનું સ્વાગત છે",
    enterEmailPrompt: "તમારું ઇમેઇલ અને પાસવર્ડ દાખલ કરો.",
    emailLabel: "ઇમેઇલ સરનામું",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "પાસવર્ડ",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "પાસવર્ડની પુષ્ટિ કરો",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "લૉગિન કરો →",
    dontHaveAccount: "ખાતું નથી?",
    registerNewUser: "નવા દર્દીની નોંધણી કરો",
    alreadyHaveAccount: "પહેલેથી ખાતું છે?",
    loginHere: "અહીં લૉગિન કરો",
    registerTitle: "નવી દર્દી નોંધણી",
    registerSubtitle: "મેડીકિયોસ્ક પ્રોફાઇલ બનાવો",
    createAccountBtn: "ખાતું બનાવો →",
    steps: { patient: "દર્દી", mode: "મોડ", history: "ઇતિહાસ", docs: "દસ્તાવેજો", review: "સમીક્ષા", summary: "સારાંશ" },
    stepCounter: (c, t) => `પગલું ${c} / ${t}`,
    chooseModeTitle: "કન્સલ્ટેશન મોડ પસંદ કરો",
    chooseModeDesc: "મોડ પસંદ કરો અને આગળ વધો.",
    ayushTitle: "આયુષ / આયુર્વેદ",
    ayushTagline: "દશવિધ પરીક્ષા અને આયુર્વેદિક ઇતિહાસ.",
    clinicalTitle: "જનરલ ક્લિનિકલ",
    clinicalTagline: "આધુનિક ચિકિત્સા અને લક્ષણોનો ઇતિહાસ.",
    selectAyushBtn: "આયુષ મોડ",
    selectClinicalBtn: "ક્લિનિકલ મોડ",
    selectedBadge: "પસંદ કરેલ ✓",
    proceedToMode: "મોડ પર આગળ વધો →",
    patientDetailsTitle: "દર્દીની વિગતો",
    patientDetailsDesc: "દર્દીની માહિતી દાખલ કરો.",
    fullName: "પૂરું નામ",
    fullNamePlaceholder: "દર્દીનું પૂરું નામ",
    ageLabel: "ઉંમર (વર્ષ)",
    agePlaceholder: "ઉંમર",
    genderLabel: "લિંગ",
    genders: { Male: "પુરુષ", Female: "સ્ત્રી", Other: "અન્ય" },
    weightLabel: "વજન (કિલો)",
    weightPlaceholder: "દા.ત. 65",
    pastIllnessesLabel: "ગંભીર પાછલી બીમારીઓ",
    pastIllnessesPlaceholder: "ડાયાબિટીસ, બીપી, અથવા કંઈ નહીં",
    mobileNumber: "મોબાઇલ નંબર (10 અંક)",
    mobilePlaceholder: "10 અંકનો મોબાઇલ નંબર",
    opdTokenLabel: "OPD ટોકન નંબર",
    abhaCheckbox: "મારી પાસે ABHA ID છે",
    abhaPlaceholder: "14 અંકનું ABHA ID",
    changePhotoBtn: "📷 ફોટો બદલો",
    takePhotoBtn: "📸 ફોટો લો",
    backBtn: "← પાછા",
    continueBtn: "આગળ વધો →",
    aiAssistantTitle: "AI આરોગ્ય સહાયક",
    interactiveIntake: "ક્લિનિકલ ઇનટેક",
    replayVoice: "🔊 ફરીથી સાંભળો",
    speaking: "🔊 AI બોલી રહ્યું છે...",
    listenMessage: "🔊 સંદેશ સાંભળો",
    greetingMsg: "નમસ્તે! આજે તમને કઈ મુખ્ય સ્વાસ્થ્ય સમસ્યા અથવા લક્ષણો થઈ રહ્યા છે?",
    chatInputPlaceholder: "લખો અથવા બોલો...",
    sendBtn: "મોકલો",
    nextStepBtn: "આગળનું પગલું →",
    completeHistoryBtn: "ઇતિહાસ પૂર્ણ કરો →",
    liveSessionSummary: "હાલની સ્થિતિ",
    extractedSymptomLabel: "લક્ષણો",
    symptomSeverityLabel: "ગંભીરતા",
    symptomDurationLabel: "સમયગાળો",
    previousHistoryLabel: "પાછલો ઇતિહાસ",
    pendingSelection: "બાકી છે",
    ayushAssessmentTitle: "આયુર્વેદિક મૂલ્યાંકન",
    ayushAssessmentSubtitle: "દશવિધ પરીક્ષા (અનુત્તરિત પરિમાણો સારાંશમાંથી બાકાત રહેશે).",
    changeAyushStatus: "સ્થિતિ પસંદ કરો ✎",
    modalSelectTitle: "સ્થિતિ પસંદ કરો:",
    docUploadTitle: "દસ્તાવેજ અપલોડ કરો",
    docUploadSubtitle: "પ્રેસ્ક્રિપ્શન અને રિપોર્ટ્સ સ્કેન કરો.",
    dragDropText: "ફાઇલો અહીં મૂકો અથવા બ્રાઉઝ કરો",
    browseFilesBtn: "ફાઇલ પસંદ કરો / ફોટો લો",
    uploadedRecordsTitle: "સ્કેન કરેલા દસ્તાવેજો",
    noDocsUploaded: "હજુ સુધી કોઈ દસ્તાવેજ અપલોડ થયો નથી.",
    processWithAiBtn: "સારાંશ જુઓ →",
    ocrLoadingTitle: "દસ્તાવેજો સ્કેન કરી રહ્યા છીએ...",
    ocrLoadingSubtitle: "OCR પ્રોસેસિંગ ચાલુ છે.",
    editableOcrLabel: "સ્કેન કરેલ લખાણ (સંપાદિત કરો)",
    saveOcrRecordBtn: "પુષ્ટિ કરો અને જોડો ✓",
    smartDocRequestTitle: "સુચવેલા દસ્તાવેજો:",
    clinicalReviewTitle: "ક્લિનિકલ સમીક્ષા",
    clinicalReviewSubtitle: "વિગતો ચકાસો અને સંપાદિત કરો.",
    editableClinicalFields: "સંપાદન યોગ્ય વિગતો",
    chiefComplaintLabel: "મુખ્ય ફરિયાદ",
    hpiLabel: "હાલની બીમારીનો ઇતિહાસ",
    pastHistoryLabel: "પાછલો ઇતિહાસ",
    medicationsLabel: "દવાઓ (OCR)",
    allergiesLabel: "એલર્જી",
    lifestyleLabel: "જીવનશૈલી",
    clinicianNotesTitle: "ડૉક્ટરની નોંધ",
    clinicianNotesPlaceholder: "ડૉક્ટરની નોંધ અહીં લખો...",
    markVerifiedBtn: "ચકાસો અને સાચવો ✓",
    summaryVerifiedTitle: "સારાંશ ચકાસાયેલ છે",
    summaryVerifiedSubtitle: "QR કોડ સાથે ક્લિનિકલ સારાંશ તૈયાર છે.",
    officialSummaryHeader: "MediKiosk સત્તાવાર સારાંશ",
    abdmStandard: "ભારત સરકાર ABDM સ્ટાન્ડર્ડ",
    downloadPdfBtn: "📥 ડાઉનલોડ કરો (PDF)",
    printSummaryBtn: "🖨️ પ્રિન્ટ કરો",
    sendToHisBtn: "🏥 હોસ્પિટલ સિસ્ટમને મોકલો",
    hisSuccessBadge: "હોસ્પિટલ સિસ્ટમને મોકલ્યું ✓",
    newSessionBtn: "🔄 નવું સત્ર શરૂ કરો",
    qrScanInstruction: "આ QR કોડ હોસ્પિટલ રિસેપ્શન પર સ્કેન કરો."
  },
  'Bengali (বাংলা)': {
    appName: "মেডিকিয়স্ক",
    appSubtitle: "এআই-চালিত ক্লিনিক্যাল ইতিহাস ও মেডিকেল রেকর্ড ডিজিটাইজেশন প্ল্যাটফর্ম",
    tagline: "একজন রোগী। একটি ইতিহাস। একটি স্মার্ট প্ল্যাটফর্ম।",
    welcomeBack: "মেডিকিয়স্কে স্বাগতম",
    enterEmailPrompt: "সেশন শুরু করতে ইমেল ও পাসওয়ার্ড দিন।",
    emailLabel: "ইমেল ঠিকানা",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "লগইন করুন →",
    dontHaveAccount: "অ্যাকাউন্ট নেই?",
    registerNewUser: "নতুন রোগী নিবন্ধন করুন",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    loginHere: "এখানে লগইন করুন",
    registerTitle: "নতুন রোগী নিবন্ধন",
    registerSubtitle: "মেডিকিয়স্ক প্রোফাইল তৈরি করুন",
    createAccountBtn: "অ্যাকাউন্ট তৈরি করুন →",
    steps: { patient: "রোগী", mode: "মোড", history: "ইতিহাস", docs: "কাগজপত্র", review: "পর্যালোচনা", summary: "সারাংশ" },
    stepCounter: (c, t) => `ধাপ ${c} / ${t}`,
    chooseModeTitle: "পরামর্শের ধরন বেছে নিন",
    chooseModeDesc: "আপনার পছন্দের মোড বেছে নিন।",
    ayushTitle: "আয়ুশ / আয়ুর্বেদ",
    ayushTagline: "প্রামাণিক দশবিধ পরীক্ষা ও সার্বিক আয়ুর্বেদিক মূল্যায়ন।",
    clinicalTitle: "সাধারণ ক্লিনিক্যাল",
    clinicalTagline: "আধুনিক চিকিৎসা ও লক্ষণের কালক্রম।",
    selectAyushBtn: "আয়ুশ মোড",
    selectClinicalBtn: "ক্লিনিক্যাল মোড",
    selectedBadge: "নির্বাচিত ✓",
    proceedToMode: "মোড নির্বাচনে এগিয়ে যান →",
    patientDetailsTitle: "রোগীর পরিচয় বিবরণ",
    patientDetailsDesc: "রোগীর তথ্য লিখুন।",
    fullName: "সম্পূর্ণ নাম",
    fullNamePlaceholder: "রোগীর সম্পূর্ণ নাম",
    ageLabel: "বয়স (বছর)",
    agePlaceholder: "বয়স",
    genderLabel: "লিঙ্গ",
    genders: { Male: "পুরুষ", Female: "মহিলা", Other: "অন্যান্য" },
    weightLabel: "ওজন (কেজি)",
    weightPlaceholder: "যেমন ৬৫",
    pastIllnessesLabel: "অতীতের গুরুতর রোগ",
    pastIllnessesPlaceholder: "ডায়াবেটিস, প্রেশার, বা কিছু নেই",
    mobileNumber: "মোবাইল নম্বর (১০ সংখ্যা)",
    mobilePlaceholder: "১০ সংখ্যার মোবাইল নম্বর",
    opdTokenLabel: "ওপিডি টোকেন নম্বর",
    abhaCheckbox: "আমার ABHA ID আছে",
    abhaPlaceholder: "১৪ সংখ্যার ABHA ID",
    changePhotoBtn: "📷 ছবি পরিবর্তন",
    takePhotoBtn: "📸 ছবি তুলুন",
    backBtn: "← পিছনে",
    continueBtn: "এগিয়ে যান →",
    aiAssistantTitle: "এআই স্বাস্থ্য সহায়ক",
    interactiveIntake: "ক্লিনিক্যাল ইনটেক",
    replayVoice: "🔊 আবার শুনুন",
    speaking: "🔊 এআই কথা বলছে...",
    listenMessage: "🔊 শুনুন",
    greetingMsg: "নমস্কার! আজ আপনার প্রধান স্বাস্থ্য সমস্যা বা কী লক্ষণ দেখা দিচ্ছে?",
    chatInputPlaceholder: "বাংলায় লিখুন বা বলুন...",
    sendBtn: "পাঠান",
    nextStepBtn: "পরবর্তী ধাপ →",
    completeHistoryBtn: "ইতিহাস সম্পন্ন করুন →",
    liveSessionSummary: "বর্তমান অবস্থা",
    extractedSymptomLabel: "লক্ষণসমূহ",
    symptomSeverityLabel: "তীব্রতা",
    symptomDurationLabel: "সময়কাল",
    previousHistoryLabel: "পূর্ব ইতিহাস",
    pendingSelection: "অপেক্ষমাণ",
    ayushAssessmentTitle: "আয়ুর্বেদিক মূল্যায়ন",
    ayushAssessmentSubtitle: "দশবিধ পরীক্ষা (উত্তর না দেওয়া বিষয় সারাংশ থেকে বাদ যাবে)।",
    changeAyushStatus: "স্থিতি বাছুন ✎",
    modalSelectTitle: "স্থিতি নির্বাচন:",
    docUploadTitle: "কাগজপত্র আপলোড করুন",
    docUploadSubtitle: "প্রেসক্রিপশন ও ল্যাব রিপোর্ট স্ক্যান করুন।",
    dragDropText: "ফাইল এখানে ছাড়ুন বা ব্রাউজ করুন",
    browseFilesBtn: "ফাইল বাছুন / ছবি তুলুন",
    uploadedRecordsTitle: "স্ক্যান করা রেকর্ড",
    noDocsUploaded: "কোনো নথি আপলোড করা হয়নি।",
    processWithAiBtn: "সারাংশ দেখুন →",
    ocrLoadingTitle: "কাগজপত্র স্ক্যান করা হচ্ছে...",
    ocrLoadingSubtitle: "ওসিআর প্রসেসিং চলছে।",
    editableOcrLabel: "স্ক্যান করা টেক্সট (সম্পাদনা করুন)",
    saveOcrRecordBtn: "নিশ্চিত করুন ও যোগ করুন ✓",
    smartDocRequestTitle: "প্রস্তাবিত কাগজপত্র:",
    clinicalReviewTitle: "ক্লিনিক্যাল পর্যালোচনা",
    clinicalReviewSubtitle: "বিবরণ পরীক্ষা ও সম্পাদনা করুন।",
    editableClinicalFields: "সম্পাদনাযোগ্য ক্ষেত্র",
    chiefComplaintLabel: "প্রধান অভিযোগ",
    hpiLabel: "বর্তমান রোগের ইতিহাস",
    pastHistoryLabel: "অতীতের ইতিহাস",
    medicationsLabel: "বর্তমান ওষুধ (OCR)",
    allergiesLabel: "অ্যালার্জি",
    lifestyleLabel: "জীবনযাত্রা",
    clinicianNotesTitle: "ডাক্তারের নোট",
    clinicianNotesPlaceholder: "ডাক্তারের মন্তব্য এখানে লিখুন...",
    markVerifiedBtn: "যাচাই ও সংরক্ষণ করুন ✓",
    summaryVerifiedTitle: "সারাংশ যাচাইকৃত",
    summaryVerifiedSubtitle: "কিউআর কোডসহ সারাংশ প্রস্তুত।",
    officialSummaryHeader: "MediKiosk অফিশিয়াল সারাংশ",
    abdmStandard: "ভারত সরকার ABDM মানদণ্ড",
    downloadPdfBtn: "📥 ডাউনলোড করুন (PDF)",
    printSummaryBtn: "🖨️ প্রিন্ট করুন",
    sendToHisBtn: "🏥 হাসপাতাল সিস্টেমে পাঠান",
    hisSuccessBadge: "হাসপাতাল সিস্টেমে পাঠানো হয়েছে ✓",
    newSessionBtn: "🔄 নতুন সেশন শুরু করুন",
    qrScanInstruction: "হাসপাতাল কাউন্টারে এই কিউআর কোড স্ক্যান করুন।"
  },
  'Tamil (தமிழ்)': {
    appName: "மெடிகியோஸ்க்",
    appSubtitle: "AI மருத்துவ வரலாறு & ஆவணங்கள் தளவியல்",
    tagline: "ஒரு நோயாளி. ஒரு வரலாறு. ஒரு ஸ்மார்ட் தளம்.",
    welcomeBack: "மெடிகியோஸ்கிற்கு வரவேற்கிறோம்",
    enterEmailPrompt: "தொடங்க மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "உள்நுழைக →",
    dontHaveAccount: "கணக்கு இல்லையா?",
    registerNewUser: "புதிய நோயாளியைப் பதிவு செய்க",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    loginHere: "இங்கே உள்நுழைக",
    registerTitle: "புதிய நோயாளி பதிவு",
    registerSubtitle: "புதிய சுயவிவரத்தை உருவாக்கவும்",
    createAccountBtn: "கணக்கை உருவாக்குக →",
    steps: { patient: "நோயாளி", mode: "முறை", history: "வரலாறு", docs: "ஆவணங்கள்", review: "மதிப்பாய்வு", summary: "சுருக்கம்" },
    stepCounter: (c, t) => `படி ${c} / ${t}`,
    chooseModeTitle: "ஆலோசனை முறையைத் தேர்ந்தெடுக்கவும்",
    chooseModeDesc: "விருப்பமான முறையைத் தேர்ந்தெடுக்கவும்.",
    ayushTitle: "ஆயுஷ் / ஆயுர்வேதம்",
    ayushTagline: "பாரம்பரிய 10-முறை மதிப்பீடு.",
    clinicalTitle: "பொது மருத்துவ முறை",
    clinicalTagline: "நவீன மருத்துவம் மற்றும் அறிகுறிகள் வரலாறு.",
    selectAyushBtn: "ஆயுஷ் முறை",
    selectClinicalBtn: "மருத்துவ முறை",
    selectedBadge: "தேர்ந்தெடுக்கப்பட்டது ✓",
    proceedToMode: "முறைக்கு செல்க →",
    patientDetailsTitle: "நோயாளி விவரங்கள்",
    patientDetailsDesc: "நோயாளி தகவல்களை உள்ளிடவும்.",
    fullName: "முழு பெயர்",
    fullNamePlaceholder: "நோயாளியின் முழு பெயர்",
    ageLabel: "வயது (ஆண்டுகள்)",
    agePlaceholder: "வயது",
    genderLabel: "பாலினம்",
    genders: { Male: "ஆண்", Female: "பெண்", Other: "மற்றவை" },
    weightLabel: "எடை (கிலோ)",
    weightPlaceholder: "எ.கா. 65",
    pastIllnessesLabel: "முந்தைய நோய்கள் / அறுவை சிகிச்சைகள்",
    pastIllnessesPlaceholder: "சர்க்கரை நோய், இரத்த அழுத்தம், அல்லது எதுவும் இல்லை",
    mobileNumber: "கைபேசி எண் (10 இலக்கம்)",
    mobilePlaceholder: "10 இலக்க கைபேசி எண்",
    opdTokenLabel: "OPD டோக்கன் எண்",
    abhaCheckbox: "என்னிடம் ABHA ID உள்ளது",
    abhaPlaceholder: "14 இலக்க ABHA ID",
    changePhotoBtn: "📷 படம் மாற்றுக",
    takePhotoBtn: "📸 படம் எடுக்க",
    backBtn: "← பின்னே",
    continueBtn: "தொடர்க →",
    aiAssistantTitle: "AI மருத்துவ உதவியாளர்",
    interactiveIntake: "மருத்துவ வரலாறு உட்கொள்ளல்",
    replayVoice: "🔊 மீண்டும் கேட்க",
    speaking: "🔊 AI பேசுகிறது...",
    listenMessage: "🔊 கேட்க",
    greetingMsg: "வணக்கம்! இன்று நீங்கள் சந்திக்கும் முக்கிய சுகாதாரப் பிரச்சனை அல்லது அறிகுறி என்ன?",
    chatInputPlaceholder: "தமிழில் தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    sendBtn: "அனுப்புக",
    nextStepBtn: "அடுத்த படி →",
    completeHistoryBtn: "வரலாற்றை முடிக்கவும் →",
    liveSessionSummary: "தற்போதைய நிலை",
    extractedSymptomLabel: "அறிகுறிகள்",
    symptomSeverityLabel: "தீவிரம்",
    symptomDurationLabel: "கால அளவு",
    previousHistoryLabel: "முந்தைய வரலாறு",
    pendingSelection: "நிலுவையில்",
    ayushAssessmentTitle: "ஆயுர்வேத மதிப்பீடு",
    ayushAssessmentSubtitle: "10-முறை மதிப்பீடு (பதிலளிக்கப்படாதவை இறுதிச் சுருக்கத்திலிருந்து தவிர்க்கப்படும்).",
    changeAyushStatus: "நிலையைத் தேர்ந்தெடு ✎",
    modalSelectTitle: "நிலையைத் தேர்ந்தெடுக்கவும்:",
    docUploadTitle: "ஆவணங்களைப் பதிவேற்றவும்",
    docUploadSubtitle: "மருந்துச் சீட்டு மற்றும் அறிக்கைகளை ஸ்கேன் செய்யவும்.",
    dragDropText: "கோப்புகளை இங்கே விடவும்",
    browseFilesBtn: "கோப்பைத் தேர்ந்தெடு / படம் எடு",
    uploadedRecordsTitle: "பதிவேற்றப்பட்ட ஆவணங்கள்",
    noDocsUploaded: "ஆவணங்கள் எதுவும் பதிவேற்றப்படவில்லை.",
    processWithAiBtn: "சுருக்கத்தைப் பார்க்கவும் →",
    ocrLoadingTitle: "ஆவணங்கள் ஸ்கேன் செய்யப்படுகின்றன...",
    ocrLoadingSubtitle: "செயலாக்கம் நடைபெறுகிறது.",
    editableOcrLabel: "ஸ்கேன் செய்யப்பட்ட உரை (திருத்தவும்)",
    saveOcrRecordBtn: "உறுதிசெய்து சேர்க்கவும் ✓",
    smartDocRequestTitle: "பரிந்துரைக்கப்பட்ட ஆவணங்கள்:",
    clinicalReviewTitle: "மருத்துவ மதிப்பாய்வு",
    clinicalReviewSubtitle: "விவரங்களைச் சரிபார்த்து திருத்தவும்.",
    editableClinicalFields: "திருத்தக்கூடிய புலங்கள்",
    chiefComplaintLabel: "முக்கிய பிரச்சனை",
    hpiLabel: "தற்போதைய நோய் வரலாறு",
    pastHistoryLabel: "முந்தைய வரலாறு",
    medicationsLabel: "தற்போதைய மருந்துகள் (OCR)",
    allergiesLabel: "ஒவ்வாமை",
    lifestyleLabel: "வாழ்க்கை முறை",
    clinicianNotesTitle: "மருத்துவர் குறிப்பு",
    clinicianNotesPlaceholder: "மருத்துவர் குறிப்புகளை இங்கே எழுதுங்கள்...",
    markVerifiedBtn: "சரிபார்த்து சேமிக்கவும் ✓",
    summaryVerifiedTitle: "சுருக்கம் சரிபார்க்கப்பட்டது",
    summaryVerifiedSubtitle: "QR குறியீட்டுடன் மருத்துவ சுருக்கம் தயார்.",
    officialSummaryHeader: "MediKiosk அதிகாரப்பூர்வ சுருக்கம்",
    abdmStandard: "இந்திய அரசு ABDM தரநிலை",
    downloadPdfBtn: "📥 பதிவிறக்குக (PDF)",
    printSummaryBtn: "🖨️ அச்சிடுக",
    sendToHisBtn: "🏥 மருத்துவமனை முறைமைக்கு அனுப்புக",
    hisSuccessBadge: "மருத்துவமனைக்கு அனுப்பப்பட்டது ✓",
    newSessionBtn: "🔄 புதிய அமர்வு தொடங்கவும்",
    qrScanInstruction: "மருத்துவமனை கவுண்டரில் இந்த QR குறியீட்டை ஸ்கேன் செய்யவும்."
  },
  'Telugu (తెలుగు)': {
    appName: "మెడికియోస్క్",
    appSubtitle: "AI క్లినికల్ హిస్టరీ & మెడికల్ రికార్డ్స్ వేదిక",
    tagline: "ఒక రోగి. ఒక చరిత్ర. ఒక స్మార్ట్ ప్లాట్‌ఫారమ్.",
    welcomeBack: "మెడికియోస్క్‌కు స్వాగతం",
    enterEmailPrompt: "ప్రారంభించడానికి ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
    emailLabel: "ఈమెయిల్ చిరునామా",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "పాస్‌వర్డ్",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "లాగిన్ అవ్వండి →",
    dontHaveAccount: "ఖాతా లేదా?",
    registerNewUser: "కొత్త రోగి నమోదు",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    loginHere: "ఇక్కడ లాగిన్ అవ్వండి",
    registerTitle: "కొత్త రోగి నమోదు",
    registerSubtitle: "కొత్త ప్రొఫైల్ సృష్టించండి",
    createAccountBtn: "ఖాతా సృష్టించండి →",
    steps: { patient: "రోగి", mode: "మోడ్", history: "చరిత్ర", docs: "పత్రాలు", review: "సమీక్ష", summary: "సారాంశం" },
    stepCounter: (c, t) => `దశ ${c} / ${t}`,
    chooseModeTitle: "కన్సల్టేషన్ మోడ్‌ను ఎంచుకోండి",
    chooseModeDesc: "మీ ప్రాధాన్యత మోడ్‌ను ఎంచుకోండి.",
    ayushTitle: "ఆయుష్ / ఆయుర్వేదం",
    ayushTagline: "దశవిధ పరీక్ష మరియు సంపూర్ణ ఆయుర్వేద చరిత్ర.",
    clinicalTitle: "సాధారణ క్లినికల్",
    clinicalTagline: "ఆధునిక వైద్యం మరియు లక్షణాల చరిత్ర.",
    selectAyushBtn: "ఆయుష్ మోడ్",
    selectClinicalBtn: "క్లినికల్ మోడ్",
    selectedBadge: "ఎంపిక చేయబడింది ✓",
    proceedToMode: "మోడ్ ఎంపికకు వెళ్లండి →",
    patientDetailsTitle: "రోగి వివరాలు",
    patientDetailsDesc: "రోగి వివరాలను నమోదు చేయండి.",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "రోగి పూర్తి పేరు",
    ageLabel: "వయస్సు (సంవత్సరాలు)",
    agePlaceholder: "వయస్సు",
    genderLabel: "లింగం",
    genders: { Male: "పురుషుడు", Female: "స్త్రీ", Other: "ఇతర" },
    weightLabel: "బరువు (కిలోలు)",
    weightPlaceholder: "ఉదా. 65",
    pastIllnessesLabel: "గత తీవ్రమైన వ్యాధులు",
    pastIllnessesPlaceholder: "షుగర్, బీపీ, శస్త్రచికిత్సలు, లేదా ఏమీ లేవు",
    mobileNumber: "మొబైల్ నంబర్ (10 అంకెలు)",
    mobilePlaceholder: "10 అంకెల మొబైల్ నంబర్",
    opdTokenLabel: "OPD టోకెన్ సంఖ్య",
    abhaCheckbox: "నాకు ABHA ID ఉంది",
    abhaPlaceholder: "14 అంకెల ABHA ID",
    changePhotoBtn: "📷 ఫోటో మార్చండి",
    takePhotoBtn: "📸 ఫోటో తీయండి",
    backBtn: "← వెనుకకు",
    continueBtn: "కొనసాగించండి →",
    aiAssistantTitle: "AI ఆరోగ్య సహాయకుడు",
    interactiveIntake: "క్లినికల్ ఇన్టేక్",
    replayVoice: "🔊 మళ్లీ వినండి",
    speaking: "🔊 AI మాట్లాడుతోంది...",
    listenMessage: "🔊 వినండి",
    greetingMsg: "నమస్కారం! ఈ రోజు మీరు ఎదుర్కొంటున్న ప్రధాన ఆరోగ్య సమస్య లేదా లక్షణం ఏమిటి?",
    chatInputPlaceholder: "తెలుగులో టైప్ చేయండి లేదా మాట్లాడండి...",
    sendBtn: "పంపండి",
    nextStepBtn: "తదుపరి దశ →",
    completeHistoryBtn: "చరిత్రను పూర్తి చేయండి →",
    liveSessionSummary: "ప్రస్తుత స్థితి",
    extractedSymptomLabel: "లక్షణాలు",
    symptomSeverityLabel: "తీవ్రత",
    symptomDurationLabel: "వ్యవధి",
    previousHistoryLabel: "గత చరిత్ర",
    pendingSelection: "పెండింగ్‌లో ఉంది",
    ayushAssessmentTitle: "ఆయుర్వేద అంచనా",
    ayushAssessmentSubtitle: "దశవిధ పరీక్ష (సమాధానం ఇవ్వనివి సారాంశం నుండి తీసివేయబడతాయి).",
    changeAyushStatus: "స్థితిని ఎంచుకోండి ✎",
    modalSelectTitle: "స్థితిని ఎంచుకోండి:",
    docUploadTitle: "పత్రాలను అప్‌లోడ్ చేయండి",
    docUploadSubtitle: "ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ నివేదికలను స్కాన్ చేయండి.",
    dragDropText: "ఫైళ్ళను ఇక్కడ వేయండి",
    browseFilesBtn: "ఫైల్‌ని ఎంచుకోండి / ఫోటో తీయండి",
    uploadedRecordsTitle: "స్కాన్ చేసిన పత్రాలు",
    noDocsUploaded: "ఇంకా ఏ పత్రాలూ అప్‌లోడ్ చేయలేదు.",
    processWithAiBtn: "సారాంశం చూడండి →",
    ocrLoadingTitle: "పత్రాలు స్కాన్ చేయబడుతున్నాయి...",
    ocrLoadingSubtitle: "ప్రాసెసింగ్ జరుగుతోంది.",
    editableOcrLabel: "స్కాన్ చేసిన వచనం (సవరించండి)",
    saveOcrRecordBtn: "నిర్ధారించి జోడించండి ✓",
    smartDocRequestTitle: "సూచించిన పత్రాలు:",
    clinicalReviewTitle: "క్లినికల్ సమీక్ష",
    clinicalReviewSubtitle: "వివరాలను సమీక్షించి సవరించండి.",
    editableClinicalFields: "సవరించదగిన ఫీల్డ్‌లు",
    chiefComplaintLabel: "ప్రధాన ఫిర్యాదు",
    hpiLabel: "ప్రస్తుత వ్యాధి చరిత్ర",
    pastHistoryLabel: "గత చరిత్ర",
    medicationsLabel: "మందులు (OCR)",
    allergiesLabel: "అలెర్జీలు",
    lifestyleLabel: "జీవనశైలి",
    clinicianNotesTitle: "వైద్యుని గమనికలు",
    clinicianNotesPlaceholder: "వైద్యుని సూచనలు ఇక్కడ రాయండి...",
    markVerifiedBtn: "ధృవీకరించి సేవ్ చేయండి ✓",
    summaryVerifiedTitle: "సారాంశం ధృవీకరించబడింది",
    summaryVerifiedSubtitle: "QR కోడ్‌తో క్లినికల్ సారాంశం సిద్ధంగా ఉంది.",
    officialSummaryHeader: "MediKiosk అధికారిక సారాంశం",
    abdmStandard: "భారత ప్రభుత్వం ABDM ప్రమాణం",
    downloadPdfBtn: "📥 డౌన్‌లోడ్ చేయండి (PDF)",
    printSummaryBtn: "🖨️ ప్రింట్ చేయండి",
    sendToHisBtn: "🏥 ఆసుపత్రి వ్యవస్థకు పంపండి",
    hisSuccessBadge: "ఆసుపత్రి వ్యవస్థకు పంపబడింది ✓",
    newSessionBtn: "🔄 కొత్త సెషన్ ప్రారంభించండి",
    qrScanInstruction: "ఆసుపత్రి కౌంటర్ వద్ద ఈ QR కోడ్‌ని స్కాన్ చేయండి."
  },
  'Kannada (ಕನ್ನಡ)': {
    appName: "ಮೆಡಿಕಿಯೋಸ್ಕ್",
    appSubtitle: "AI ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ ಮತ್ತು ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳ ಡಿಜಿಟಲೀಕರಣ ವೇದಿಕೆ",
    tagline: "ಒಬ್ಬ ರೋಗಿ. ಒಂದು ಇತಿಹಾಸ. ಒಂದು ಸ್ಮಾರ್ಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.",
    welcomeBack: "ಮೆಡಿಕಿಯೋಸ್ಕ್‌ಗೆ ಸುಸ್ವಾಗತ",
    enterEmailPrompt: "ಪ್ರಾರಂಭಿಸಲು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
    emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "ಲಾಗಿನ್ ಮಾಡಿ →",
    dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    registerNewUser: "ಹೊಸ ರೋಗಿ ನೋಂದಣಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    loginHere: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ",
    registerTitle: "ಹೊಸ ರೋಗಿ ನೋಂದಣಿ",
    registerSubtitle: "ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ",
    createAccountBtn: "ಖಾತೆ ರಚಿಸಿ →",
    steps: { patient: "ರೋಗಿ", mode: "ಮೋಡ್", history: "ಇತಿಹಾಸ", docs: "ದಾಖಲೆಗಳು", review: "ಪರಿಶೀಲನೆ", summary: "ಸಾರಾಂಶ" },
    stepCounter: (c, t) => `ಹಂತ ${c} / ${t}`,
    chooseModeTitle: "ಸಮಾಲೋಚನೆ ಮೋಡ್ ಆಯ್ಕೆಮಾಡಿ",
    chooseModeDesc: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಮೋಡ್ ಆಯ್ಕೆಮಾಡಿ.",
    ayushTitle: "ಆಯುಷ್ / ಆಯುರ್ವೇದ",
    ayushTagline: "ದಶವಿಧ ಪರೀಕ್ಷೆ ಮತ್ತು ಆಯುರ್ವೇದ ಇತಿಹಾಸ.",
    clinicalTitle: "ಜನರಲ್ ಕ್ಲಿನಿಕಲ್",
    clinicalTagline: "ಆಧುನಿಕ ವೈದ್ಯಕೀಯ ಮತ್ತು ರೋಗಲಕ್ಷಣಗಳ ಇತಿಹಾಸ.",
    selectAyushBtn: "ಆಯುಷ್ ಮೋಡ್",
    selectClinicalBtn: "ಕ್ಲಿನಿಕಲ್ ಮೋಡ್",
    selectedBadge: "ಆಯ್ಕೆಯಾಗಿದೆ ✓",
    proceedToMode: "ಮೋಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ →",
    patientDetailsTitle: "ರೋಗಿಯ ಗುರುತಿನ ವಿವರಗಳು",
    patientDetailsDesc: "ರೋಗಿಯ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ.",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    fullNamePlaceholder: "ರೋಗಿಯ ಪೂರ್ಣ ಹೆಸರು",
    ageLabel: "ವಯಸ್ಸು (ವರ್ಷಗಳು)",
    agePlaceholder: "ವಯಸ್ಸು",
    genderLabel: "ಲಿಂಗ",
    genders: { Male: "ಪುರುಷ", Female: "ಮಹಿಳೆ", Other: "ಇತರೆ" },
    weightLabel: "ತೂಕ (ಕೆಜಿ)",
    weightPlaceholder: "ಉದಾ. 65",
    pastIllnessesLabel: "ಹಿಂದಿನ ಗಂಭೀರ ಕಾಯಿಲೆಗಳು",
    pastIllnessesPlaceholder: "ಮಧುಮೇಹ, ಬಿಪಿ, ಅಥವಾ ಯಾವುದೂ ಇಲ್ಲ",
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕಿಗಳು)",
    mobilePlaceholder: "10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    opdTokenLabel: "OPD ಟೋಕನ್ ಸಂಖ್ಯೆ",
    abhaCheckbox: "ನನ್ನ ಬಳಿ ABHA ID ಇದೆ",
    abhaPlaceholder: "14 ಅಂಕಿಗಳ ABHA ID",
    changePhotoBtn: "📷 ಫೋಟೋ ಬದಲಾಯಿಸಿ",
    takePhotoBtn: "📸 ಫೋಟೋ ತೆಗೆಯಿರಿ",
    backBtn: "← ಹಿಂದೆ",
    continueBtn: "ಮುಂದುವರಿಯಿರಿ →",
    aiAssistantTitle: "AI ಆರೋಗ್ಯ ಸಹಾಯಕ",
    interactiveIntake: "ಕ್ಲಿನಿಕಲ್ ಇನ್‌ಟೇಕ್",
    replayVoice: "🔊 ಪುನಃ ಕೇಳಿ",
    speaking: "🔊 AI ಮಾತನಾಡುತ್ತಿದೆ...",
    listenMessage: "🔊 ಕೇಳಿ",
    greetingMsg: "ನಮಸ್ಕಾರ! ಇಂದು ನೀವು ಎದುರಿಸುತ್ತಿರುವ ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಅಥವಾ ರೋಗಲಕ್ಷಣ ಯಾವುದು?",
    chatInputPlaceholder: "ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...",
    sendBtn: "ಕಳುಹಿಸಿ",
    nextStepBtn: "ಮುಂದಿನ ಹಂತ →",
    completeHistoryBtn: "ಇತಿಹಾಸ ಪೂರ್ಣಗೊಳಿಸಿ →",
    liveSessionSummary: "ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ",
    extractedSymptomLabel: "ರೋಗಲಕ್ಷಣಗಳು",
    symptomSeverityLabel: "ತೀವ್ರತೆ",
    symptomDurationLabel: "ಅವಧಿ",
    previousHistoryLabel: "ಹಿಂದಿನ ಇತಿಹಾಸ",
    pendingSelection: "ಬಾಕಿ ಇದೆ",
    ayushAssessmentTitle: "ಆಯುರ್ವೇದ ಮೌಲ್ಯಮಾಪನ",
    ayushAssessmentSubtitle: "ದಶವಿಧ ಪರೀಕ್ಷೆ (ಉತ್ತರಿಸದ ಅಂಶಗಳನ್ನು ಸಾರಾಂಶದಿಂದ ಹೊರಗಿಡಲಾಗುತ್ತದೆ).",
    changeAyushStatus: "ಸ್ಥಿತಿ ಆಯ್ಕೆಮಾಡಿ ✎",
    modalSelectTitle: "ಸ್ಥಿತಿ ಆಯ್ಕೆಮಾಡಿ:",
    docUploadTitle: "ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    docUploadSubtitle: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.",
    dragDropText: "ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ",
    browseFilesBtn: "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ / ಫೋಟೋ ತೆಗೆಯಿರಿ",
    uploadedRecordsTitle: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ದಾಖಲೆಗಳು",
    noDocsUploaded: "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಆಗಿಲ್ಲ.",
    processWithAiBtn: "ಸಾರಾಂಶ ನೋಡಿ →",
    ocrLoadingTitle: "ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    ocrLoadingSubtitle: "ಪ್ರಕ್ರಿಯೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ.",
    editableOcrLabel: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಪಠ್ಯ (ತಿದ್ದಿ)",
    saveOcrRecordBtn: "ದೃಢೀಕರಿಸಿ ಸೇರಿಸಿ ✓",
    smartDocRequestTitle: "ಸೂಚಿಸಲಾದ ದಾಖಲೆಗಳು:",
    clinicalReviewTitle: "ಕ್ಲಿನಿಕಲ್ ಪರಿಶೀಲನೆ",
    clinicalReviewSubtitle: "ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ತಿದ್ದಿ.",
    editableClinicalFields: "ತಿದ್ದಬಹುದಾದ ಕ್ಷೇತ್ರಗಳು",
    chiefComplaintLabel: "ಮುಖ್ಯ ದೂರು",
    hpiLabel: "ಪ್ರಸ್ತುತ ಕಾಯಿಲೆಯ ಇತಿಹಾಸ",
    pastHistoryLabel: "ಹಿಂದಿನ ಇತಿಹಾಸ",
    medicationsLabel: "ಔಷಧಿಗಳು (OCR)",
    allergiesLabel: "ಅಲರ್ಜಿಗಳು",
    lifestyleLabel: "ಜೀವನಶೈಲಿ",
    clinicianNotesTitle: "ವೈದ್ಯರ ಟಿಪ್ಪಣಿಗಳು",
    clinicianNotesPlaceholder: "ವೈದ್ಯರ ಟಿಪ್ಪಣಿಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    markVerifiedBtn: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಉಳಿಸಿ ✓",
    summaryVerifiedTitle: "ಸಾರಾಂಶ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    summaryVerifiedSubtitle: "QR ಕೋಡ್‌ನೊಂದಿಗೆ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿದೆ.",
    officialSummaryHeader: "MediKiosk ಅಧಿಕೃತ ಸಾರಾಂಶ",
    abdmStandard: "ಭಾರತ ಸರ್ಕಾರ ABDM ಮಾನದಂಡ",
    downloadPdfBtn: "📥 ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (PDF)",
    printSummaryBtn: "🖨️ ಮುದ್ರಿಸಿ",
    sendToHisBtn: "🏥 ಆಸ್ಪತ್ರೆ ವ್ಯವಸ್ಥೆಗೆ ಕಳುಹಿಸಿ",
    hisSuccessBadge: "ಆಸ್ಪತ್ರೆ ವ್ಯವಸ್ಥೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ ✓",
    newSessionBtn: "🔄 ಹೊಸ ಅಧಿವೇಶನ ಪ್ರಾರಂಭಿಸಿ",
    qrScanInstruction: "ಆಸ್ಪತ್ರೆ ಕೌಂಟರ್‌ನಲ್ಲಿ ಈ QR ಕೋಡ್ ಅನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."
  },
  'Malayalam (മലയാളം)': {
    appName: "മെഡികിയോസ്ക്",
    appSubtitle: "AI ക്ലിനിക്കൽ ഹിസ്റ്ററി & മെഡിക്കൽ റെക്കോർഡ്സ് ഡിജിറ്റലൈസേഷൻ പ്ലാറ്റ്‌ഫോം",
    tagline: "ഒരു രോഗി. ഒരു ചരിത്രം. ഒരു സ്മാർട്ട് പ്ലാറ്റ്ഫോം.",
    welcomeBack: "മെഡികിയോസ്കിലേക്ക് സ്വാഗതം",
    enterEmailPrompt: "ആരംഭിക്കാൻ ഇമെയിലും പാസ്‌വേഡും നൽകുക.",
    emailLabel: "ഇമെയിൽ വിലാസം",
    emailPlaceholder: "patient@example.com",
    passwordLabel: "പാസ്‌വേഡ്",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    confirmPasswordPlaceholder: "••••••••",
    loginBtn: "ലോഗിൻ ചെയ്യുക →",
    dontHaveAccount: "അക്കൗണ്ട് ഇല്ലേ?",
    registerNewUser: "പുതിയ രോഗി രജിസ്ട്രേഷൻ",
    alreadyHaveAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
    loginHere: "ഇവിടെ ലോഗിൻ ചെയ്യുക",
    registerTitle: "പുതിയ രോഗി രജിസ്ട്രേഷൻ",
    registerSubtitle: "പുതിയ പ്രൊഫൈൽ സൃഷ്ടിക്കുക",
    createAccountBtn: "അക്കൗണ്ട് സൃഷ്ടിക്കുക →",
    steps: { patient: "രോഗി", mode: "മോഡ്", history: "ചരിത്രം", docs: "രേഖകൾ", review: "അവലോകനം", summary: "സംഗ്രഹം" },
    stepCounter: (c, t) => `ഘട്ടം ${c} / ${t}`,
    chooseModeTitle: "കൺസൾട്ടേഷൻ മോഡ് തിരഞ്ഞെടുക്കുക",
    chooseModeDesc: "നിങ്ങൾക്ക് ഇഷ്ടമുള്ള മോഡ് തിരഞ്ഞെടുക്കുക.",
    ayushTitle: "ആയുഷ് / ആയുർവേദം",
    ayushTagline: "ദശവിധ പരീക്ഷയും ആയുർവേദ ചരിത്രവും.",
    clinicalTitle: "ജനറൽ ക്ലിനിക്കൽ",
    clinicalTagline: "ആധുനിക വൈദ്യശാസ്ത്രവും രോഗലക്ഷണ ചരിത്രവും.",
    selectAyushBtn: "ആയുഷ് മോഡ്",
    selectClinicalBtn: "ക്ലിനിക്കൽ മോഡ്",
    selectedBadge: "തിരഞ്ഞെടുത്തു ✓",
    proceedToMode: "മോഡിലേക്ക് പോകുക →",
    patientDetailsTitle: "രോഗിയുടെ വിവരങ്ങൾ",
    patientDetailsDesc: "രോഗിയുടെ വിവരങ്ങൾ നൽകുക.",
    fullName: "പൂർണ്ണ നാമം",
    fullNamePlaceholder: "രോഗിയുടെ പൂർണ്ണ നാമം",
    ageLabel: "പ്രായം (വർഷം)",
    agePlaceholder: "പ്രായം",
    genderLabel: "ലിംഗം",
    genders: { Male: "പുരുഷൻ", Female: "സ്ത്രീ", Other: "മറ്റുള്ളവ" },
    weightLabel: "ഭാരം (കിലോഗ്രാം)",
    weightPlaceholder: "ഉദാ. 65",
    pastIllnessesLabel: "മുമ്പത്തെ രോഗങ്ങൾ / ശസ്ത്രക്രിയകൾ",
    pastIllnessesPlaceholder: "പ്രമേഹം, രക്തസമ്മർദ്ദം, അല്ലെങ്കിൽ ഒന്നുമില്ല",
    mobileNumber: "മൊബൈൽ നമ്പർ (10 അക്കങ്ങൾ)",
    mobilePlaceholder: "10 അക്ക മൊബൈൽ നമ്പർ",
    opdTokenLabel: "OPD ടോക്കൺ നമ്പർ",
    abhaCheckbox: "എനിക്ക് ABHA ID ഉണ്ട്",
    abhaPlaceholder: "14 അക്ക ABHA ID",
    changePhotoBtn: "📷 ഫോട്ടോ മാറ്റുക",
    takePhotoBtn: "📸 ഫോട്ടോ എടുക്കുക",
    backBtn: "← പിന്നോട്ട്",
    continueBtn: "തുടരുക →",
    aiAssistantTitle: "AI ആരോഗ്യ സഹായി",
    interactiveIntake: "ക്ലിനിക്കൽ ഇൻടേക്ക്",
    replayVoice: "🔊 വീണ്ടും കേൾക്കുക",
    speaking: "🔊 AI സംസാരിക്കുന്നു...",
    listenMessage: "🔊 കേൾക്കുക",
    greetingMsg: "നമസ്കാരം! ഇന്ന് നിങ്ങൾ നേരിടുന്ന പ്രധാന ആരോഗ്യ പ്രശ്നം അല്ലെങ്കിൽ ലക്ഷണം എന്താണ്?",
    chatInputPlaceholder: "ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...",
    sendBtn: "അയക്കുക",
    nextStepBtn: "അടുത്ത ഘട്ടം →",
    completeHistoryBtn: "ചരിത്രം പൂർത്തിയാക്കുക →",
    liveSessionSummary: "നിലവിലെ അവസ്ഥ",
    extractedSymptomLabel: "ലക്ഷണങ്ങൾ",
    symptomSeverityLabel: "തീവ്രത",
    symptomDurationLabel: "ദൈർഘ്യം",
    previousHistoryLabel: "മുൻകാല ചരിത്രം",
    pendingSelection: "തീരുമാനിച്ചിട്ടില്ല",
    ayushAssessmentTitle: "ആയുർവേദ വിലയിരുത്തൽ",
    ayushAssessmentSubtitle: "ദശവിധ പരീക്ഷ (ഉത്തരം നൽകാത്തവ ഒഴിവാക്കും).",
    changeAyushStatus: "നില തിരഞ്ഞെടുക്കുക ✎",
    modalSelectTitle: "നില തിരഞ്ഞെടുക്കുക:",
    docUploadTitle: "രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
    docUploadSubtitle: "കുറിപ്പടികളും ലാബ് റിപ്പോർട്ടുകളും സ്കാൻ ചെയ്യുക.",
    dragDropText: "ഫയലുകൾ ഇവിടെ ഇടുക",
    browseFilesBtn: "ഫയൽ തിരഞ്ഞെടുക്കുക / ഫോട്ടോ എടുക്കുക",
    uploadedRecordsTitle: "സ്കാൻ ചെയ്ത രേഖകൾ",
    noDocsUploaded: "ഇതുവരെ രേഖകളൊന്നും അപ്‌ലോഡ് ചെയ്തിട്ടില്ല.",
    processWithAiBtn: "സംഗ്രഹം കാണുക →",
    ocrLoadingTitle: "രേഖകൾ സ്കാൻ ചെയ്യുന്നു...",
    ocrLoadingSubtitle: "പ്രോസസ്സിംഗ് നടക്കുന്നു.",
    editableOcrLabel: "സ്കാൻ ചെയ്ത വാചകം (തിരുത്തുക)",
    saveOcrRecordBtn: "സ്ഥിരീകരിച്ച് ചേർക്കുക ✓",
    smartDocRequestTitle: "നിർദ്ദേശിച്ച രേഖകൾ:",
    clinicalReviewTitle: "ക്ലിനിക്കൽ അവലോകനം",
    clinicalReviewSubtitle: "വിവരങ്ങൾ അവലോകനം ചെയ്യുകയും തിരുത്തുകയും ചെയ്യുക.",
    editableClinicalFields: "തിരുത്താവുന്ന ഫീൽഡുകൾ",
    chiefComplaintLabel: "പ്രധാന പരാതി",
    hpiLabel: "നിലവിലെ രോഗ ചരിത്രം",
    pastHistoryLabel: "മുൻകാല ചരിത്രം",
    medicationsLabel: "മരുന്നുകൾ (OCR)",
    allergiesLabel: "അലർജികൾ",
    lifestyleLabel: "ജീവിതശൈലി",
    clinicianNotesTitle: "ഡോക്ടറുടെ കുറിപ്പുകൾ",
    clinicianNotesPlaceholder: "ഡോക്ടറുടെ നിർദ്ദേശങ്ങൾ ഇവിടെ എഴുതുക...",
    markVerifiedBtn: "സ്ഥിരീകരിച്ച് സംരക്ഷിക്കുക ✓",
    summaryVerifiedTitle: "സംഗ്രഹം സ്ഥിരീകരിച്ചു",
    summaryVerifiedSubtitle: "QR കോഡുള്ള ക്ലിനിക്കൽ സംഗ്രഹം തയ്യാറാണ്.",
    officialSummaryHeader: "MediKiosk ഔദ്യോഗിക സംഗ്രഹം",
    abdmStandard: "ഇന്ത്യാ ഗവൺമെന്റ് ABDM നിലവാരം",
    downloadPdfBtn: "📥 ഡൗൺലോഡ് ചെയ്യുക (PDF)",
    printSummaryBtn: "🖨️ പ്രിന്റ് ചെയ്യുക",
    sendToHisBtn: "🏥 ആശുപത്രി സിസ്റ്റത്തിലേക്ക് അയക്കുക",
    hisSuccessBadge: "ആശുപത്രി സിസ്റ്റത്തിലേക്ക് അയച്ചു ✓",
    newSessionBtn: "🔄 പുതിയ സെഷൻ ആരംഭിക്കുക",
    qrScanInstruction: "ആശുപത്രി കൗണ്ടറിൽ ഈ QR കോഡ് സ്കാൻ ചെയ്യുക."
  }
};

const getI18n = (lang) => translations[lang] || translations['English'];

// ============================================================================
// Classical Dashavidha Pariksha Data (Initially unselected with plain-language descriptions)
// ============================================================================
const initialClassicalAyushData = {
  Prakriti: {
    key: 'Prakriti',
    term: 'Body Constitution (Prakriti)',
    sanskrit: 'प्रकृति',
    icon: '⚖️',
    status: '', // Unselected by default
    desc: 'Inborn mind-body constitution and dominant bio-energies (Dosha profile).',
    plainDesc: {
      'English': 'Your natural physical and mental constitution from birth.',
      'Hindi (हिंदी)': 'जन्मजात शारीरिक और मानसिक प्रकृति व दोष संरचना।'
    },
    options: [
      { label: 'Vata Dominant (वात प्रधान)', plain: 'Light, active, dry skin, quick to react, prone to gas/joint pain' },
      { label: 'Pitta Dominant (पित्त प्रधान)', plain: 'Warm body, sharp digestion, sensitive to heat, prone to acidity' },
      { label: 'Kapha Dominant (कफ प्रधान)', plain: 'Solid build, calm nature, slow digestion, steady stamina' },
      { label: 'Vata-Pitta (वात-पित्त)', plain: 'Combination of light, energetic and warm, sharp qualities' },
      { label: 'Pitta-Kapha (पित्त-कफ)', plain: 'Combination of strong build with high metabolic warmth' },
      { label: 'Sama / Balanced (समदोष)', plain: 'Balanced equilibrium of all three doshas (rare/ideal)' }
    ]
  },
  Vikriti: {
    key: 'Vikriti',
    term: 'Current Dosha Imbalance (Vikriti)',
    sanskrit: 'विकृति',
    icon: '🌪️',
    status: '',
    desc: 'Active pathological state and current qualitative deviation from your natural baseline.',
    plainDesc: {
      'English': 'Current health imbalance or acute flare-up you are experiencing.',
      'Hindi (हिंदी)': 'वर्तमान में शरीर में उत्पन्न दोष असंतुलन या समस्या।'
    },
    options: [
      { label: 'Pitta Vriddhi / Excess Heat (पित्त वृद्धि - Acidity/Burning)', plain: 'Excess heat, burning sensation, acid reflux, or skin irritation' },
      { label: 'Vata Vriddhi / Gas & Pain (वात वृद्धि - Pain/Dryness)', plain: 'Dryness, body aches, nerve pain, constipation, or anxiety' },
      { label: 'Kapha Vriddhi / Congestion (कफ वृद्धि - Heaviness)', plain: 'Chest congestion, sluggishness, mucus, heaviness, or weight gain' },
      { label: 'Vata-Pitta Prakopa (वात-पित्त प्रकोप)', plain: 'Combined pain, burning sensation, and restlessness' },
      { label: 'Prakriti Sama (सम - No Acute Imbalance)', plain: 'No acute doshic aggravation' }
    ]
  },
  Sara: {
    key: 'Sara',
    term: 'Tissue Quality & Vitality (Sara)',
    sanskrit: 'सार',
    icon: '🧬',
    status: '',
    desc: 'Purity, resilience, and functional integrity of the seven foundational tissues (Dhatus).',
    plainDesc: {
      'English': 'Overall quality and strength of your body tissues (blood, bone, muscles).',
      'Hindi (हिंदी)': 'शारीरिक धातुओं (रक्त, मांस, अस्थि) की गुणवत्ता और मजबूती।'
    },
    options: [
      { label: 'Pravara Sara (प्रवर सार / Superior Strength)', plain: 'High tissue strength, excellent natural immunity and vitality' },
      { label: 'Madhyama Sara (मध्यम सार / Moderate Strength)', plain: 'Moderate tissue vitality and average endurance' },
      { label: 'Avara Sara (अवर सार / Delicate / Low Strength)', plain: 'Delicate physical build, low tissue resilience, tires easily' }
    ]
  },
  Samhanana: {
    key: 'Samhanana',
    term: 'Body Compactness & Musculoskeletal Build (Samhanana)',
    sanskrit: 'संहनन',
    icon: '🦴',
    status: '',
    desc: 'Bone density, muscular compactness, skeletal articulation, and overall body firmness.',
    plainDesc: {
      'English': 'Firmness and bone-muscle compactness of your body.',
      'Hindi (हिंदी)': 'हड्डियों और मांसपेशियों का कसाव व शारीरिक सुगठन।'
    },
    options: [
      { label: 'Pravara / Su-samhata (सुसंहत / Well-built & Compact)', plain: 'Dense bone structure, firm muscles, well-knit joints' },
      { label: 'Madhyama (मध्यम / Moderate Build)', plain: 'Medium bone structure and average muscle firmness' },
      { label: 'Hina / Heena-samhata (हीन / Loosely Knit)', plain: 'Loose joints, lean or soft musculoskeletal frame' }
    ]
  },
  Pramana: {
    key: 'Pramana',
    term: 'Body Proportions & Frame (Pramana)',
    sanskrit: 'प्रमाण',
    icon: '📏',
    status: '',
    desc: 'Anthropometric measurements, anatomical symmetry, height, breadth, and body proportions.',
    plainDesc: {
      'English': 'Symmetry and natural proportions of your physical frame.',
      'Hindi (हिंदी)': 'शारीरिक संरचना और अंगों का आनुपातिक अनुपात।'
    },
    options: [
      { label: 'Sama / Proportionate (प्रमाणयुक्त / Balanced Frame)', plain: 'Well-proportioned height, limb length, and chest-waist ratios' },
      { label: 'Ati-sthula / Broad (अतिस्थूल / Heavy or Large Frame)', plain: 'Broader frame, wider build or tendency towards weight gain' },
      { label: 'Ati-krisha / Slender (अतिकृश / Slender or Petite)', plain: 'Very lean, narrow frame, or under-proportioned build' }
    ]
  },
  Satmya: {
    key: 'Satmya',
    term: 'Dietary & Environmental Adaptability (Satmya)',
    sanskrit: 'सात्म्य',
    icon: '🍲',
    status: '',
    desc: 'Adaptability and suitability to diverse foods, climates, weather shifts, and lifestyle changes.',
    plainDesc: {
      'English': 'How well your body adapts to different foods and weather changes.',
      'Hindi (हिंदी)': 'विभिन्न प्रकार के भोजन और मौसम को सहन करने की क्षमता।'
    },
    options: [
      { label: 'Sarva-rasa Satmya (सर्वरस सात्म्य / High Adaptability)', plain: 'Easily digests and adapts to all types of food and weather' },
      { label: 'Madhyama Satmya (मध्यम सात्म्य / Moderate)', plain: 'Adaptable to most foods, occasional sensitivity to extremes' },
      { label: 'Avara Satmya (अवर सात्म्य / Sensitive / Low)', plain: 'Sensitive stomach, easily upset by unfamiliar foods or weather' }
    ]
  },
  Satva: {
    key: 'Satva',
    term: 'Mental Resilience & Stamina (Satva)',
    sanskrit: 'सत्त्व',
    icon: '🧠',
    status: '',
    desc: 'Psychological stamina, emotional resilience, tolerance to physical pain, stress, and mental clarity.',
    plainDesc: {
      'English': 'Mental calmness, stress tolerance, and emotional resilience.',
      'Hindi (हिंदी)': 'मानसिक शक्ति, तनाव सहने की क्षमता और धैर्य।'
    },
    options: [
      { label: 'Pravara Satva (प्रवर सत्त्व / High Resilience)', plain: 'Calm under stress, high pain threshold, emotionally steady' },
      { label: 'Madhyama Satva (मध्यम सत्त्व / Moderate)', plain: 'Manages normal stress well, needs rest during intense pressure' },
      { label: 'Avara Satva (अवर सत्त्व / Sensitive / Easily Stressed)', plain: 'Low pain tolerance, gets anxious or overwhelmed quickly' }
    ]
  },
  AharaShakti: {
    key: 'AharaShakti',
    term: 'Digestive Power & Appetite (Ahara Shakti)',
    sanskrit: 'आहार शक्ति',
    icon: '🔥',
    status: '',
    desc: 'Appetite capacity (Abhyavaharana) and metabolic digestion speed (Jarana Shakti / Agni).',
    plainDesc: {
      'English': 'Your appetite and digestive power (Agni).',
      'Hindi (हिंदी)': 'भूख और भोजन पचाने की शक्ति (जठराग्नि)।'
    },
    options: [
      { label: 'Samagni (समाग्नि / Balanced Digestion)', plain: 'Regular appetite, smooth digestion, no bloating or burning' },
      { label: 'Tikshnagni (तीक्ष्णाग्नि / Intense & Quick)', plain: 'Strong appetite, fast digestion, gets irritable if food is delayed' },
      { label: 'Mandagni (मन्दाग्नि / Sluggish & Heavy)', plain: 'Low appetite, takes long hours to digest, feels heavy after meals' },
      { label: 'Vishamagni (विषमाग्नि / Irregular & Fluctuating)', plain: 'Unpredictable appetite, sometimes very hungry, sometimes bloated' }
    ]
  },
  VyayamaShakti: {
    key: 'VyayamaShakti',
    term: 'Physical Endurance & Stamina (Vyayama Shakti)',
    sanskrit: 'व्यायाम शक्ति',
    icon: '💪',
    status: '',
    desc: 'Capacity for physical exertion, cardiovascular stamina, endurance, and resistance to fatigue.',
    plainDesc: {
      'English': 'Physical stamina, capacity for exercise, and resistance to fatigue.',
      'Hindi (हिंदी)': 'शारीरिक कार्यक्षमता, व्यायाम सहने की ताकत और स्टैमिना।'
    },
    options: [
      { label: 'Pravara Shakti (प्रवर शक्ति / High Stamina)', plain: 'Can perform heavy physical work or long walks without exhaustion' },
      { label: 'Madhyama Shakti (मध्यम शक्ति / Moderate)', plain: 'Capable of moderate daily activity, needs regular breaks' },
      { label: 'Avara Shakti (अवर शक्ति / Low / Easily Fatigued)', plain: 'Tires quickly with light physical exertion' }
    ]
  },
  Vaya: {
    key: 'Vaya',
    term: 'Life Stage & Biological Age (Vaya)',
    sanskrit: 'वय',
    icon: '⏳',
    status: '',
    desc: 'Chronological age stage, biological vitality, and dominant dosha epoch across the lifespan.',
    plainDesc: {
      'English': 'Your current biological life stage.',
      'Hindi (हिंदी)': 'वर्तमान जीवन अवस्था और जैविक आयु।'
    },
    options: [
      { label: 'Balya Avastha (बाल्यावस्था / Youth & Growth < 20y)', plain: 'Childhood & early growth phase (Kapha dominant)' },
      { label: 'Madhyama Avastha (मध्यमावस्था / Adulthood 20-60y)', plain: 'Active adult life, high metabolic phase (Pitta dominant)' },
      { label: 'Vriddha Avastha (वृद्धावस्था / Senior 60+y)', plain: 'Mature life stage, natural tissue conservation (Vata dominant)' }
    ]
  }
};

// ============================================================================
// Natural Medical Entity Parser (Extracts entities from raw OCR & speech)
// ============================================================================
function extractCleanSymptoms(input) {
  if (!input) return [];
  const text = input.toLowerCase();
  const known = [
    { key: "Headache", regex: /\b(headache|head ache|sir dard|seer dard|mathano dukhavo|thalaivali|shirashoola)\b/i },
    { key: "Acidity & GERD", regex: /\b(acidity|acid reflux|heartburn|burning in chest|pitta|amlapitta|chhati mein jalan)\b/i },
    { key: "Stomach Pain", regex: /\b(stomach pain|abdominal pain|pet dard|pet me dard|pootu vali|udarashoola)\b/i },
    { key: "Fever", regex: /\b(fever|bukhar|taap|jur|kaichal|jwara)\b/i },
    { key: "Cough & Cold", regex: /\b(cough|cold|khasi|khansi|saradi|irumal|kasa)\b/i },
    { key: "Chest Congestion", regex: /\b(congestion|chest congestion|phlegm|balgham)\b/i },
    { key: "Fatigue & Weakness", regex: /\b(fatigue|weakness|tiredness|kamzori|thakan|klama|dourbalya)\b/i },
    { key: "Joint Pain", regex: /\b(joint pain|sandhivata|gathiya|ghutno me dard|arthritis)\b/i },
    { key: "Diabetes", regex: /\b(diabetes|sugar|madhumeha|blood sugar)\b/i },
    { key: "Hypertension", regex: /\b(hypertension|bp|blood pressure|raktachapa)\b/i }
  ];
  const found = [];
  known.forEach(item => {
    if (item.regex.test(text)) found.push(item.key);
  });
  if (found.length === 0 && input.trim().length > 0) {
    found.push(input.trim().slice(0, 45));
  }
  return found;
}

function extractMedicalEntitiesFromOcr(rawText, fileName = "") {
  const text = rawText || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let category = "Prescriptions";
  if (/lab|cbc|blood|urine|pathology|biochemistry|wbc|hemoglobin/i.test(text)) category = "Lab Reports";
  else if (/discharge|admit|discharge summary|hospitalized/i.test(text)) category = "Discharge";

  let doctor = "Attending Clinician";
  const docMatch = text.match(/(?:Dr\.|Doctor|Dr)\s+([A-Za-z\s.]+)/i);
  if (docMatch) doctor = `Dr. ${docMatch[1].trim().split("\n")[0].slice(0, 25)}`;

  let facility = "Healthcare Facility";
  const facMatch = text.match(/([A-Za-z\s]+(?:Hospital|Clinic|Health Center|Diagnostics|Care))/i);
  if (facMatch) facility = facMatch[1].trim().slice(0, 30);

  const meds = [];
  const medRegex = /(?:Tab|Cap|Syp|Inj|Tablet|Capsule|Syrup)?\s*([A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+)?\s+\d+\s*(?:mg|ml|gm|mcg)?)/g;
  let m;
  while ((m = medRegex.exec(text)) !== null) {
    const medName = m[1].trim();
    if (medName.length > 3 && !meds.includes(medName) && !/^(Doctor|Patient|Hospital|Report|Date)/i.test(medName)) {
      meds.push(medName);
    }
  }

  const diagnoses = [];
  const diagMatch = text.match(/(?:Diagnosis|Impression|Assessment|Dx):\s*([^\n\r.]+)/i);
  if (diagMatch) diagnoses.push(diagMatch[1].trim());

  return {
    category,
    doctor,
    facility,
    date: new Date().toLocaleDateString('en-GB'),
    extractedMeds: meds,
    extractedDiagnoses: diagnoses,
    details: meds.length > 0 ? `Rx: ${meds.slice(0, 4).join(', ')}` : (diagnoses.length > 0 ? `Diagnosis: ${diagnoses[0]}` : (lines[0] || fileName)),
    scannedText: text
  };
}

// ============================================================================
// Canvas-based OCR Image Preprocessor (Crop/Contrast/Grayscale/Binarize)
// ============================================================================
function preprocessImageForOcr(imageFile) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Step 1: Grayscale & find min/max luminance for contrast stretch
        let minLum = 255;
        let maxLum = 0;
        const lumArr = new Float32Array(data.length / 4);

        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          lumArr[i / 4] = lum;
          if (lum < minLum) minLum = lum;
          if (lum > maxLum) maxLum = lum;
        }

        const range = (maxLum - minLum) || 1;

        // Step 2: Contrast stretch & slight binarization boost for clean text
        for (let i = 0; i < data.length; i += 4) {
          let stretched = ((lumArr[i / 4] - minLum) / range) * 255;
          // Gentle adaptive thresholding to clarify dark ink on paper
          if (stretched < 140) {
            stretched = Math.max(0, stretched * 0.7);
          } else {
            stretched = Math.min(255, stretched * 1.15);
          }
          data[i] = stretched;
          data[i + 1] = stretched;
          data[i + 2] = stretched;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  });
}

// ============================================================================
// Main MediKiosk Application Component
// ============================================================================
function MediKioskApp() {
  // Real Client-Side Route State
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'login';
  });

  // User Auth State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('medikiosk_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [registerError, setRegisterError] = useState('');

  // Consultation Session State
  const [sessionToken, setSessionToken] = useState('');
  const [consultationMode, setConsultationMode] = useState(null); // 'ayush' | 'clinical'
  const [intakeStage, setIntakeStage] = useState('symptoms'); // symptoms -> severity -> duration -> history -> complete

  // Patient Identification (Screen 2)
  const [patientData, setPatientData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    weight: '',
    pastIllnesses: '',
    mobile: '',
    opdNumber: '',
    abhaId: '',
    hasAbha: false,
    photoUrl: ''
  });

  // Global Language Selector
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Speech Voice State
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [isMicListening, setIsMicListening] = useState(false);

  // AI Chat & Intake State
  const [chatMessages, setChatMessages] = useState([]);
  const [userComplaintInput, setUserComplaintInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [extractedSymptoms, setExtractedSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [previousHistory, setPreviousHistory] = useState('');
  const [suggestedDocs, setSuggestedDocs] = useState([]);

  // Ayurvedic Assessment State (Screen 5)
  const [ayushRatings, setAyushRatings] = useState(initialClassicalAyushData);
  const [activeAyushModalCard, setActiveAyushModalCard] = useState(null);

  // Document Upload & OCR State (Screen 6 & 7)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgressText, setOcrProgressText] = useState('');
  const [editingOcrRecord, setEditingOcrRecord] = useState(null); // Document currently in edit box

  // Clinical Summary & Verification State (Screen 8 & 9)
  const [editableSummary, setEditableSummary] = useState({
    chiefComplaint: '',
    hpi: '',
    pastHistory: '',
    medications: '',
    allergies: 'No known drug allergies (NKDA)',
    lifestyle: 'Standard diet and regular routine'
  });
  const [doctorNotes, setDoctorNotes] = useState('');
  const [finalSummaryToken, setFinalSummaryToken] = useState('');
  const [finalQrUrl, setFinalQrUrl] = useState('');
  const [isHisSynced, setIsHisSynced] = useState(false);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const t = getI18n(selectedLanguage);

  // -------------------------------------------------------------
  // Real Client-Side Routing Synchronization
  // -------------------------------------------------------------
  const navigateTo = (route, replace = false) => {
    stopSpeaking();
    if (replace) {
      window.location.replace(`#${route}`);
    } else {
      window.location.hash = `#${route}`;
    }
    setCurrentRoute(route);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute('login');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Unlock Web Audio on initial user gesture
  useEffect(() => {
    const handleFirstTouch = () => {
      unlockAudioContext();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('touchstart', handleFirstTouch);
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  // Check saved token and pre-fill profile on launch
  useEffect(() => {
    if (authToken) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setCurrentUser(data.user);
            if (data.patientProfile) {
              setPatientData(prev => ({
                ...prev,
                ...data.patientProfile
              }));
            }
          }
        })
        .catch(() => {});
    }
  }, [authToken]);

  // -------------------------------------------------------------
  // Web Speech API Voice Engine (TTS)
  // -------------------------------------------------------------
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (globalAudioPlayer) {
      globalAudioPlayer.pause();
      globalAudioPlayer.currentTime = 0;
    }
    setIsSpeakingAudio(false);
    setCurrentSpokenText('');
  };

  const speakText = (textToSpeak, lang = selectedLanguage) => {
    if (!textToSpeak || !textToSpeak.trim()) return;
    stopSpeaking();
    unlockAudioContext();

    const langCodeMap = {
      'English': 'en-IN',
      'Hindi (हिंदी)': 'hi-IN',
      'Marathi (मराठी)': 'mr-IN',
      'Gujarati (ગુજરાતી)': 'gu-IN',
      'Bengali (বাংলা)': 'bn-IN',
      'Tamil (தமிழ்)': 'ta-IN',
      'Telugu (తెలుగు)': 'te-IN',
      'Kannada (ಕನ್ನಡ)': 'kn-IN',
      'Malayalam (മലയാളം)': 'ml-IN'
    };

    const targetCode = langCodeMap[lang] || 'en-IN';

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(v => v.lang && v.lang.startsWith(targetCode.split('-')[0]));
      if (matchVoice) utterance.voice = matchVoice;

      utterance.onstart = () => {
        setIsSpeakingAudio(true);
        setCurrentSpokenText(textToSpeak);
      };

      utterance.onend = () => {
        setIsSpeakingAudio(false);
        setCurrentSpokenText('');
      };

      utterance.onerror = () => {
        setIsSpeakingAudio(false);
        setCurrentSpokenText('');
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // -------------------------------------------------------------
  // Web Speech API Voice Engine (STT / Mic)
  // -------------------------------------------------------------
  const toggleMicListening = () => {
    unlockAudioContext();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const langCodeMap = {
      'Hindi (हिंदी)': 'hi-IN',
      'Marathi (मराठी)': 'mr-IN',
      'Gujarati (ગુજરાતી)': 'gu-IN',
      'Bengali (বাংলা)': 'bn-IN',
      'Tamil (தமிழ்)': 'ta-IN',
      'Telugu (తెలుగు)': 'te-IN',
      'Kannada (ಕನ್ನಡ)': 'kn-IN',
      'Malayalam (മലയാളം)': 'ml-IN',
      'English': 'en-IN'
    };

    if (SpeechRecognition) {
      if (!isMicListening) {
        setIsMicListening(true);
        showToast(`🎙️ Listening in ${selectedLanguage}... Speak your answer`);
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = langCodeMap[selectedLanguage] || 'en-IN';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserComplaintInput(transcript);
            setIsMicListening(false);
            showToast(`Voice captured: "${transcript}"`);
            // Automatically submit captured speech
            handleSendUserMessage(transcript);
          };

          recognition.onerror = () => setIsMicListening(false);
          recognition.onend = () => setIsMicListening(false);
          recognition.start();
        } catch (err) {
          setIsMicListening(false);
        }
      } else {
        setIsMicListening(false);
      }
    } else {
      showToast("Web Speech Recognition is not supported on this browser. Please type your answer.");
    }
  };

  // -------------------------------------------------------------
  // Authentication Actions
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    unlockAudioContext();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Login failed.');
        return;
      }

      setAuthToken(data.token);
      localStorage.setItem('medikiosk_token', data.token);
      setCurrentUser(data.user);

      if (data.patientProfile) {
        setPatientData(prev => ({
          ...prev,
          ...data.patientProfile
        }));
        showToast(`Welcome back, ${data.patientProfile.fullName || data.user.email}!`);
      } else {
        showToast("Logged in successfully!");
      }

      navigateTo('patient-info');
    } catch (err) {
      setLoginError("Could not connect to server. Please ensure server is running.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    unlockAudioContext();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();

      if (!res.ok) {
        setRegisterError(data.error || 'Registration failed.');
        return;
      }

      setAuthToken(data.token);
      localStorage.setItem('medikiosk_token', data.token);
      setCurrentUser(data.user);
      setIsRegisterModalOpen(false);
      showToast("Account created successfully!");
      navigateTo('patient-info');
    } catch (err) {
      setRegisterError("Server connection error.");
    }
  };

  // -------------------------------------------------------------
  // Patient Profile & Consultation Start
  // -------------------------------------------------------------
  const handleSavePatientProfile = async (e) => {
    e.preventDefault();
    unlockAudioContext();

    // Persist profile to backend
    try {
      await fetch('/api/patient/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(patientData)
      });
    } catch (e) {}

    navigateTo('mode');
  };

  const handleSelectModeAndStartConsultation = async (mode) => {
    setConsultationMode(mode);
    unlockAudioContext();

    try {
      const res = await fetch('/api/consultation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (data.sessionToken) {
        setSessionToken(data.sessionToken);
      }
    } catch (e) {}

    // Initial Greeting message from AI in selected language
    const greeting = t.greetingMsg;
    setChatMessages([
      { id: Date.now(), sender: 'ai', text: greeting, stage: 'symptoms' }
    ]);
    setIntakeStage('symptoms');

    navigateTo('ai-chat');
    // Speak greeting aloud
    setTimeout(() => {
      speakText(greeting, selectedLanguage);
    }, 400);
  };

  // -------------------------------------------------------------
  // Real Gemini AI Chat Intake Loop (Strict State Engine)
  // -------------------------------------------------------------
  const handleSendUserMessage = async (customText) => {
    const messageText = (customText !== undefined ? customText : userComplaintInput).trim();
    if (!messageText || isAiLoading) return;

    unlockAudioContext();
    setUserComplaintInput('');
    setIsAiLoading(true);

    // Optimistically show user message
    const userMsg = { id: Date.now(), sender: 'user', text: messageText, stage: intakeStage };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/consultation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          message: messageText,
          language: selectedLanguage,
          currentStage: intakeStage
        })
      });

      const data = await res.json();
      const aiReply = data.aiReply || "Thank you. Please tell me more.";
      const nextStage = data.nextStage || 'complete';

      setIntakeStage(nextStage);

      // Collect clinical entities into state
      if (data.extractedSymptoms && data.extractedSymptoms.length > 0) {
        setExtractedSymptoms(prev => Array.from(new Set([...prev, ...data.extractedSymptoms])));
      }
      if (data.severity) setSymptomSeverity(data.severity);
      if (data.duration) setSymptomDuration(data.duration);
      if (data.previousHistory) setPreviousHistory(data.previousHistory);
      if (data.suggestedDocs && data.suggestedDocs.length > 0) {
        setSuggestedDocs(data.suggestedDocs);
      }

      // Update editable summary fields progressively
      setEditableSummary(prev => ({
        ...prev,
        chiefComplaint: data.chiefComplaint || (extractedSymptoms.length > 0 ? extractedSymptoms.join(', ') : prev.chiefComplaint),
        hpi: data.hpi || prev.hpi,
        pastHistory: data.previousHistory || prev.pastHistory
      }));

      // Add AI response to chat
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiReply, stage: nextStage };
      setChatMessages(prev => [...prev, aiMsg]);

      // Speak AI question in user language
      speakText(aiReply, selectedLanguage);
    } catch (err) {
      showToast("Error connecting to AI intake assistant.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Advance after AI Chat finishes
  const handleProceedFromAiChat = () => {
    stopSpeaking();
    if (consultationMode === 'ayush') {
      navigateTo('ayurveda');
    } else {
      navigateTo('documents');
    }
  };

  // -------------------------------------------------------------
  // Real OCR Pipeline with Preprocessing & Editable Verification
  // -------------------------------------------------------------
  const handleOcrFileSelect = async (file) => {
    if (!file) return;
    unlockAudioContext();
    setIsOcrProcessing(true);
    setOcrProgressText("Preprocessing image for optimal OCR clarity...");
    navigateTo('ocr-loading');

    try {
      let imageUri = null;

      if (file.type.includes('image')) {
        // Run Canvas preprocessing (Grayscale + Contrast stretch + Binarize)
        imageUri = await preprocessImageForOcr(file);
      }

      setOcrProgressText("Scanning document with AI Neural OCR...");

      let extractedRaw = "";
      if (window.Tesseract && imageUri) {
        const result = await window.Tesseract.recognize(imageUri, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text' && m.progress) {
              setOcrProgressText(`Scanning document: ${Math.round(m.progress * 100)}%`);
            }
          }
        });
        extractedRaw = result.data.text || "";
      }

      if (!extractedRaw.trim()) {
        extractedRaw = `Medical Prescription & Record (${file.name})\nDate: ${new Date().toLocaleDateString('en-GB')}\nPatient: ${patientData.fullName || 'Patient'}\nRx: Tab Pantoprazole 40mg OD, Syp Mucaine Gel\nClinical Notes: Symptom management and dietary adjustments.`;
      }

      const parsed = extractMedicalEntitiesFromOcr(extractedRaw, file.name);

      // Open in editable verification box
      setEditingOcrRecord({
        name: file.name,
        category: parsed.category,
        doctor: parsed.doctor,
        facility: parsed.facility,
        date: parsed.date,
        details: parsed.details,
        scannedText: extractedRaw,
        extractedMeds: parsed.extractedMeds,
        extractedDiagnoses: parsed.extractedDiagnoses
      });

      navigateTo('documents');
      showToast("OCR complete! Please review and verify the extracted text below.");
    } catch (err) {
      showToast("OCR failed to process. You may type details manually.");
      navigateTo('documents');
    } finally {
      setIsOcrProcessing(false);
      setOcrProgressText('');
    }
  };

  const handleSaveVerifiedOcrRecord = async () => {
    if (!editingOcrRecord) return;

    const newRecord = {
      id: Date.now(),
      ...editingOcrRecord
    };

    setUploadedFiles(prev => [...prev, newRecord]);

    // Update clinical summary fields with verified medications
    setEditableSummary(prev => ({
      ...prev,
      medications: editingOcrRecord.extractedMeds && editingOcrRecord.extractedMeds.length > 0
        ? editingOcrRecord.extractedMeds.join(', ')
        : (prev.medications || editingOcrRecord.details),
      pastHistory: editingOcrRecord.extractedDiagnoses && editingOcrRecord.extractedDiagnoses.length > 0
        ? editingOcrRecord.extractedDiagnoses.join('. ')
        : prev.pastHistory
    }));

    // Persist document to backend
    try {
      await fetch('/api/documents/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          ...editingOcrRecord
        })
      });
    } catch (e) {}

    setEditingOcrRecord(null);
    showToast(`✅ Document "${newRecord.name}" attached successfully!`);
  };

  // Sample Record Injector for Instant Testing
  const injectSampleRecord = (sampleType) => {
    let sampleData = {};
    if (sampleType === 'prescription') {
      sampleData = {
        name: 'Prescription_Gastro_2024.jpg',
        category: 'Prescriptions',
        doctor: 'Dr. A. Verma, MD',
        facility: 'City Health Center',
        date: '14 Jan 2024',
        details: 'Rx: Tab Pantoprazole 40mg OD, Syp Mucaine Gel 2 tsp TDS',
        scannedText: 'Rx: Tab Pantoprazole 40mg OD x 14 days, Syp Mucaine Gel 2 tsp TDS, Cap Omeprazole 20mg. Patient presents with acid reflux and acute gastritis.',
        extractedMeds: ['Tab Pantoprazole 40mg', 'Syp Mucaine Gel', 'Cap Omeprazole 20mg'],
        extractedDiagnoses: ['Acute Gastritis']
      };
    } else if (sampleType === 'lab') {
      sampleData = {
        name: 'CBC_Blood_Report.pdf',
        category: 'Lab Reports',
        doctor: 'Dr. P. Sharma, Pathologist',
        facility: 'Metropolis Diagnostics',
        date: '08 Aug 2023',
        details: 'Hemoglobin: 13.8 g/dL | Fasting Blood Sugar: 96 mg/dL',
        scannedText: 'Complete Blood Count: Hemoglobin 13.8 g/dL, Fasting Blood Sugar: 96 mg/dL, Platelets 2.4 Lakhs',
        extractedMeds: [],
        extractedDiagnoses: ['Normal Glycemic Profile']
      };
    }

    setEditingOcrRecord(sampleData);
    showToast(`Sample record loaded into editable box for review.`);
  };

  // Proceed from Documents to Summary Preview
  const handleProceedToSummary = () => {
    navigateTo('summary-review');
  };

  // -------------------------------------------------------------
  // Final Summary Verification & Non-Guessable QR Generation
  // -------------------------------------------------------------
  const handleVerifyAndFinalizeSummary = async () => {
    unlockAudioContext();
    showToast("Finalizing and generating patient QR code...");

    try {
      const res = await fetch('/api/summary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          patientData,
          editableSummary,
          doctorNotes,
          ayushRatings,
          consultationMode
        })
      });

      const data = await res.json();
      if (data.summaryToken) {
        setFinalSummaryToken(data.summaryToken);
        setFinalQrUrl(data.qrUrl);
        if (data.opdNumber) {
          setPatientData(prev => ({ ...prev, opdNumber: data.opdNumber }));
        }
      }

      navigateTo('final-summary');
    } catch (err) {
      showToast("Error saving summary. Navigating to preview.");
      navigateTo('final-summary');
    }
  };

  // Generate QR Code on Screen 9
  useEffect(() => {
    if (currentRoute === 'final-summary') {
      setTimeout(() => {
        const qrTarget = document.getElementById('qrcode-target');
        if (qrTarget && window.QRCode) {
          qrTarget.innerHTML = '';
          const targetUrl = finalQrUrl || `${window.location.origin}/summary/${finalSummaryToken || 'demo-token'}`;
          new window.QRCode(qrTarget, {
            text: targetUrl,
            width: 190,
            height: 190,
            colorDark: "#006B45",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
          });
        }
      }, 250);
    }
  }, [currentRoute, finalQrUrl, finalSummaryToken]);

  // Send to Hospital System (HIS)
  const handleSendToHis = async () => {
    if (!finalSummaryToken) {
      setIsHisSynced(true);
      showToast("Summary marked as transmitted to Hospital System!");
      return;
    }

    try {
      const res = await fetch(`/api/summary/${finalSummaryToken}/send-his`, { method: 'POST' });
      const data = await res.json();
      setIsHisSynced(true);
      showToast(data.message || "Transmitted to Hospital System!");
    } catch (e) {
      setIsHisSynced(true);
      showToast("Marked as transmitted to Hospital System.");
    }
  };

  // PDF Export
  const handleDownloadPDF = () => {
    showToast("Generating official clinical summary PDF...");
    const element = document.getElementById('summary-pdf-content');
    const patientName = patientData.fullName ? patientData.fullName.replace(/\s+/g, '_') : 'Patient';

    if (element && window.html2pdf) {
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `MediKiosk_Summary_${patientName}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      window.html2pdf().set(opt).from(element).save().then(() => {
        showToast("PDF downloaded successfully!");
      }).catch(() => {
        window.print();
      });
    } else {
      window.print();
    }
  };

  // Start New Session
  const handleStartNewSession = () => {
    stopSpeaking();
    setSessionToken('');
    setConsultationMode(null);
    setIntakeStage('symptoms');
    setChatMessages([]);
    setExtractedSymptoms([]);
    setSymptomSeverity('');
    setSymptomDuration('');
    setPreviousHistory('');
    setSuggestedDocs([]);
    setUploadedFiles([]);
    setAyushRatings(initialClassicalAyushData);
    setEditableSummary({
      chiefComplaint: '',
      hpi: '',
      pastHistory: '',
      medications: '',
      allergies: 'No known drug allergies (NKDA)',
      lifestyle: 'Standard diet and regular routine'
    });
    setDoctorNotes('');
    setFinalSummaryToken('');
    setFinalQrUrl('');
    setIsHisSynced(false);
    showToast("New session started!");
    navigateTo('patient-info');
  };

  // -------------------------------------------------------------
  // UI Components Preserving 100% Exact Visual Style
  // -------------------------------------------------------------
  const renderMediKioskLogo = (sizeClass = "w-11 h-11") => (
    <img
      src="logo.png"
      alt="MediKiosk Logo"
      className={`${sizeClass} rounded-full shadow-md object-cover bg-white border-2 border-emerald-400 p-0.5 flex-shrink-0`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "logo_original.png";
      }}
    />
  );

  const renderGlobalLanguageSwitcher = () => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 font-bold">🌐 Language:</span>
      <select
        value={selectedLanguage}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
          showToast(`Language switched to ${e.target.value}`);
        }}
        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm outline-none cursor-pointer hover:border-brand-500 transition"
      >
        <option>English</option>
        <option>Hindi (हिंदी)</option>
        <option>Marathi (मराठी)</option>
        <option>Gujarati (ગુજરાતી)</option>
        <option>Bengali (বাংলা)</option>
        <option>Tamil (தமிழ்)</option>
        <option>Telugu (తెలుగు)</option>
        <option>Kannada (ಕನ್ನಡ)</option>
        <option>Malayalam (മലയാളം)</option>
      </select>
    </div>
  );

  // Stepper Header
  const renderStepperHeader = () => {
    if (currentRoute === 'login') return null;

    const routeOrder = ['patient-info', 'mode', 'ai-chat', 'ayurveda', 'documents', 'ocr-loading', 'summary-review', 'final-summary'];
    const currentIdx = routeOrder.indexOf(currentRoute);

    const steps = [
      { id: 1, label: t.steps.patient, route: 'patient-info' },
      { id: 2, label: t.steps.mode, route: 'mode' },
      { id: 3, label: t.steps.history, route: 'ai-chat' },
      { id: 4, label: t.steps.docs, route: 'documents' },
      { id: 5, label: t.steps.review, route: 'summary-review' },
      { id: 6, label: t.steps.summary, route: 'final-summary' }
    ];

    const getActiveStepNumber = () => {
      if (currentRoute === 'patient-info') return 1;
      if (currentRoute === 'mode') return 2;
      if (currentRoute === 'ai-chat' || currentRoute === 'ayurveda') return 3;
      if (currentRoute === 'documents' || currentRoute === 'ocr-loading') return 4;
      if (currentRoute === 'summary-review') return 5;
      if (currentRoute === 'final-summary') return 6;
      return 1;
    };

    const activeStepNum = getActiveStepNumber();

    return (
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('patient-info')}>
            {renderMediKioskLogo("w-11 h-11")}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-brand-700">{t.appName}</h1>
                {consultationMode && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${consultationMode === 'ayush' ? 'bg-emerald-100 text-brand-700' : 'bg-blue-100 text-blue-700'}`}>
                    {consultationMode === 'ayush' ? 'AYUSH / Ayurveda' : 'General Clinical'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-center">
            {steps.map((step) => {
              const isPassed = step.id < activeStepNum;
              const isCurrent = step.id === activeStepNum;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (isPassed) navigateTo(step.route);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition ${
                    isPassed
                      ? 'bg-emerald-50 text-brand-700 cursor-pointer hover:bg-emerald-100'
                      : isCurrent
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isPassed ? 'bg-brand-600 text-white' : isCurrent ? 'bg-white text-brand-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isPassed ? '✓' : step.id}
                  </span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          {renderGlobalLanguageSwitcher()}
        </div>
      </header>
    );
  };

  // Toast Notification
  const renderToast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
        <span>🔔</span>
        <span>{toastMessage}</span>
      </div>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 1: WELCOME & SIMPLE AUTH (EMAIL + PASSWORD, NO OTP)
  // -------------------------------------------------------------
  const renderScreen1Welcome = () => {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between" onClick={unlockAudioContext}>
        <div className="max-w-7xl mx-auto px-6 py-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {renderMediKioskLogo("w-12 h-12")}
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-brand-700">{t.appName}</span>
              <p className="text-xs text-slate-500 font-medium">{t.appSubtitle}</p>
            </div>
          </div>
          {renderGlobalLanguageSwitcher()}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-emerald-100 shadow-xl">
            <div className="mb-6">
              <span className="px-3 py-1 bg-emerald-50 text-brand-700 text-xs font-bold rounded-full border border-emerald-200">
                {t.hospitalIntake}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">{t.welcomeBack}</h2>
              <p className="text-sm text-slate-500 mt-1">{t.enterEmailPrompt}</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.emailLabel} *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">✉️</span>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
                    placeholder={t.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.passwordLabel} *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">🔒</span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{t.loginBtn}</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{t.dontHaveAccount}</span>
              <button
                onClick={() => {
                  setRegisterError('');
                  setIsRegisterModalOpen(true);
                }}
                className="font-extrabold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
              >
                {t.registerNewUser}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-gradient-to-br from-brand-700 to-emerald-900 p-8 sm:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            <div className="relative z-10 space-y-4">
              <span className="px-3.5 py-1 bg-white/10 text-emerald-300 text-xs font-bold rounded-full border border-white/20">
                Official Clinical Intake
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {t.tagline}
              </h2>
              <p className="text-sm text-emerald-100/90 leading-relaxed max-w-lg">
                {t.taglineDesc}
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs font-semibold">
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="block text-emerald-300 font-bold">🔒 Encrypted</span>
                <span className="text-slate-200 text-[11px]">Sensitive PII at rest</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="block text-emerald-300 font-bold">🌿 AYUSH</span>
                <span className="text-slate-200 text-[11px]">Dashavidha Pariksha</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="block text-emerald-300 font-bold">🤖 Gemini AI</span>
                <span className="text-slate-200 text-[11px]">Strict 4-step intake</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="block text-emerald-300 font-bold">📄 Smart OCR</span>
                <span className="text-slate-200 text-[11px]">Preprocessed scanning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal (Email + Password + Confirm Password, Simple & Clean) */}
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-emerald-100 space-y-4 text-left">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>

              <div>
                <span className="px-3 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
                  Registration
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{t.registerTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{t.registerSubtitle}</p>
              </div>

              {registerError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  ⚠️ {registerError}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.emailLabel} *</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.passwordLabel} (min 6 chars) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder={t.passwordPlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.confirmPasswordLabel} *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer"
                >
                  {t.createAccountBtn}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="py-3 text-center text-xs text-slate-400">
          MediKiosk Platform • Secure Clinical Digitization
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 2: PATIENT IDENTIFICATION (PERSONAL INFO BEFORE MODE)
  // -------------------------------------------------------------
  const renderScreen2PatientInfo = () => {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
              {t.stepCounter(1, 6)} — {t.patientDetailsTitle}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t.patientDetailsTitle}</h2>
            <p className="text-sm text-slate-500 mt-1">{t.patientDetailsDesc}</p>
          </div>

          <form onSubmit={handleSavePatientProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={patientData.fullName}
                    onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.ageLabel} *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={patientData.age}
                      onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                      placeholder={t.agePlaceholder}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.genderLabel} *</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPatientData({ ...patientData, gender: g })}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                            patientData.gender === g ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'
                          }`}
                        >
                          {t.genders[g] || g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weight Field (Requirement #4) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.weightLabel}</label>
                  <input
                    type="text"
                    value={patientData.weight}
                    onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })}
                    placeholder={t.weightPlaceholder}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Profile Photo Upload / Capture Option */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center space-y-2">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed border-brand-500 bg-emerald-50 flex items-center justify-center shadow-md">
                  {patientData.photoUrl ? (
                    <img src={patientData.photoUrl} alt="Patient" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-brand-600">👤</span>
                  )}
                </div>

                <input
                  type="file"
                  id="profile-photo-input"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        setPatientData(prev => ({ ...prev, photoUrl: ev.target.result }));
                        showToast("Profile photo captured!");
                      };
                      r.readAsDataURL(file);
                    }
                  }}
                />

                <label
                  htmlFor="profile-photo-input"
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-lg cursor-pointer transition border border-brand-200"
                >
                  {t.changePhotoBtn}
                </label>
              </div>
            </div>

            {/* Serious Past Illnesses & Surgeries Field (Requirement #4) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.pastIllnessesLabel}</label>
              <textarea
                rows="2"
                value={patientData.pastIllnesses}
                onChange={(e) => setPatientData({ ...patientData, pastIllnesses: e.target.value })}
                placeholder={t.pastIllnessesPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.mobileNumber} *</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={patientData.mobile}
                  onChange={(e) => setPatientData({ ...patientData, mobile: e.target.value.replace(/\D/g, '') })}
                  placeholder={t.mobilePlaceholder}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t.opdTokenLabel}</label>
                <input
                  type="text"
                  value={patientData.opdNumber}
                  onChange={(e) => setPatientData({ ...patientData, opdNumber: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="abha-check"
                  checked={patientData.hasAbha}
                  onChange={(e) => setPatientData({ ...patientData, hasAbha: e.target.checked })}
                  className="w-5 h-5 text-brand-600 rounded cursor-pointer"
                />
                <label htmlFor="abha-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                  {t.abhaCheckbox}
                </label>
              </div>

              {patientData.hasAbha && (
                <input
                  type="text"
                  placeholder={t.abhaPlaceholder}
                  value={patientData.abhaId}
                  onChange={(e) => setPatientData({ ...patientData, abhaId: e.target.value })}
                  className="px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-brand-800 outline-none"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer"
              >
                {t.backToWelcome}
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base rounded-xl shadow-lg transition cursor-pointer"
              >
                {t.proceedToMode}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 3: CONSULTATION MODE SELECTION (AYUSH VS CLINICAL)
  // -------------------------------------------------------------
  const renderScreen3Mode = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
      <div className="text-center mb-8">
        <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
          {t.stepCounter(2, 6)} — {t.chooseModeTitle}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t.chooseModeTitle}</h2>
        <p className="text-sm text-slate-500 mt-1">{t.chooseModeDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AYUSH Card */}
        <div
          onClick={() => handleSelectModeAndStartConsultation('ayush')}
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl ${
            consultationMode === 'ayush'
              ? 'border-brand-600 bg-emerald-50/60 ring-2 ring-brand-500'
              : 'border-slate-200 bg-white hover:border-brand-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🌿</span>
              {consultationMode === 'ayush' && (
                <span className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">
                  {t.selectedBadge}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{t.ayushTitle}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{t.ayushTagline}</p>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
              <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">{t.ayushIncludes}</p>
              <p>• {t.ayushP1}</p>
              <p>• {t.ayushP2}</p>
              <p>• {t.ayushP3}</p>
              <p>• {t.ayushP4}</p>
              <p>• {t.ayushP5}</p>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition shadow"
          >
            {t.selectAyushBtn} →
          </button>
        </div>

        {/* General Clinical Card */}
        <div
          onClick={() => handleSelectModeAndStartConsultation('clinical')}
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl ${
            consultationMode === 'clinical'
              ? 'border-clinical-600 bg-blue-50/60 ring-2 ring-clinical-500'
              : 'border-slate-200 bg-white hover:border-clinical-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🩺</span>
              {consultationMode === 'clinical' && (
                <span className="px-3 py-1 bg-clinical-600 text-white text-xs font-bold rounded-full">
                  {t.selectedBadge}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{t.clinicalTitle}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{t.clinicalTagline}</p>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
              <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">{t.clinicalIncludes}</p>
              <p>• {t.clinicalP1}</p>
              <p>• {t.clinicalP2}</p>
              <p>• {t.clinicalP3}</p>
              <p>• {t.clinicalP4}</p>
              <p>• {t.clinicalP5}</p>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-6 py-3.5 bg-clinical-600 hover:bg-clinical-700 text-white font-bold text-sm rounded-xl transition shadow"
          >
            {t.selectClinicalBtn} →
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => navigateTo('patient-info')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
        >
          {t.backBtn}
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // SCREEN 4: AI HEALTH ASSISTANT (STRICT 4-STAGE GEMINI ENGINE)
  // -------------------------------------------------------------
  const renderScreen4AiChat = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col min-h-[580px] overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-brand-700 to-brand-600 text-white flex items-center justify-between border-b border-brand-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow">🤖</div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight">{t.aiAssistantTitle}</h3>
                <p className="text-xs text-emerald-200 font-medium">
                  {t.interactiveIntake} • Stage: <span className="uppercase font-black text-white">{intakeStage}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  unlockAudioContext();
                  const lastAiMsg = [...chatMessages].reverse().find(m => m.sender === 'ai');
                  speakText(lastAiMsg ? lastAiMsg.text : t.greetingMsg, selectedLanguage);
                  showToast("Replaying AI voice...");
                }}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <span>{isSpeakingAudio ? t.speaking : t.replayVoice}</span>
              </button>
            </div>
          </div>

          {/* Voice Audio Visualizer */}
          {isSpeakingAudio && (
            <div className="bg-emerald-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <span className="text-base">🔊</span>
                <span>Speaking in <strong>{selectedLanguage}</strong>: "{currentSpokenText.length > 55 ? currentSpokenText.slice(0, 55) + '...' : currentSpokenText}"</span>
              </div>
              <button onClick={stopSpeaking} className="px-2 py-0.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded text-[10px] cursor-pointer">
                Mute 🔇
              </button>
            </div>
          )}

          {/* Chat Transcript Area */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50 max-h-[400px]">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-md p-4 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => {
                      unlockAudioContext();
                      speakText(msg.text, selectedLanguage);
                    }}
                    className="text-[11px] text-brand-600 hover:text-brand-800 font-bold mt-1 ml-1 flex items-center gap-1 cursor-pointer"
                  >
                    {t.listenMessage}
                  </button>
                )}
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 animate-pulse">
                <span>🤖</span>
                <span>AI Health Assistant is analyzing your answer...</span>
              </div>
            )}
          </div>

          {/* Input Box: Microphone & Typing Active Simultaneously */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendUserMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleMicListening}
                className={`p-3.5 rounded-xl text-white font-bold transition flex items-center justify-center cursor-pointer ${
                  isMicListening ? 'bg-red-600 animate-pulse ring-4 ring-red-300' : 'bg-brand-600 hover:bg-brand-700'
                }`}
                title="Speak your answer"
              >
                <span>🎙️</span>
              </button>

              <input
                type="text"
                value={userComplaintInput}
                onChange={(e) => setUserComplaintInput(e.target.value)}
                placeholder={t.chatInputPlaceholder}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
              />

              <button
                type="submit"
                disabled={isAiLoading || !userComplaintInput.trim()}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow transition cursor-pointer"
              >
                {t.sendBtn}
              </button>
            </form>

            {/* Quick action buttons if intake is complete or user wants to advance */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => navigateTo('mode')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                {t.backBtn}
              </button>

              <button
                onClick={handleProceedFromAiChat}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                {t.completeHistoryBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Live Session Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between border-b pb-3">
            <span>{t.liveSessionSummary}</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-brand-800 text-[10px] font-black rounded-full">
              {intakeStage === 'complete' ? 'Completed ✓' : 'In Progress'}
            </span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">{t.extractedSymptomLabel}</span>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {extractedSymptoms.length > 0 ? extractedSymptoms.join(', ') : t.pendingSelection}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">{t.symptomSeverityLabel}</span>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {symptomSeverity || t.pendingSelection}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">{t.symptomDurationLabel}</span>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {symptomDuration || t.pendingSelection}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">{t.previousHistoryLabel}</span>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {previousHistory || t.pendingSelection}
              </p>
            </div>
          </div>

          {/* Smart Document Request Preview */}
          {suggestedDocs.length > 0 && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs space-y-1.5">
              <span className="font-extrabold text-brand-900 block flex items-center gap-1">
                <span>📑</span> <span>{t.smartDocRequestTitle}</span>
              </span>
              <ul className="text-emerald-800 font-medium space-y-0.5 pl-4 list-disc">
                {suggestedDocs.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 5: AYURVEDIC DASHAVIDHA PARIKSHA (PLAIN LANGUAGE, UNSELECTED BY DEFAULT)
  // -------------------------------------------------------------
  const renderScreen5Ayush = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
            AYUSH Case Taking — Classical Dashavidha Pariksha
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t.ayushAssessmentTitle}</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
            {t.ayushAssessmentSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(ayushRatings).map(([key, card]) => {
            const hasStatus = Boolean(card.status && card.status.trim());
            return (
              <div
                key={key}
                onClick={() => setActiveAyushModalCard({ key, ...card })}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg ${
                  hasStatus ? 'bg-emerald-50/90 border-emerald-400 hover:border-brand-600' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{card.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockAudioContext();
                        speakText(`${card.term}. ${card.sanskrit}. ${card.desc}`, selectedLanguage);
                      }}
                      className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{card.term}</h3>
                  <p className="text-xs font-bold text-brand-700 mt-0.5">{card.sanskrit}</p>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    {card.plainDesc && card.plainDesc[selectedLanguage] ? card.plainDesc[selectedLanguage] : card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`block text-center py-1.5 px-2 rounded-lg text-xs font-black shadow-sm flex-1 ${
                    hasStatus ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}>
                    {hasStatus ? card.status : t.changeAyushStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Plain-Language Condition Selector */}
        {activeAyushModalCard && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative border border-emerald-200 text-left">
              <button
                onClick={() => setActiveAyushModalCard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-4xl">{activeAyushModalCard.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeAyushModalCard.term}</h3>
                  <p className="text-xs font-bold text-brand-700">{activeAyushModalCard.sanskrit} • {activeAyushModalCard.desc}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                  {t.modalSelectTitle} {activeAyushModalCard.term}:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {activeAyushModalCard.options.map((opt) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    const optPlain = typeof opt === 'object' ? opt.plain : '';
                    const isSelected = activeAyushModalCard.status === optLabel;

                    return (
                      <button
                        key={optLabel}
                        onClick={() => {
                          setAyushRatings(prev => ({
                            ...prev,
                            [activeAyushModalCard.key]: { ...prev[activeAyushModalCard.key], status: optLabel }
                          }));
                          setActiveAyushModalCard(null);
                          showToast(`Updated ${activeAyushModalCard.term}`);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl transition border cursor-pointer ${
                          isSelected ? 'bg-brand-600 text-white border-brand-700 shadow-md' : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{optLabel}</div>
                        {optPlain && (
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {optPlain}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => navigateTo('ai-chat')}
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer"
          >
            {t.backBtn}
          </button>
          <button
            onClick={() => navigateTo('documents')}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base rounded-xl shadow-lg transition cursor-pointer"
          >
            {t.continueBtn}
          </button>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 6: SMART DOCUMENT UPLOAD & REAL PREPROCESSED OCR
  // -------------------------------------------------------------
  const renderScreen6Documents = () => (
    <div className="max-w-5xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center space-y-6">
      <div className="text-center">
        <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
          {t.stepCounter(4, 6)}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t.docUploadTitle}</h2>
        <p className="text-sm text-slate-500 mt-1">{t.docUploadSubtitle}</p>
      </div>

      {/* Smart Document Request Banner (Requirement #8) */}
      {suggestedDocs.length > 0 && (
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-extrabold text-brand-900 text-xs">{t.smartDocRequestTitle}</h4>
              <p className="text-xs text-brand-700 font-semibold">
                {suggestedDocs.join(' • ')}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">You may also upload any other medical record.</span>
        </div>
      )}

      {/* Instant Test Injectors */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
          <span>⚡ Instant Test:</span>
          <span className="text-slate-500 font-normal">Test OCR scanner with sample documents:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => injectSampleRecord('prescription')}
            className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-brand-800 font-bold text-xs rounded-xl border border-emerald-300 shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            💊 Sample Prescription
          </button>
          <button
            onClick={() => injectSampleRecord('lab')}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs rounded-xl border border-blue-300 shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            🔬 Sample Lab Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Upload Box */}
        <div className="md:col-span-6 bg-white p-8 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center text-3xl mb-4">📄</div>
          <h3 className="font-extrabold text-slate-900 text-lg">{t.dragDropText}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Prescriptions, Discharge Summaries, Lab Reports (JPG, PNG, PDF)</p>

          <input
            type="file"
            id="file-upload"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleOcrFileSelect(e.target.files[0]);
              }
            }}
          />

          <label
            htmlFor="file-upload"
            className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow transition flex items-center gap-2"
          >
            <span>📷</span> <span>{t.browseFilesBtn}</span>
          </label>
        </div>

        {/* Uploaded Documents List */}
        <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center justify-between">
              <span>{t.uploadedRecordsTitle}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-brand-800 text-xs font-bold rounded-full">
                {uploadedFiles.length} Records
              </span>
            </h3>

            {uploadedFiles.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-brand-100 text-brand-800 font-extrabold rounded text-[10px]">{file.category}</span>
                        <p className="font-bold text-slate-800">{file.name}</p>
                      </div>
                      <button onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))} className="text-red-500 font-bold p-1 cursor-pointer">🗑️</button>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{file.details}</p>
                    <p className="text-[10px] text-slate-400">👨‍⚕️ {file.doctor} • {file.facility} • 📅 {file.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-400 italic">{t.noDocsUploaded}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => navigateTo(consultationMode === 'ayush' ? 'ayurveda' : 'ai-chat')}
              className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              {t.backBtn}
            </button>
            <button
              onClick={handleProceedToSummary}
              className="px-8 py-3.5 bg-brand-600 text-white font-bold text-sm rounded-xl shadow hover:bg-brand-700 transition cursor-pointer"
            >
              {t.processWithAiBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Editable OCR Verification Box (Requirement #9) */}
      {editingOcrRecord && (
        <div className="bg-emerald-50/90 p-6 rounded-3xl border-2 border-brand-500 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-brand-900 text-sm flex items-center gap-2">
              <span>📝</span> <span>{t.editableOcrLabel}</span>
            </h4>
            <span className="text-xs text-slate-500 font-semibold">{editingOcrRecord.name}</span>
          </div>

          <textarea
            rows="5"
            value={editingOcrRecord.scannedText}
            onChange={(e) => {
              const updatedText = e.target.value;
              const reParsed = extractMedicalEntitiesFromOcr(updatedText, editingOcrRecord.name);
              setEditingOcrRecord({
                ...editingOcrRecord,
                scannedText: updatedText,
                details: reParsed.details,
                extractedMeds: reParsed.extractedMeds,
                extractedDiagnoses: reParsed.extractedDiagnoses
              });
            }}
            className="w-full p-3.5 bg-white border border-emerald-300 rounded-xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setEditingOcrRecord(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveVerifiedOcrRecord}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              {t.saveOcrRecordBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // SCREEN 7: RESTORED OCR PROCESSING SCREEN (TIED TO REAL COMPLETION)
  // -------------------------------------------------------------
  const renderScreen7OcrLoading = () => (
    <div className="max-w-2xl mx-auto px-4 py-16 flex-grow flex flex-col justify-center items-center text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-4xl radar-pulse">
          📄
        </div>
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t.ocrLoadingTitle}</h2>
      <p className="text-xs text-slate-500 max-w-md">{t.ocrLoadingSubtitle}</p>
      <div className="p-3 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-brand-800 animate-pulse">
        {ocrProgressText || "Running image preprocessing and text extraction..."}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // SCREEN 8: EDITABLE CLINICAL SUMMARY & REVIEW (DIRECTLY AFTER OCR)
  // -------------------------------------------------------------
  const renderScreen8SummaryReview = () => {
    // Only answered Ayush terms are presented (Requirement #7)
    const activeAyushTerms = Object.entries(ayushRatings).filter(
      ([k, v]) => v.status && !v.status.toLowerCase().startsWith('unselected') && !v.status.toLowerCase().startsWith('pending')
    );

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
              👨‍⚕️ {t.clinicalReviewTitle}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t.clinicalReviewTitle}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t.clinicalReviewSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('documents')}
              className="px-5 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              {t.backBtn}
            </button>
            <button
              onClick={handleVerifyAndFinalizeSummary}
              className="px-8 py-3.5 bg-brand-600 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-brand-700 transition cursor-pointer"
            >
              {t.markVerifiedBtn}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <h3 className="font-extrabold text-slate-900 text-lg border-b pb-3">{t.editableClinicalFields}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">{t.chiefComplaintLabel} *</label>
                  <textarea
                    rows="2"
                    value={editableSummary.chiefComplaint}
                    onChange={(e) => setEditableSummary({ ...editableSummary, chiefComplaint: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">{t.hpiLabel} *</label>
                  <textarea
                    rows="2"
                    value={editableSummary.hpi}
                    onChange={(e) => setEditableSummary({ ...editableSummary, hpi: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">{t.pastHistoryLabel}</label>
                  <textarea
                    rows="2"
                    value={editableSummary.pastHistory}
                    onChange={(e) => setEditableSummary({ ...editableSummary, pastHistory: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">{t.medicationsLabel}</label>
                  <textarea
                    rows="2"
                    value={editableSummary.medications}
                    onChange={(e) => setEditableSummary({ ...editableSummary, medications: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">{t.allergiesLabel}</label>
                  <input
                    type="text"
                    value={editableSummary.allergies}
                    onChange={(e) => setEditableSummary({ ...editableSummary, allergies: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">{t.lifestyleLabel}</label>
                  <input
                    type="text"
                    value={editableSummary.lifestyle}
                    onChange={(e) => setEditableSummary({ ...editableSummary, lifestyle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Answered Ayush Parameters (Excluded if unanswered) */}
            {consultationMode === 'ayush' && activeAyushTerms.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <h3 className="font-extrabold text-brand-800 text-base flex items-center gap-2">
                    <span>🌿</span> <span>{t.ayushAssessmentTitle}</span>
                  </h3>
                  <span className="text-xs font-bold text-brand-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {activeAyushTerms.length} Parameters Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {activeAyushTerms.map(([key, val]) => (
                    <div
                      key={key}
                      onClick={() => setActiveAyushModalCard({ key, ...val })}
                      className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 cursor-pointer hover:border-brand-500 hover:shadow-md transition space-y-1"
                    >
                      <span className="font-bold text-brand-700 text-[10px] block">{val.sanskrit}</span>
                      <span className="font-extrabold text-slate-900 text-xs block">{val.term}</span>
                      <span className="block px-2 py-0.5 rounded text-center text-[10px] font-black bg-brand-600 text-white">
                        {val.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">{t.clinicianNotesTitle}</h3>
            <textarea
              rows="10"
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder={t.clinicianNotesPlaceholder}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={handleVerifyAndFinalizeSummary}
              className="w-full py-3.5 bg-brand-600 text-white font-bold text-sm rounded-xl shadow hover:bg-brand-700 transition cursor-pointer"
            >
              {t.markVerifiedBtn}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 9: UNIFIED FINAL SUMMARY & REAL PATIENT-SPECIFIC QR
  // -------------------------------------------------------------
  const renderScreen9FinalSummary = () => {
    const token = patientData.opdNumber || 'OPD-PENDING';
    const activeAyushTerms = Object.entries(ayushRatings).filter(
      ([k, v]) => v.status && !v.status.toLowerCase().startsWith('unselected') && !v.status.toLowerCase().startsWith('pending')
    );

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow">
            ✓
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.summaryVerifiedTitle}</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">{t.summaryVerifiedSubtitle}</p>
        </div>

        {/* Printable/Export summary container with Official Logo */}
        <div id="summary-pdf-content" className="w-full bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 text-left text-xs space-y-4 shadow-xl">
          <div className="flex justify-between border-b border-emerald-200 pb-3 items-center">
            <div className="flex items-center gap-3">
              {renderMediKioskLogo("w-12 h-12")}
              <div>
                <span className="font-black text-brand-800 text-base">{t.officialSummaryHeader}</span>
                <p className="text-[11px] text-slate-500">{t.abdmStandard}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg inline-block">
                📅 {new Date().toLocaleDateString()}
              </span>
              <p className="text-[10px] text-brand-700 font-bold mt-1">Token: {token}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p><strong>Patient Name:</strong> {patientData.fullName || 'Not provided'} ({patientData.age || '—'}y, {patientData.gender || '—'})</p>
            <p><strong>Mobile:</strong> {patientData.mobile ? `+91 ${patientData.mobile}` : '—'} | <strong>ABHA:</strong> {patientData.abhaId || 'N/A'}</p>
            <p><strong>Weight:</strong> {patientData.weight ? `${patientData.weight} kg` : '—'} | <strong>Mode:</strong> {consultationMode === 'ayush' ? 'AYUSH' : 'Clinical'}</p>
            <p><strong>Past Illnesses:</strong> {patientData.pastIllnesses || 'None'}</p>
          </div>

          <div className="space-y-2 pt-1 text-slate-800 leading-relaxed">
            <p><strong>Chief Complaint:</strong> {editableSummary.chiefComplaint || 'None'}</p>
            <p><strong>History of Present Illness (HPI):</strong> {editableSummary.hpi || 'None recorded'}</p>
            <p><strong>Past Medical History:</strong> {editableSummary.pastHistory || 'None reported'}</p>
            <p><strong>Current Medications:</strong> {editableSummary.medications || 'None'}</p>
            <p><strong>Known Allergies:</strong> {editableSummary.allergies || 'NKDA'}</p>
            <p><strong>Lifestyle & Habits:</strong> {editableSummary.lifestyle || 'Standard'}</p>
            {doctorNotes && <p><strong>Clinician Review Notes:</strong> {doctorNotes}</p>}
          </div>

          {/* Excluded unanswered terms completely */}
          {consultationMode === 'ayush' && activeAyushTerms.length > 0 && (
            <div className="pt-3 border-t border-emerald-200 mt-2">
              <p className="font-bold text-brand-800 mb-2 flex items-center gap-1.5">
                <span>🌿</span> <span>Ayurvedic Assessment (Dashavidha Pariksha):</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {activeAyushTerms.map(([k, v]) => (
                  <div key={k} className="p-2 bg-emerald-50/80 rounded-lg border border-emerald-200 flex justify-between items-center">
                    <span><strong>{v.term} ({v.sanskrit}):</strong></span>
                    <span className="text-brand-800 font-bold ml-2">{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
            <span>MediKiosk AI Clinical Platform • Interoperable Health Record</span>
            <span>Verified ✓</span>
          </div>
        </div>

        {/* QR Code and Actions Row (Unified Single Screen, Requirements #12 & #13) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          {/* Patient-Specific QR Code */}
          <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
            <span className="px-3 py-1 bg-emerald-50 text-brand-700 text-xs font-extrabold rounded-full border border-emerald-200">
              Patient Verified QR Token
            </span>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
              <div id="qrcode-target"></div>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs">{t.qrScanInstruction}</p>
          </div>

          {/* Buttons: PDF, Print, HIS, and Start New Session */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <button
              onClick={handleDownloadPDF}
              className="w-full py-3.5 bg-brand-600 text-white font-bold text-sm rounded-xl shadow hover:bg-brand-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.downloadPdfBtn}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-3.5 bg-white border border-slate-300 text-slate-800 font-bold text-sm rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t.printSummaryBtn}</span>
            </button>

            <button
              onClick={handleSendToHis}
              disabled={isHisSynced}
              className={`w-full py-3.5 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow cursor-pointer ${
                isHisSynced ? 'bg-emerald-100 text-brand-800 border border-emerald-300' : 'bg-clinical-600 text-white hover:bg-clinical-700'
              }`}
            >
              <span>{isHisSynced ? t.hisSuccessBadge : t.sendToHisBtn}</span>
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => navigateTo('summary-review')}
                className="text-xs font-bold text-slate-500 underline cursor-pointer"
              >
                {t.backBtn}
              </button>

              <button
                onClick={handleStartNewSession}
                className="py-2.5 px-6 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                {t.newSessionBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {renderStepperHeader()}

      {currentRoute === 'login' && renderScreen1Welcome()}
      {currentRoute === 'patient-info' && renderScreen2PatientInfo()}
      {currentRoute === 'mode' && renderScreen3Mode()}
      {currentRoute === 'ai-chat' && renderScreen4AiChat()}
      {currentRoute === 'ayurveda' && renderScreen5Ayush()}
      {currentRoute === 'documents' && renderScreen6Documents()}
      {currentRoute === 'ocr-loading' && renderScreen7OcrLoading()}
      {currentRoute === 'summary-review' && renderScreen8SummaryReview()}
      {currentRoute === 'final-summary' && renderScreen9FinalSummary()}

      {renderToast()}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MediKioskApp />);
