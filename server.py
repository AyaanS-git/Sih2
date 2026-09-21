import os
import secrets
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import bcrypt
import urllib.request
import urllib.parse

load_dotenv()

from db import SessionLocal, encrypt_field, decrypt_field, Base, engine
import models
from models import User, PatientProfile, ConsultationSession, ChatMessage, UploadedDocument, ClinicalSummary
import gemini_service

# Create all tables on launch
Base.metadata.create_all(bind=engine)

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

PORT = int(os.getenv('PORT', 8000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Helper to get current user from token in Authorization header
def get_user_from_request(db):
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header[7:].strip()
    elif 'X-Session-Token' in request.headers:
        token = request.headers.get('X-Session-Token').strip()

    if not token:
        return None

    # Check if token is user session or consultation session
    # For user auth, we store session tokens or match user id
    if token.startswith('usr_'):
        user_id = token.replace('usr_', '')
        try:
            return db.query(User).filter(User.id == int(user_id)).first()
        except Exception:
            return None
    return None

# -------------------------------------------------------------
# Static and Page Routes
# -------------------------------------------------------------
@app.route('/')
def serve_index():
    return send_from_directory(DIRECTORY, 'index.html')

# -------------------------------------------------------------
# Standalone Patient-Specific Verified Summary View (QR Target)
# -------------------------------------------------------------
@app.route('/summary/<token>')
def view_verified_summary(token):
    db = SessionLocal()
    try:
        summary = db.query(ClinicalSummary).filter(ClinicalSummary.summary_token == token).first()
        if not summary:
            return """
            <!DOCTYPE html>
            <html>
            <head><title>Summary Not Found — MediKiosk</title><script src="https://cdn.tailwindcss.com"></script></head>
            <body class="bg-slate-50 flex items-center justify-center min-h-screen p-4 text-center">
                <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-slate-200">
                    <span class="text-4xl">⚠️</span>
                    <h2 class="text-xl font-bold text-slate-800 mt-3">Summary Not Found</h2>
                    <p class="text-xs text-slate-500 mt-2">The clinical summary link is invalid or has expired.</p>
                </div>
            </body>
            </html>
            """, 404

        data = summary.to_dict()
        ayush_data = {}
        if data.get('ayushRatings'):
            try:
                import json
                ayush_data = json.loads(data['ayushRatings'])
            except Exception:
                ayush_data = {}

        html_template = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verified Clinical Summary — {{ data.patientName or 'Patient' }}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .print-card { box-shadow: none !important; border: 1px solid #CBD5E1 !important; }
                }
            </style>
        </head>
        <body class="bg-slate-100 text-slate-800 p-4 sm:p-8 min-h-screen flex flex-col items-center">
            <div class="max-w-3xl w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-300 print-card space-y-6">
                <div class="flex items-center justify-between border-b border-emerald-100 pb-4">
                    <div class="flex items-center gap-3">
                        <img src="/logo.png" alt="MediKiosk" class="w-12 h-12 rounded-full border-2 border-emerald-500 p-0.5" onerror="this.src='/logo_original.png';">
                        <div>
                            <h1 class="text-xl font-black text-emerald-900 tracking-tight">MediKiosk Verified Summary</h1>
                            <p class="text-[11px] text-slate-500">Government of India ABDM / NDHM Health Record Standard</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">Official Verified ✓</span>
                        <p class="text-[10px] text-slate-400 mt-1">Token: {{ data.opdNumber or token[:10] }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <p><strong>Patient Name:</strong> {{ data.patientName or 'Not Specified' }}</p>
                    <p><strong>Age / Gender:</strong> {{ data.patientAge or '—' }}y, {{ data.patientGender or '—' }}</p>
                    <p><strong>Mobile:</strong> {{ '+91 ' + data.patientMobile if data.patientMobile else '—' }}</p>
                    <p><strong>ABHA ID:</strong> {{ data.patientAbha or 'N/A' }}</p>
                    <p><strong>Consultation Mode:</strong> {{ 'AYUSH / Ayurveda' if data.consultationMode == 'ayush' else 'General Clinical' }}</p>
                    <p><strong>Hospital System Status:</strong> <span class="{{ 'text-emerald-700 font-bold' if data.isSentToHis else 'text-slate-500' }}">{{ 'Transmitted to HIS ✓' if data.isSentToHis else 'Pending Reception Check-in' }}</span></p>
                </div>

                <div class="space-y-3 text-xs leading-relaxed">
                    <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <h3 class="font-bold text-emerald-900 uppercase tracking-wider text-[11px] mb-1">Chief Complaint</h3>
                        <p class="font-semibold text-slate-800">{{ data.chiefComplaint or 'None reported' }}</p>
                    </div>

                    <div>
                        <h3 class="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">History of Present Illness (HPI)</h3>
                        <p class="text-slate-700">{{ data.hpi or 'None documented' }}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 class="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Past Medical History</h3>
                            <p class="text-slate-700">{{ data.pastHistory or 'None reported' }}</p>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Current Medications (OCR)</h3>
                            <p class="text-slate-700">{{ data.medications or 'No active prescriptions' }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 class="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Known Allergies</h3>
                            <p class="text-slate-700">{{ data.allergies or 'No known drug allergies (NKDA)' }}</p>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Lifestyle & Routine</h3>
                            <p class="text-slate-700">{{ data.lifestyle or 'Standard' }}</p>
                        </div>
                    </div>

                    {% if data.clinicianNotes %}
                    <div class="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                        <h3 class="font-bold text-blue-900 uppercase tracking-wider text-[11px] mb-1">Clinician Directives & Notes</h3>
                        <p class="text-slate-800">{{ data.clinicianNotes }}</p>
                    </div>
                    {% endif %}

                    {% if ayush_data %}
                    <div class="pt-3 border-t border-emerald-200">
                        <h3 class="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                            <span>🌿</span> <span>Ayurvedic Assessment (Dashavidha Pariksha)</span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {% for k, v in ayush_data.items() %}
                            <div class="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between">
                                <span><strong>{{ v.term or k }}:</strong></span>
                                <span class="font-bold text-emerald-800">{{ v.status }}</span>
                            </div>
                            {% endfor %}
                        </div>
                    </div>
                    {% endif %}
                </div>

                <div class="pt-4 border-t border-slate-200 flex items-center justify-between no-print">
                    <button onclick="window.print()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition">
                        🖨️ Print Clinical Record
                    </button>
                    <a href="/" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
                        MediKiosk Home →
                    </a>
                </div>
            </div>
        </body>
        </html>
        """
        return render_template_string(html_template, data=data, ayush_data=ayush_data, token=token)
    finally:
        db.close()

# -------------------------------------------------------------
# Authentication Routes (Simple Email + Password, No OTP)
# -------------------------------------------------------------
@app.route('/api/auth/register', methods=['POST'])
def auth_register():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    confirm_password = data.get('confirmPassword', '').strip()

    if not email or '@' not in email:
        return jsonify({'error': 'Please provide a valid email address.'}), 400
    if not password or len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters.'}), 400
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match.'}), 400

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return jsonify({'error': 'An account with this email already exists. Please log in.'}), 400

        salt = bcrypt.gensalt()
        pw_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

        user = User(email=email, password_hash=pw_hash)
        db.add(user)
        db.commit()
        db.refresh(user)

        token = f"usr_{user.id}"
        return jsonify({
            'message': 'Registration successful!',
            'token': token,
            'user': {'id': user.id, 'email': user.email},
            'patientProfile': None
        })
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'error': 'Please enter both email and password.'}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return jsonify({'error': 'Invalid email or password.'}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password.'}), 401

        profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
        profile_data = profile.to_dict() if profile else None

        token = f"usr_{user.id}"
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user': {'id': user.id, 'email': user.email},
            'patientProfile': profile_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    db = SessionLocal()
    try:
        user = get_user_from_request(db)
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
        return jsonify({
            'user': {'id': user.id, 'email': user.email},
            'patientProfile': profile.to_dict() if profile else None
        })
    finally:
        db.close()

# -------------------------------------------------------------
# Patient Profile Routes (Persistent & Pre-filled)
# -------------------------------------------------------------
@app.route('/api/patient/profile', methods=['GET', 'POST'])
def patient_profile_handler():
    db = SessionLocal()
    try:
        user = get_user_from_request(db)
        if request.method == 'GET':
            if not user:
                return jsonify({'profile': None})
            profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
            return jsonify({'profile': profile.to_dict() if profile else None})

        # POST: Save / update profile
        data = request.json or {}
        user_id = user.id if user else None

        # If user is not authenticated yet, check if email or user_id provided
        if not user_id and data.get('userId'):
            user_id = int(data['userId'])

        profile = None
        if user_id:
            profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()

        if not profile and user_id:
            profile = PatientProfile(user_id=user_id)
            db.add(profile)

        if profile:
            profile.full_name_enc = encrypt_field(data.get('fullName', ''))
            profile.age = str(data.get('age', ''))
            profile.gender = data.get('gender', '')
            profile.mobile_enc = encrypt_field(data.get('mobile', ''))
            profile.opd_number = data.get('opdNumber', '')
            profile.abha_id_enc = encrypt_field(data.get('abhaId', ''))
            profile.weight_enc = encrypt_field(data.get('weight', ''))
            profile.past_illnesses_enc = encrypt_field(data.get('pastIllnesses', ''))
            profile.photo_url = data.get('photoUrl', '')
            db.commit()
            return jsonify({'message': 'Profile saved successfully!', 'profile': profile.to_dict()})

        return jsonify({'message': 'Profile received in memory (unauthenticated)'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# -------------------------------------------------------------
# Consultation Session & AI Chat Routes (Strict Gemini Engine)
# -------------------------------------------------------------
@app.route('/api/consultation/start', methods=['POST'])
def consultation_start():
    data = request.json or {}
    mode = data.get('mode', 'clinical')
    db = SessionLocal()
    try:
        user = get_user_from_request(db)
        session_token = secrets.token_hex(16)
        session = ConsultationSession(
            session_token=session_token,
            user_id=user.id if user else None,
            mode=mode,
            status='active',
            current_stage='symptoms'
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        return jsonify({
            'sessionToken': session.session_token,
            'sessionId': session.id,
            'currentStage': session.current_stage,
            'mode': session.mode
        })
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route('/api/consultation/chat', methods=['POST'])
def consultation_chat():
    data = request.json or {}
    session_token = data.get('sessionToken')
    user_input = data.get('message', '').strip()
    language = data.get('language', 'English')
    current_stage = data.get('currentStage', 'symptoms')

    if not user_input:
        return jsonify({'error': 'Message cannot be empty.'}), 400

    db = SessionLocal()
    try:
        session = None
        if session_token:
            session = db.query(ConsultationSession).filter(ConsultationSession.session_token == session_token).first()

        history = []
        if session:
            db_msgs = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.id.asc()).all()
            history = [m.to_dict() for m in db_msgs]
            if session.current_stage:
                current_stage = session.current_stage

        # Process turn with Gemini AI
        result = gemini_service.process_intake_turn(history, user_input, current_stage, language)

        next_stage = result.get('next_stage', 'complete')
        ai_reply = result.get('ai_question', '')

        # Persist messages and update stage
        if session:
            session.current_stage = next_stage
            user_msg = ChatMessage(
                session_id=session.id,
                sender='user',
                stage=current_stage,
                text_enc=encrypt_field(user_input)
            )
            ai_msg = ChatMessage(
                session_id=session.id,
                sender='ai',
                stage=next_stage,
                text_enc=encrypt_field(ai_reply)
            )
            db.add(user_msg)
            db.add(ai_msg)
            db.commit()

        return jsonify({
            'understanding': result.get('understanding', ''),
            'aiReply': ai_reply,
            'nextStage': next_stage,
            'extractedSymptoms': result.get('extracted_symptoms', []),
            'severity': result.get('severity', ''),
            'duration': result.get('duration', ''),
            'previousHistory': result.get('previous_history', ''),
            'chiefComplaint': result.get('chief_complaint', ''),
            'hpi': result.get('hpi', ''),
            'suggestedDocs': result.get('suggested_docs', []),
            'isComplete': next_stage == 'complete'
        })
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# -------------------------------------------------------------
# Documents & OCR Text Routes
# -------------------------------------------------------------
@app.route('/api/documents/save', methods=['POST'])
def save_document():
    data = request.json or {}
    session_token = data.get('sessionToken')
    db = SessionLocal()
    try:
        session = None
        if session_token:
            session = db.query(ConsultationSession).filter(ConsultationSession.session_token == session_token).first()

        doc = UploadedDocument(
            session_id=session.id if session else None,
            user_id=session.user_id if (session and session.user_id) else None,
            name=data.get('name', 'Document'),
            category=data.get('category', 'Prescriptions'),
            doctor=data.get('doctor', ''),
            facility=data.get('facility', ''),
            date_str=data.get('date', datetime.utcnow().strftime('%d/%m/%Y')),
            details_enc=encrypt_field(data.get('details', '')),
            ocr_text_enc=encrypt_field(data.get('scannedText', ''))
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return jsonify({'message': 'Document saved!', 'document': doc.to_dict()})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# -------------------------------------------------------------
# Clinical Summary & Non-Guessable QR Generation
# -------------------------------------------------------------
@app.route('/api/summary/save', methods=['POST'])
def save_clinical_summary():
    data = request.json or {}
    session_token = data.get('sessionToken')
    patient_data = data.get('patientData', {})
    editable_summary = data.get('editableSummary', {})
    doctor_notes = data.get('doctorNotes', '')
    ayush_ratings = data.get('ayushRatings', {})
    consultation_mode = data.get('consultationMode', 'clinical')

    # Filter out unselected Ayush terms entirely
    filtered_ayush = {}
    if consultation_mode == 'ayush' and isinstance(ayush_ratings, dict):
        for k, v in ayush_ratings.items():
            if isinstance(v, dict):
                st = v.get('status', '').strip()
                if st and not st.lower().startswith('unselected') and not st.lower().startswith('pending'):
                    filtered_ayush[k] = {
                        'term': v.get('term', k),
                        'sanskrit': v.get('sanskrit', ''),
                        'status': st
                    }

    import json
    ayush_json_str = json.dumps(filtered_ayush)

    # Generate unique, non-guessable, cryptographically secure token
    summary_token = secrets.token_urlsafe(20)

    db = SessionLocal()
    try:
        session = None
        if session_token:
            session = db.query(ConsultationSession).filter(ConsultationSession.session_token == session_token).first()

        user_id = session.user_id if session else None

        summary = ClinicalSummary(
            summary_token=summary_token,
            user_id=user_id,
            session_id=session.id if session else None,
            patient_name_enc=encrypt_field(patient_data.get('fullName', '')),
            patient_age=str(patient_data.get('age', '')),
            patient_gender=patient_data.get('gender', ''),
            patient_mobile_enc=encrypt_field(patient_data.get('mobile', '')),
            patient_abha_enc=encrypt_field(patient_data.get('abhaId', '')),
            opd_number=patient_data.get('opdNumber') or f"OPD-{secrets.randbelow(899999)+100000}",
            consultation_mode=consultation_mode,
            chief_complaint_enc=encrypt_field(editable_summary.get('chiefComplaint', '')),
            hpi_enc=encrypt_field(editable_summary.get('hpi', '')),
            past_history_enc=encrypt_field(editable_summary.get('pastHistory', '')),
            medications_enc=encrypt_field(editable_summary.get('medications', '')),
            allergies_enc=encrypt_field(editable_summary.get('allergies', '')),
            lifestyle_enc=encrypt_field(editable_summary.get('lifestyle', '')),
            clinician_notes_enc=encrypt_field(doctor_notes),
            ayush_ratings_json=ayush_json_str,
            is_verified=True,
            is_sent_to_his=False
        )
        db.add(summary)
        db.commit()
        db.refresh(summary)

        # Host domain for QR code
        host = request.host_url.rstrip('/')
        qr_url = f"{host}/summary/{summary_token}"

        return jsonify({
            'message': 'Summary verified and saved!',
            'summaryToken': summary_token,
            'qrUrl': qr_url,
            'opdNumber': summary.opd_number
        })
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route('/api/summary/<token>', methods=['GET'])
def get_summary_api(token):
    db = SessionLocal()
    try:
        summary = db.query(ClinicalSummary).filter(ClinicalSummary.summary_token == token).first()
        if not summary:
            return jsonify({'error': 'Summary not found'}), 404
        return jsonify({'summary': summary.to_dict()})
    finally:
        db.close()

@app.route('/api/summary/<token>/send-his', methods=['POST'])
def send_summary_to_his(token):
    db = SessionLocal()
    try:
        summary = db.query(ClinicalSummary).filter(ClinicalSummary.summary_token == token).first()
        if not summary:
            return jsonify({'error': 'Summary not found'}), 404

        summary.is_sent_to_his = True
        summary.sent_to_his_at = datetime.utcnow()
        db.commit()

        return jsonify({
            'success': True,
            'message': 'Clinical summary successfully marked as transmitted to Hospital Information System (HIS / ABDM)!'
        })
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

# -------------------------------------------------------------
# Retained Audio TTS Proxy
# -------------------------------------------------------------
@app.route('/api/tts')
def tts_proxy():
    tl = request.args.get('tl', 'hi')
    text = request.args.get('q', '')
    if not text:
        return 'Missing text parameter', 400

    try:
        encoded_q = urllib.parse.quote(text)
        google_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={tl}&client=tw-ob&q={encoded_q}"
        req = urllib.request.Request(
            google_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/'
            }
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            audio_data = response.read()
            return audio_data, 200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': str(len(audio_data)),
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=86400'
            }
    except Exception as e:
        return f"Error: {e}", 500

# Route aliases for convenience
app.add_url_rule('/api/register', 'api_register_alias', auth_register, methods=['POST'])
app.add_url_rule('/api/login', 'api_login_alias', auth_login, methods=['POST'])
app.add_url_rule('/api/save_patient', 'api_save_patient_alias', patient_profile_handler, methods=['POST', 'GET'])

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(DIRECTORY, filename)

if __name__ == '__main__':
    print(f"MediKiosk Flask Server running at http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=False)
