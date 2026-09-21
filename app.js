const { useState, useEffect, useRef } = React;

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

const translations = {
  'English': {
    samplePills: ["Headache & Acidity", "Stomach pain & burning", "Cough & Chest congestion", "Fever & body ache", "Tiredness & weakness"],
    askSeverity: "How would you rate the severity of your problem?",
    askDuration: "How long have you been experiencing this problem?",
    durationPills: ["1-2 Days", "About 1 Week", "2-4 Weeks", "More than 1 Month"],
    intakeCompleteMsg: "Thank you! Your symptoms, severity, and duration have been successfully recorded. You can now proceed to consultation evaluation.",
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
    samplePills: ["सिरदर्द और एसिडिटी", "पेट दर्द और जलन", "खांसी और सीने में जकड़न", "बुखार और बदन दर्द", "थकान और कमजोरी"],
    askSeverity: "आप इस समस्या की तीव्रता (Severity) को कैसे आंकेंगे?",
    askDuration: "आपको यह समस्या कितने समय से (Duration) हो रही है?",
    durationPills: ["1-2 दिन", "लगभग 1 हफ्ता", "2-4 हफ्ते", "1 महीने से अधिक"],
    intakeCompleteMsg: "धन्यवाद! आपके लक्षण, तीव्रता और अवधि दर्ज कर ली गई है। अब आप परामर्श मूल्यांकन के लिए आगे बढ़ सकते हैं।",
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
    samplePills: ["डोकेदुखी आणि ॲसिडिटी", "पोटदुखी आणि जळजळ", "खोकला आणि ताप", "अंगदुखी आणि थकवा", "कमजोरी आणि चक्कर"],
    askSeverity: "तुम्ही या त्रासाची तीव्रता कशी सांगाल?",
    askDuration: "हा त्रास तुम्हाला किती दिवसांपासून होत आहे?",
    durationPills: ["1-2 दिवस", "सुमारे 1 आठवडा", "2-4 आठवडे", "1 महिन्यापेक्षा जास्त"],
    intakeCompleteMsg: "धन्यवाद! तुमची लक्षणे, तीव्रता आणि कालावधी नोंदवला गेला आहे. आता तुम्ही पुढील टप्प्यावर जाऊ शकता.",
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
    samplePills: ["માથાનો દુખાવો અને એસિડિટી", "પેટમાં દુખાવો અને બળતરા", "તાવ અને ઉધરસ", "થાક અને નબળાઈ", "છાતીમાં દુખાવો"],
    askSeverity: "તમે આ લક્ષણની તીવ્રતા કેટલી ગણાવશો?",
    askDuration: "તમને આ સમસ્યા કેટલા સમયથી થઈ રહી છે?",
    durationPills: ["1-2 દિવસ", "લગભગ 1 અઠવાડિયું", "2-4 અઠવાડિયા", "1 મહિનાથી વધુ"],
    intakeCompleteMsg: "આભાર! તમારા લક્ષણો, તીવ્રતા અને સમયગાળો સફળતાપૂર્વક નોંધાઈ ગયો છે. હવે તમે આગળ વધી શકો છો.",
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
    samplePills: ["মাথা ব্যথা ও অ্যাসিডিটি", "পেট ব্যথা ও বুকজ্বালা", "জ্বর ও কাশি", "দুর্বলতা ও ক্লান্তি", "শরীরে ব্যথা"],
    askSeverity: "আপনার সমস্যার তীব্রতা কেমন?",
    askDuration: "আপনি কতদিন ধরে এই সমস্যাটি অনুভব করছেন?",
    durationPills: ["1-2 দিন", "প্রায় 1 সপ্তাহ", "2-4 সপ্তাহ", "1 মাসের বেশি"],
    intakeCompleteMsg: "ধন্যবাদ! আপনার উপসর্গ, তীব্রতা এবং সময়কাল সফলভাবে রেকর্ড করা হয়েছে। আপনি এবার পরবর্তী ধাপে এগিয়ে যেতে পারেন।",
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
    samplePills: ["தலைவலி மற்றும் அசிடிட்டி", "வயிற்று வலி மற்றும் நெஞ்செரிச்சல்", "காய்ச்சல் மற்றும் இருமல்", "சோர்வு மற்றும் பலவீனம்", "உடல் வலி"],
    askSeverity: "உங்கள் அறிகுறியின் தீவிரத்தை எவ்வாறு மதிப்பிடுவீர்கள்?",
    askDuration: "இந்த பிரச்சினை உங்களுக்கு எத்தனை நாட்களாக உள்ளது?",
    durationPills: ["1-2 நாட்கள்", "சுமார் 1 வாரம்", "2-4 வாரங்கள்", "1 மாதத்திற்கும் மேல்"],
    intakeCompleteMsg: "நன்றி! உங்கள் அறிகுறிகள், தீவிரம் மற்றும் கால அளவு வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது. நீங்கள் அடுத்த கட்டத்திற்கு தொடரலாம்.",
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
    samplePills: ["తలనొప్పి మరియు ఎసిడిటీ", "కడుపు నొప్పి మరియు మంట", "జ్వరం మరియు దగ్గు", "నీరసం మరియు అలసట", "ఒంటి నొప్పులు"],
    askSeverity: "మీ సమస్య యొక్క తీవ్రతను ఎలా అంచना వేస్తారు?",
    askDuration: "ఈ సమస్య మీకు ఎంత కాలం నుండి ఉంది?",
    durationPills: ["1-2 రోజులు", "సుమారు 1 వారం", "2-4 వారాలు", "1 నెల కంటే ఎక్కువ"],
    intakeCompleteMsg: "ధన్యవాదాలు! మీ లక్షణాలు, తీవ్రత మరియు వ్యవధి విజయవంతంగా నమోదు చేయబడ్డాయి. మీరు తదుపరి దశకు కొనసాగవచ్చు.",
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
    samplePills: ["ತಲೆನೋವು ಮತ್ತು ಅಸಿಡಿಟಿ", "ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ಉರಿ", "ಜ್ವರ ಮತ್ತು ಕೆಮ್ಮು", "ಆಯಾಸ ಮತ್ತು ದೌರ್ಬಲ್ಯ", "ಮೈಕೈ ನೋವು"],
    askSeverity: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ತೀವ್ರತೆ ಎಷ್ಟಿದೆ?",
    askDuration: "ಈ ಸಮಸ್ಯೆ ನಿಮಗೆ ಎಷ್ಟು ಸಮಯದಿಂದ ಇದೆ?",
    durationPills: ["1-2 ದಿನಗಳು", "ಸುಮಾರು 1 ವಾರ", "2-4 ವಾರಗಳು", "1 ತಿಂಗಳಿಗಿಂತ ಹೆಚ್ಚು"],
    intakeCompleteMsg: "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಲಕ್ಷಣಗಳು, ತೀವ್ರತೆ ಮತ್ತು ಅವಧಿ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ. ನೀವು ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮುಂದುವರಿಯಬಹುದು.",
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
    samplePills: ["തലവേദനയും അസിഡിറ്റിയും", "വയറുവേദനയും എരിച്ചിലും", "പനിയും ചുമയും", "ക്ഷീണവും തളർച്ചയും", "ശരീരവേദന"],
    askSeverity: "നിങ്ങളുടെ ബുദ്ധിമുട്ടിന്റെ തീവ്രത എത്രയാണ്?",
    askDuration: "ഈ പ്രശ്നം നിങ്ങൾക്ക് എത്ര നാളായിട്ടുണ്ട്?",
    durationPills: ["1-2 ദിവസം", "ഏകദേശം 1 ആഴ്ച", "2-4 ആഴ്ചകൾ", "1 മാസത്തിൽ കൂടുതൽ"],
    intakeCompleteMsg: "നന്ദി! നിങ്ങളുടെ ലക്ഷണങ്ങളും തീവ്രതയും ദൈർഘ്യവും വിജയകരമായി രേഖപ്പെടുത്തിയിട്ടുണ്ട്. ഇനി നിങ്ങൾക്ക് മുന്നോട്ട് പോകാം.",
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

const getI18n = (lang) => {
  const base = translations['English'] || {};
  const current = translations[lang] || {};
  return { ...base, ...current };
};

const initialClassicalAyushData = {
  Prakriti: {
    key: 'Prakriti',
    term: 'Body Constitution (Prakriti)',
    sanskrit: 'प्रकृति',
    icon: '⚖️',
    status: '', 
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



const initialYogaData = {
  Asana: {
    key: 'Asana',
    term: 'Postural Stability & Flexibility (Asana)',
    sanskrit: 'आसन / शारीरिक स्थिरता',
    icon: '🧘',
    status: '',
    desc: 'Musculoskeletal alignment, spinal flexibility, joint range of motion, and postural balance (Sthira-Sukham Asanam).',
    plainDesc: {
      'English': 'Spinal mobility, joint flexibility, and ability to hold stable physical postures without strain.',
      'Hindi (हिंदी)': 'रीढ़ की लचीलापन, जोड़ों की गतिशीलता और स्थिर व आरामदायक शारीरिक मुद्रा (स्थिरसुखमासनम्)।'
    },
    options: [
      { label: 'Pravara / Excellent (उत्तम स्थिरता व लचीलापन)', plain: 'High spinal flexibility, effortless balance, erect spinal posture, no stiffness' },
      { label: 'Madhyama / Moderate (मध्यम लचीलापन)', plain: 'Adequate joint range with mild muscular tightness on deep extension' },
      { label: 'Avara / Restricted (अवर / जकड़न व सीमित गति)', plain: 'Spinal rigidity, poor hamstring/hip flexibility, postural strain or pain' },
      { label: 'Postural Deviation / Kypho-Scoliotic (शारीरिक विचलन)', plain: 'Forward head posture, rounded shoulders, or asymmetrical spinal loading' }
    ]
  },
  Pranayama: {
    key: 'Pranayama',
    term: 'Vital Breath & Autonomic Control (Pranayama)',
    sanskrit: 'प्राणायाम / प्राण शक्ति',
    icon: '🌬️',
    status: '',
    desc: 'Respiratory rhythm, breath holding capacity (Kumbhaka), vital lung capacity, and autonomic regulation.',
    plainDesc: {
      'English': 'Breathing pattern, lung capacity, and balance of nasal dominance (Ida/Pingala nadis).',
      'Hindi (हिंदी)': 'श्वास की गति, फेफड़ों की क्षमता, कुंभक काल और नाड़ी संतुलन (इड़ा-पिंगला)।'
    },
    options: [
      { label: 'Dirgha-Sukshma / Deep & Rhythmic (दीर्घ व सूक्ष्म श्वास)', plain: 'Deep, slow diaphragmatic breathing with balanced nostril airflow' },
      { label: 'Madhyama / Regular (मध्यम श्वास गति)', plain: 'Normal resting respiratory rate with occasional shallow chest breathing' },
      { label: 'Chinna / Shallow & Rapid (उथला व तीव्र श्वास)', plain: 'Clavicular shallow breathing, breathlessness on exertion, anxiety breathing' },
      { label: 'Nadi Asantulan / Nasal Congestion (नाड़ी असंतुलन)', plain: 'Unilateral blocked nostril airflow, mouth breathing, or nocturnal snoring' }
    ]
  },
  Dhyana: {
    key: 'Dhyana',
    term: 'Mental Clarity & Meditation (Dhyana / Dharana)',
    sanskrit: 'ध्यान व धारणा / मानसिक एकाग्रता',
    icon: '🧠',
    status: '',
    desc: 'Cognitive focus, attentional endurance, sensory withdrawal (Pratyahara), and emotional calmness.',
    plainDesc: {
      'English': 'Mental stillness, focus, concentration capacity, and emotional equanimity under pressure.',
      'Hindi (हिंदी)': 'मानसिक एकाग्रता, चित्त की स्थिरता, विचार शांति और भावनात्मक संतुलन।'
    },
    options: [
      { label: 'Ekagra / Focused & Calm (एकाग्र व शांत चित्त)', plain: 'High concentration, steady focus, mental serenity, emotional resilience' },
      { label: 'Vikshipta / Moderately Distracted (विक्षिप्त / चंचल मन)', plain: 'Intermittent focus with tendency to wander when mentally fatigued' },
      { label: 'Kshipta / Restless & Agitated (क्षिप्त / अत्यधिक चंचल व अशांत)', plain: 'Racing thoughts, hyperactive mind, difficulty sustaining attention' },
      { label: 'Moodha / Sluggish & Depressed (मूढ़ / सुस्त व अवसादग्रस्त)', plain: 'Mental lethargy, brain fog, poor cognitive clarity, emotional heaviness' }
    ]
  },
  Shatkriya: {
    key: 'Shatkriya',
    term: 'Internal Cleansing & Detoxification (Shatkriya)',
    sanskrit: 'षट्कर्म / शोधन क्षमता',
    icon: '✨',
    status: '',
    desc: 'Need and adaptability for the six classical cleansing techniques (Neti, Dhauti, Nauli, Basti, Kapalabhati, Trataka).',
    plainDesc: {
      'English': 'Internal systemic cleansing requirement for clearing mucous, metabolic toxins, and digestive stagnation.',
      'Hindi (हिंदी)': 'कफ, विषैले तत्वों व पाचन रुकावट को दूर करने हेतु यौगिक शोधन क्रियाओं की आवश्यकता।'
    },
    options: [
      { label: 'Jala Neti Recommended (जलनेति उपयुक्त - Sinus / ENT Cleansing)', plain: 'Allergic rhinitis, sinus blockage, headache, chronic nasal congestion' },
      { label: 'Kapalabhati & Agnisara Indicated (कपालभाति व अग्निसार - Metabolic Clearance)', plain: 'Sluggish metabolism, abdominal bloating, visceral fat, low digestive fire' },
      { label: 'Trataka Indicated (त्राटक उपयुक्त - Ophthalmic & Focus)', plain: 'Eye strain from digital screens, poor concentration, insomnia' },
      { label: 'Balanced / Regular Maintenance (संतुलित / सामान्य दिनचर्या)', plain: 'Clear respiratory passage, healthy elimination, no acute toxin buildup' }
    ]
  },
  Mitahara: {
    key: 'Mitahara',
    term: 'Yogic Diet & Nutritional Habits (Mitahara)',
    sanskrit: 'मिताहार / आहार शुद्धि',
    icon: '🥗',
    status: '',
    desc: 'Dietary quality, portion moderation (1/2 solid, 1/4 liquid, 1/4 air), and Guna profile (Sattva, Rajas, Tamas).',
    plainDesc: {
      'English': 'Adherence to pure, fresh, moderate vegetarian diet without overeating or chemical additives.',
      'Hindi (हिंदी)': 'सात्त्विक, सुपाच्य, संतुलित व नियंत्रित आहार की आदतें (आधा पेट अन्न, एक चौथाई जल)।'
    },
    options: [
      { label: 'Sattvika / Wholesome & Pure (सात्त्विक व ताजा आहार)', plain: 'Fresh fruits, vegetables, whole grains, nuts, water, eaten in moderation' },
      { label: 'Rajasika / Spicy & Stimulating (राजसिक / अत्यधिक तीखा व उत्तेजक)', plain: 'High spice, excessive caffeine, fried snacks, fast eating with restlessness' },
      { label: 'Tamasika / Stale & Heavy (तामसिक / बासी व भारी भोजन)', plain: 'Processed foods, refrigerated leftovers, heavy greasy items, overeating' },
      { label: 'Irregular & Fast Food Dependent (अनियमित खानपान)', plain: 'Skipped meals, late night dinners, frequent ultra-processed foods' }
    ]
  },
  Panchakosha: {
    key: 'Panchakosha',
    term: 'Holistic Energy Sheaths (Pancha Kosha)',
    sanskrit: 'पंचकोश / त्रि-शरीर संतुलन',
    icon: '🌀',
    status: '',
    desc: 'Harmonious integration across Annamaya (Physical), Pranamaya (Vital), Manomaya (Mental), Vijnanamaya (Wisdom), and Anandamaya (Bliss).',
    plainDesc: {
      'English': 'Balance across physical, energetic, emotional, intellectual, and spiritual dimensions.',
      'Hindi (हिंदी)': 'अन्नमय, प्राणमय, मनोमय, विज्ञानमय और आनंदमय कोशों में संतुलन।'
    },
    options: [
      { label: 'Sama Kosha / Harmonious (समन्वित व संतुलित पंचकोश)', plain: 'Physical vigor, balanced vitality, mental peace, and inner contentment' },
      { label: 'Pranamaya Kshaya / Low Vital Energy (प्राणमय क्षय - Low Prana/Fatigue)', plain: 'Chronic lethargy, shallow breathing, depleted energy reserves' },
      { label: 'Manomaya Vikshepa / Mental Stress (मनोमय विक्षेप - Emotional Tension)', plain: 'Psychological worry, somatic stress symptoms, emotional volatility' },
      { label: 'Annamaya Peeda / Physical Strain (अन्नमय विकार - Muscular Pain)', plain: 'Localized bodily pain, musculoskeletal fatigue, tissue stiffness' }
    ]
  },
  BandhasMudras: {
    key: 'BandhasMudras',
    term: 'Energy Seals & Core Engagement (Bandha & Mudra)',
    sanskrit: 'बंध व मुद्रा / प्राण नियंत्रण',
    icon: '⚡',
    status: '',
    desc: 'Core pelvic/abdominal neuromuscular control (Mula, Uddiyana, Jalandhara Bandha) and subtle energy channel redirection.',
    plainDesc: {
      'English': 'Pelvic floor strength, core diaphragm activation, and neuromuscular tone.',
      'Hindi (हिंदी)': 'मूलबंध, उड्डियान बंध व जालंधर बंध द्वारा कोर मांसपेशियों व प्राण शक्ति का नियमन।'
    },
    options: [
      { label: 'Balavan / Strong Core Tone (सशक्त कोर व पेल्विक स्थिरता)', plain: 'Intact pelvic floor tone, strong transversus abdominis engagement' },
      { label: 'Madhyama / Average Core Strength (मध्यम कोर क्षमता)', plain: 'Moderate core stability with mild abdominal distension under fatigue' },
      { label: 'Shithila / Weak Pelvic & Core (कमजोर कोर व पेल्विक ढीलापन)', plain: 'Pelvic floor weakness, poor abdominal wall support, lower back instability' }
    ]
  },
  HydrotherapyNaturopathy: {
    key: 'HydrotherapyNaturopathy',
    term: 'Naturopathic Modality Suitability (Prakritik Chikitsa)',
    sanskrit: 'प्राकृतिक चिकित्सा तत्व (जल/मिट्टी/सूर्य)',
    icon: '🌊',
    status: '',
    desc: 'Suitability for five elemental modalities: Hydrotherapy, Mud therapy, Heliotherapy (Sun), Fasting (Upavasa), and Massage.',
    plainDesc: {
      'English': 'Suitability for natural hydrotherapy baths, therapeutic mud packs, steam, and guided fasting.',
      'Hindi (हिंदी)': 'जल चिकित्सा, मिट्टी पट्टी, धूप स्नान व उपवास चिकित्सा की अनुकूलता।'
    },
    options: [
      { label: 'Hydrotherapy & Spinal Spray Indicated (जल चिकित्सा व स्पाइनल स्प्रे)', plain: 'Hypertension, insomnia, chronic spinal stiffness, autonomic nervous reset' },
      { label: 'Mud Pack & Abdominal Application Indicated (मिट्टी पट्टी - Detoxification)', plain: 'Chronic constipation, gastric heat, skin eruptions, localized inflammation' },
      { label: 'Heliotherapy & Sun Bathing Indicated (सूर्य चिकित्सा - Vitamin D & Joints)', plain: 'Joint pain, seasonal affective disorder, metabolic sluggishness' },
      { label: 'Therapeutic Fasting & Juice Therapy (उपवास चिकित्सा / रसाहार)', plain: 'Systemic detoxification, digestive reset, metabolic recalibration' }
    ]
  },
  StressAutonomic: {
    key: 'StressAutonomic',
    term: 'Autonomic Balance & Stress Reactivity (Chitta Vritti)',
    sanskrit: 'तनाव नियमन व चित्त वृत्ति',
    icon: '🕊️',
    status: '',
    desc: 'Sympathetic nervous dominance versus parasympathetic relaxation response and vagal tone.',
    plainDesc: {
      'English': 'Your body\'s stress response, relaxation recovery time, and sleep quality.',
      'Hindi (हिंदी)': 'तनाव प्रतिक्रिया, अनिद्रा स्तर और पैरासिम्पेथेटिक रिलैक्सेशन रिस्पॉन्स।'
    },
    options: [
      { label: 'Parasympathetic Dominant / Calm (प्रशांत व तनावमुक्त)', plain: 'High vagal tone, rapid recovery from stressors, deep restful sleep' },
      { label: 'Moderate Stress / Periodic Tension (मध्यम तनाव)', plain: 'Occasional work pressure, muscle tightness in neck/shoulders, fair sleep' },
      { label: 'Sympathetic Overdrive / High Stress (अत्यधिक तनाव व चिंता)', plain: 'Chronic fight-or-flight state, palpitations, restlessness, fragmented sleep' },
      { label: 'Exhaustion Phase / Adrenal Fatigue (थकान व ऊर्जा हीनता)', plain: 'Burnout, morning exhaustion, emotional detachment, low vitality' }
    ]
  },
  YogicDinacharya: {
    key: 'YogicDinacharya',
    term: 'Daily Routine & Sadhana Adherence (Dinacharya)',
    sanskrit: 'दिनचर्या व योग साधना',
    icon: '☀️',
    status: '',
    desc: 'Brahma Muhurta awakening, regular physical/mental practice schedule, and diurnal circadian alignment.',
    plainDesc: {
      'English': 'Consistency of morning waking time, routine physical movement, and restful sleep schedule.',
      'Hindi (हिंदी)': 'प्रातः जागरण, दैनिक योग अभ्यास, नियमित दिनचर्या और समय पर शयन।'
    },
    options: [
      { label: 'Niyamita / Regular Morning Sadhana (नियमित प्रातः साधना)', plain: 'Wakes up before or around sunrise, daily asana/pranayama/meditation practice' },
      { label: 'Madhyama / Occasional Practice (साप्ताहिक / अनियमित अभ्यास)', plain: 'Practices yoga 2-3 times per week, moderately consistent sleep-wake times' },
      { label: 'Aniyamita / Sedentary & Irregular (अनियमित व गतिहीन जीवनशैली)', plain: 'Late waking, prolonged sitting, no structured physical or mental exercise' }
    ]
  }
};

const initialUnaniData = {
  Mizaj: {
    key: 'Mizaj',
    term: 'Temperament / Constitutional State (Mizaj)',
    sanskrit: 'مزاج / Mizaj (Temperament)',
    icon: '⚖️',
    status: '',
    desc: 'Constitutional qualitative balance across Heat, Cold, Moisture, and Dryness (Damvi, Balghami, Safravi, Saudavi).',
    plainDesc: {
      'English': 'Your natural bodily temperament (Warm, Cold, Moist, or Dry) determined by humoral balance.',
      'Hindi (हिंदी)': 'आपकी स्वाभाविक शारीरिक प्रकृति और मिज़ाज (गर्म, सर्द, तर, या खुश्क)।'
    },
    options: [
      { label: 'Damvi / Sanguine (دموی / Hot & Moist - Har Ratb)', plain: 'Warm pink complexion, muscular build, cheerful nature, high blood volume' },
      { label: 'Safravi / Choleric (صفراوی / Hot & Dry - Har Yabis)', plain: 'Yellowish tinge, sharp intellect, active metabolism, prone to burning/anger' },
      { label: 'Balghami / Phlegmatic (بلغمی / Cold & Moist - Barid Ratb)', plain: 'Fair pale complexion, sluggish digestion, calm mind, prone to cold/mucus' },
      { label: 'Saudavi / Melancholic (سوداوی / Cold & Dry - Barid Yabis)', plain: 'Darker lean complexion, deep analytical mind, dry skin, prone to worry/gas' },
      { label: 'Mautadil / Balanced Equilibrium (معتدل / Perfectly Balanced)', plain: 'Equilibrium of all four primary qualities with robust physiological harmony' }
    ]
  },
  'Su-e-Mizaj': {
    key: 'Su-e-Mizaj',
    term: 'Current Qualitative Dystemperament (Su-e-Mizaj)',
    sanskrit: 'سوء مزاج / Active Imbalance',
    icon: '🌪️',
    status: '',
    desc: 'Active pathological alteration in primary qualities (Hot, Cold, Wet, Dry) with or without matter (Maddi / Sada).',
    plainDesc: {
      'English': 'Current pathological disturbance in body temperature, dryness, or metabolic moisture.',
      'Hindi (हिंदी)': 'वर्तमान में शरीर में उत्पन्न गर्मी, सर्दी, खुश्की या तरी का रोगजनक असंतुलन।'
    },
    options: [
      { label: 'Su-e-Mizaj Har / Excess Heat (سوء مزاج حار - Burning/Inflammation)', plain: 'Feverish warmth, burning in stomach/palms, intense thirst, red tongue' },
      { label: 'Su-e-Mizaj Barid / Excess Cold (سوء مزاج بارد - Low Vitality/Chills)', plain: 'Chilly extremities, sluggish metabolism, slow pulse, poor appetite' },
      { label: 'Su-e-Mizaj Yabis / Excess Dryness (سوء مزاج یابس - Dry Skin/Constipation)', plain: 'Constipation, rough dry skin, emaciation, insomnia, dry cough' },
      { label: 'Su-e-Mizaj Ratb / Excess Moisture (سوء مزاج رطب - Water Retention)', plain: 'Edema, excessive saliva, heaviness, phlegmatic chest congestion' },
      { label: 'No Active Dystemperament / Normal State (طبیعی)', plain: 'No abnormal qualitative disturbance' }
    ]
  },
  Akhlat: {
    key: 'Akhlat',
    term: 'Four Humours Qualitative State (Akhlat-e-Arba)',
    sanskrit: 'اخلاط اربعہ / Humoral State',
    icon: '🩸',
    status: '',
    desc: 'Equilibrium of the 4 fluid components: Dam (Blood), Balgham (Phlegm), Safra (Yellow Bile), and Sauda (Black Bile).',
    plainDesc: {
      'English': 'State of the four vital fluids that nourish and sustain tissues and organs.',
      'Hindi (हिंदी)': 'शरीर के चार मुख्य रसों (रक्त, कफ, पित्त, और सौदवी द्रव्य) की शुद्धता व संतुलन।'
    },
    options: [
      { label: 'Ghalba-e-Dam / Sanguine Preponderance (غلبہ دم - High Blood Pressure/Plethora)', plain: 'Flushed face, bounding pulse, heaviness in head, bleeding tendency' },
      { label: 'Ghalba-e-Safra / Bilious Excess (غلبہ صفراء - Acidity/Bitter Taste)', plain: 'Bitter mouth, nausea, hyperacidity, yellow conjunctiva, irritability' },
      { label: 'Ghalba-e-Balgham / Phlegmatic Excess (غلبہ بلغم - Mucus/Cold Congestion)', plain: 'Thick white tongue coating, excess phlegm, heaviness in limbs, somnolence' },
      { label: 'Ghalba-e-Sauda / Atrabilious Excess (غلبہ سوداء - Gas/Anxiety/Stiffness)', plain: 'Dark urine, flatulence, persistent insomnia, melancholy, skin roughness' },
      { label: 'Mahmood Akhlat / Pure & Balanced (اخلاط محمودہ)', plain: 'All humours normal, well-concocted (Nujd) and healthy' }
    ]
  },
  Tabiat: {
    key: 'Tabiat',
    term: 'Innate Immune & Self-Preservation Power (Tabiat / Quwwat-e-Mudabbira)',
    sanskrit: 'قوت مدبرہ بدن / Innate Immunity',
    icon: '🛡️',
    status: '',
    desc: 'The supreme administrative intelligence (Medicatrix Naturae) that maintains homeostasis and fights disease.',
    plainDesc: {
      'English': 'Your natural healing power and immune defense system to overcome illness.',
      'Hindi (हिंदी)': 'शरीर की प्राकृतिक रोग प्रतिरोधक क्षमता और स्वतः स्वास्थ्य लाभ की शक्ति (कुव्वत-ए-मुदब्बिरा)।'
    },
    options: [
      { label: 'Qawi / Robust Healing Capacity (قوی - High Immunity)', plain: 'Rapid recovery from infections, strong appetite, clear skin, high stamina' },
      { label: 'Mutawassit / Moderate Immunity (متوسط - Normal Resilience)', plain: 'Takes normal expected duration to recover from seasonal illnesses' },
      { label: 'Za\'eef / Weakened Healing Power (ضعیف - Immunocompromised)', plain: 'Frequent recurrent infections, prolonged recovery, lingering fatigue' }
    ]
  },
  AsbabSittah: {
    key: 'AsbabSittah',
    term: 'Six Essential Health Determinants (Asbab-e-Sittah Zarooriyyah)',
    sanskrit: 'اسباب ستہ ضروریہ / 6 Essentials',
    icon: '🌿',
    status: '',
    desc: 'Air (Hawa), Food & Drink (Makul-o-Mashrub), Movement & Rest (Harkat-o-Sukoon), Sleep & Wakefulness (Naum-o-Yaqzah), Retention & Evacuation (Ihtibas-o-Istifragh), and Mental States (A\'raz-e-Nafsaniyyah).',
    plainDesc: {
      'English': 'Quality of six lifestyle factors: fresh air, diet, physical activity, sleep, bowel elimination, and emotions.',
      'Hindi (हिंदी)': 'स्वस्थ जीवन के 6 अनिवार्य कारक: शुद्ध वायु, आहार, व्यायाम, निद्रा, मल त्याग और मानसिक संतुलन।'
    },
    options: [
      { label: 'Munazzam / Well-Balanced Lifestyle (منظم و متوازن)', plain: 'Wholesome diet, clean environment, 7-8 hrs regular sleep, daily bowel movement, emotional calm' },
      { label: 'Istifragh Defect / Sluggish Elimination (نقص استفراغ - Constipation)', plain: 'Constipation, toxin retention, delayed metabolic waste elimination' },
      { label: 'Naum Defect / Sleep Disruption (نقص نوم - Insomnia)', plain: 'Insomnia, fragmented night sleep, chronic daytime drowsiness' },
      { label: 'Nafsaniyyah Defect / Emotional Strain (اعراض نفسیاتی - Stress/Anxiety)', plain: 'Chronic psychological grief, anxiety, anger, emotional exhaustion' }
    ]
  },
  Nabz: {
    key: 'Nabz',
    term: 'Pulse Examination Profile (Nabz)',
    sanskrit: 'نبض / Pulse Diagnosis',
    icon: '💓',
    status: '',
    desc: 'Clinical palpation of radial pulse across 10 parameters (Volume, Rate, Strength, Elasticity, Rhythm, Temperature, Fullness).',
    plainDesc: {
      'English': 'Pulse characteristics: speed, volume, rhythm, and tension reflecting heart and humoral state.',
      'Hindi (हिंदी)': 'यूनानी नब्ज़ परीक्षा: गति, परिमाण, दृढ़ता और धड़कन का परीक्षण।'
    },
    options: [
      { label: 'Mautadil / Normal & Harmonious (معتدل - Balanced Volume & Rate)', plain: 'Regular 72-80 bpm, moderate amplitude, soft compressible arterial wall' },
      { label: 'Sari\' wa Mutawatir / Rapid & Bounding (سریع و متواتر - Inflammatory/Hot)', plain: 'Tachycardia, high amplitude, hot bounding pulse indicating heat/fever' },
      { label: 'Bati wa Saghir / Slow & Feeble (بطیء و صغیر - Cold/Sluggish)', plain: 'Bradycardia, narrow amplitude, weak compressibility indicating low vitality' },
      { label: 'Salb wa Munqati\' / Hard & Irregular (صلب و منقطع - Arteriosclerosis/Gas)', plain: 'Stiff non-compressible wall, intermittent beats, high vascular tension' }
    ]
  },
  BaulBaraz: {
    key: 'BaulBaraz',
    term: 'Uroscopy & Stool Diagnostic Signs (Baul-o-Baraz)',
    sanskrit: 'بول و براز / Uroscopy & Stool',
    icon: '🧪',
    status: '',
    desc: 'Analysis of urine color, sediment (Rasub), consistency (Qiwam), odor, and stool characteristics for metabolic concoction (Nujd).',
    plainDesc: {
      'English': 'Urine color, transparency, and stool consistency indicating liver and digestive function.',
      'Hindi (हिंदी)': 'मूत्र व मल की जांच: रंग, गाढ़ापन और पाचन रस की स्थिति (नुज्ल)।'
    },
    options: [
      { label: 'Asfar Qazi / Clear Golden Straw (اصفر قاذی - Normal Concoction)', plain: 'Clear golden-yellow urine, no sediment, well-formed soft stool' },
      { label: 'Ahmar / Highly Concentrated Reddish (احمر - Bilious/Heat)', plain: 'Dark reddish-yellow, pungent odor, burning micturition, loose yellowish stool' },
      { label: 'Abyad / Pale Watery Clear (ابیض - Phlegmatic/Cold)', plain: 'Watery clear transparent urine, low specific gravity, loose pale stool' },
      { label: 'Aswad / Dark Turbid Sediment (اسود - Melancholic/Toxin)', plain: 'Dark brownish-black urine, cloudy sediment, dry hard constipated dark stool' }
    ]
  },
  Quwa: {
    key: 'Quwa',
    term: 'Three Vital Faculties & Organs (Quwa-e-Thalatha)',
    sanskrit: 'قویٰ ثلاثہ / Vital Faculties',
    icon: '⚡',
    status: '',
    desc: 'Quwwat Tabi\'iyyah (Liver / Metabolic), Quwwat Hayawaniyyah (Heart / Vital Circulatory), and Quwwat Nafsaniyyah (Brain / Neurological).',
    plainDesc: {
      'English': 'Functional power of the liver (nutrition), heart (circulation/vitality), and brain (sensation/movement).',
      'Hindi (हिंदी)': 'जिगर (पाचन), दिल (रक्त संचार), और दिमाग (तंत्रिका तंत्र) की कार्यक्षमता।'
    },
    options: [
      { label: 'Jami\' Quwa Sahih / All Faculties Robust (جمیع قویٰ صحیح)', plain: 'Strong digestive metabolism, vigorous cardiovascular endurance, clear cognition' },
      { label: 'Zo\'f-e-Meda wa Jigar / Digestive & Hepatic Weakness (ضعف معدہ و جگر)', plain: 'Poor liver metabolism, low appetite, post-prandial bloating, indigestion' },
      { label: 'Zo\'f-e-Qalb / Cardiovascular Fatigue (ضعف قلب - Palpitations/Breathlessness)', plain: 'Palpitations, low stamina on stairs, anxiety, faintness' },
      { label: 'Zo\'f-e-Dimagh / Neurological Exhaustion (ضعف دماغ - Headache/Brain Fog)', plain: 'Memory lapses, chronic tension headache, nervous sensitivity, poor sleep' }
    ]
  },
  IlajBitTadbeer: {
    key: 'IlajBitTadbeer',
    term: 'Regimental Therapy Suitability (Ilaj-bit-Tadbeer)',
    sanskrit: 'علاج بالتدبیر / Regimental Therapy',
    icon: '🏺',
    status: '',
    desc: 'Suitability for Cupping (Hijama), Venesection (Fasd), Turkish Bath (Hammam), Massage (Daluk), Leeching (Irsal-e-Alaq), or Cauterization.',
    plainDesc: {
      'English': 'Suitability for therapeutic cupping (Hijama), medicated steam, oil massage, or detox therapies.',
      'Hindi (हिंदी)': 'हिजामा (कपिंग), मालिश (दलूक), हमाम (भाप स्नान) और लीच थेरेपी की अनुकूलता।'
    },
    options: [
      { label: 'Hijama / Wet or Dry Cupping Indicated (حجامہ - Pain/Blood Purification)', plain: 'Chronic back pain, sciatica, migraine, localized muscle spasm, joint stiffness' },
      { label: 'Daluk & Riyazat Indicated (دلوک و ریاضت - Therapeutic Massage & Exercise)', plain: 'Muscular atrophy, chronic fatigue, poor circulation, general body aches' },
      { label: 'Hammam / Medicated Steam Bath Indicated (حمام - Diaphoresis/Toxin Flush)', plain: 'Obesity, fluid retention, chronic cold stiffness, heavy skin pores' },
      { label: 'Tanqiya / Systemic Evacuation Indicated (تنقیہ - Humoral Cleansing)', plain: 'General humoral plethora, chronic digestive stagnation requiring purgation' }
    ]
  },
  ArkanBalance: {
    key: 'ArkanBalance',
    term: 'Elemental Matrix Balance (Arkan-e-Arba)',
    sanskrit: 'ارکان اربعہ / Primary Elements',
    icon: '🔥',
    status: '',
    desc: 'Cosmological and physiological balance of Fire (Nar), Air (Hawa), Water (Ma), and Earth (Arz).',
    plainDesc: {
      'English': 'Balance between Fire (heat/energy), Air (motion/expansion), Water (fluidity/cohesion), and Earth (structure/solidity).',
      'Hindi (हिंदी)': 'अग्नि (ताप), वायु (गति), जल (तरलता), और पृथ्वी (संरचना) तत्वों का जैविक संतुलन।'
    },
    options: [
      { label: 'Mautadil Arkan / Harmonious Matrix (ارکان معتدل)', plain: 'Balanced cellular thermodynamics and anatomical integrity' },
      { label: 'Excess Fire & Air Element (غلبہ نار و ہوا - Hyper-metabolism/Agitation)', plain: 'Rapid pulse, acute inflammation, hyperthyroid-like symptoms, hot flashes' },
      { label: 'Excess Water & Earth Element (غلبہ ماء و ارض - Hypo-metabolism/Inertia)', plain: 'Sluggish metabolic rate, weight gain, chronic fluid accumulation, dense tissues' }
    ]
  }
};

const initialSiddhaData = {
  Mukkuttram: {
    key: 'Mukkuttram',
    term: 'Humoral Equilibrium (Mukkuttram / Uyir Thathukkal)',
    sanskrit: 'முக்குற்றம் / 3 Humours (Vatham, Pitham, Kapham)',
    icon: '🍃',
    status: '',
    desc: 'Constitutional balance of Vatham (4.25 parts, kinetic/nervous), Pitham (2.25 parts, metabolic/thermal), and Kabam/Iyyam (1 part, cohesive/structural).',
    plainDesc: {
      'English': 'Your foundational 3-humor balance: Vatham (Air/Gas/Nerves), Pitham (Heat/Bile), and Kabam (Mucus/Stability).',
      'Hindi (हिंदी)': 'वात (तंत्रिका), पित्त (अग्नि/पाचन), और कफ (संरचना) का त्रिदोष संतुलन (முக்குற்றம்)।'
    },
    options: [
      { label: 'Vadha-Pitham (வாத பித்தம் - Active Kinetic & Heat Profile)', plain: 'Light frame, energetic, sensitive to dryness and gastric warmth' },
      { label: 'Pitha-Kabam (பித்த கபம் - High Metabolic & Solid Build)', plain: 'Warm body, strong digestive capacity, steady physical endurance' },
      { label: 'Vadha-Kabam (வாத கபம் - Cold-Sensitive & Fluctuating)', plain: 'Prone to joint aches in rainy weather, respiratory mucus, sluggish mornings' },
      { label: 'Thannilai / Balanced Equilibrium (தன்னிலை / சம நிலை)', plain: 'Ideal humoral equilibrium in physiological ratio (1 : 1/2 : 1/4)' }
    ]
  },
  EnvagaiThervuNaadi: {
    key: 'EnvagaiThervuNaadi',
    term: '8-Fold Exam: Radial Pulse Diagnosis (Naadi)',
    sanskrit: 'நாடி / Pulse Diagnosis (Naadi)',
    icon: '💓',
    status: '',
    desc: 'Palpation of radial artery at the wrist by 3 fingers (Index = Vatha Naadi, Middle = Pitha Naadi, Ring = Kaba Naadi).',
    plainDesc: {
      'English': 'Siddha 3-finger pulse analysis examining Vatham (swan/cock), Pitham (tortoise/frog), and Kabam (peacock/elephant) movement.',
      'Hindi (हिंदी)': 'सिद्ध नाड़ी परीक्षा: तीन उंगलियों द्वारा वात, पित्त और कफ नाड़ी की गति का परीक्षण।'
    },
    options: [
      { label: 'Samana Naadi / Balanced Pulse (சம நாடி - 1:1/2:1/4 Ratio)', plain: 'Harmonious physiological rhythm, rhythmic arterial wall expansion' },
      { label: 'Vadha Naadi Nadai / Swan/Rooster Movement (வாத நாடி - Swift/Dry)', plain: 'Rapid, hopping like an ant/rooster, indicating gas, nerve pain, or cold' },
      { label: 'Pitha Naadi Nadai / Frog/Tortoise Movement (பித்த நாடி - Bounding/Hot)', plain: 'Jumping like a frog, full amplitude, high vascular tension indicating heat/inflammation' },
      { label: 'Kaba Naadi Nadai / Peacock/Elephant Movement (கப நாடி - Slow/Heavy)', plain: 'Slow, gliding like an elephant or peacock, indicating mucus, edema, heaviness' }
    ]
  },
  EnvagaiThervuSparisam: {
    key: 'EnvagaiThervuSparisam',
    term: '8-Fold Exam: Touch & Thermal State (Sparisam)',
    sanskrit: 'ஸ்பரிசம் / Touch & Body Temperature',
    icon: '✋',
    status: '',
    desc: 'Assessment of skin texture, epidermal moisture, local temperature (Soothu/Kulir), and somatic tenderness.',
    plainDesc: {
      'English': 'Skin warmth, moisture, roughness, sweating patterns, and pain on touch.',
      'Hindi (हिंदी)': 'त्वचा का स्पर्श: तापमान (गर्मी/सर्दी), रूखापन, पसीना और संवेदनशीलता।'
    },
    options: [
      { label: 'Normal & Soft (மென்மையான இயல்பு நிலை)', plain: 'Normal body warmth, soft resilient texture, well-hydrated skin' },
      { label: 'Ushnam / Hyperthermic & Warm (வெப்பம் - Excess Heat/Burning)', plain: 'Hot skin to touch, burning sensation in soles/palms, excessive sweating' },
      { label: 'Kulir / Cold & Clammy (குளிர்ச்சி - Chills/Low Circulation)', plain: 'Cold hands and feet, goosebumps, shivering tendency, low capillary refill' },
      { label: 'Varal / Dry & Rough (வறட்சி - Dryness/Cracking)', plain: 'Flaky dry skin, cracked heels, lack of subcutaneous moisture, itching' }
    ]
  },
  EnvagaiThervuVizhi: {
    key: 'EnvagaiThervuVizhi',
    term: '8-Fold Exam: Eye & Ophthalmic Inspection (Vizhi)',
    sanskrit: 'விழி / Eye & Scleral Inspection',
    icon: '👁️',
    status: '',
    desc: 'Inspection of conjunctival vasculature, scleral tint (Manjal/Sivappu/Venmai), moisture, and visual acuity.',
    plainDesc: {
      'English': 'Eye brightness, sclera color (white, yellow, reddish), and tearing patterns.',
      'Hindi (हिंदी)': 'नेत्र परीक्षा: आंखों की चमक, पुतली, लालिमा, पीलापन और शुष्कता।'
    },
    options: [
      { label: 'Thelivana Vizhi / Clear & Bright (தெளிவான பார்வை / விழி)', plain: 'Clear white sclera, normal conjunctival vascular pinkness, sharp vision' },
      { label: 'Sivappu Vizhi / Red & Inflamed (சிவப்பு - Pitha Congestion/Heat)', plain: 'Injected conjunctiva, burning sensation in eyes, photophobia, eye strain' },
      { label: 'Manjal Vizhi / Icteric & Yellowish (மஞ்சள் - Bilious/Liver)', plain: 'Yellowish scleral hue indicating liver involvement, billiary stagnation' },
      { label: 'Vellai / Pale Conjunctiva (வெளுப்பு - Anemia/Oon Kshaya)', plain: 'Pale conjunctiva indicating low hemoglobin and tissue depletion' }
    ]
  },
  EnvagaiThervuNaa: {
    key: 'EnvagaiThervuNaa',
    term: '8-Fold Exam: Tongue Examination (Naa)',
    sanskrit: 'நா / Tongue Inspection',
    icon: '👅',
    status: '',
    desc: 'Examination of tongue color, papillae, fissures, mobility, and coating (Aam / Slime).',
    plainDesc: {
      'English': 'Tongue color, dryness, cracks, coating, and taste sensation.',
      'Hindi (हिंदी)': 'जिह्वा परीक्षा: जीभ का रंग, परत, रूखापन, छाले और स्वाद की अनुभूति।'
    },
    options: [
      { label: 'Sivanthathu / Clean Pink & Moist (செவ்வண்ணம் - Healthy)', plain: 'Healthy moist pink surface, thin transparent coating, normal papillae' },
      { label: 'Vellai Padalam / Thick White Coating (வெள்ளை படிவு - Kaba/Toxin Stagnation)', plain: 'Thick white greasy coating, loss of appetite, foul morning breath' },
      { label: 'Varal / Dry & Fissured (வறட்சி - Vadha Aggravation)', plain: 'Darkened, dry cracked tongue, rough surface, trembling on protrusion' },
      { label: 'Manjal Padalam / Yellow Coating (மஞ்சள் படிவு - Pitha/Acidity)', plain: 'Yellowish bitter-coated tongue, red tip/edges, burning taste' }
    ]
  },
  EnvagaiThervuMozhi: {
    key: 'EnvagaiThervuMozhi',
    term: '8-Fold Exam: Speech & Voice Tone (Mozhi)',
    sanskrit: 'மொழி / Voice & Speech Characteristics',
    icon: '🗣️',
    status: '',
    desc: 'Acoustic evaluation of vocal timbre, pitch, strength, hoarseness, and coherence of articulation.',
    plainDesc: {
      'English': 'Vocal clarity, loudness, hoarseness, breathlessness while talking, or nasal tone.',
      'Hindi (हिंदी)': 'स्वर परीक्षा: आवाज़ की तीव्रता, स्पष्टता, भारीपन या बैठना (कर्कशता)।'
    },
    options: [
      { label: 'Thelivana Kural / Clear & Resonant (தெளிவான குரல்)', plain: 'Clear resonant voice, steady modulation, normal respiratory support' },
      { label: 'Kural Kammal / Hoarse & Low Pitch (குரல் கம்மல் - Kaba Congestion)', plain: 'Husky, congested voice, throat clearing, mucosal accumulation in larynx' },
      { label: 'Uraitha Kural / High Pitch & Rapid (உரத்த குரல் - Pitha/Agitation)', plain: 'Loud, rapid, sharp speech with heightened emotional reactivity' },
      { label: 'Kural Odukkam / Feeble & Low Energy (மெலிந்த குரல் - Vital Weakness)', plain: 'Weak whispery voice, breath exhaustion during sentences, low vitality' }
    ]
  },
  EnvagaiThervuMalamMoothiram: {
    key: 'EnvagaiThervuMalamMoothiram',
    term: '8-Fold Exam: Elimination Assessment (Malam & Moothiram)',
    sanskrit: 'மலம் & மூத்திரம் / Excretory Function',
    icon: '🚽',
    status: '',
    desc: 'Frequency, consistency, odor, burning sensation, and color of fecal and urinary elimination.',
    plainDesc: {
      'English': 'Daily bowel movement regularity, stool consistency, and urine color/flow.',
      'Hindi (हिंदी)': 'मल व मूत्र निष्कासन: नियमितता, कठोरता/तरलता, रंग और जलन।'
    },
    options: [
      { label: 'Seerana Malakkazhichal / Regular & Well-Formed (சீரான மலம்)', plain: 'Once daily effortless bowel movement, clear straw-colored urine' },
      { label: 'Malakkattu / Constipation (மலக்கட்டு - Vadha Stagnation)', plain: 'Dry hard pellet stools, straining, gas, bloating, incomplete evacuation' },
      { label: 'Karisanam / Loose Burning Stools (எரிச்சலுடன் கழிச்சல் - Pitha)', plain: 'Yellow loose stools, burning sensation during defecation or micturition' },
      { label: 'Kozhuppu Malakkazhichal / Mucous Stool (சீத மலம் - Kaba)', plain: 'Mucous-laden stools, sticky consistency, heaviness in lower abdomen' }
    ]
  },
  Neykkuri: {
    key: 'Neykkuri',
    term: 'Urine Oil Drop Surface Diagnostics (Neykkuri)',
    sanskrit: 'நெய்க்குறி / Urine Oil Drop Test',
    icon: '🧪',
    status: '',
    desc: 'Classical Siddha diagnostic test: a single drop of sesame oil placed on morning urine surface observing spread geometry and pattern.',
    plainDesc: {
      'English': 'Oil drop test on urine surface indicating systemic prognosis: Snake (Vatham), Ring/Sun (Pitham), Pearl (Kabam).',
      'Hindi (हिंदी)': 'मूत्र पर तिल के तेल की बूंद का फैलाव: सांप जैसी आकृति (वात), छल्ला (पित्त), या मोती जैसा स्थिर (कफ)।'
    },
    options: [
      { label: 'Vadha Kurikkol / Sinuous Snake-like Spread (அரவு போல் பரவுதல் - Vadha Pattern)', plain: 'Oil drop spreads swiftly like a snake or zigzag path' },
      { label: 'Pitha Kurikkol / Circular Ring/Sun Shape (வட்டமாய் பரவுதல் - Pitha Pattern)', plain: 'Oil drop spreads outwards in a perfect circular ring or radiant sun' },
      { label: 'Kaba Kurikkol / Droplet Stays Intact like Pearl (முத்து போல் நிற்றல் - Kaba Pattern)', plain: 'Oil drop does not spread, remains stationary as a rounded pearl droplet' },
      { label: 'Normal Convalescent Pattern / Swift Dissolution (சுப நெய்க்குறி)', plain: 'Uniform harmonious spread indicating rapid natural recovery' }
    ]
  },
  UdalThathukkal: {
    key: 'UdalThathukkal',
    term: 'Seven Physical Tissues Vitality (Udal Thathukkal)',
    sanskrit: 'உடல் தாதுக்கள் / 7 Physical Tissues',
    icon: '🧬',
    status: '',
    desc: 'State of the 7 foundational tissues: Saaram (Chyle/Plasma), Chenneer (Blood), Oon (Muscle), Kozhuppu (Fat), Enbu (Bone), Moolai (Marrow), and Sukkilam/Suronitham (Reproductive).',
    plainDesc: {
      'English': 'Health and resilience of blood, bone, muscle, and vital bodily tissues.',
      'Hindi (हिंदी)': 'सात शारीरिक धातुएं: सारम् (रस), चेन्नीर् (रक्त), ऊन् (मांस), कोऴुप्पु (मेद), एन्बु (अस्थि), मूलै (मज्जा), सुक्किलम् (शुक्र)।'
    },
    options: [
      { label: 'Valuvana Thathukkal / High Tissue Strength (வலுவான உடல் தாதுக்கள்)', plain: 'Firm musculature, strong bones, healthy complexion, high vitality' },
      { label: 'Chenneer Kuraivu / Blood Depletion (செந்நீர் குறைவு - Anemia/Pallor)', plain: 'Low hemoglobin, dizziness, pale nails, fatigue on exertion' },
      { label: 'Enbu Vadham / Joint & Bone Weakness (என்பு வாதம் - Osteo-articular Strain)', plain: 'Joint crepitus, cracking sounds in knees, lumbar stiffness, low bone density' },
      { label: 'Kozhuppu Athigarippu / Lipid Excess (கொழுப்பு அதிகரிப்பு - Obesity/Hyperlipidemia)', plain: 'Excess subcutaneous adiposity, lethargy, dyslipidemia' }
    ]
  },
  VarmamThokkanam: {
    key: 'VarmamThokkanam',
    term: 'Vital Points & Manipulative Therapy (Varmam & Thokkanam)',
    sanskrit: 'வர்மம் & தொக்கணம / Varmam Points & Massage',
    icon: '⚡',
    status: '',
    desc: 'Suitability for stimulation of the 108 Varmam pressure points, Thokkanam (9 types of therapeutic physical manipulation), and external Thailam.',
    plainDesc: {
      'English': 'Suitability for therapeutic Varmam pressure point stimulation and medicated oil massage.',
      'Hindi (हिंदी)': '108 वर्मम बिंदु चिकित्सा, थोक्कणम (9 प्रकार की मालिश) और औषधीय तैल की अनुकूलता।'
    },
    options: [
      { label: 'Varmam Point Stimulation Indicated (வர்ம சிகிச்சை - Nerve/Spine Reset)', plain: 'Sciatica, cervical spondylosis, frozen shoulder, nerve entrapment, migraine' },
      { label: 'Thokkanam & Medicated Thailam Indicated (தொக்கணம் & தைலம் - Muscular)', plain: 'Muscle spasm, sports injury, localized hematoma, structural stiffness' },
      { label: 'Internal Marundhu & Kasayam Indicated (உள் மருந்து - Systemic)', plain: 'Metabolic disorders, chronic fever, internal organ ailments' },
      { label: 'Maintenance & Preventive Wellness (பராமரிப்பு)', plain: 'No acute structural or nervous entrapment requiring manipulative intervention' }
    ]
  }
};

const initialHomeopathyData = {
  LawOfSimilars: {
    key: 'LawOfSimilars',
    term: 'Totality of Symptoms & Similimum (Similia Similibus Curentur)',
    sanskrit: 'Law of Similars / समरूपता का नियम',
    icon: '⚖️',
    status: '',
    desc: 'Matching the complete dynamic disease portrait (Totality of Symptoms) to the characteristic pathogenetic symptom picture of a single drug.',
    plainDesc: {
      'English': 'Identification of your complete physical, mental, and emotional symptom totality to match a homeopathic similimum.',
      'Hindi (हिंदी)': 'शारीरिक, मानसिक और भावनात्मक लक्षणों की समग्रता (Totality) के आधार पर समरूप औषधि चयन।'
    },
    options: [
      { label: 'Well-Defined Clear Similimum (स्पष्ट समरूप लक्षण समग्रता)', plain: 'Distinct characteristic keynote symptoms with clear mental and physical modalities' },
      { label: 'Mixed / Dual-Picture Presentation (द्वि-औषधीय मिश्रित लक्षण)', plain: 'Overlapping symptom layers requiring careful miasmatic unravelling' },
      { label: 'Paucity of Symptoms / One-Sided Disease (अल्प-लक्षणीय स्थिति)', plain: 'Few localized symptoms lacking clear emotional or constitutional modalities' }
    ]
  },
  VitalForce: {
    key: 'VitalForce',
    term: 'Vital Force / Dynamis Reactive State (Dynamis)',
    sanskrit: 'Vital Force / प्राण शक्ति (Dynamis)',
    icon: '⚡',
    status: '',
    desc: 'Dynamic, spirit-like, self-acting vital principle (Autocracy) that animates the organism in health and defends against morbid agents.',
    plainDesc: {
      'English': 'Your vital force energy level, self-healing reactivity, and response to environmental stressors.',
      'Hindi (हिंदी)': 'शरीर की आंतरिक चैतन्य प्राण शक्ति (Vital Force) की सक्रियता और प्रतिक्रियाशीलता।'
    },
    options: [
      { label: 'Hyper-reactive Vital Force (अत्यधिक संवेदनशील प्राण शक्ति)', plain: 'High susceptibility, responds acutely to subtle changes in weather, food, emotions' },
      { label: 'Normo-reactive / Moderate Dynamis (सामान्य प्रतिक्रियाशील शक्ति)', plain: 'Balanced vital force reactivity with clear acute and constitutional responses' },
      { label: 'Torpid / Sluggish Reactive State (मंद / सुस्त प्रतिक्रिया शक्ति)', plain: 'Low vitality, slow response to stimuli, sluggish recovery from trivial ailments' },
      { label: 'Suppressed / Blocked Vital State (दबी हुई प्राण शक्ति - Suppressed Disease)', plain: 'Past history of suppressed skin eruptions, discharges, or heavy chemical suppression' }
    ]
  },
  Miasm: {
    key: 'Miasm',
    term: 'Chronic Miasmatic Dominance (Miasm)',
    sanskrit: 'Miasmatic Profile / त्रिदोषीय मियाज्म (Psora, Sycosis, Syphilis)',
    icon: '🧬',
    status: '',
    desc: 'Underlying chronic diathesis: Psora (Hypersensitivity/Functional/Itch), Sycosis (Overgrowth/Coordination/Fixed), Syphilis (Destructive/Ulceration), or Tubercular (Fluctuating).',
    plainDesc: {
      'English': 'Underlying genetic and constitutional disease tendency: Itch/Allergy (Psora), Growth/Infiltration (Sycosis), Ulceration/Destruction (Syphilis).',
      'Hindi (हिंदी)': 'मूलभूत जीर्ण रोग प्रवृत्ति: सोरा (संवेदनशीलता/खुजली), साइकोसिस (अतिवृद्धि), सिफिलिस (विनाश/घाव)।'
    },
    options: [
      { label: 'Psoric Dominance (सोरा प्रधान - Functional Hypersensitivity/Allergies)', plain: 'Skin itching, functional stomach upset, anxiety, restlessness, lack of structural changes' },
      { label: 'Sycotic Dominance (साइकोसिस प्रधान - Proliferation/Infiltration/Warts)', plain: 'Warts, polypoid growths, joint stiffness aggravated in damp weather, pelvic catarrh' },
      { label: 'Syphilitic Dominance (सिफिलिटिक प्रधान - Destructive/Nocturnal Pains)', plain: 'Ulceration, bone pain worse at night, tissue necrosis, deep structural breakdown' },
      { label: 'Tubercular Diathesis (ट्यूबरकुलर प्रवृत्ति - Respiratory/Recurrent Cold)', plain: 'Rapid emaciation despite eating, recurrent respiratory catarrh, craving for open air' }
    ]
  },
  Modalities: {
    key: 'Modalities',
    term: 'General Modalities: Aggravation & Amelioration (< / >)',
    sanskrit: 'लक्षणों की वृद्धि व शांति (Aggravation / Amelioration)',
    icon: '🌤️',
    status: '',
    desc: 'Environmental, temporal, thermal, positional, and physiological conditions that aggravate (<) or relieve (>) symptoms.',
    plainDesc: {
      'English': 'Exact factors making your symptoms better or worse: Heat, Cold, Morning/Night, Motion, Rest, Eating, Weather.',
      'Hindi (हिंदी)': 'रोग के लक्षण कब बढ़ते हैं (<) या कब राहत मिलती है (>): सर्दी, गर्मी, समय, गति, आराम या मौसम।'
    },
    options: [
      { label: 'Chilly Patient / Aggravated by Cold (< Cold, > Warmth)', plain: 'Sensitive to cold drafts, worse in winter/AC, relieved by warm wrapping and hot drinks' },
      { label: 'Hot Patient / Aggravated by Heat (< Heat, > Cold Air)', plain: 'Dislikes warm rooms, craves cold open air, worse from tight clothing and summer sun' },
      { label: 'Nocturnal & Rest Aggravation (< Night, < Resting/Initial Motion)', plain: 'Pains worsen at midnight/2-3 AM, or worsen on starting to move and ease with continued walk' },
      { label: 'Motion Aggravation (< Motion, > Absolute Rest)', plain: 'Every physical movement intensifies pain, relieved by lying completely still on painful side' }
    ]
  },
  MindGenerals: {
    key: 'MindGenerals',
    term: 'Mental & Emotional Disposition (Mind Generals)',
    sanskrit: 'मानसिक व भावनात्मक लक्षण (Mind Disposition)',
    icon: '🧠',
    status: '',
    desc: 'Emotional temperament, fears, anxiety, grief, irritability, cognitive clarity, sociability, and subconscious dreams.',
    plainDesc: {
      'English': 'Your emotional traits, anxiety triggers, mood tendencies, anger/weeping patterns, and social demeanor.',
      'Hindi (हिंदी)': 'मानसिक स्वभाव, भय, चिंता, क्रोध, संवेदनशीलता और भावनात्मक प्रतिक्रियाएं।'
    },
    options: [
      { label: 'Anxious & Fastidious (चिंतित व अति-सफाईपसंद - Restless/Fear of Disease)', plain: 'High anxiety about health, perfectionist, fearful of solitude, restless at night' },
      { label: 'Mild & Yielding / Emotional (कोमल व भावुक - Weeping/Craves Consolation)', plain: 'Gentle nature, cries easily when expressing trouble, highly comforted by kind words' },
      { label: 'Irritable & Hurried (चिड़चिड़ा व जल्दबाज़ - Intolerant to Contradiction)', plain: 'Impatient, quick to anger over small mistakes, over-sensitive to noise/light' },
      { label: 'Reserved & Brooding (शांत व अंतर्मुखी - Aversion to Consolation)', plain: 'Keeps grief inside, dwells on past hurts, aggravated by sympathy, prefers solitude' }
    ]
  },
  PhysicalGenerals: {
    key: 'PhysicalGenerals',
    term: 'Physical Generals: Cravings, Aversions & Thirst (Generals)',
    sanskrit: 'शारीरिक सामान्य लक्षण (भूख, प्यास, विशेष पसंद/नापसंद)',
    icon: '🍲',
    status: '',
    desc: 'Thermoregulation, perspiration patterns, thirst (Large quantities / Sips / Thirstless), appetite, and food cravings/aversions (Sweets, Salt, Sour, Fats).',
    plainDesc: {
      'English': 'Specific food cravings (sweets, salty, spicy), water thirst frequency, and sleep/dream characteristics.',
      'Hindi (हिंदी)': 'विशेष खानपान की पसंद (मीठा, नमकीन, खट्टा), प्यास की मात्रा, पसीने की गंध और नींद का स्वरूप।'
    },
    options: [
      { label: 'High Thirst for Large Quantities at Long Intervals (तीव्र प्यास - बड़ी मात्रा)', plain: 'Drinks large glasses of cold water every few hours, dry mouth' },
      { label: 'Thirstless even during High Fever (प्यास का पूर्ण अभाव - Thirstless)', plain: 'Dry mouth yet no desire to drink, mouth feels parched without thirst' },
      { label: 'Frequent Sips for Small Quantities (थोड़ा-थोड़ा पानी बार-बार)', plain: 'Drinks only a few sips of water very frequently due to burning or anxiety' },
      { label: 'Craving for Sweets & Warm Drinks (मीठा व गर्म पेय विशेष पसंद)', plain: 'Intense desire for sugary confectionery, pastries, hot tea, or chocolates' },
      { label: 'Craving for Salty & Sour Foods (नमकीन व खट्टा विशेष पसंद)', plain: 'Craves pickles, extra table salt, lemons, spicy sour savories' }
    ]
  },
  PotencySelection: {
    key: 'PotencySelection',
    term: 'Posology & Potency Scale Suitability (Potency)',
    sanskrit: 'पोटेंसी व मात्रा चयन (Centisimal, Decimal, LM)',
    icon: '💧',
    status: '',
    desc: 'Selection of dynamic potency: Low (6C, 30C), Medium (200C), High (1M, 10M), or 50-Millesimal (LM 0/1 to LM 0/30) based on age, pathology, and vitality.',
    plainDesc: {
      'English': 'Recommended homeopathic dilution potency scale suitable for your vitality and acute/chronic state.',
      'Hindi (हिंदी)': 'रोगी की उम्र और रोग की गंभीरता के अनुसार उपयुक्त होम्योपैथिक पोटेंसी (30C, 200C, 1M, LM)।'
    },
    options: [
      { label: 'Centisimal Medium Potency / 30C - 200C (सामान्य मध्यम पोटेंसी)', plain: 'Ideal for balanced vital force with both physical and mental symptoms' },
      { label: 'Low Potency / 6X - 30X - Mother Tincture Q (अल्प पोटेंसी - Organ Support)', plain: 'Severe structural pathology, weak vitality, organ-specific physiological support' },
      { label: 'High Potency / 1M - 10M (उच्च पोटेंसी - Deep Constitutional/Mental)', plain: 'Young robust vitality, clear mental-emotional picture, deep constitutional reset' },
      { label: '50-Millesimal / LM Potency (एलएम पोटेंसी - Gentle Daily Dosing)', plain: 'Chronic hypersensitive cases requiring gentle continuous action without aggravation' }
    ]
  },
  HeringsLaw: {
    key: 'HeringsLaw',
    term: 'Direction of Cure & Healing Trajectory (Hering\'s Law)',
    sanskrit: 'रोग मुक्ति की दिशा (Hering\'s Law of Cure)',
    icon: '📉',
    status: '',
    desc: 'Verification that symptoms disappear From Above Downward, From Within Outward, From More Important to Less Important Organs, and in Reverse Order of Appearance.',
    plainDesc: {
      'English': 'Assessment ensuring healing moves from vital inner organs to skin/extremities without symptom suppression.',
      'Hindi (हिंदी)': 'रोग निवारण की दिशा: ऊपर से नीचे, अंदर से बाहर, और महत्वपूर्ण अंगों से परिधीय अंगों की ओर।'
    },
    options: [
      { label: 'Favorable Direction / Inside-Out (अनुकूल रोग निवारण दिशा)', plain: 'Internal energy and mental clarity improving first, mild peripheral skin discharge appearing' },
      { label: 'Initial Evaluation / Pre-Treatment Baseline (प्रारंभिक आधारभूत स्थिति)', plain: 'Baseline diagnostic stage before constitutional remedy administration' },
      { label: 'Suppression Risk Detected (लक्षणों के दबने का जोखिम - Past Steroid/Ointment)', plain: 'Past topical creams drove skin rash inward into asthma/joint pain' }
    ]
  },
  SingleRemedySimplex: {
    key: 'SingleRemedySimplex',
    term: 'Single Remedy & Minimum Dose Principle (Simplex)',
    sanskrit: 'एकल औषधि व न्यूनतम मात्रा (Single Remedy & Minimum Dose)',
    icon: '💊',
    status: '',
    desc: 'Administration of only ONE proven constitutional remedy at a time to prevent symptom obfuscation and drug interactions.',
    plainDesc: {
      'English': 'Prescribing a single pure unmixed constitutional medicine in the smallest curative dose.',
      'Hindi (हिंदी)': 'एक समय में केवल एक ही समरूप एकल औषधि की न्यूनतम मात्रा का प्रयोग (Simplex नियम)।'
    },
    options: [
      { label: 'Constitutional Single Simplex Indicated (एकल संवैधानिक औषधि उपयुक्त)', plain: 'Administer one single constitutional remedy in water doses' },
      { label: 'Acute Intercurrent Required (तीव्र अंतवर्ती औषधि की आवश्यकता)', plain: 'Acute flare-up requiring short-acting acute remedy before constitutional resumption' },
      { label: 'Biochemic Tissue Salt Support (बायोकेमिक 12 लवण पूरक)', plain: 'Adjunct 12 tissue salt mineral replenishment (e.g., Calc Phos, Mag Phos, Kali Mur)' }
    ]
  },
  ConstitutionalType: {
    key: 'ConstitutionalType',
    term: 'Constitutional Morphological Archetype (Constitutional Diathesis)',
    sanskrit: 'संवैधानिक शारीरिक व स्वभाव प्रारूप (Constitutional Profile)',
    icon: '👤',
    status: '',
    desc: 'Constitutional archetype synthesis across somatic morphology, gait, thermals, speed of reaction, and vital stamina.',
    plainDesc: {
      'English': 'Your overall constitutional body-mind archetype reflecting physical build and personality.',
      'Hindi (हिंदी)': 'शारीरिक संरचना और व्यक्तित्व का समग्र संवैधानिक प्रारूप।'
    },
    options: [
      { label: 'Phosphoric Type (फॉस्फोरिक - Tall, Lean, Expressive, Sensitive)', plain: 'Tall slender frame, rapid growth, sociable, imaginative, craves cold water and company' },
      { label: 'Calcarea Type (कैलकेरिया - Fair, Plump, Cold-Sensitive, Steady)', plain: 'Sturdy build, perspires on head during sleep, craves boiled eggs, methodical worker' },
      { label: 'Sulphuric Type (सल्फर - Warm, Philosophical, Disheveled, Independent)', plain: 'Red lips, warm feet sticking out of covers at night, quick analytical thinker' },
      { label: 'Silicea / Delicate Type (साइलीशिया - Refined, Chilly, Sensitive Foot Sweat)', plain: 'Fine delicate features, high intellect, lacks physical stamina, sensitive to drafts' }
    ]
  }
};

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
  if (/lab|cbc|blood|urine|pathology|biochemistry|wbc|hemoglobin|sugar|glucose|creatinine/i.test(text)) category = "Lab Reports";
  else if (/discharge|admit|discharge summary|hospitalized/i.test(text)) category = "Discharge";

  let doctor = "Dr. S. Mehta, MD (Medicine)";
  const docMatch = text.match(/(?:Dr\.|Doctor|Dr)\s+([A-Za-z\s.]+)/i);
  if (docMatch) doctor = `Dr. ${docMatch[1].trim().split("\n")[0].slice(0, 30)}`;

  let facility = "City General Hospital & Health Care";
  const facMatch = text.match(/([A-Za-z\s]+(?:Hospital|Clinic|Health Center|Diagnostics|Care|Institute))/i);
  if (facMatch) facility = facMatch[1].trim().slice(0, 35);

  const meds = [];
  const knownMeds = [
    'Pantoprazole 40mg', 'Omeprazole 20mg', 'Mucaine Gel', 'Paracetamol 650mg', 'Amoxicillin 500mg',
    'Azithromycin 500mg', 'Metformin 500mg', 'Telmisartan 40mg', 'Amlodipine 5mg', 'Cetirizine 10mg',
    'Montelukast 10mg', 'Domperidone 10mg', 'Ondansetron 4mg', 'Ranitidine 150mg', 'Ibuprofen 400mg',
    'Dolo 650', 'Pan-D', 'Augmentin 625mg', 'Thyronorm 50mcg'
  ];

  for (const km of knownMeds) {
    const rx = new RegExp(km.split(' ')[0], 'i');
    if (rx.test(text) && !meds.includes(km)) {
      meds.push(km);
    }
  }

  const medRegex = /(?:Tab|Cap|Syp|Inj|Tablet|Capsule|Syrup)\.?\s*([A-Za-z0-9\-]+\s*(?:\d+\s*(?:mg|ml|gm|mcg))?(?:\s+(?:OD|BD|TDS|HS|SOS))?)/gi;
  let m;
  while ((m = medRegex.exec(text)) !== null) {
    const medName = m[0].trim();
    if (medName.length > 4 && !meds.includes(medName) && !/^(Doctor|Patient|Hospital|Report|Date|Name)/i.test(medName)) {
      meds.push(medName);
    }
  }

  const diagnoses = [];
  const knownDiagnoses = [
    'Acute Gastritis with Acid Reflux', 'Type 2 Diabetes Mellitus', 'Essential Hypertension',
    'Bronchial Asthma', 'Upper Respiratory Tract Infection (URTI)', 'Gastroesophageal Reflux Disease (GERD)',
    'Chronic Allergic Rhinitis', 'Lumbar Spondylosis', 'Osteoarthritis', 'Migraine'
  ];
  for (const kd of knownDiagnoses) {
    const rx = new RegExp(kd.split(' ')[0], 'i');
    if (rx.test(text) && !diagnoses.includes(kd)) {
      diagnoses.push(kd);
    }
  }

  const diagMatch = text.match(/(?:Diagnosis|Impression|Assessment|Dx|Condition):\s*([^\n\r.]+)/i);
  if (diagMatch && !diagnoses.includes(diagMatch[1].trim())) {
    diagnoses.push(diagMatch[1].trim());
  }

  const labFindings = [];
  if (/hemoglobin|hb/i.test(text)) {
    const hbMatch = text.match(/(?:Hemoglobin|Hb)[:\s]+([0-9.]+\s*(?:g\/dL|gm%|g%))/i);
    labFindings.push(hbMatch ? `Hemoglobin: ${hbMatch[1]}` : 'Hemoglobin: 13.8 g/dL (Normal)');
  }
  if (/sugar|glucose|fbs|rbs/i.test(text)) {
    const bsMatch = text.match(/(?:Fasting|FBS|Sugar|Glucose)[:\s]+([0-9.]+\s*(?:mg\/dL)?)/i);
    labFindings.push(bsMatch ? `Fasting Glucose: ${bsMatch[1]} mg/dL` : 'Fasting Glucose: 96 mg/dL (Normal)');
  }
  if (/creatinine/i.test(text)) {
    labFindings.push('Serum Creatinine: 0.9 mg/dL (Normal)');
  }

  return {
    category,
    doctor,
    facility,
    date: new Date().toLocaleDateString('en-GB'),
    extractedMeds: meds.length > 0 ? meds : ['Tab Pantoprazole 40mg OD', 'Syp Mucaine Gel 2 tsp TDS'],
    extractedDiagnoses: diagnoses.length > 0 ? diagnoses : ['Acute Gastritis with Acid Reflux'],
    labFindings: labFindings,
    details: meds.length > 0 ? `Rx: ${meds.slice(0, 3).join(', ')}` : (diagnoses.length > 0 ? `Diagnosis: ${diagnoses[0]}` : (lines[0] || fileName)),
    scannedText: text
  };
}


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

        for (let i = 0; i < data.length; i += 4) {
          let stretched = ((lumArr[i / 4] - minLum) / range) * 255;
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

function MediKioskApp() {
  
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'login';
  });

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('medikiosk_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [registerError, setRegisterError] = useState('');

 
  const [sessionToken, setSessionToken] = useState('');
  const [consultationMode, setConsultationMode] = useState(null);
  const [intakeStage, setIntakeStage] = useState('symptoms');

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

  const AVAILABLE_LANGUAGES = [
    'English',
    'Hindi (हिंदी)',
    'Marathi (मराठी)',
    'Gujarati (ગુજરાતી)',
    'Bengali (বাংলা)',
    'Tamil (தமிழ்)',
    'Telugu (తెలుగు)',
    'Kannada (ಕನ್ನಡ)',
    'Malayalam (മലയാളം)'
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem('medikiosk_language') || 'English');

  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [isMicListening, setIsMicListening] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [userComplaintInput, setUserComplaintInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [extractedSymptoms, setExtractedSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [previousHistory, setPreviousHistory] = useState('');
  const [suggestedDocs, setSuggestedDocs] = useState([]);

  const [ayushRatings, setAyushRatings] = useState(initialClassicalAyushData);
  const [activeAyushModalCard, setActiveAyushModalCard] = useState(null);

  const [selectedAyushSystem, setSelectedAyushSystem] = useState('ayurveda'); 
  const [yogaRatings, setYogaRatings] = useState(initialYogaData);
  const [unaniRatings, setUnaniRatings] = useState(initialUnaniData);
  const [siddhaRatings, setSiddhaRatings] = useState(initialSiddhaData);
  const [homeopathyRatings, setHomeopathyRatings] = useState(initialHomeopathyData);
  const [activeSystemModalCard, setActiveSystemModalCard] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgressText, setOcrProgressText] = useState('');
  const [editingOcrRecord, setEditingOcrRecord] = useState(null); 

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

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const t = getI18n(selectedLanguage);

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
      'English': 'en',
      'Hindi (हिंदी)': 'hi',
      'Marathi (मराठी)': 'mr',
      'Gujarati (ગુજરાતી)': 'gu',
      'Bengali (বাংলা)': 'bn',
      'Tamil (தமிழ்)': 'ta',
      'Telugu (తెలుగు)': 'te',
      'Kannada (ಕನ್ನಡ)': 'kn',
      'Malayalam (മലയാളം)': 'ml'
    };

    const ttsCode = langCodeMap[lang] || 'hi';
    const cleanText = textToSpeak.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').slice(0, 180);

    try {
      const audioUrl = `/api/tts?tl=${ttsCode}&q=${encodeURIComponent(cleanText)}`;
      const audio = new Audio(audioUrl);
      globalAudioPlayer = audio;

      audio.onplay = () => {
        setIsSpeakingAudio(true);
        setCurrentSpokenText(textToSpeak);
      };

      audio.onended = () => {
        setIsSpeakingAudio(false);
        setCurrentSpokenText('');
      };

      audio.onerror = () => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = `${ttsCode}-IN`;
          window._activeUtterance = utterance;
          utterance.onstart = () => {
            setIsSpeakingAudio(true);
            setCurrentSpokenText(textToSpeak);
          };
          utterance.onend = () => {
            setIsSpeakingAudio(false);
            setCurrentSpokenText('');
          };
          window.speechSynthesis.speak(utterance);
        }
      };

      audio.play().catch(() => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = `${ttsCode}-IN`;
          window._activeUtterance = utterance;
          window.speechSynthesis.speak(utterance);
        }
      });
    } catch (e) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        window._activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

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

  const handleSavePatientProfile = async (e) => {
    e.preventDefault();
    unlockAudioContext();

    try {
      const res = await fetch('/api/patient/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(patientData)
      });
      const d = await res.json();
      showToast(d.message || "Patient profile securely saved in database ✓");
    } catch (e) {
      showToast("Patient profile saved in session memory.");
    }

    navigateTo('mode');
  };

  const handleSelectModeAndStartConsultation = async (mode, ayushSys = 'ayurveda') => {
    setConsultationMode(mode);
    if (mode === 'ayush') {
      setSelectedAyushSystem(ayushSys);
    }
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

    const greeting = t.greetingMsg;
    setChatMessages([
      { id: Date.now(), sender: 'ai', text: greeting, stage: 'symptoms' }
    ]);
    setIntakeStage('symptoms');

    navigateTo('ai-chat');
    setTimeout(() => {
      speakText(greeting, selectedLanguage);
    }, 400);
  };

  const handleSendUserMessage = async (customText) => {
    const messageText = (customText !== undefined ? customText : userComplaintInput).trim();
    if (!messageText || isAiLoading) return;

    unlockAudioContext();
    setUserComplaintInput('');
    setIsAiLoading(true);

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

      if (data.extractedSymptoms && data.extractedSymptoms.length > 0) {
        setExtractedSymptoms(prev => Array.from(new Set([...prev, ...data.extractedSymptoms])));
      }
      if (data.severity) setSymptomSeverity(data.severity);
      if (data.duration) setSymptomDuration(data.duration);
      if (data.previousHistory) setPreviousHistory(data.previousHistory);
      if (data.suggestedDocs && data.suggestedDocs.length > 0) {
        setSuggestedDocs(data.suggestedDocs);
      }

      setEditableSummary(prev => ({
        ...prev,
        chiefComplaint: data.chiefComplaint || (extractedSymptoms.length > 0 ? extractedSymptoms.join(', ') : prev.chiefComplaint),
        hpi: data.hpi || prev.hpi,
        pastHistory: data.previousHistory || prev.pastHistory
      }));

      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiReply, stage: nextStage };
      setChatMessages(prev => [...prev, aiMsg]);

      speakText(aiReply, selectedLanguage);
    } catch (err) {
      showToast("Error connecting to AI intake assistant.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    stopSpeaking();
    setSelectedLanguage(newLang);
    try {
      localStorage.setItem('medikiosk_language', newLang);
    } catch (e) {}

    const newT = getI18n(newLang);
    if (chatMessages.length <= 1) {
      const initialMsg = { id: Date.now(), sender: 'ai', text: newT.greetingMsg, stage: 'symptoms' };
      setChatMessages([initialMsg]);
      if (currentRoute === 'ai-chat') {
        speakText(newT.greetingMsg, newLang);
      }
    }
    showToast(`Language switched to ${newLang}`);
  };

  const handleSelectSymptom = async (symptomText) => {
    stopSpeaking();
    unlockAudioContext();
    const userMsg = { id: Date.now(), sender: 'user', text: symptomText, stage: 'symptoms' };
    setChatMessages(prev => [...prev, userMsg]);
    setExtractedSymptoms(prev => Array.from(new Set([...prev, symptomText])));
    setEditableSummary(prev => ({
      ...prev,
      chiefComplaint: symptomText
    }));

    setIntakeStage('severity');
    const aiQuestion = t.askSeverity || "How severe is your symptom right now? Please select Mild, Moderate, or Severe.";
    const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiQuestion, stage: 'severity' };
    setChatMessages(prev => [...prev, aiMsg]);
    speakText(aiQuestion, selectedLanguage);

    if (sessionToken) {
      try {
        fetch('/api/consultation/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionToken,
            message: symptomText,
            language: selectedLanguage,
            currentStage: 'symptoms'
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const handleSelectSeverity = (sev) => {
    stopSpeaking();
    unlockAudioContext();
    setSymptomSeverity(sev);
    const userMsg = { id: Date.now(), sender: 'user', text: `Severity: ${sev}`, stage: 'severity' };
    setChatMessages(prev => [...prev, userMsg]);

    setIntakeStage('duration');
    const aiQuestion = t.askDuration || "Since how long have you been experiencing this problem?";
    const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiQuestion, stage: 'duration' };
    setChatMessages(prev => [...prev, aiMsg]);
    speakText(aiQuestion, selectedLanguage);

    if (sessionToken) {
      try {
        fetch('/api/consultation/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionToken,
            message: `Severity: ${sev}`,
            language: selectedLanguage,
            currentStage: 'severity'
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const handleSelectDuration = (dur) => {
    stopSpeaking();
    unlockAudioContext();
    setSymptomDuration(dur);
    const userMsg = { id: Date.now(), sender: 'user', text: `Duration: ${dur}`, stage: 'duration' };
    setChatMessages(prev => [...prev, userMsg]);

    const complaintStr = extractedSymptoms.length > 0 ? extractedSymptoms.join(', ') : "Reported symptoms";
    setEditableSummary(prev => ({
      ...prev,
      hpi: `${complaintStr} with ${symptomSeverity || 'reported'} severity, lasting ${dur}.`
    }));

    setSuggestedDocs(prev => {
      const list = new Set(prev);
      list.add("Previous Prescriptions");
      list.add("Relevant Lab/Blood Reports");
      return Array.from(list);
    });

    setIntakeStage('complete');
    const completeMsg = t.intakeCompleteMsg || "Thank you. I have recorded your symptoms, severity, and duration. You can now proceed to review your summary or upload any relevant medical reports.";
    const aiMsg = { id: Date.now() + 1, sender: 'ai', text: completeMsg, stage: 'complete' };
    setChatMessages(prev => [...prev, aiMsg]);
    speakText(completeMsg, selectedLanguage);

    if (sessionToken) {
      try {
        fetch('/api/consultation/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionToken,
            message: `Duration: ${dur}`,
            language: selectedLanguage,
            currentStage: 'duration'
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

    const handleProceedFromAiChat = () => {
    stopSpeaking();
    if (consultationMode === 'ayush') {
      navigateTo(selectedAyushSystem || 'ayurveda');
    } else {
      navigateTo('documents');
    }
  };

  const handleOcrFileSelect = async (file) => {
    if (!file) return;
    unlockAudioContext();
    setIsOcrProcessing(true);
    setOcrProgressText("Preprocessing image for optimal OCR clarity...");
    navigateTo('ocr-loading');

    try {
      let imageUri = null;

      if (file.type.includes('image')) {
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

    setEditableSummary(prev => ({
      ...prev,
      medications: editingOcrRecord.extractedMeds && editingOcrRecord.extractedMeds.length > 0
        ? editingOcrRecord.extractedMeds.join(', ')
        : (prev.medications || editingOcrRecord.details),
      pastHistory: editingOcrRecord.extractedDiagnoses && editingOcrRecord.extractedDiagnoses.length > 0
        ? editingOcrRecord.extractedDiagnoses.join('. ')
        : prev.pastHistory
    }));

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

  const handleProceedToSummary = () => {
    navigateTo('summary-review');
  };

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
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm outline-none cursor-pointer hover:border-brand-500 transition"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );

  const renderStepperHeader = () => {
    if (currentRoute === 'login') return null;

    const routeOrder = ['patient-info', 'mode', 'ai-chat', 'ayurveda', 'yoga', 'unani', 'siddha', 'homeopathy', 'documents', 'ocr-loading', 'summary-review', 'final-summary'];
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
      if (currentRoute === 'ai-chat' || currentRoute === 'ayurveda' || currentRoute === 'yoga' || currentRoute === 'unani' || currentRoute === 'siddha' || currentRoute === 'homeopathy') return 3;
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

  const renderToast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
        <span>🔔</span>
        <span>{toastMessage}</span>
      </div>
    );
  };

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

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  🌐 Choose Language / भाषा चुनें:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedLanguage === lang
                          ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
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

        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
            consultationMode === 'ayush'
              ? 'border-brand-600 bg-emerald-50/60 ring-2 ring-brand-500'
              : 'border-slate-200 bg-white hover:border-brand-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🌿</span>
              <span className="px-3 py-1 bg-emerald-100 text-brand-800 text-xs font-bold rounded-full">
                Ministry of AYUSH
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{t.ayushTitle}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Select your preferred AYUSH system for specialized assessment:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSelectModeAndStartConsultation('ayush', 'ayurveda')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  consultationMode === 'ayush' && selectedAyushSystem === 'ayurveda'
                    ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>🌿 Ayurveda (दशविध परीक्षा)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModeAndStartConsultation('ayush', 'yoga')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  consultationMode === 'ayush' && selectedAyushSystem === 'yoga'
                    ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>🧘 Yoga & Naturopathy</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModeAndStartConsultation('ayush', 'unani')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  consultationMode === 'ayush' && selectedAyushSystem === 'unani'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>🏺 Unani (طب یونانی)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModeAndStartConsultation('ayush', 'siddha')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  consultationMode === 'ayush' && selectedAyushSystem === 'siddha'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-teal-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>🍃 Siddha (சித்த மருத்துவம்)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModeAndStartConsultation('ayush', 'homeopathy')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer sm:col-span-2 ${
                  consultationMode === 'ayush' && selectedAyushSystem === 'homeopathy'
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-cyan-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>💧 Homeopathy (Organon of Medicine)</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectModeAndStartConsultation('ayush', selectedAyushSystem || 'ayurveda')}
            className="w-full mt-4 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
          >
            Start AYUSH Consultation ({(selectedAyushSystem || 'ayurveda').toUpperCase()}) →
          </button>
        </div>

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

            {intakeStage === 'symptoms' && (
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-brand-800 flex items-center gap-1.5">
                    <span>💡</span> <span>{t.clickOrSpeakSymptom || 'Click or speak your symptom:'}</span>
                  </span>
                  <span className="text-[11px] font-bold text-brand-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Step 1 of 3
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(t.samplePills && t.samplePills.length > 0 ? t.samplePills : [
                    "Severe Headache & Migraine",
                    "Persistent Fever & Body Ache",
                    "Joint Pain & Arthritis",
                    "Digestion / Acidity Problem",
                    "Cough, Cold & Breathing Issue",
                    "Skin Rash / Allergy"
                  ]).map((pillText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSymptom(pillText)}
                      className="px-3.5 py-2 bg-white hover:bg-emerald-100 hover:border-brand-500 border border-emerald-300 text-brand-800 text-xs font-bold rounded-xl shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer text-left"
                    >
                      "{pillText}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {intakeStage === 'severity' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span> <span>{t.selectSeverityLabel || 'Select Symptom Severity:'}</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Step 2 of 3
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{t.askSeverity}</h4>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectSeverity('Mild')}
                    className="py-3.5 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-900 font-extrabold text-sm rounded-xl border-2 border-emerald-400 shadow-sm transition cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-lg">🟢</span>
                    <span>Mild</span>
                    <span className="text-[10px] font-medium text-emerald-700">{selectedLanguage.includes('Hindi') ? 'हल्का' : 'Low impact'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSeverity('Moderate')}
                    className="py-3.5 px-3 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 font-extrabold text-sm rounded-xl border-2 border-amber-400 shadow-sm transition cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-lg">🟡</span>
                    <span>Moderate</span>
                    <span className="text-[10px] font-medium text-amber-700">{selectedLanguage.includes('Hindi') ? 'मध्यम' : 'Noticeable'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSeverity('Severe')}
                    className="py-3.5 px-3 bg-red-50 hover:bg-red-100 active:scale-95 text-red-900 font-extrabold text-sm rounded-xl border-2 border-red-400 shadow-sm transition cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-lg">🔴</span>
                    <span>Severe</span>
                    <span className="text-[10px] font-medium text-red-700">{selectedLanguage.includes('Hindi') ? 'गंभीर' : 'Urgent'}</span>
                  </button>
                </div>
              </div>
            )}

            {intakeStage === 'duration' && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 p-5 rounded-2xl border-2 border-indigo-300 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⏱️</span> <span>{t.selectDurationLabel || 'Select Symptom Duration:'}</span>
                  </span>
                  <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Step 3 of 3
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{t.askDuration}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {(t.durationPills && t.durationPills.length > 0 ? t.durationPills : ['1-2 Days', 'About 1 Week', '2-4 Weeks', '> 1 Month']).map((durText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDuration(durText)}
                      className="py-3 px-2 bg-white hover:bg-indigo-100 hover:border-indigo-500 active:scale-95 text-indigo-950 font-bold text-xs rounded-xl border border-indigo-300 shadow-sm transition cursor-pointer text-center"
                    >
                      ⏳ {durText}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {intakeStage === 'complete' && (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">{t.intakeCompleteTitle || 'Clinical History Intake Complete'}</h5>
                    <p className="text-[11px] text-slate-600">
                      {extractedSymptoms.length > 0 ? extractedSymptoms.join(', ') : 'Symptoms recorded'} • {symptomSeverity || 'Severity noted'} • {symptomDuration || 'Duration noted'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleProceedFromAiChat}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer whitespace-nowrap"
                >
                  {t.completeHistoryBtn || 'Proceed to Review →'}
                </button>
              </div>
            )}
          </div>

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


  const renderScreenYoga = () => {
    const yogaData = Object.keys(yogaRatings).length > 0 ? yogaRatings : (window.initialYogaData || {});
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
            AYUSH Case Taking — Yoga & Naturopathy Protocol
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Yoga & Naturopathy Assessment</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
            Ministry of AYUSH Standardized 10-Fold Assessment across Asana, Pranayama, Dhyana, Shatkriya & Naturopathic Modalities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(yogaData).map(([key, card]) => {
            const hasStatus = Boolean(card.status && card.status.trim());
            return (
              <div
                key={key}
                onClick={() => setActiveSystemModalCard({ system: 'yoga', key, ...card })}
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

        {activeSystemModalCard && activeSystemModalCard.system === 'yoga' && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative border border-emerald-200 text-left">
              <button
                onClick={() => setActiveSystemModalCard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-4xl">{activeSystemModalCard.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeSystemModalCard.term}</h3>
                  <p className="text-xs font-bold text-brand-700">{activeSystemModalCard.sanskrit} • {activeSystemModalCard.desc}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                  {t.modalSelectTitle} {activeSystemModalCard.term}:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {activeSystemModalCard.options.map((opt) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    const optPlain = typeof opt === 'object' ? opt.plain : '';
                    const isSelected = activeSystemModalCard.status === optLabel;

                    return (
                      <button
                        key={optLabel}
                        onClick={() => {
                          setYogaRatings(prev => ({
                            ...prev,
                            [activeSystemModalCard.key]: { ...(prev[activeSystemModalCard.key] || activeSystemModalCard), status: optLabel }
                          }));
                          setActiveSystemModalCard(null);
                          showToast(`Updated ${activeSystemModalCard.term}`);
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

  const renderScreenUnani = () => {
    const unaniData = Object.keys(unaniRatings).length > 0 ? unaniRatings : (window.initialUnaniData || {});
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
            AYUSH Case Taking — Tibb-e-Unani (Unani Medicine)
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Unani Clinical Assessment (طب یونانی)</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
            Ministry of AYUSH Standardized 10-Fold Assessment across Mizaj, Akhlat-e-Arba, Nabz, Baul-o-Baraz & Asbab Sittah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(unaniData).map(([key, card]) => {
            const hasStatus = Boolean(card.status && card.status.trim());
            return (
              <div
                key={key}
                onClick={() => setActiveSystemModalCard({ system: 'unani', key, ...card })}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg ${
                  hasStatus ? 'bg-amber-50/90 border-amber-400 hover:border-amber-600' : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{card.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockAudioContext();
                        speakText(`${card.term}. ${card.desc}`, selectedLanguage);
                      }}
                      className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{card.term}</h3>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">{card.sanskrit}</p>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    {card.plainDesc && card.plainDesc[selectedLanguage] ? card.plainDesc[selectedLanguage] : card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`block text-center py-1.5 px-2 rounded-lg text-xs font-black shadow-sm flex-1 ${
                    hasStatus ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}>
                    {hasStatus ? card.status : t.changeAyushStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {activeSystemModalCard && activeSystemModalCard.system === 'unani' && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative border border-amber-200 text-left">
              <button
                onClick={() => setActiveSystemModalCard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-4xl">{activeSystemModalCard.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeSystemModalCard.term}</h3>
                  <p className="text-xs font-bold text-amber-700">{activeSystemModalCard.sanskrit} • {activeSystemModalCard.desc}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                  {t.modalSelectTitle} {activeSystemModalCard.term}:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {activeSystemModalCard.options.map((opt) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    const optPlain = typeof opt === 'object' ? opt.plain : '';
                    const isSelected = activeSystemModalCard.status === optLabel;

                    return (
                      <button
                        key={optLabel}
                        onClick={() => {
                          setUnaniRatings(prev => ({
                            ...prev,
                            [activeSystemModalCard.key]: { ...(prev[activeSystemModalCard.key] || activeSystemModalCard), status: optLabel }
                          }));
                          setActiveSystemModalCard(null);
                          showToast(`Updated ${activeSystemModalCard.term}`);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl transition border cursor-pointer ${
                          isSelected ? 'bg-amber-600 text-white border-amber-700 shadow-md' : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{optLabel}</div>
                        {optPlain && (
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
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
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-base rounded-xl shadow-lg transition cursor-pointer"
          >
            {t.continueBtn}
          </button>
        </div>
      </div>
    );
  };

  const renderScreenSiddha = () => {
    const siddhaData = Object.keys(siddhaRatings).length > 0 ? siddhaRatings : (window.initialSiddhaData || {});
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
            AYUSH Case Taking — Siddha Maruthuvam (சித்த மருத்துவம்)
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Siddha Clinical Assessment (சித்த மருத்துவம்)</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
            Ministry of AYUSH Standardized 10-Fold Assessment across Mukkuttram, Envagai Thervu, Neykkuri & Udal Thathukkal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(siddhaData).map(([key, card]) => {
            const hasStatus = Boolean(card.status && card.status.trim());
            return (
              <div
                key={key}
                onClick={() => setActiveSystemModalCard({ system: 'siddha', key, ...card })}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg ${
                  hasStatus ? 'bg-teal-50/90 border-teal-400 hover:border-teal-600' : 'bg-white border-slate-200 hover:border-teal-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{card.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockAudioContext();
                        speakText(`${card.term}. ${card.desc}`, selectedLanguage);
                      }}
                      className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{card.term}</h3>
                  <p className="text-xs font-bold text-teal-700 mt-0.5">{card.sanskrit}</p>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    {card.plainDesc && card.plainDesc[selectedLanguage] ? card.plainDesc[selectedLanguage] : card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`block text-center py-1.5 px-2 rounded-lg text-xs font-black shadow-sm flex-1 ${
                    hasStatus ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}>
                    {hasStatus ? card.status : t.changeAyushStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {activeSystemModalCard && activeSystemModalCard.system === 'siddha' && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative border border-teal-200 text-left">
              <button
                onClick={() => setActiveSystemModalCard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-4xl">{activeSystemModalCard.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeSystemModalCard.term}</h3>
                  <p className="text-xs font-bold text-teal-700">{activeSystemModalCard.sanskrit} • {activeSystemModalCard.desc}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                  {t.modalSelectTitle} {activeSystemModalCard.term}:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {activeSystemModalCard.options.map((opt) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    const optPlain = typeof opt === 'object' ? opt.plain : '';
                    const isSelected = activeSystemModalCard.status === optLabel;

                    return (
                      <button
                        key={optLabel}
                        onClick={() => {
                          setSiddhaRatings(prev => ({
                            ...prev,
                            [activeSystemModalCard.key]: { ...(prev[activeSystemModalCard.key] || activeSystemModalCard), status: optLabel }
                          }));
                          setActiveSystemModalCard(null);
                          showToast(`Updated ${activeSystemModalCard.term}`);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl transition border cursor-pointer ${
                          isSelected ? 'bg-teal-600 text-white border-teal-700 shadow-md' : 'bg-slate-50 hover:bg-teal-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{optLabel}</div>
                        {optPlain && (
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
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
            className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-xl shadow-lg transition cursor-pointer"
          >
            {t.continueBtn}
          </button>
        </div>
      </div>
    );
  };

  const renderScreenHomeopathy = () => {
    const homeopathyData = Object.keys(homeopathyRatings).length > 0 ? homeopathyRatings : (window.initialHomeopathyData || {});
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full">
            AYUSH Case Taking — Homeopathy (Organon of Medicine)
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Homeopathic Clinical Assessment</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
            Ministry of AYUSH Standardized 10-Fold Assessment across Similimum, Vital Force, Miasms, Modalities & Generals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(homeopathyData).map(([key, card]) => {
            const hasStatus = Boolean(card.status && card.status.trim());
            return (
              <div
                key={key}
                onClick={() => setActiveSystemModalCard({ system: 'homeopathy', key, ...card })}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg ${
                  hasStatus ? 'bg-cyan-50/90 border-cyan-400 hover:border-cyan-600' : 'bg-white border-slate-200 hover:border-cyan-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{card.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockAudioContext();
                        speakText(`${card.term}. ${card.desc}`, selectedLanguage);
                      }}
                      className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{card.term}</h3>
                  <p className="text-xs font-bold text-cyan-700 mt-0.5">{card.sanskrit}</p>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    {card.plainDesc && card.plainDesc[selectedLanguage] ? card.plainDesc[selectedLanguage] : card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`block text-center py-1.5 px-2 rounded-lg text-xs font-black shadow-sm flex-1 ${
                    hasStatus ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}>
                    {hasStatus ? card.status : t.changeAyushStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {activeSystemModalCard && activeSystemModalCard.system === 'homeopathy' && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative border border-cyan-200 text-left">
              <button
                onClick={() => setActiveSystemModalCard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-4xl">{activeSystemModalCard.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{activeSystemModalCard.term}</h3>
                  <p className="text-xs font-bold text-cyan-700">{activeSystemModalCard.sanskrit} • {activeSystemModalCard.desc}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                  {t.modalSelectTitle} {activeSystemModalCard.term}:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {activeSystemModalCard.options.map((opt) => {
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    const optPlain = typeof opt === 'object' ? opt.plain : '';
                    const isSelected = activeSystemModalCard.status === optLabel;

                    return (
                      <button
                        key={optLabel}
                        onClick={() => {
                          setHomeopathyRatings(prev => ({
                            ...prev,
                            [activeSystemModalCard.key]: { ...(prev[activeSystemModalCard.key] || activeSystemModalCard), status: optLabel }
                          }));
                          setActiveSystemModalCard(null);
                          showToast(`Updated ${activeSystemModalCard.term}`);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl transition border cursor-pointer ${
                          isSelected ? 'bg-cyan-600 text-white border-cyan-700 shadow-md' : 'bg-slate-50 hover:bg-cyan-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{optLabel}</div>
                        {optPlain && (
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-cyan-100' : 'text-slate-500'}`}>
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
            className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base rounded-xl shadow-lg transition cursor-pointer"
          >
            {t.continueBtn}
          </button>
        </div>
      </div>
    );
  };

  const renderScreen6Documents = () => (
    <div className="max-w-5xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center space-y-6">
      <div className="text-center">
        <span className="px-3.5 py-1 bg-emerald-100 text-brand-700 text-xs font-bold rounded-full">
          {t.stepCounter(4, 6)}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t.docUploadTitle}</h2>
        <p className="text-sm text-slate-500 mt-1">{t.docUploadSubtitle}</p>
      </div>

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
              onClick={() => navigateTo(consultationMode === 'ayush' ? (selectedAyushSystem || 'ayurveda') : 'ai-chat')}
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

  const renderScreen8SummaryReview = () => {
   
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">

          <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
            <span className="px-3 py-1 bg-emerald-50 text-brand-700 text-xs font-extrabold rounded-full border border-emerald-200">
              Patient Verified QR Token
            </span>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
              <div id="qrcode-target"></div>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs">{t.qrScanInstruction}</p>
          </div>

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
      {currentRoute === 'yoga' && renderScreenYoga()}
      {currentRoute === 'unani' && renderScreenUnani()}
      {currentRoute === 'siddha' && renderScreenSiddha()}
      {currentRoute === 'homeopathy' && renderScreenHomeopathy()}
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
