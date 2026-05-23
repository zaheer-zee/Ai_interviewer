"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { motion } from "framer-motion";

interface UserVideoPanelProps {
  isMicMuted: boolean;
  isCamMuted: boolean;
  userName?: string;
}

export function UserVideoPanel({ isMicMuted, isCamMuted, userName = "You" }: UserVideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    async function setupCamera() {
      if (isCamMuted) {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
          activeStream = null;
          setStream(null);
        }
        return;
      }
      
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { aspectRatio: 16/9, facingMode: "user" },
          audio: false // Audio is handled by LiveKit
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    setupCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamMuted]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col items-center justify-center">
      {/* Video Stream or Fallback */}
      {!isCamMuted && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <VideoOff className="w-10 h-10 text-zinc-500" />
          </div>
          <span className="text-zinc-500 font-medium">Camera is off</span>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      
      {/* Name and Indicators Badge */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
          <span className="text-sm font-medium text-white shadow-sm">{userName}</span>
        </div>
        
        <div className="flex gap-2">
          {isMicMuted && (
            <div className="p-2 rounded-full bg-red-500/80 backdrop-blur-md border border-red-400/50">
              <MicOff className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
