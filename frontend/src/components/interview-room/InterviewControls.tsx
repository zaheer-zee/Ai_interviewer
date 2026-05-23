"use client";

import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";

interface InterviewControlsProps {
  isMicMuted: boolean;
  isCamMuted: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onDisconnect: () => void;
}

export function InterviewControls({
  isMicMuted,
  isCamMuted,
  onToggleMic,
  onToggleCam,
  onDisconnect,
}: InterviewControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {/* Mic Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleMic}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg border ${
          isMicMuted 
            ? "bg-red-500 hover:bg-red-600 border-red-400 text-white" 
            : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
        }`}
      >
        {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>

      {/* Cam Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleCam}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg border ${
          isCamMuted 
            ? "bg-red-500 hover:bg-red-600 border-red-400 text-white" 
            : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
        }`}
      >
        {isCamMuted ? <VideoOff size={24} /> : <Video size={24} />}
      </motion.button>

      {/* Disconnect */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDisconnect}
        className="w-16 h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-lg border border-red-500 text-white ml-4"
      >
        <PhoneOff size={24} />
      </motion.button>
    </div>
  );
}
