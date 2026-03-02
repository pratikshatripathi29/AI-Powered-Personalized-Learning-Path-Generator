# main.py
# This is the SERVER — it listens for requests from the frontend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model import model   # import our ML model

# Create the app
app = FastAPI(title="Learning Path API")

# ── CORS: Allow frontend to talk to backend ────────────
# Without this, your browser will BLOCK requests between ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React runs here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DATA SCHEMA ────────────────────────────────────────
# Pydantic checks that incoming data has the right types
# If frontend sends "python": "hello" instead of a number, it auto-rejects it
class SkillScores(BaseModel):
    python: int
    math: int
    webdev: int
    databases: int
    ml_basics: int

# ── ROUTES (API endpoints) ─────────────────────────────

@app.get("/")
def home():
    # Visit http://localhost:8000 to see this
    return {"status": "API is running! 🚀"}

@app.post("/predict")
def predict(scores: SkillScores):
    """
    Frontend sends scores → we run the ML model → return the path
    
    Example request body:
    {
        "python": 5,
        "math": 6,
        "webdev": 3,
        "databases": 4,
        "ml_basics": 2
    }
    """
    result = model.predict(scores.dict())
    return result

@app.get("/paths")
def get_paths():
    """Returns all 7 learning paths (useful for frontend dropdowns)"""
    from ml_model import LEARNING_PATHS
    return LEARNING_PATHS
