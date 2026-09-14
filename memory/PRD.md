# PRD — Rupesh Dev AI Portfolio (rupeshdev.space)

## Original Problem Statement
Build a landing page: a stunning AI product portfolio with random AI products, CV featured creatively, and FinPilot (user's fintech product) linked. Reference: aishashok.com. Audience: recruiters. Target domain: https://rupeshdev.space/. User choices: FinPilot as showcase card; AI-powered game as interactive demo; "Ask my CV" chatbot = yes; contact links Email + LinkedIn + GitHub; dark futuristic AI vibe; surprise with extra AI products. Design bar: Awwwards-level, framer-motion + lenis, kinetic hero with masked line reveal, editorial marquee, numbered manifesto chapters.

## User Personas
- Tech recruiters / hiring managers evaluating Rupesh for CS leadership or AI product roles
- Founders / VCs scanning product-building proof
- Rupesh Dev (owner) sharing the link as his living CV

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll) + sonner. Single-page immersive portfolio at /app/frontend/src (components: Navbar, Hero+ParticleCanvas, Marquee, Manifesto, Products+modal, NeuralSnake, CVTimeline, ChatWidget, Footer; data in src/data/portfolio.js).
- Backend: FastAPI at /app/backend/server.py. Routes (all /api prefixed): GET /api/ (health), POST /api/chat (SSE streaming LLM chat, GPT-5.4 via EMERGENT_LLM_KEY + emergentintegrations, CV injected as system prompt), GET /api/chat/history/{session_id}.
- DB: MongoDB via MONGO_URL/DB_NAME; collection chat_messages (session_id, role, content, ISO timestamp).
- Fonts: Clash Display (Fontshare), Space Grotesk, Plus Jakarta Sans, JetBrains Mono.

## Core Requirements (static)
1. Kinetic hero with masked line reveal, particle canvas, 3D-tilt portrait, metric badges
2. Numbered manifesto chapters telling the CV story
3. AI product arsenal: FinPilot featured + EchoVerse, VisionPulse, ChurnRadar cards with case-file modals
4. Playable Neural Snake with BFS AI autopilot + live thought log
5. "Ask my CV" streaming LLM chatbot with recruiter quick chips
6. CV matrix: expandable timeline, skill bars, education, awards
7. Terminal-style contact footer (email, LinkedIn, GitHub, resume PDF)
8. Dark futuristic aesthetic, all interactive elements carry data-testid

## Implemented (2026-07-14)
- Full single-page portfolio, all 8 core requirements built and visually verified
- POST /api/chat streaming verified via curl (GPT-5.4, CV-grounded answers)
- E2E screenshot tests: hero render, AI autopilot scored 5 pts with live BFS log, FinPilot modal, chatbot chip answer stream
- Lenis momentum scrolling, grain overlay, spotlight cards, marquee
- Real CV PDF linked for download; real email wired (rupeshdev4@gmail.com)

## Known Placeholders / Pending
- VisionPulse / ChurnRadar remain concept-demo showcase cards (not live products)
- Custom domain rupeshdev.space not yet mapped — needs deployment + DNS step

## Implemented (2026-07-14, iteration 2)
- Real LinkedIn (linkedin.com/in/rupesh-dev-a394a4156) and GitHub (github.com/rupeshdev4) wired in footer
- FinPilot featured card + modal now launch the live app (finpilot-preview-1.emergent.host) in a new tab
- EchoVerse voice demo: POST /api/tts (OpenAI tts-1 via Emergent key, 4 voice profiles, Mongo-cached mp3) + GET /api/tts/{key}.mp3; VoiceDemo widget in EchoVerse modal — verified playing 7s audio e2e

## Backlog
- P0: Map rupeshdev.space custom domain (deploy + DNS)
- P1: Recruiter analytics (track chat questions, section dwell)
- P2: Voice-clone micro-demo for EchoVerse; more AI demos; blog/field-notes section (aishashok.com-style)

## Next Tasks
1. Deploy to production + attach rupeshdev.space
2. Collect real social URLs from user
3. Optional: seed FinPilot live demo
