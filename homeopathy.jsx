
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

window.initialHomeopathyData = initialHomeopathyData;
