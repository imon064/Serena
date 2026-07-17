import { supabase } from './supabase';

/**
 * A single chat turn, in the shape OpenAI expects.
 * - 'user'      = something the person typed
 * - 'assistant' = something Serena (the bot) said
 */
export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Sends the recent conversation to our Supabase Edge Function ("chat"),
 * which forwards it to OpenAI using the secret API key and returns Serena's
 * reply. The user's Supabase auth token is attached automatically, so only
 * logged-in users can call it.
 *
 * @param history  The conversation so far (oldest first).
 * @param userName Optional first name so Serena can address the person warmly.
 * @returns        Serena's reply text.
 */
export async function sendChat(
  history: ChatMessage[],
  userName?: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('chat', {
    body: { messages: history, userName },
  });

  if (error) {
    // Surface a clear error to the caller so it can show a gentle fallback.
    throw new Error(error.message ?? 'Failed to reach Serena.');
  }

  const reply = (data as { reply?: string })?.reply?.trim();
  if (!reply) {
    throw new Error('Serena did not return a reply.');
  }

  return reply;
}

/** A journal entry, trimmed to just what the summarizer needs. */
export interface JournalSummaryInput {
  date: string;
  title?: string;
  content: string;
  mood?: string;
}

/**
 * Sends a month's journal entries to the "summarize" Edge Function and returns
 * a warm, AI-written reflection paragraph in Serena's voice.
 */
export async function summarizeJournal(
  entries: JournalSummaryInput[],
  monthName: string,
  userName?: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('summarize', {
    body: { entries, monthName, userName },
  });

  if (error) {
    throw new Error(error.message ?? 'Failed to reach Serena.');
  }

  const summary = (data as { summary?: string })?.summary?.trim();
  if (!summary) {
    throw new Error('No reflection was returned.');
  }

  return summary;
}
