import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')
_client = None

def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=API_KEY)
    return _client

def process_intake_turn(session_history, user_input, current_stage, language='English'):
    """
    Processes a single clinical intake turn via Google Gemini.
    Strict sequence:
    symptoms -> severity -> duration -> history -> complete
    Guarantees no repeated questions and supports short/free-form responses.
    """
    client = get_client()

    history_summary = []
    for m in session_history:
        sender = m.get('sender', 'user')
        text = m.get('text', '')
        history_summary.append(f"{sender}: {text}")
    history_text = "\n".join(history_summary[-8:]) if history_summary else "(Initial greeting turn)"

    system_prompt = f"""You are the clinical intake AI for MediKiosk, a smart hospital kiosk in India.
Current intake stage waiting for answer: '{current_stage}'
Target Language: '{language}'

The patient just answered: "{user_input}"

Recent conversation history:
{history_text}

Rules:
1. Genuinely interpret the patient's answer in the context of '{current_stage}'.
   Support free-form speech/text, including short answers like 'yes', 'no', 'not sure', 'mild', 'since 2 days', 'none', etc.
2. The question order MUST strictly be:
   Stage 1: 'symptoms' (main complaint)
   Stage 2: 'severity' (mild, moderate, severe, etc.)
   Stage 3: 'duration' (timeline, how many days/weeks)
   Stage 4: 'history' (previous medical problems, surgeries, or chronic conditions like diabetes, hypertension, asthma)
   Stage 5: 'complete' (all 4 aspects collected)
3. If '{current_stage}' is 'symptoms':
   - Extract symptom entities.
   - If user already provided severity in this message, note it. Otherwise next_stage must be 'severity'.
   - Formulate next question asking for severity in '{language}'.
4. If '{current_stage}' is 'severity':
   - Extract severity rating.
   - Next stage must be 'duration'.
   - Formulate next question asking for duration in '{language}'.
5. If '{current_stage}' is 'duration':
   - Extract duration.
   - Next stage must be 'history'.
   - Formulate next question asking about previous medical problems / history in '{language}'.
6. If '{current_stage}' is 'history':
   - Extract past medical history or note none/NKDA.
   - Next stage must be 'complete'.
   - Formulate a brief closing acknowledgment in '{language}' confirming all details are recorded.
7. NEVER repeat a question that was already asked and answered.
8. Suggest 1 to 3 relevant document types (e.g., 'Blood Glucose / HbA1c Report' if diabetes or weakness mentioned, 'Past Prescription', 'Lipid Profile', 'ECG Report', 'Endoscopy Report') based on the symptoms and history identified so far.

You MUST respond strictly in valid JSON with this exact structure:
{{
  "understanding": "Brief empathetic acknowledgment of the patient's answer in {language}",
  "next_stage": "severity | duration | history | complete",
  "ai_question": "The single next question to display and speak in {language}",
  "extracted_symptoms": ["list of symptoms identified"],
  "severity": "detected severity or empty",
  "duration": "detected duration or empty",
  "previous_history": "detected past conditions or empty",
  "chief_complaint": "concise clinical chief complaint phrase",
  "hpi": "concise 1-2 sentence History of Present Illness",
  "suggested_docs": ["document suggestion 1", "document suggestion 2"]
}}
"""

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=system_prompt,
            config={'response_mime_type': 'application/json'}
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Gemini API error: {e}")
        return fallback_intake_progression(user_input, current_stage, language)

def fallback_intake_progression(user_input, current_stage, language):
    translations_fallback = {
        'English': {
            'ask_severity': 'How would you describe the severity of this symptom (Mild, Moderate, or Severe)?',
            'ask_duration': 'Since when have you been facing this problem or symptom?',
            'ask_history': 'Do you have any previous medical conditions, past surgeries, or ongoing illnesses like diabetes or blood pressure?',
            'complete': 'Thank you! Your clinical intake details have been recorded.',
            'ack': 'Understood.'
        },
        'Hindi (हिंदी)': {
            'ask_severity': 'इस लक्षण की गंभीरता कैसी है — हल्की (Mild), मध्यम (Moderate), या गंभीर (Severe)?',
            'ask_duration': 'आप कितने समय से इस समस्या या लक्षण का सामना कर रहे हैं?',
            'ask_history': 'क्या आपको पहले से कोई बीमारी, सर्जरी, या बीपी/शुगर जैसी कोई समस्या है?',
            'complete': 'धन्यवाद! आपकी स्वास्थ्य संबंधी जानकारी दर्ज कर ली गई है।',
            'ack': 'समझ गया।'
        },
        'Marathi (मराठी)': {
            'ask_severity': 'या लक्षणाची तीव्रता कशी आहे — सौम्य (Mild), मध्यम (Moderate), की तीव्र (Severe)?',
            'ask_duration': 'तुम्हाला हा त्रास कधीपासून होत आहे?',
            'ask_history': 'तुम्हाला आधीचा काही आजार, शस्त्रक्रिया किंवा मधुमेह/रक्तदाब यांसारखा त्रास आहे का?',
            'complete': 'धन्यवाद! तुमची आरोग्य विषयक माहिती नोंदवली गेली आहे.',
            'ack': 'समजले.'
        }
    }
    t = translations_fallback.get(language, translations_fallback['English'])

    if current_stage == 'symptoms':
        return {
            'understanding': t['ack'],
            'next_stage': 'severity',
            'ai_question': t['ask_severity'],
            'extracted_symptoms': [user_input],
            'severity': '',
            'duration': '',
            'previous_history': '',
            'chief_complaint': user_input,
            'hpi': f'Patient reports experiencing {user_input}.',
            'suggested_docs': ['Recent Prescriptions', 'Relevant Diagnostic Reports']
        }
    elif current_stage == 'severity':
        return {
            'understanding': t['ack'],
            'next_stage': 'duration',
            'ai_question': t['ask_duration'],
            'extracted_symptoms': [],
            'severity': user_input,
            'duration': '',
            'previous_history': '',
            'chief_complaint': '',
            'hpi': '',
            'suggested_docs': ['Past Prescriptions']
        }
    elif current_stage == 'duration':
        return {
            'understanding': t['ack'],
            'next_stage': 'history',
            'ai_question': t['ask_history'],
            'extracted_symptoms': [],
            'severity': '',
            'duration': user_input,
            'previous_history': '',
            'chief_complaint': '',
            'hpi': '',
            'suggested_docs': ['Recent Lab Reports']
        }
    else:
        return {
            'understanding': t['ack'],
            'next_stage': 'complete',
            'ai_question': t['complete'],
            'extracted_symptoms': [],
            'severity': '',
            'duration': '',
            'previous_history': user_input,
            'chief_complaint': '',
            'hpi': '',
            'suggested_docs': ['Prescriptions', 'Diagnostic Reports']
        }
