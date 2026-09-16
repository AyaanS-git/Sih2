// ============================================================================
// MediKiosk — Yoga & Naturopathy (Ministry of AYUSH Standardized System)
// Complete 10-Fold Assessment for Yogic & Naturopathic Clinical Evaluation
// ============================================================================

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

window.initialYogaData = initialYogaData;
