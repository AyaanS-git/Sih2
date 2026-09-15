from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db import Base, encrypt_field, decrypt_field

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship('PatientProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    sessions = relationship('ConsultationSession', back_populates='user', cascade='all, delete-orphan')

class PatientProfile(Base):
    __tablename__ = 'patient_profiles'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    full_name_enc = Column(Text, default='')
    age = Column(String(10), default='')
    gender = Column(String(20), default='')
    mobile_enc = Column(Text, default='')
    opd_number = Column(String(50), default='')
    abha_id_enc = Column(Text, default='')
    weight_enc = Column(Text, default='')
    past_illnesses_enc = Column(Text, default='')
    photo_url = Column(Text, default='')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='profile')

    def to_dict(self):
        return {
            'fullName': decrypt_field(self.full_name_enc),
            'age': self.age or '',
            'gender': self.gender or '',
            'mobile': decrypt_field(self.mobile_enc),
            'opdNumber': self.opd_number or '',
            'abhaId': decrypt_field(self.abha_id_enc),
            'hasAbha': bool(decrypt_field(self.abha_id_enc)),
            'weight': decrypt_field(self.weight_enc),
            'pastIllnesses': decrypt_field(self.past_illnesses_enc),
            'photoUrl': self.photo_url or ''
        }

class ConsultationSession(Base):
    __tablename__ = 'consultation_sessions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_token = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    mode = Column(String(20), default='clinical') # 'ayush' | 'clinical'
    status = Column(String(20), default='active')
    current_stage = Column(String(30), default='symptoms') # symptoms, severity, duration, history, complete
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='sessions')
    messages = relationship('ChatMessage', back_populates='session', cascade='all, delete-orphan')

class ChatMessage(Base):
    __tablename__ = 'chat_messages'
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey('consultation_sessions.id'), nullable=False)
    sender = Column(String(10), nullable=False) # 'user' | 'ai'
    stage = Column(String(30), default='')
    text_enc = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship('ConsultationSession', back_populates='messages')

    def to_dict(self):
        return {
            'id': self.id,
            'sender': self.sender,
            'stage': self.stage,
            'text': decrypt_field(self.text_enc),
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

class UploadedDocument(Base):
    __tablename__ = 'uploaded_documents'
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey('consultation_sessions.id'), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    name = Column(String(255), default='')
    category = Column(String(50), default='Prescriptions')
    doctor = Column(String(100), default='')
    facility = Column(String(100), default='')
    date_str = Column(String(50), default='')
    details_enc = Column(Text, default='')
    ocr_text_enc = Column(Text, default='')
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'doctor': self.doctor,
            'facility': self.facility,
            'date': self.date_str,
            'details': decrypt_field(self.details_enc),
            'scannedText': decrypt_field(self.ocr_text_enc)
        }

class ClinicalSummary(Base):
    __tablename__ = 'clinical_summaries'
    id = Column(Integer, primary_key=True, autoincrement=True)
    summary_token = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    session_id = Column(Integer, ForeignKey('consultation_sessions.id'), nullable=True)
    
    patient_name_enc = Column(Text, default='')
    patient_age = Column(String(10), default='')
    patient_gender = Column(String(20), default='')
    patient_mobile_enc = Column(Text, default='')
    patient_abha_enc = Column(Text, default='')
    opd_number = Column(String(50), default='')
    consultation_mode = Column(String(20), default='clinical')

    chief_complaint_enc = Column(Text, default='')
    hpi_enc = Column(Text, default='')
    past_history_enc = Column(Text, default='')
    medications_enc = Column(Text, default='')
    allergies_enc = Column(Text, default='')
    lifestyle_enc = Column(Text, default='')
    clinician_notes_enc = Column(Text, default='')
    ayush_ratings_json = Column(Text, default='{}')

    is_verified = Column(Boolean, default=True)
    is_sent_to_his = Column(Boolean, default=False)
    sent_to_his_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'summaryToken': self.summary_token,
            'patientName': decrypt_field(self.patient_name_enc),
            'patientAge': self.patient_age,
            'patientGender': self.patient_gender,
            'patientMobile': decrypt_field(self.patient_mobile_enc),
            'patientAbha': decrypt_field(self.patient_abha_enc),
            'opdNumber': self.opd_number,
            'consultationMode': self.consultation_mode,
            'chiefComplaint': decrypt_field(self.chief_complaint_enc),
            'hpi': decrypt_field(self.hpi_enc),
            'pastHistory': decrypt_field(self.past_history_enc),
            'medications': decrypt_field(self.medications_enc),
            'allergies': decrypt_field(self.allergies_enc),
            'lifestyle': decrypt_field(self.lifestyle_enc),
            'clinicianNotes': decrypt_field(self.clinician_notes_enc),
            'ayushRatings': self.ayush_ratings_json,
            'isVerified': self.is_verified,
            'isSentToHis': self.is_sent_to_his,
            'sentToHisAt': self.sent_to_his_at.isoformat() if self.sent_to_his_at else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
