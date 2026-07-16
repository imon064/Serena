// Demo seed data: 2 weeks of journal entries for one user, with recurring
// themes (thesis, family, a friend named Rani) and a mood that rises and falls.
//
// Run:  npm run seed
//
// Each entry: mood-analyzed -> saved to .data/serena.json -> profile updated.
// After this, the dev server can demo the journal->chat loop because Serena
// already "remembers" the demo user's journal.

import { readFileSync } from "fs";
import { join } from "path";

// load OPENAI_API_KEY from .env.local (tsx doesn't auto-load)
function loadEnv() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // ignore; client.ts will complain if the key is empty
  }
}
loadEnv();

if (!process.env.OPENAI_API_KEY) {
  console.error(
    "\n❌ OPENAI_API_KEY is not set in .env.local.\n" +
      "   Generate a key at https://platform.openai.com/api-keys and paste it into .env.local.\n"
  );
  process.exit(1);
}

const USER_ID = "demo-user";

// Entries: [days ago, text]. Built backwards from today.
const ENTRIES: [number, string][] = [
  [13, "Started working on my thesis proposal today. Still really unsure what topic to pick, but honestly kind of excited to finally get going."],
  [12, "Ran into Rani on campus and she helped me brainstorm topics. So grateful to have a friend like her — makes facing this whole thesis thing feel less lonely."],
  [11, "My advisor is impossible to reach. I've been messaging since yesterday and still nothing. Starting to get stressed about the deadline."],
  [9, "Weekend at home, but I ended up arguing with my mom about when I'll graduate. Tired of being pushed all the time, like nobody gets that I'm already trying."],
  [8, "Feeling really down today. Thesis is stuck, revisions are piling up, and I feel so far behind compared to friends who are already doing their defense."],
  [6, "Rani dragged me out for coffee and just let me vent for ages. Felt so much lighter afterward, like someone actually gets it. Thank you, Ran."],
  [5, "My advisor finally replied and part of my revision got approved. Small, but it's the first bit of progress after weeks of being stuck. Relieved."],
  [3, "Pulled an all-nighter chasing chapter 2. Body's exhausted but my mind won't stop. A little anxious about whether all of this will be done in time."],
  [1, "Had a good talk with my mom last night — she apologized for pushing too hard. It felt warm, like a weight lifted off my chest a little."],
  [0, "Productive day! Chapter 2 is almost done and I met Rani to review it. For the first time in a month I actually feel optimistic about this thesis."],
];

async function main() {
  // import after env is loaded, so the client can read the key
  const { analyzeJournalEntry } = await import("../lib/ai/journal");
  const { updateProfileFromJournal } = await import("../lib/ai/profile");
  const { getStore } = await import("../lib/ai/store");
  const store = getStore();

  console.log(`\n🌱 Seeding ${ENTRIES.length} journal entries for "${USER_ID}"...\n`);

  for (const [daysAgo, text] of ENTRIES) {
    const createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    const mood = await analyzeJournalEntry(text);
    await store.saveJournal({ userId: USER_ID, text, mood, createdAt });
    await updateProfileFromJournal(USER_ID, text, mood);

    const bar =
      mood.valence >= 0
        ? "🙂".repeat(Math.max(1, Math.round(mood.valence * 5)))
        : "🙁".repeat(Math.max(1, Math.round(-mood.valence * 5)));
    console.log(
      `  ${createdAt.slice(0, 10)}  valence=${mood.valence
        .toFixed(2)
        .padStart(5)}  ${mood.primaryEmotion.padEnd(12)} ${bar}`
    );
    console.log(`             themes: ${mood.themes.join(", ")}`);
  }

  const profile = await store.getProfile(USER_ID);
  console.log("\n📋 Inferred communication-style profile:");
  console.log(`   register        : ${profile.languageRegister}`);
  console.log(`   preferredSupport: ${profile.preferredSupport}`);
  console.log(`   emojiUse        : ${profile.emojiUse}`);
  console.log(`   messageLength   : ${profile.messageLength}`);
  console.log(`   recurringThemes : ${profile.recurringThemes.join(", ")}`);
  console.log(`\n   rollingSummary  : ${profile.rollingSummary}\n`);
  console.log("✅ Done. Run `npm run dev` and test /api/chat.\n");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
