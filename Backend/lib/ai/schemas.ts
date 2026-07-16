// Zod schemas are used two ways inside generateStructured() in client.ts:
// as the OpenAI json_schema response_format (constrains generation), and to
// validate/parse the model's JSON reply.

import { z } from "zod";
import {
  PRIMARY_EMOTIONS,
  RISK_LEVELS,
  LANGUAGE_REGISTERS,
  PREFERRED_SUPPORTS,
  EMOJI_USES,
  MESSAGE_LENGTHS,
} from "./types";

export const MoodAnalysisZ = z.object({
  valence: z.number().min(-1).max(1),
  arousal: z.number().min(0).max(1),
  primaryEmotion: z.enum(PRIMARY_EMOTIONS),
  themes: z.array(z.string()),
  summary: z.string(),
  confidence: z.number().min(0).max(1),
});

export const SafetyTriageZ = z.object({
  risk: z.enum(RISK_LEVELS),
  reason: z.string(),
});

// updatedAt is omitted here — it's set by code, not the model.
export const ProfileInferZ = z.object({
  languageRegister: z.enum(LANGUAGE_REGISTERS),
  preferredSupport: z.enum(PREFERRED_SUPPORTS),
  emojiUse: z.enum(EMOJI_USES),
  messageLength: z.enum(MESSAGE_LENGTHS),
  recurringThemes: z.array(z.string()),
  rollingSummary: z.string(),
});

export const DraftZ = z.object({ draft: z.string() });
