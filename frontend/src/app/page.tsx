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
import { 
  SessionConfig, 
  DEFAULT_CONFIG, 
  VOICE_OPTIONS, 
  ROLE_OPTIONS, 
  TECH_STACK_OPTIONS, 
  QUESTION_TYPE_OPTIONS,
  DURATION_OPTIONS,
  VoiceName
} from "./types";
import { BrainCircuit, MessageSquare, ChevronRight, Check, Settings2, FileText, User, Mic, Clock, ChevronLeft } from "lucide-react";

import { InterviewRoom } from "@/components/interview-room/InterviewRoom";

export default function Home() {
  const [token, setToken] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [config, setConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  const [isStarting, setIsStarting] = useState(false);
  const [customRole, setCustomRole] = useState("");
  const [customTech, setCustomTech] = useState("");
  const [customFocus, setCustomFocus] = useState("");

  const startSession = async () => {
    setIsStarting(true);
    try {
      const roomPrefix = config.mode === "coach" ? "coach_room_" : "interview_room_";
      
      // Finalize config with custom inputs if needed
      const finalConfig = { ...config };
      if (customRole && !ROLE_OPTIONS.includes(customRole)) {
        finalConfig.role = customRole;
      }
      
      const response = await fetch("http://localhost:8001/api/v1/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participant_name: "User_" + Math.floor(Math.random() * 1000),
          room_name: roomPrefix + Math.floor(Math.random() * 10000),
          config: finalConfig,
        }),
      });
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error("Failed to fetch token:", error);
      alert("Failed to start session. Check backend connection.");
    } finally {
      setIsStarting(false);
    }
  };

  const toggleTech = (tech: string) => {
    setConfig(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const toggleQuestionType = (typeId: string) => {
    setConfig(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(typeId)
        ? prev.questionTypes.filter(t => t !== typeId)
        : [...prev.questionTypes, typeId]
    }));
  };

  const addCustomTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTech.trim()) {
      e.preventDefault();
      if (!config.techStack.includes(customTech.trim())) {
        setConfig(prev => ({ ...prev, techStack: [...prev.techStack, customTech.trim()] }));
      }
      setCustomTech("");
    }
  };

  const addCustomFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customFocus.trim()) {
      e.preventDefault();
      if (!config.focusAreas.includes(customFocus.trim())) {
        setConfig(prev => ({ ...prev, focusAreas: [...prev.focusAreas, customFocus.trim()] }));
      }
      setCustomFocus("");
    }
  };

  const removeFocus = (focus: string) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(f => f !== focus)
    }));
  };

  if (token === "") {
    return (
      <main className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-6 md:p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl z-10 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Powered by Gemini Realtime Voice
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              AI Interview <span className="text-gradient">&</span> Coach
            </h1>
            <p className="text-zinc-400 max-w-2xl text-lg">
              Configure your perfect session. Practice technical interviews or improve your spoken English with a highly realistic AI agent.
            </p>
          </div>

          {step === 1 ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Mode Selection Cards */}
              <button
                onClick={() => {
                  setConfig({ ...config, mode: "interview" });
                  setStep(2);
                }}
                className="glass-card p-8 rounded-2xl flex flex-col items-start text-left group hover:-translate-y-1"
              >
                <div className="p-4 bg-blue-500/10 rounded-xl mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <BrainCircuit className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Mock Interview</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed flex-grow">
                  Practice technical or behavioral interviews. The AI acts as a professional recruiter, asking tailored questions and follow-ups based on your stack.
                </p>
                <div className="flex items-center text-blue-400 font-medium group-hover:gap-2 transition-all">
                  Configure Interview <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>

              <button
                onClick={() => {
                  setConfig({ ...config, mode: "coach" });
                  setStep(2);
                }}
                className="glass-card p-8 rounded-2xl flex flex-col items-start text-left group hover:-translate-y-1"
              >
                <div className="p-4 bg-emerald-500/10 rounded-xl mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <MessageSquare className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">English Coach</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed flex-grow">
                  Improve your spoken English and confidence. The AI acts as a friendly coach, having natural conversations and gently correcting mistakes.
                </p>
                <div className="flex items-center text-emerald-400 font-medium group-hover:gap-2 transition-all">
                  Configure Coaching <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            </div>
          ) : (
            <div className="glass p-6 md:p-8 rounded-2xl border border-zinc-800 animate-fade-in relative">
              <button 
                onClick={() => setStep(1)}
                className="absolute top-6 left-6 text-zinc-400 hover:text-white flex items-center text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8 mt-10 md:mt-0 md:ml-20">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.mode === 'interview' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {config.mode === 'interview' ? 'Interview Settings' : 'Coaching Settings'}
                  </h2>
                </div>
                
                <button
                  onClick={startSession}
                  disabled={isStarting}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                    isStarting 
                      ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {isStarting ? (
                    <>Starting...</>
                  ) : (
                    <>Start Session <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column - General Settings */}
                <div className="md:col-span-5 space-y-8">
                  {/* Voice Selection - Applies to both modes */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Mic className="w-4 h-4" /> AI Voice
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {VOICE_OPTIONS.map((v) => (
                        <button
                          key={v.name}
                          onClick={() => setConfig({ ...config, voice: v.name })}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                            config.voice === v.name
                              ? 'bg-zinc-800 border-zinc-600'
                              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{v.name} <span className="text-xs text-zinc-500 ml-2">{v.gender}</span></div>
                            <div className="text-xs text-zinc-400">{v.description}</div>
                          </div>
                          {config.voice === v.name && <Check className="w-4 h-4 text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration - Applies to both modes */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Duration (Minutes)
                    </label>
                    <select
                      value={config.duration}
                      onChange={(e) => setConfig({ ...config, duration: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                    >
                      {DURATION_OPTIONS.map(d => (
                        <option key={d} value={d}>{d} minutes</option>
                      ))}
                    </select>
                    <p className="text-xs text-zinc-500">Session automatically ends after this time or 2 min silence.</p>
                  </div>
                  
                  {/* Personality - Interview Only */}
                  {config.mode === "interview" && (
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                        <User className="w-4 h-4" /> Interviewer Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['friendly', 'professional', 'strict', 'faang'].map((style) => (
                          <button
                            key={style}
                            onClick={() => setConfig({ ...config, personality: style as any })}
                            className={`p-3 rounded-xl border text-center capitalize transition-colors ${
                              config.personality === style
                                ? 'bg-zinc-800 border-zinc-600 text-white'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Follow-up Intensity - Interview Only */}
                  {config.mode === "interview" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-zinc-400">Follow-up Intensity</label>
                        <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md capitalize">{config.followupIntensity}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="1"
                        value={config.followupIntensity === 'low' ? 0 : config.followupIntensity === 'medium' ? 1 : 2}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig({...config, followupIntensity: val === '0' ? 'low' : val === '1' ? 'medium' : 'high'});
                        }}
                      />
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Interview Specifics */}
                <div className="md:col-span-7 space-y-8">
                  {config.mode === "interview" ? (
                    <>
                      {/* Role & Difficulty */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="text-sm font-medium text-zinc-400">Target Role</label>
                          <select
                            value={ROLE_OPTIONS.includes(config.role) ? config.role : "custom"}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "custom") {
                                setCustomRole("");
                                setConfig({ ...config, role: "" });
                              } else {
                                setConfig({ ...config, role: val });
                              }
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                          >
                            <option value="" disabled>Select a role...</option>
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            <option value="custom">Other (Custom)...</option>
                          </select>
                          
                          {(!ROLE_OPTIONS.includes(config.role) && config.role !== "") || config.role === "" && customRole !== "" ? (
                            <input
                              type="text"
                              placeholder="Type custom role..."
                              value={customRole}
                              onChange={(e) => setCustomRole(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors mt-2"
                            />
                          ) : null}
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-medium text-zinc-400">Difficulty</label>
                          <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                              <button
                                key={level}
                                onClick={() => setConfig({ ...config, difficulty: level })}
                                className={`flex-1 py-2 text-sm font-medium capitalize rounded-lg transition-colors ${
                                  config.difficulty === level
                                    ? 'bg-zinc-800 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-400">Tech Stack Focus</label>
                        <div className="flex flex-wrap gap-2">
                          {TECH_STACK_OPTIONS.map(tech => (
                            <button
                              key={tech}
                              onClick={() => toggleTech(tech)}
                              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                config.techStack.includes(tech)
                                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              {tech}
                            </button>
                          ))}
                          {config.techStack.filter(t => !TECH_STACK_OPTIONS.includes(t)).map(tech => (
                            <button
                              key={tech}
                              onClick={() => toggleTech(tech)}
                              className="px-3 py-1.5 text-sm rounded-full border bg-blue-500/20 border-blue-500/50 text-blue-300 transition-colors"
                            >
                              {tech} ✕
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Type tech and press Enter..."
                          value={customTech}
                          onChange={(e) => setCustomTech(e.target.value)}
                          onKeyDown={addCustomTech}
                          className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                      </div>

                      {/* Question Types */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-400">Question Types</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {QUESTION_TYPE_OPTIONS.map(q => (
                            <button
                              key={q.id}
                              onClick={() => toggleQuestionType(q.id)}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm text-left transition-colors ${
                                config.questionTypes.includes(q.id)
                                  ? 'bg-zinc-800 border-zinc-600 text-white'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                              }`}
                            >
                              <span>{q.icon}</span>
                              <span className="truncate">{q.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Focus Areas */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-400">Specific Focus Areas (Optional)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {config.focusAreas.map(focus => (
                            <span key={focus} className="px-3 py-1 text-sm bg-zinc-800 rounded-full flex items-center gap-2 text-zinc-300">
                              {focus}
                              <button onClick={() => removeFocus(focus)} className="hover:text-white">✕</button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Memory management, Redux, Microservices (press Enter)"
                          value={customFocus}
                          onChange={(e) => setCustomFocus(e.target.value)}
                          onKeyDown={addCustomFocus}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                      </div>

                      {/* Resume Mode */}
                      <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Resume-based Questions
                          </label>
                          <button
                            onClick={() => setConfig({ ...config, resumeMode: !config.resumeMode })}
                            className={`w-11 h-6 rounded-full transition-colors relative ${config.resumeMode ? 'bg-blue-500' : 'bg-zinc-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.resumeMode ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                        
                        {config.resumeMode && (
                          <div className="animate-fade-in">
                            <textarea
                              placeholder="Paste your resume text here. The AI will analyze it and ask related questions..."
                              value={config.resumeText}
                              onChange={(e) => setConfig({ ...config, resumeText: e.target.value })}
                              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors resize-none hide-scrollbar"
                            />
                            <p className="text-xs text-zinc-500 mt-2">Paste plain text. Formatting doesn't matter, just the content.</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-3">Coaching Mode Ready</h3>
                      <p className="text-zinc-400 max-w-sm">
                        In this mode, the AI focuses purely on conversational English. It will adapt to your speaking level naturally without technical constraints.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Active Session View
  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => {
        setToken("");
      }}
      onConnected={() => console.log("LiveKit connected!")}
    >
      <InterviewRoom 
        config={config} 
        onLeave={() => setToken("")} 
      />
    </LiveKitRoom>
  );
}
