import os
import sys
import json
import secrets
from server import app
from db import SessionLocal
from models import User, ClinicalSummary, PatientProfile

client = app.test_client()

def test_full_pipeline():
    print("--- 1. Testing Registration ---")
    test_email = f"test_patient_{secrets.token_hex(4)}@example.com"
    test_password = "SecurePassword123!"

    reg_res = client.post('/api/auth/register', json={
        'email': test_email,
        'password': test_password,
        'confirmPassword': test_password
    })
    print("Register status:", reg_res.status_code, reg_res.json.get('message'))
    assert reg_res.status_code == 200
    token = reg_res.json['token']

    db = SessionLocal()
    user = db.query(User).filter(User.email == test_email).first()
    assert user is not None
    assert user.password_hash != test_password
    assert user.password_hash.startswith('$2b$') or user.password_hash.startswith('$2a$')
    print("[OK] Password is securely hashed with bcrypt (never plaintext)")
    db.close()

    print("\n--- 2. Testing Login ---")
    login_res = client.post('/api/auth/login', json={
        'email': test_email,
        'password': test_password
    })
    print("Login status:", login_res.status_code, login_res.json.get('message'))
    assert login_res.status_code == 200

    print("\n--- 3. Testing Patient Profile (with weight & past illnesses) ---")
    prof_res = client.post('/api/patient/profile', 
        headers={'Authorization': f'Bearer {token}'},
        json={
            'fullName': 'Test Patient Name',
            'age': '34',
            'gender': 'Female',
            'weight': '62',
            'pastIllnesses': 'Type 2 Diabetes since 2020',
            'mobile': '9876543210',
            'opdNumber': 'OPD-889900',
            'abhaId': '12-3456-7890-1234'
        }
    )
    print("Save Profile status:", prof_res.status_code)
    assert prof_res.status_code == 200

    db = SessionLocal()
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    assert profile.full_name_enc != 'Test Patient Name'
    assert profile.weight_enc != '62'
    assert profile.to_dict()['fullName'] == 'Test Patient Name'
    assert profile.to_dict()['weight'] == '62'
    print("[OK] Sensitive patient data is encrypted at rest and decrypted on authenticated fetch")
    db.close()

    print("\n--- 4. Testing Consultation Start ---")
    start_res = client.post('/api/consultation/start',
        headers={'Authorization': f'Bearer {token}'},
        json={'mode': 'ayush'}
    )
    print("Start consultation status:", start_res.status_code)
    assert start_res.status_code == 200
    session_token = start_res.json['sessionToken']

    print("\n--- 5. Testing Real Gemini Clinical Intake Turn ---")
    chat_res = client.post('/api/consultation/chat', json={
        'sessionToken': session_token,
        'message': 'I have severe burning acidity and gas in my stomach',
        'language': 'English',
        'currentStage': 'symptoms'
    })
    print("Chat turn 1 status:", chat_res.status_code)
    chat_data = chat_res.json
    print("AI Question:", chat_data.get('aiReply'))
    print("Next Stage:", chat_data.get('nextStage'))
    print("Extracted Symptoms:", chat_data.get('extractedSymptoms'))
    print("Suggested Docs:", chat_data.get('suggestedDocs'))
    assert chat_res.status_code == 200
    assert chat_data.get('nextStage') in ['severity', 'duration', 'history', 'complete']

    print("\n--- 6. Testing Document Save with OCR Text ---")
    doc_res = client.post('/api/documents/save', json={
        'sessionToken': session_token,
        'name': 'Prescription_Test.jpg',
        'category': 'Prescriptions',
        'doctor': 'Dr. K. Nair',
        'facility': 'City Hospital',
        'date': '15/09/2026',
        'details': 'Tab Pantoprazole 40mg OD',
        'scannedText': 'Dr. K. Nair, City Hospital. Tab Pantoprazole 40mg OD for 14 days.'
    })
    print("Save Document status:", doc_res.status_code)
    assert doc_res.status_code == 200

    print("\n--- 7. Testing Clinical Summary Finalization & Non-Guessable QR Token ---")
    sum_res = client.post('/api/summary/save', json={
        'sessionToken': session_token,
        'patientData': {
            'fullName': 'Test Patient Name',
            'age': '34',
            'gender': 'Female',
            'weight': '62',
            'pastIllnesses': 'Type 2 Diabetes since 2020',
            'mobile': '9876543210',
            'opdNumber': 'OPD-889900',
            'abhaId': '12-3456-7890-1234'
        },
        'editableSummary': {
            'chiefComplaint': 'Severe acidity and stomach burning',
            'hpi': 'Patient reports 3-day history of acute epigastric burning.',
            'pastHistory': 'Type 2 Diabetes',
            'medications': 'Tab Pantoprazole 40mg OD',
            'allergies': 'NKDA',
            'lifestyle': 'Standard'
        },
        'doctorNotes': 'Advised bland diet and regular antacid dosing.',
        'ayushRatings': {
            'Prakriti': {'term': 'Body Constitution', 'sanskrit': 'प्रकृति', 'status': 'Pitta Dominant'},
            'Sara': {'term': 'Tissue Quality', 'sanskrit': 'सार', 'status': 'Unselected'}
        },
        'consultationMode': 'ayush'
    })
    print("Save Summary status:", sum_res.status_code)
    assert sum_res.status_code == 200
    summary_token = sum_res.json['summaryToken']
    qr_url = sum_res.json['qrUrl']
    print("Generated Non-Guessable Token:", summary_token)
    print("Generated QR URL:", qr_url)
    assert len(summary_token) >= 16

    db = SessionLocal()
    saved_sum = db.query(ClinicalSummary).filter(ClinicalSummary.summary_token == summary_token).first()
    ayush_dict = json.loads(saved_sum.ayush_ratings_json)
    assert 'Prakriti' in ayush_dict
    assert 'Sara' not in ayush_dict
    print("[OK] Unselected Ayurvedic parameters are strictly excluded from the finalized summary")
    db.close()

    print("\n--- 8. Testing Standalone Verified Summary QR Route ---")
    qr_view_res = client.get(f'/summary/{summary_token}')
    print("QR View status:", qr_view_res.status_code)
    assert qr_view_res.status_code == 200
    assert b"MediKiosk Verified Summary" in qr_view_res.data
    assert b"Test Patient Name" in qr_view_res.data
    assert b"Pitta Dominant" in qr_view_res.data
    print("[OK] Standalone QR page successfully loads verified patient record")

    print("\n--- 9. Testing Send to Hospital System (HIS) ---")
    his_res = client.post(f'/api/summary/{summary_token}/send-his')
    print("Send to HIS status:", his_res.status_code, his_res.json)
    assert his_res.status_code == 200
    assert his_res.json['success'] is True

    db = SessionLocal()
    updated_sum = db.query(ClinicalSummary).filter(ClinicalSummary.summary_token == summary_token).first()
    assert updated_sum.is_sent_to_his is True
    assert updated_sum.sent_to_his_at is not None
    print("[OK] Summary successfully marked as sent to HIS with timestamp")
    db.close()

    print("\n==========================================")
    print("ALL BACKEND & DATABASE TESTS PASSED 100%!")
    print("==========================================")

if __name__ == '__main__':
    test_full_pipeline()
