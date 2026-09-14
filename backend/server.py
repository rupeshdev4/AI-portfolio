from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

CV_CONTEXT = """
RUPESH DEV — rupeshdev4@gmail.com | +91 8446541707 | India
Customer Success & Project Management professional turned AI Product Builder. 5 years driving global enterprise SaaS transformations, customer adoption, executive stakeholder management and cross-functional delivery. Managed $1.8M+ enterprise portfolios.

EXPERIENCE
1) SAP — Consultant (Jul 2024 - Jun 2026), Associate Consultant (Jul 2022 - Jul 2024), Bengaluru
- Managed a $1M+ ARR portfolio of 30+ enterprise accounts in North America, driving customer success and account growth
- Maintained 92.5%+ CSAT through consultative problem-solving, stakeholder management and timely issue resolution
- Achieved 83%+ customer retention by identifying churn risks and leading cross-functional account recovery
- Built trusted partnerships with C-1 level stakeholders through executive business reviews and solution roadmaps
- Leveraged product analytics for strategic recommendations, improving platform utilization
- Owned escalations with cross-functional teams to resolve critical issues
- Built and led a 10-day onboarding program accelerating consultant readiness
- Owned 5 end-to-end SAP Concur implementations across ANZ, India and Europe through go-live
- Delivered SAP SaaS implementations for UST, Tech Mahindra, Mitsubishi Motors, Steel & Tube NZ
- Executed 4 enterprise expansion projects for US & EU clients incl. Biocon, Lupin, Sandvik
- Drove project governance via SteerCo reviews, mitigating risks and ensuring on-time delivery
- Reduced annual effort by 75% by automating Customer Success workflows
- Delivered 3 ANZ enterprise go-lives in a single quarter, earning the Customer Champion award
- Enabled 121%+ customer adoption by standardizing the FREEDOM project portfolio
- Received 15+ customer commendations and monetary awards

2) CLOUDMOYO — Associate Consultant (Apr 2021 - Apr 2022), Remote
- Delivered 2 enterprise Icertis CLM implementations for GIA and Amobee, integrating Workday, NetSuite, DocuSign
- Trained and mentored 2 FTE consultants
- Facilitated discovery workshops and solution configuration for scalable CLM solutions

3) URBAN COMPANY — Business Development Intern (Jan 2020 - Mar 2020), Nagpur
- Generated Rs 14.4L onboarding revenue in 23 days signing 36 salon partners during Nagpur launch
- Executed a 0-to-1 GTM strategy establishing the salon vertical

4) GODREJ & BOYCE — Process Engineering Trainee (May 2018 - Nov 2018), Goa
- Optimized assembly workflows, increasing First Pass Yield by 3%

FOUNDER PROJECT
FOREVER INDIAN (D2C E-commerce) — Founder (Sep 2019 - Jul 2020)
- Launched pan-India D2C store: Rs 4L+ revenue, 40+ SKUs
- Boosted landing page conversions 11% via funnel analysis and Meta Ads
- Integrated WooCommerce, Shiprocket, Razorpay

AI PRODUCTS BUILT
- FinPilot: flagship fintech AI co-pilot — autonomous financial modeling, risk scoring, cash-flow forecasting and portfolio intelligence
- EchoVerse: voice cloning & audio AI studio (30-second sample voice cloning, multilingual dubbing)
- VisionPulse: industrial computer-vision defect inspection AI
- ChurnRadar: enterprise churn & revenue intelligence engine (born from his CS background)
- Neural Snake: snake game with a live pathfinding AI autopilot (on this site)

EDUCATION
- Masters' Union — PGP in Technology & Business Management (2026-2027), Gurgaon
- G.H. Raisoni College of Engineering — BE Mechanical, CGPA 7.7 (2015-2019)

SKILLS
Business: SaaS Implementation (B2B), Strategic Account Management, Customer Success, Executive Stakeholder Management, Business Analysis, Cross-functional Collaboration, Project Management, Process Optimization, Customer Retention, Business Development
Technical: SQL, JIRA, Gainsight, Cognos Analytics, SAP Concur, Icertis CLM, Integrations, Freshdesk, Microsoft Office Suite, plus hands-on AI product development (React, FastAPI, LLM APIs)

CERTIFICATIONS: SAP Business Technology Platform (SAP), Icertis Contract Intelligence Professional

EXTRAS: Led team of 8 organizing 10 events for 1200+ participants (Student Forum Secretary); Robocon India national robotics; published photography in Times of India.

STATUS: Open to Customer Success & AI Product leadership roles.
"""

SYSTEM_PROMPT = f"""You are RUPESH.AI, the sharp personal AI advocate embedded in Rupesh Dev's portfolio, talking to recruiters and hiring managers.

Rules:
- Answer ONLY from the CV context below. If something is not in it, say you don't have that data and pivot to a relevant strength.
- Be crisp: 2-4 sentences unless a detailed breakdown is explicitly requested. Confident, precise, zero fluff.
- Always frame answers around recruiter value: metrics, outcomes, leadership.
- Never invent numbers, employers, or dates.
- You may recommend contacting Rupesh at rupeshdev4@gmail.com for deeper conversations.

CV CONTEXT:
{CV_CONTEXT}
"""


class ChatRequest(BaseModel):
    session_id: str
    message: str


@api_router.get("/")
async def root():
    return {"message": "RUPESH.DEV portfolio API", "status": "all neural systems operational"}


@api_router.post("/chat")
async def ask_cv(req: ChatRequest):
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    ts = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one(
        {"session_id": req.session_id, "role": "user", "content": req.message, "timestamp": ts}
    )
    history = await db.chat_messages.find(
        {"session_id": req.session_id}, {"_id": 0}
    ).sort("timestamp", 1).to_list(40)
    convo = "\n".join(
        f"{'Recruiter' if m['role'] == 'user' else 'RUPESH.AI'}: {m['content']}" for m in history[-12:]
    )

    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=req.session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.4")

    async def stream():
        full = ""
        try:
            async for ev in chat.stream_message(
                UserMessage(text=f"Conversation so far:\n{convo}\n\nReply to the recruiter's latest message.")
            ):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception:
            logging.exception("chat stream error")
            yield f"data: {json.dumps({'error': 'Neural link disrupted. Please retry.'})}\n\n"
        if full:
            await db.chat_messages.insert_one({
                "session_id": req.session_id,
                "role": "assistant",
                "content": full,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    msgs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    return {"messages": msgs}


TTS_VOICES = {"alloy", "ash", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"}


class TTSRequest(BaseModel):
    text: str
    voice: str = "onyx"


@api_router.post("/tts")
async def tts_generate(req: TTSRequest):
    import re
    import hashlib
    from bson import Binary
    from emergentintegrations.llm.openai import OpenAITextToSpeech

    text = re.sub(r"https?://\S+", "", req.text)
    text = re.sub(r"[*_#>~|`]", "", text)
    text = re.sub(r"\s+", " ", text).strip()[:500]
    if not text:
        return {"error": "empty text"}
    voice = req.voice if req.voice in TTS_VOICES else "onyx"
    key = hashlib.sha256(f"{text}|{voice}|1.0|tts-1|mp3".encode()).hexdigest()
    existing = await db.tts_cache.find_one({"key": key}, {"_id": 1})
    if not existing:
        try:
            tts = OpenAITextToSpeech(api_key=os.environ["EMERGENT_LLM_KEY"])
            audio = await tts.generate_speech(text=text, model="tts-1", voice=voice)
        except Exception:
            logging.exception("tts generation error")
            return {"error": "synthesis failed"}
        await db.tts_cache.insert_one(
            {"key": key, "audio": Binary(audio), "created_at": datetime.now(timezone.utc).isoformat()}
        )
    return {"url": f"/api/tts/{key}.mp3"}


@api_router.get("/tts/{key}.mp3")
async def tts_serve(key: str):
    from fastapi import Response, HTTPException

    doc = await db.tts_cache.find_one({"key": key}, {"_id": 0, "audio": 1})
    if not doc:
        raise HTTPException(status_code=404, detail="not found")
    return Response(
        content=bytes(doc["audio"]),
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
