"use client";

import { motion } from "framer-motion";
import { VoiceName } from "@/app/types";

interface AIInterviewerPanelProps {
  isSpeaking: boolean;
  voiceName: VoiceName;
}

export function AIInterviewerPanel({ isSpeaking, voiceName }: AIInterviewerPanelProps) {
  // Determine stylistic color based on selected voice gender
  const isFemale = ["Kore", "Aoede"].includes(voiceName);
  const themeColor = isFemale ? "emerald" : "blue";
  
  const glowVariants = {
    idle: {
      scale: 1,
      opacity: 0.3,
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const }
    },
    speaking: {
      scale: 1.15,
      opacity: 0.8,
      transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" as const }
    }
  };

  const ringVariants = {
    idle: {
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    speaking: {
      scale: 1.05,
      borderColor: isFemale ? "rgba(16, 185, 129, 0.5)" : "rgba(59, 130, 246, 0.5)",
      boxShadow: isFemale ? "0 0 40px rgba(16, 185, 129, 0.4)" : "0 0 40px rgba(59, 130, 246, 0.4)"
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col items-center justify-center">
      {/* Background ambient light */}
      <motion.div
        variants={glowVariants}
        initial="idle"
        animate={isSpeaking ? "speaking" : "idle"}
        className={`absolute w-96 h-96 rounded-full blur-[100px] pointer-events-none ${
          isFemale ? "bg-emerald-500/20" : "bg-blue-500/20"
        }`}
      />

      {/* Placeholder Avatar Container */}
      <motion.div
        variants={ringVariants}
        initial="idle"
        animate={isSpeaking ? "speaking" : "idle"}
        transition={{ duration: 0.5 }}
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-white/10 bg-zinc-950 flex items-center justify-center overflow-hidden z-10 shadow-xl"
      >
        {/* Placeholder for actual image/video to be added by user later */}
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full mb-4 flex items-center justify-center ${
            isFemale ? "bg-emerald-500/20" : "bg-blue-500/20"
          }`}>
            <span className="text-4xl">🤖</span>
          </div>
          <div className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
            AI Interviewer
          </div>
          <div className="text-xs text-zinc-600 mt-2">
            ({voiceName} Voice)
          </div>
        </div>

        {/* Audio activity visualizer overlay when speaking */}
        {isSpeaking && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 h-8 items-end">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{ height: ["4px", "24px", "8px", "16px", "4px"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
                className={`w-1.5 rounded-full ${isFemale ? 'bg-emerald-400' : 'bg-blue-400'}`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Name Badge */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
        <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
          <span className="text-sm font-medium text-white shadow-sm">AI Interviewer</span>
          {isSpeaking && (
            <span className={`w-2 h-2 rounded-full animate-pulse ${isFemale ? 'bg-emerald-400' : 'bg-blue-400'}`} />
          )}
        </div>
      </div>
    </div>
  );
}
