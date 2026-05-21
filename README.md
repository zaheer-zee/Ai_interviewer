# AI Interview & Communication Coach

A real-time Voice AI Interview simulator built with:
- Next.js (React)
- LiveKit Cloud (WebRTC)
- FastAPI (Backend)
- Google Gemini 1.5 (LLM + STT + TTS)

## Setup Instructions

### 1. Backend (FastAPI + LiveKit Agent)
Open a terminal and set up the environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt # (Dependencies are already installed in the venv)
```

Create a `.env` file in the `backend/` directory (you can copy `.env.example`):
```env
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-livekit-project.livekit.cloud
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8001
```

Start the LiveKit Voice Agent:
```bash
python -m app.agent start
```

### 2. Frontend (Next.js)
Open a new terminal:
```bash
cd frontend
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-project.livekit.cloud
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and click "Start Mock Interview". Make sure your microphone permissions are enabled!
