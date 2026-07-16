// IMPORTANT: this is a COMMUNICATION-STYLE profile, not a psychological
// assessment/diagnosis. The model infers how the user likes to be talked to,
// not a personality type.

import { generateStructured } from "./client";
import { getStore } from "./store";
import { ProfileInferZ } from "./schemas";
import type { ChatHistory, MoodAnalysis, UserProfile } from "./types";

const PROFILE_SYSTEM = `You infer a user's COMMUNICATION-STYLE PROFILE from their writing/conversation in a journaling & chat app.
This is NOT a personality test, NOT MBTI, NOT a diagnosis. Focus: how this user is most comfortable being talked to.

Output JSON:
- languageRegister: the user's language style (formal / casual / slang / mixed).
- preferredSupport: from the tone of their writing, what they most need (listening / advice / perspective / comfort).
- emojiUse: how often they use emoji (none / some / lots).
- messageLength: their typical writing length (short / medium / long).
- recurringThemes: topics that recur in their life (e.g. "thesis", "family"). Merge the old profile with new info, drop what's no longer relevant. Max 6.
- rollingSummary: a <=200-word summary of the user's life context (what they're going through, important people, recurring themes, general mood). This is long-term memory. Update the old profile with new info — don't just overwrite blindly; keep what's still relevant, add what's new.

If there's little new info, keep most of the old profile.`;

function buildUserPrompt(current: UserProfile, newMaterial: string): string {
  return `The user's old profile (JSON):
${JSON.stringify(
  {
    languageRegister: current.languageRegister,
    preferredSupport: current.preferredSupport,
    emojiUse: current.emojiUse,
    messageLength: current.messageLength,
    recurringThemes: current.recurringThemes,
    rollingSummary: current.rollingSummary,
  },
  null,
  2
)}

New material from the user:
"""
${newMaterial}
"""

Update the profile based on the new material above.`;
}

async function inferAndSave(
  userId: string,
  newMaterial: string
): Promise<UserProfile> {
  const store = getStore();
  const current = await store.getProfile(userId);

  const inferred = await generateStructured({
    system: PROFILE_SYSTEM,
    contents: buildUserPrompt(current, newMaterial),
    schema: ProfileInferZ,
    schemaName: "UserProfile",
  });

  const updated: UserProfile = {
    ...inferred,
    updatedAt: new Date().toISOString(),
  };
  await store.saveProfile(userId, updated);
  return updated;
}

/** Update the profile from a new journal entry. */
export async function updateProfileFromJournal(
  userId: string,
  text: string,
  mood: MoodAnalysis
): Promise<UserProfile> {
  const material = `Journal entry:\n${text}\n\n(detected mood: ${mood.primaryEmotion}, themes: ${mood.themes.join(", ")})`;
  return inferAndSave(userId, material);
}

/** Update the profile from the latest chunk of chat. */
export async function updateProfileFromChat(
  userId: string,
  history: ChatHistory
): Promise<UserProfile> {
  const userTurns = history
    .filter((m) => m.role === "user")
    .slice(-8)
    .map((m) => m.content)
    .join("\n---\n");
  if (!userTurns.trim()) return getStore().getProfile(userId);
  return inferAndSave(userId, `The user's latest messages:\n${userTurns}`);
}
