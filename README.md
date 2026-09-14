# Rupesh Dev — AI Product Portfolio

A dark-futuristic, single-page AI product portfolio built for recruiters. Features a kinetic hero with particle canvas, numbered manifesto chapters, an AI product arsenal (FinPilot, EchoVerse, VisionPulse, ChurnRadar), a playable Neural Snake with a BFS pathfinding AI autopilot, an "Ask my CV" streaming LLM chatbot, a live voice-synthesis demo, and a creative CV matrix.

## Stack

- Frontend: React 19, Tailwind CSS, framer-motion, lenis (smooth scroll), sonner, lucide-react
- Backend: FastAPI (Python), Motor (async MongoDB)
- AI: emergentintegrations (OpenAI GPT for chat, OpenAI TTS for voice) via an Emergent universal LLM key — or bring your own OpenAI key
- DB: MongoDB

## Project Structure

```
backend/          FastAPI app (server.py) — /api/chat (SSE streaming), /api/tts (voice), /api/chat/history
frontend/         React app (src/components, src/data/portfolio.js holds all content)
```

## Environment Variables

Copy the example files and fill in values:

```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

backend/.env:
- MONGO_URL — MongoDB connection string
- DB_NAME — database name
- CORS_ORIGINS — allowed origins (e.g. `*` or your domain)
- EMERGENT_LLM_KEY — Emergent universal key (sk-emergent-...) or your OpenAI key

frontend/.env:
- REACT_APP_BACKEND_URL — full URL of the deployed backend (e.g. https://your-domain.com)

## Run Locally

Backend:

```
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Frontend:

```
cd frontend
yarn install
yarn start
```

Frontend runs on :3000, backend on :8001. All backend routes are prefixed with /api.

## Key Features

- POST /api/chat — streaming (SSE) "Ask my CV" chatbot, CV injected as system prompt, chat history persisted in MongoDB
- POST /api/tts + GET /api/tts/{key}.mp3 — voice synthesis with 4 voice profiles, mp3 cached in MongoDB
- Neural Snake — manual play or AI autopilot (BFS pathfinding with live decision log)

## Content Editing

All portfolio content (products, timeline, skills, links) lives in `frontend/src/data/portfolio.js` — edit one file to update the whole site.
