#!/usr/bin/env bash
echo "Starting Attribrix AI Development Services..."

# 1. Start ML service
(cd ml && uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload) &
ML_PID=$!

# 2. Start Backend
(cd backend && npm run dev) &
BACKEND_PID=$!

# 3. Start Frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $ML_PID $BACKEND_PID $FRONTEND_PID" EXIT
wait
