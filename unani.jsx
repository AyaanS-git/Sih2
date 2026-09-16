// ============================================================================
// MediKiosk — Unani Medicine (Tibb-e-Unani / Ministry of AYUSH Standardized)
// Complete 10-Fold Assessment for Unani Clinical Evaluation & Diagnosis
// ============================================================================

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
  Su-e-Mizaj: {
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

window.initialUnaniData = initialUnaniData;
