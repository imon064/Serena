import { NextRequest, NextResponse } from "next/server";
import { draftJournalFromChat } from "@/lib/ai/journal";
import type { DraftRequest, DraftResponse } from "@/lib/ai/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: DraftRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON." }, { status: 400 });
  }

  if (!body.userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }
  if (!body.history?.length && !body.sessionId) {
    return NextResponse.json(
      { error: "Provide history or sessionId to create a draft." },
      { status: 400 }
    );
  }

  try {
    const draft = await draftJournalFromChat({
      userId: body.userId,
      history: body.history,
      sessionId: body.sessionId,
    });
    const res: DraftResponse = { draft };
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create draft." },
      { status: 500 }
    );
  }
}
