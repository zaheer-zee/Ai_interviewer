export interface SessionConfig {
  mode: "interview" | "coach";
  voice: VoiceName;
  role: string;
  techStack: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  questionTypes: string[];
  personality: "friendly" | "professional" | "strict" | "faang";
  followupIntensity: "low" | "medium" | "high";
  duration: number; // minutes
  focusAreas: string[];
  resumeMode: boolean;
  resumeText: string;
}

export type VoiceName = "Puck" | "Charon" | "Kore" | "Fenrir" | "Aoede";

export const VOICE_OPTIONS: { name: VoiceName; gender: string; description: string }[] = [
  { name: "Puck", gender: "Male", description: "Warm & friendly" },
  { name: "Charon", gender: "Male", description: "Deep & authoritative" },
  { name: "Fenrir", gender: "Male", description: "Clear & professional" },
  { name: "Kore", gender: "Female", description: "Bright & expressive" },
  { name: "Aoede", gender: "Female", description: "Calm & articulate" },
];

export const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Product Manager",
  "Software Architect",
  "Cloud Engineer",
  "Cybersecurity Analyst",
];

export const TECH_STACK_OPTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "Svelte",
  "Node.js", "Express", "FastAPI", "Django", "Spring Boot",
  "Python", "Java", "Go", "Rust", "TypeScript",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes",
  "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST API",
  "TensorFlow", "PyTorch", "LangChain", "OpenAI API",
];

export const QUESTION_TYPE_OPTIONS = [
  { id: "theory", label: "Theory", icon: "📖" },
  { id: "coding", label: "Coding", icon: "💻" },
  { id: "scenario", label: "Scenario-Based", icon: "🎯" },
  { id: "debugging", label: "Debugging", icon: "🐛" },
  { id: "behavioral", label: "Behavioral", icon: "🤝" },
  { id: "system_design", label: "System Design", icon: "🏗️" },
  { id: "rapid_fire", label: "Rapid Fire", icon: "⚡" },
  { id: "project", label: "Project Discussion", icon: "📂" },
];

export const DURATION_OPTIONS = [10, 15, 20, 25, 30];

export const DEFAULT_CONFIG: SessionConfig = {
  mode: "interview",
  voice: "Puck",
  role: "",
  techStack: [],
  difficulty: "intermediate",
  questionTypes: [],
  personality: "professional",
  followupIntensity: "medium",
  duration: 15,
  focusAreas: [],
  resumeMode: false,
  resumeText: "",
};
