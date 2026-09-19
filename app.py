"""
SPECTRA Local Engine - FastAPI Backend Entry Point
Run with:
    uvicorn app:app --reload --port 8000
"""

from backend.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
