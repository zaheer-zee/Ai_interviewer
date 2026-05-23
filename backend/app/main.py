from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Interview Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenRequest(BaseModel):
    participant_name: str
    room_name: str
    config: dict = {}

@app.get("/")
def read_root():
    return {"message": "AI Interview Coach API is running"}

@app.post("/api/v1/livekit/token")
async def create_token(req: TokenRequest):
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")
    
    if not api_key or not api_secret or not livekit_url:
        raise HTTPException(status_code=500, detail="LiveKit credentials not configured")
        
    import json
    # Explicitly tell LiveKit to send the agent into this room, and pass config as metadata
    try:
        lkapi = api.LiveKitAPI(livekit_url, api_key, api_secret)
        await lkapi.room.create_room(
            api.CreateRoomRequest(
                name=req.room_name,
                metadata=json.dumps(req.config)
            )
        )
        await lkapi.agent_dispatch.create_dispatch(
            api.CreateAgentDispatchRequest(
                agent_name="interviewer",
                room=req.room_name
            )
        )
        await lkapi.aclose()
    except Exception as e:
        print(f"Error dispatching agent: {e}")

    token = api.AccessToken(api_key, api_secret) \
        .with_identity(req.participant_name) \
        .with_name(req.participant_name) \
        .with_grants(api.VideoGrants(
            room_join=True,
            room=req.room_name,
        ))
        
    return {"token": token.to_jwt()}
