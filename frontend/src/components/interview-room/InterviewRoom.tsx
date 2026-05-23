"use client";

import { useState, useEffect } from "react";
import { useVoiceAssistant, useRoomContext, useLocalParticipant, RoomAudioRenderer } from "@livekit/components-react";
import { UserVideoPanel } from "./UserVideoPanel";
import { AIInterviewerPanel } from "./AIInterviewerPanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { InterviewControls } from "./InterviewControls";
import { SessionConfig } from "@/app/types";

interface InterviewRoomProps {
  config: SessionConfig;
  onLeave: () => void;
}

export function InterviewRoom({ config, onLeave }: InterviewRoomProps) {
  const { state } = useVoiceAssistant();
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamMuted, setIsCamMuted] = useState(false);

  // Automatically mute mic when AI speaks
  useEffect(() => {
    if (!localParticipant) return;
    
    if (state === "speaking") {
      localParticipant.setMicrophoneEnabled(false);
      setIsMicMuted(true);
    } else if (state === "listening") {
      localParticipant.setMicrophoneEnabled(true);
      setIsMicMuted(false);
    }
  }, [state, localParticipant]);

  const handleDisconnect = () => {
    room.disconnect();
    onLeave();
  };

  const handleToggleMic = () => {
    if (localParticipant) {
      if (isMicMuted) {
        localParticipant.setMicrophoneEnabled(true);
        setIsMicMuted(false);
      } else {
        localParticipant.setMicrophoneEnabled(false);
        setIsMicMuted(true);
      }
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-950 p-4 md:p-6 flex flex-col gap-4">
      <RoomAudioRenderer />
      {/* Top Header */}
      <header className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            AI
          </div>
          <div>
            <h1 className="text-white font-medium">{config.mode === 'interview' ? 'Mock Interview' : 'Communication Coach'}</h1>
            {config.mode === 'interview' && config.role && (
              <p className="text-zinc-400 text-xs">{config.role}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Connected
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left/Top: AI Interviewer */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <AIInterviewerPanel 
              isSpeaking={state === "speaking"} 
              voiceName={config.voice} 
            />
          </div>
        </div>

        {/* Right/Bottom: User Video & Transcript */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
          <div className="h-64 lg:h-1/2 flex-shrink-0">
            <UserVideoPanel 
              isMicMuted={isMicMuted} 
              isCamMuted={isCamMuted} 
            />
          </div>
          
          <div className="flex-1 min-h-0">
            <TranscriptPanel />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-20 flex-shrink-0 flex items-center justify-center">
        <InterviewControls
          isMicMuted={isMicMuted}
          isCamMuted={isCamMuted}
          onToggleMic={handleToggleMic}
          onToggleCam={() => setIsCamMuted(!isCamMuted)}
          onDisconnect={handleDisconnect}
        />
      </div>
    </div>
  );
}
