import os
import base64
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from cryptography.fernet import Fernet

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

if not DATABASE_URL:
    DATABASE_URL = 'sqlite:///medikiosk.db'

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()

# Fernet encryption for sensitive medical and PII fields
enc_key = os.getenv('ENCRYPTION_KEY')
if not enc_key:
    enc_key = Fernet.generate_key().decode()

try:
    fernet = Fernet(enc_key.encode())
except Exception:
    fernet = Fernet(Fernet.generate_key())

def encrypt_field(val):
    if not val:
        return ''
    try:
        return fernet.encrypt(str(val).encode('utf-8')).decode('utf-8')
    except Exception:
        return str(val)

def decrypt_field(val):
    if not val:
        return ''
    try:
        return fernet.decrypt(str(val).encode('utf-8')).decode('utf-8')
    except Exception:
        return str(val)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
