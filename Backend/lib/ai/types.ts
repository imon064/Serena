export type Role = "user" | "model";

export interface ChatMessage {
  role: Role;
  content: string;
}

export type ChatHistory = ChatMessage[];

export const PRIMARY_EMOTIONS = [
  "happy",
  "sad",
  "angry",
  "afraid",
  "anxious",
  "calm",
  "mixed",
  "neutral",
] as const;
export type PrimaryEmotion = (typeof PRIMARY_EMOTIONS)[number];

export interface MoodAnalysis {
  /** -1 (very negative/sad) .. 1 (very positive/happy). 0 = neutral */
  valence: number;
  /** 0 (calm) .. 1 (high energy / intense) */
  arousal: number;
  primaryEmotion: PrimaryEmotion;
  /** themes present, e.g. ["college", "family"] */
  themes: string[];
  /** one-sentence summary, in the user's voice */
  summary: string;
  /** 0..1 how confident the model is */
  confidence: number;
}

export const RISK_LEVELS = ["none", "low", "moderate", "high"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export interface SafetyTriage {
  risk: RiskLevel;
  reason: string;
}

export const LANGUAGE_REGISTERS = ["formal", "casual", "slang", "mixed"] as const;
export type LanguageRegister = (typeof LANGUAGE_REGISTERS)[number];

export const PREFERRED_SUPPORTS = [
  "listening", // just wants to be heard
  "advice", // wants practical suggestions
  "perspective", // wants to be challenged / think it through
  "comfort", // wants to be cheered up / reassured
] as const;
export type PreferredSupport = (typeof PREFERRED_SUPPORTS)[number];

export const EMOJI_USES = ["none", "some", "lots"] as const;
export type EmojiUse = (typeof EMOJI_USES)[number];

export const MESSAGE_LENGTHS = ["short", "medium", "long"] as const;
export type MessageLength = (typeof MESSAGE_LENGTHS)[number];

export interface UserProfile {
  languageRegister: LanguageRegister;
  preferredSupport: PreferredSupport;
  emojiUse: EmojiUse;
  messageLength: MessageLength;
  recurringThemes: string[];
  /** Serena's long-term memory: the user's life context, <= 200 words */
  rollingSummary: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  languageRegister: "casual",
  preferredSupport: "listening",
  emojiUse: "some",
  messageLength: "medium",
  recurringThemes: [],
  rollingSummary: "",
  updatedAt: new Date(0).toISOString(),
};

export interface JournalEntry {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  mood?: MoodAnalysis;
}

export interface CrisisResource {
  name: string;
  contact: string;
  note?: string;
}

export interface CrisisResponse {
  crisis: true;
  message: string;
  resources: CrisisResource[];
}

export interface ChatRequest {
  userId: string;
  message: string;
  history?: ChatHistory;
}

export interface AnalyzeRequest {
  userId: string;
  text: string;
  /** if true, entry is saved to the store + profile is updated. default true */
  save?: boolean;
}

export interface DraftRequest {
  userId: string;
  sessionId?: string;
  /** if history is passed directly it's used; otherwise it's read from the store */
  history?: ChatHistory;
}

export interface DraftResponse {
  draft: string;
}

export interface ChatContext {
  profile: UserProfile;
  recentJournals: JournalEntry[];
}
