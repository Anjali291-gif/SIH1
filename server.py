# Python FastAPI Backend Architecture for UAV Engine AI Platform (SIH 26054)
# Run with: uvicorn server:app --reload --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI(
    title="UAV Engine AI — Digital Twin Backend API",
    description="Python FastAPI REST API & AI Telemetry Engine for MALE UAV Piston Aero Engines",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "system": "UAV Engine AI Digital Twin",
        "problem_statement": "SIH 26054",
        "engine_model": "ROTAX-914-iS"
    }

@app.get("/api/sensor-data")
def get_sensor_data():
    return {
        "timestamp": time.time(),
        "rpm": 4520 + random.randint(-30, 30),
        "temperature": round(82.0 + random.uniform(-0.5, 0.5), 1),
        "oilPressure": round(3.8 + random.uniform(-0.1, 0.1), 1),
        "vibration": round(0.42 + random.uniform(-0.02, 0.02), 2),
        "fuelConsumption": round(10.2 + random.uniform(-0.1, 0.1), 1),
        "engineLoad": 68 + random.randint(-1, 1),
        "exhaustTemp": 620 + random.randint(-5, 5),
        "operatingHours": 1250
    }

@app.get("/api/engine-health")
def get_engine_health():
    return {
        "healthScore": 86,
        "status": "Healthy",
        "confidence": 94.2
    }

@app.get("/api/fault-prediction")
def get_fault_prediction():
    return {
        "predictedFault": "Overheating",
        "probability": 87,
        "contributingFactors": [
            {"factor": "Crankcase Temperature", "delta": "+14%"},
            {"factor": "Vibration Amplitude", "delta": "+31%"},
            {"factor": "Oil Pressure", "delta": "-12%"}
        ]
    }

@app.get("/api/rul")
def get_rul():
    return {
        "rulHours": 42,
        "confidence": 88.5,
        "recommendation": "Inspect cooling system within next 42 hours."
    }

@app.get("/api/alerts")
def get_alerts():
    return [
        {
            "id": 1,
            "severity": "warning",
            "title": "Potential Engine Overheating Detected",
            "probability": 87,
            "timestamp": "12:44:10"
        }
    ]

# ============================================================
# AUTHENTICATION & DEFENSE OTP VERIFICATION ENDPOINTS
# ============================================================
from pydantic import BaseModel
from typing import Optional

# In-memory storage for active OTPs and registered users
active_otps = {}
registered_users = {
    "ay8572873559@gmail.com": {
        "name": "Anjali Yadav",
        "email": "ay8572873559@gmail.com",
        "role": "Aerospace Systems Engineer",
        "organization": "DRDO Aeronautical Development Establishment",
        "clearanceLevel": "Level 4 Defense Security"
    }
}

class SendOtpRequest(BaseModel):
    email: str
    name: Optional[str] = "Defense Engineer"
    otp: Optional[str] = None

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

@app.post("/api/auth/send-otp")
def send_otp(req: SendOtpRequest):
    email = req.email.strip().lower()
    # Generate 6-digit OTP if not provided
    otp_code = req.otp if req.otp else str(random.randint(100000, 999999))
    active_otps[email] = {
        "otp": otp_code,
        "name": req.name,
        "expires_at": time.time() + 300 # 5 min validity
    }
    return {
        "success": True,
        "message": f"Verification code dispatched to {email}",
        "otp": otp_code, # Sent for testing/demo presentation
        "email": email
    }

@app.post("/api/auth/verify-otp")
def verify_otp(req: VerifyOtpRequest):
    email = req.email.strip().lower()
    entered_otp = req.otp.strip()

    stored = active_otps.get(email)
    valid_code = stored.get("otp") if stored else None

    # Verify against active code or demo bypass code 784201
    if (valid_code and entered_otp == valid_code) or entered_otp == "784201":
        user_name = stored.get("name") if stored else (email.split("@")[0] if "@" in email else "Engineer")
        user_profile = {
            "name": user_name,
            "email": email,
            "role": "Aerospace Systems Engineer",
            "organization": "DRDO Aeronautical Development Establishment",
            "clearanceLevel": "Level 4 Defense Security",
            "isLoggedIn": True
        }
        registered_users[email] = user_profile
        if email in active_otps:
            del active_otps[email]
        return {
            "success": True,
            "message": "Access Granted. Identity verified with Defense Clearance.",
            "user": user_profile
        }
    else:
        return {
            "success": False,
            "message": "Incorrect OTP. Verification failed. Please check the code and re-enter."
        }

