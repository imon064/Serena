import { generateStructured } from "./client";
import { getStore } from "./store";
import { MoodAnalysisZ, DraftZ } from "./schemas";
import {
  MOOD_SYSTEM,
  moodUserPrompt,
  DRAFT_SYSTEM,
  draftUserPrompt,
} from "./prompts/journal";
import type { ChatHistory, JournalEntry, MoodAnalysis } from "./types";

/** Analyze one piece of writing into a MoodAnalysis. Saves nothing. */
export async function analyzeJournalEntry(text: string): Promise<MoodAnalysis> {
  return generateStructured({
    system: MOOD_SYSTEM,
    contents: moodUserPrompt(text),
    schema: MoodAnalysisZ,
    schemaName: "MoodAnalysis",
  });
}

/**
 * Draft a journal entry from a conversation. History can be passed directly,
 * or read from the store via sessionId.
 */
export async function draftJournalFromChat(params: {
  userId: string;
  history?: ChatHistory;
  sessionId?: string;
}): Promise<string> {
  const store = getStore();
  const profile = await store.getProfile(params.userId);

  let history = params.history;
  if (!history && params.sessionId && store.getSessionHistory) {
    history = await store.getSessionHistory(params.sessionId);
  }
  if (!history || history.length === 0) {
    throw new Error("No conversation available to draft a journal from.");
  }

  const { draft } = await generateStructured({
    system: DRAFT_SYSTEM,
    contents: draftUserPrompt(history, profile),
    schema: DraftZ,
    schemaName: "JournalDraft",
  });
  return draft;
}

/**
 * Full flow used by the /api/journal/analyze endpoint:
 * analyze mood -> save entry (optional) -> update profile from the new entry.
 */
export async function processJournalEntry(params: {
  userId: string;
  text: string;
  save: boolean;
}): Promise<{ mood: MoodAnalysis; entry?: JournalEntry }> {
  const mood = await analyzeJournalEntry(params.text);
  if (!params.save) return { mood };

  const store = getStore();
  const entry = await store.saveJournal({
    userId: params.userId,
    text: params.text,
    mood,
  });

  // Profile update is non-critical — don't block the response if it fails.
  try {
    const { updateProfileFromJournal } = await import("./profile");
    await updateProfileFromJournal(params.userId, params.text, mood);
  } catch {}

  return { mood, entry };
}
