import type { ChatHistory, UserProfile } from "../types";

export const MOOD_SYSTEM = `You analyze the emotion in English-language journal entries.
Read what the user wrote, then output a mood analysis as JSON.

Guidance:
- valence: -1 (very negative/sad) to 1 (very positive/happy). 0 = neutral.
- arousal: 0 (calm, flat) to 1 (high energy, intense, panic/euphoria).
- primaryEmotion: pick the SINGLE most dominant one.
- themes: 1-4 concrete topics from the writing (e.g. "thesis", "family", "friendship", "work"). Use short noun phrases.
- summary: 1 sentence, in a voice similar to the user's, neutral third-person point of view.
- confidence: 0-1, how clearly the emotion comes through.

Do not diagnose mental disorders. Do not judge. Just read and map the emotion.`;

export function moodUserPrompt(text: string): string {
  return `Journal entry:\n"""\n${text}\n"""`;
}

export const DRAFT_SYSTEM = `You help the user turn their vent/chat with Serena into a draft journal entry.
Write the draft as JSON with a "draft" field.

Important rules:
- Write from the USER'S point of view (first person: "I").
- Summarize what the user experienced and felt that day, NOT a transcript of the conversation.
- Mirror the user's language style and register (casual/slang/formal per their profile).
- Do not add advice, do not analyze, do not mention "Serena" or "AI".
- Reasonable length: 3-6 sentences. It should feel like the user wrote it themselves.
- This is a DRAFT — the user will edit it before saving. Give a good starting point, not a finished version.`;

export function draftUserPrompt(history: ChatHistory, profile: UserProfile): string {
  const convo = history
    .map((m) => `${m.role === "user" ? "User" : "Serena"}: ${m.content}`)
    .join("\n");
  return `User's language register: ${profile.languageRegister}. Typical length: ${profile.messageLength}.

Today's conversation:
"""
${convo}
"""

Write a first-person journal draft for the user based on the conversation above.`;
}
