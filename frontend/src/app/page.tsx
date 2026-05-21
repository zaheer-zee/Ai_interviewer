"use client";

import { useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  BarVisualizer,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import "@livekit/components-styles";

export default function Home() {
  const [token, setToken] = useState("");
  const [sessionType, setSessionType] = useState<"interview" | "coach" | null>(null);

  const startSession = async (type: "interview" | "coach") => {
    try {
      const roomPrefix = type === "coach" ? "coach_room_" : "interview_room_";
      const response = await fetch("http://localhost:8001/api/v1/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participant_name: "User_" + Math.floor(Math.random() * 1000),
          room_name: roomPrefix + Math.floor(Math.random() * 10000),
        }),
      });
      const data = await response.json();
      setToken(data.token);
      setSessionType(type);
    } catch (error) {
      console.error("Failed to fetch token:", error);
      alert("Failed to start session. Check backend connection.");
    }
  };

  if (token === "") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-24">
        <h1 className="text-4xl font-bold mb-12">AI Interview & Communication Coach</h1>
        
        <div className="flex gap-8 flex-col sm:flex-row">
          <div className="flex flex-col items-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 w-80">
            <h2 className="text-2xl font-semibold mb-4">Mock Interview</h2>
            <p className="text-zinc-400 mb-8 text-center">Practice your interview skills with a professional AI recruiter.</p>
            <button
              onClick={() => startSession("interview")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-colors w-full"
            >
              Start Interview
            </button>
          </div>

          <div className="flex flex-col items-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 w-80">
            <h2 className="text-2xl font-semibold mb-4 text-center">English Coach</h2>
            <p className="text-zinc-400 mb-8 text-center">Build confidence and improve your spoken English naturally.</p>
            <button
              onClick={() => startSession("coach")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full font-semibold transition-colors w-full"
            >
              Start Coaching
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => {
        setToken("");
        setSessionType(null);
      }}
      onConnected={() => console.log("LiveKit connected!")}
    >
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-2xl font-semibold mb-12">
          {sessionType === "coach" ? "English Communication Coach" : "Live Interview"}
        </h1>
        
        {/* Simple Audio Visualizer */}
        <div className="h-48 w-full max-w-md flex items-center justify-center">
           <VoiceAssistantVisualizer />
        </div>
        
        <div className="mt-12">
          <VoiceAssistantControlBar />
        </div>
        
        <RoomAudioRenderer />
      </main>
    </LiveKitRoom>
  );
}

function VoiceAssistantVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`text-sm px-3 py-1 rounded-full ${
        state === "speaking" ? "bg-green-500/20 text-green-400" :
        state === "listening" ? "bg-blue-500/20 text-blue-400" :
        "bg-zinc-800 text-zinc-400"
      }`}>
        {state.charAt(0).toUpperCase() + state.slice(1)}
      </div>
      <div className="h-24 flex items-center">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          className="w-48"
        />
      </div>
    </div>
  );
}
