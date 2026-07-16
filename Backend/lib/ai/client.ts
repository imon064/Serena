import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ZodType } from "zod";
import type { ChatHistory } from "./types";

export const MODEL = "gpt-5.6-luna";

let _client: OpenAI | null = null;

export function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local (see .env.example)."
    );
  }
  if (!_client) _client = new OpenAI({ apiKey });
  return _client;
}

const MAX_RETRIES = 6;

function isRetryable(err: unknown): boolean {
  const e = err as { status?: number; code?: number; message?: string };
  const status = e?.status ?? e?.code;
  if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
    return true;
  }
  return /rate limit|overloaded|timeout|fetch failed|socket|ECONNRESET|ETIMEDOUT|UND_ERR/i.test(
    String(e?.message ?? "")
  );
}

/** Pull a server-suggested wait (seconds) out of the error message, if present. */
function retryDelayMs(err: unknown): number | null {
  const msg = String((err as { message?: string })?.message ?? "");
  const m = msg.match(/(?:retry|try again)[^0-9]*(\d+(?:\.\d+)?)\s*s/i);
  if (m) return Math.ceil(parseFloat(m[1]) * 1000) + 1000; // +1s safety buffer
  return null;
}

const MIN_REQUEST_GAP_MS = Number(process.env.SERENA_MIN_REQUEST_GAP_MS ?? 0);

let _lastRequestAt = 0;
let _gate: Promise<void> = Promise.resolve();

/** Serialize request starts and enforce a minimum gap between them. */
async function pace(): Promise<void> {
  if (MIN_REQUEST_GAP_MS <= 0) return;
  const prev = _gate;
  let release!: () => void;
  _gate = new Promise<void>((r) => (release = r));
  await prev;
  const wait = Math.max(0, _lastRequestAt + MIN_REQUEST_GAP_MS - Date.now());
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  _lastRequestAt = Date.now();
  release();
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      await pace();
      return await fn();
    } catch (err) {
      if (!isRetryable(err) || attempt >= MAX_RETRIES) throw err;
      const wait =
        retryDelayMs(err) ?? Math.min(60000, 2000 * 2 ** (attempt - 1));
      console.warn(
        `[openai] transient error on "${label}" — waiting ${Math.round(
          wait / 1000
        )}s then retrying (attempt ${attempt}/${MAX_RETRIES})...`
      );
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

export async function generateStructured<T>(params: {
  contents: string;
  schema: ZodType<T>;
  schemaName: string;
  system?: string;
}): Promise<T> {
  const client = getClient();
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  if (params.system) messages.push({ role: "system", content: params.system });
  messages.push({ role: "user", content: params.contents });

  const completion = await withRetry(
    () =>
      client.chat.completions.create({
        model: MODEL,
        messages,
        response_format: zodResponseFormat(params.schema, params.schemaName),
      }),
    "generateStructured"
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty response.");
  return params.schema.parse(JSON.parse(content));
}

/** Map our ChatHistory (role: "user" | "model") to OpenAI message params. */
function toMessages(
  system: string,
  history: ChatHistory,
  latestUserMessage: string
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    { role: "system", content: system },
    ...history.map((m) => ({
      role: (m.role === "model" ? "assistant" : "user") as "assistant" | "user",
      content: m.content,
    })),
    { role: "user" as const, content: latestUserMessage },
  ];
}

/**
 * Streaming text for chat. Returns an async iterable of string (text chunks).
 */
export async function* streamText(params: {
  system: string;
  history: ChatHistory;
  message: string;
}): AsyncGenerator<string> {
  const client = getClient();
  const stream = await withRetry(
    () =>
      client.chat.completions.create({
        model: MODEL,
        messages: toMessages(params.system, params.history, params.message),
        stream: true,
      }),
    "streamText"
  );
  for await (const chunk of stream) {
    const t = chunk.choices[0]?.delta?.content;
    if (t) yield t;
  }
}
