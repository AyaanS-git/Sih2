// ============================================================================
// MediKiosk — Siddha Medicine (Siddha Maruthuvam / Ministry of AYUSH Standardized)
// Complete 10-Fold Assessment for Siddha Clinical Evaluation & Diagnostic System
// ============================================================================

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

window.initialSiddhaData = initialSiddhaData;
