// Supabase Edge Function: "chat"
//
// This runs on Supabase's servers (Deno runtime), NOT in the mobile app.
// Your OpenAI key lives here as a secret and is never shipped to the phone.
//
// The app calls this with the recent conversation; we forward it to OpenAI
// together with a "system" prompt that gives Serena her calm, gentle voice,
// then return only the reply text.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
// Set the real model id you have access to via the OPENAI_MODEL secret
// (e.g. `supabase secrets set OPENAI_MODEL=gpt-5.6-luna`).
// gpt-4o-mini is a safe, known fallback if the secret is not set.
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

// The "personality" of the bot. This is the single most important knob for
// tone. Edit this text to reshape how Serena speaks.
const SYSTEM_PROMPT = `You are Serena, a warm, gentle mental-wellbeing companion inside a self-care app.

Your voice:
- Speak in a calm, soft, reassuring tone — like a kind friend who is fully present.
- Keep replies short and unhurried (usually 2-4 sentences). Never lecture or overwhelm.
- Validate the person's feelings before offering anything. Make them feel heard.
- Use simple, warm language. Gentle encouragement, never clinical or robotic.
- Offer one small, doable suggestion at a time (a breath, a reflection, a tiny step) only when it feels welcome.
- Ask soft, open questions to help them explore how they feel.
- Use the person's name occasionally and naturally when you know it. Emojis are okay but sparing.

Boundaries:
- You are a supportive companion, not a therapist or doctor. Do not diagnose or give medical advice.
- If someone expresses thoughts of self-harm, suicide, or being in danger, respond with calm compassion, gently encourage them to reach out to a trusted person or a local crisis line / emergency services right away, and make clear they deserve support. Do not panic or be preachy.

Always stay on the side of gentleness and safety.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Browsers/clients send a preflight OPTIONS request first.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY secret is not set on the function.");
    }

    // The app sends: { messages: [{role, content}...], userName?: string }
    const { messages = [], userName } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Let the model know who it's talking to, if we have a name.
    const systemContent = userName
      ? `${SYSTEM_PROMPT}\n\nThe person you are speaking with is named ${userName}.`
      : SYSTEM_PROMPT;

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        // Newer OpenAI models (gpt-5.x and o-series) renamed this parameter
        // and only accept the default temperature, so we keep it simple.
        max_completion_tokens: 400,
        messages: [
          { role: "system", content: systemContent },
          // Only forward role + content; ignore any extra fields from the app.
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
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
    const reply: string = data?.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("chat function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
