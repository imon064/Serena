// Assembles what makes the journal -> chat loop work: profile + recent journals.

import { getStore } from "./store";
import type { ChatContext } from "./types";

const RECENT_JOURNAL_LIMIT = 5;

export async function assembleChatContext(userId: string): Promise<ChatContext> {
  const store = getStore();
  const [profile, recentJournals] = await Promise.all([
    store.getProfile(userId),
    store.getRecentJournals(userId, RECENT_JOURNAL_LIMIT),
  ]);
  return { profile, recentJournals };
}
