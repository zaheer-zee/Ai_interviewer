"use client";

import { motion } from "framer-motion";

interface TranscriptPanelProps {
  // We accept props but for now it's a static layout representation
  messages?: any[]; 
}

export function TranscriptPanel({ messages }: TranscriptPanelProps) {
  // Dummy data representing how it will look
  const dummyMessages = [
    { id: 1, sender: "ai", text: "Welcome to the interview. Could you please tell me your name?", time: "10:00 AM" },
    { id: 2, sender: "user", text: "Hi, I'm Alex.", time: "10:00 AM" },
    { id: 3, sender: "ai", text: "Nice to meet you, Alex. Let's start with your background. Can you describe your experience with React?", time: "10:01 AM" },
    { id: 4, sender: "user", text: "I've been using React for about 3 years, mostly building dashboards...", time: "10:01 AM" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <h3 className="text-sm font-medium text-zinc-300">Live Transcript</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {dummyMessages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-zinc-500 mb-1 px-1">
              {msg.sender === "user" ? "You" : "AI Interviewer"} • {msg.time}
            </span>
            <div 
              className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                msg.sender === "user" 
                  ? "bg-blue-600/20 text-blue-100 border border-blue-500/20 rounded-tr-sm" 
                  : "bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {/* Fake typing/interim indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800/50 rounded-2xl rounded-tl-sm w-fit border border-zinc-800"
        >
          <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </motion.div>
      </div>
    </div>
  );
}
