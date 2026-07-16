import { NextRequest, NextResponse } from "next/server";
import { handleChatTurn } from "@/lib/ai/chat";
import type { ChatRequest } from "@/lib/ai/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON." }, { status: 400 });
  }

  if (!body.userId || !body.message?.trim()) {
    return NextResponse.json(
      { error: "userId and message are required." },
      { status: 400 }
    );
  }

  let turn;
  try {
    turn = await handleChatTurn({
      userId: body.userId,
      message: body.message,
      history: body.history,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process chat." },
      { status: 500 }
    );
  }

  if (turn.kind === "crisis") {
    return NextResponse.json(turn.response, { status: 200 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of turn.stream) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong while replying.";
        controller.enqueue(encoder.encode(`\n[error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      // marker for the frontend: this is a normal stream, not a crisis response
      "X-Serena-Mode": "chat",
    },
  });
}
