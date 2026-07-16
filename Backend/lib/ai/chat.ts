import { streamText } from "./client";
import { assembleChatContext } from "./context";
import { runSafetyTriage, CRISIS_RESPONSE } from "./safety";
import { buildSerenaSystem } from "./prompts/serena";
import { updateProfileFromChat } from "./profile";
import type { ChatHistory, CrisisResponse } from "./types";

const PROFILE_UPDATE_EVERY = 6;

export type ChatTurn =
  | { kind: "crisis"; response: CrisisResponse }
  | { kind: "stream"; stream: AsyncGenerator<string> };

export async function handleChatTurn(params: {
  userId: string;
  message: string;
  history?: ChatHistory;
}): Promise<ChatTurn> {
  const history = params.history ?? [];

  // Safety first: on high risk, never involve the chat model at all.
  const triage = await runSafetyTriage(params.message);
  if (triage.risk === "high") {
    return { kind: "crisis", response: CRISIS_RESPONSE };
  }

  const ctx = await assembleChatContext(params.userId);
  const system = buildSerenaSystem(ctx, {
    moderateRisk: triage.risk === "moderate",
  });

  // Refresh the profile periodically, without blocking the reply.
  const userTurnCount = history.filter((m) => m.role === "user").length + 1;
  if (userTurnCount % PROFILE_UPDATE_EVERY === 0) {
    const material: ChatHistory = [
      ...history,
      { role: "user", content: params.message },
    ];
    void updateProfileFromChat(params.userId, material).catch(() => {});
  }

  const stream = streamText({
    system,
    history,
    message: params.message,
  });

  return { kind: "stream", stream };
}
