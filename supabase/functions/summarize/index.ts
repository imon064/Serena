// Supabase Edge Function: "summarize"
//
// Takes a month's journal entries and returns a short, warm reflection written
// in Serena's calm voice. Runs server-side so the OpenAI key stays secret.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `You are Serena, a warm, gentle mental-wellbeing companion.

You will be given a person's journal entries for one month. Write a short, calming reflection (about 3-4 sentences) that:
- Gently notices the emotional themes and patterns across the entries.
- Warmly acknowledges their feelings and any growth or effort you see.
- Ends with one soft, encouraging note for the month ahead.

Speak directly to the person ("you"), in a soft, caring, unhurried tone. Do not list the entries back or use bullet points — write it as one gentle paragraph. Never diagnose or give medical advice.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface JournalInput {
  date: string;
  title?: string;
  content: string;
  mood?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY secret is not set on the function.");
    }

    // The app sends: { entries: [...], monthName?: string, userName?: string }
    const { entries = [], monthName, userName } = await req.json();

    if (!Array.isArray(entries) || entries.length === 0) {
      return new Response(
        JSON.stringify({
          summary:
            "There are no journal entries yet this month. When you write a few, I'll gently reflect them back to you here. 🌿",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Flatten the entries into a readable block for the model.
    const entriesText = (entries as JournalInput[])
      .map(
        (e) =>
          `Date: ${e.date}\nMood: ${e.mood ?? "n/a"}\nTitle: ${
            e.title ?? "(untitled)"
          }\n${e.content}`,
      )
      .join("\n\n---\n\n");

    const userContent = `${
      userName ? `The person's name is ${userName}. ` : ""
    }Here are the journal entries for ${
      monthName ?? "this month"
    }:\n\n${entriesText}`;

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        // Newer OpenAI models use this name instead of `max_tokens`.
        max_completion_tokens: 300,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!openaiResp.ok) {
      const detail = await openaiResp.text();
      console.error("OpenAI error:", openaiResp.status, detail);
      return new Response(
        JSON.stringify({ error: "OpenAI request failed.", detail }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await openaiResp.json();
    const summary: string = data?.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("summarize function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
