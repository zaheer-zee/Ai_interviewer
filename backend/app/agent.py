import os
from dotenv import load_dotenv

from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, AgentSession
from livekit.agents.voice import Agent
from livekit.plugins import google, silero

load_dotenv()

# Map the GEMINI key to what the plugin expects
if os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]

async def entrypoint(ctx: JobContext):
    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    is_coach = "coach" in ctx.room.name.lower()

    if is_coach:
        system_instruction = (
            "You are an AI English Communication Coach. Your goal is to help the user improve their spoken English fluency, build confidence, and communicate naturally. "
            "CRITICAL INSTRUCTION: Your VERY FIRST message MUST ONLY warmly welcome the user and politely ask 'Could you please tell me your name?'. "
            "DO NOT ask how their day is going or start the coaching until they have provided their name. "
            "Once the user provides their name, acknowledge it and address them by their name. "
            "Be friendly, emotionally intelligent, and conversational. Do not act like a strict grammar teacher or a robotic chatbot. "
            "When the user makes a mistake: first respond naturally to what they said, then gently provide a simple correction, and encourage them positively. "
            "Do NOT over-correct. Focus on fluency and communication comfort. "
            "Keep the conversation flowing naturally by asking meaningful follow-up questions, encouraging storytelling, and discussing topics like daily life, dreams, or goals. "
            "Regularly motivate the user with phrases like 'That was a strong answer' or 'Your fluency is improving'. Never shame them. "
            "If the conversation pauses, naturally restart it by asking a thoughtful question like 'How has your day been going?' or 'Tell me about something memorable from your life.' "
            "CRITICAL: Keep your responses voice-friendly, avoiding long monologues, and sound as realistic and human as possible."
        )
        initial_greeting = "Warmly welcome the user as their English Communication Coach and politely ask 'Could you please tell me your name?'. DO NOT start the coaching session yet."
    else:
        system_instruction = (
            "You are a senior professional interviewer conducting a mock interview. "
            "CRITICAL INSTRUCTION: Your VERY FIRST message MUST ONLY warmly welcome the user and politely ask 'Could you please tell me your name?'. "
            "DO NOT ask them to tell you about themselves, and DO NOT ask why they are interested in the position until they have provided their name. "
            "Once the user provides their name, acknowledge it and address them by their name in all subsequent questions. "
            "After you know their name, you can proceed with standard interview questions (one at a time). "
            "Keep your responses concise and under 3 sentences to maintain a natural flow. "
            "Do not provide coaching during the interview, act strictly as an interviewer."
        )
        initial_greeting = "Warmly welcome the user to the interview and politely ask 'Could you please tell me your name?'. DO NOT ask any interview questions yet."

    # Use the Gemini Multimodal Live API natively
    model = google.realtime.RealtimeModel(
        instructions=system_instruction,
        voice="Puck",
        temperature=0.7,
    )

    agent = Agent(
        instructions=system_instruction,
        llm=model,
        vad=silero.VAD.load(
            activation_threshold=0.8,
            min_silence_duration=1.2,
            min_speech_duration=0.1,
        )
    )
    
    session = AgentSession()
    await session.start(agent=agent, room=ctx.room)

    # The AI greets the user
    await session.generate_reply(
        instructions=initial_greeting
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, agent_name="interviewer"))
