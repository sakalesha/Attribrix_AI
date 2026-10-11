@echo off
echo ====================================================
echo Starting Attribrix AI Development Environment
echo ====================================================

echo 1. Starting ML Service on port 8000...
start cmd /k "cd ml && uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Starting Node.js Backend on port 5000...
start cmd /k "cd backend && npm run dev"

echo 3. Starting Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo All services launched!
pause
