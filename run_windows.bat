@echo off
cd /d "%~dp0"
if not exist .env (
  echo Please copy .env.example to .env and add your GROQ_API_KEY first.
  pause
  exit /b 1
)
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
