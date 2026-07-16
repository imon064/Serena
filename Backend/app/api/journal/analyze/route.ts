import { NextRequest, NextResponse } from "next/server";
import { processJournalEntry } from "@/lib/ai/journal";
import type { AnalyzeRequest } from "@/lib/ai/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON." }, { status: 400 });
  }

  if (!body.userId || !body.text?.trim()) {
    return NextResponse.json(
      { error: "userId and text are required." },
      { status: 400 }
    );
  }

  try {
    const result = await processJournalEntry({
      userId: body.userId,
      text: body.text,
      save: body.save ?? true,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to analyze journal." },
      { status: 500 }
    );
  }
}
