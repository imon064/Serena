import { generateStructured } from "./client";
import { SafetyTriageZ } from "./schemas";
import { SAFETY_SYSTEM, safetyUserPrompt } from "./prompts/safety";
import type { CrisisResponse, SafetyTriage } from "./types";

export async function runSafetyTriage(message: string): Promise<SafetyTriage> {
  try {
    return await generateStructured({
      system: SAFETY_SYSTEM,
      contents: safetyUserPrompt(message),
      schema: SafetyTriageZ,
      schemaName: "SafetyTriage",
    });
  } catch {
    // Fail-safe: if triage fails, don't assume the message is safe. Treat it as
    // "moderate" so chat continues but in careful mode.
    return { risk: "moderate", reason: "triage failed — safe default" };
  }
}

// The crisis response is HAND-WRITTEN. The model must not improvise while the
// user is in crisis. Number: Indonesia's Kemenkes SEJIWA line (119 ext. 8).
// NOTE: confirm/replace these resources for your users' region before shipping.
export const CRISIS_RESPONSE: CrisisResponse = {
  crisis: true,
  message:
    "I hear you, and I'm genuinely worried about you right now. What you're feeling is heavy, and you don't have to face it alone. You matter, and your life is worth it. Please reach out to one of the contacts below right now — there are people ready to listen and help.",
  resources: [
    {
      name: "Mental Health Hotline (Kemenkes SEJIWA, Indonesia)",
      contact: "119 ext. 8",
      note: "24-hour phone line, free, nationwide across Indonesia.",
    },
    {
      name: "Emergency / Ambulance",
      contact: "112",
      note: "If you're in immediate danger, call this.",
    },
  ],
};
