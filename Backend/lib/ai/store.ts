// COORDINATION POINT WITH THE TEAM.
// The AI layer only needs the `Store` interface below. By default it writes to
// a local JSON file (.data/serena.json) so data is shared between the seed
// script and the dev server — enough for a local demo, safely lost if deleted.
// The teammate who owns the DB just implements a database version of `Store`
// and calls setStore(dbStore). No AI logic needs to change at all.

import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import {
  DEFAULT_PROFILE,
  type JournalEntry,
  type MoodAnalysis,
  type UserProfile,
} from "./types";

export interface Store {
  getProfile(userId: string): Promise<UserProfile>;
  saveProfile(userId: string, profile: UserProfile): Promise<void>;

  getRecentJournals(userId: string, limit: number): Promise<JournalEntry[]>;
  getJournal(id: string): Promise<JournalEntry | null>;
  saveJournal(
    entry: Omit<JournalEntry, "id" | "createdAt"> & {
      id?: string;
      createdAt?: string;
    }
  ): Promise<JournalEntry>;
  setJournalMood(id: string, mood: MoodAnalysis): Promise<void>;

  // optional: used by draftJournalFromChat when history isn't passed directly
  getSessionHistory?(
    sessionId: string
  ): Promise<{ role: "user" | "model"; content: string }[]>;
}

interface DbShape {
  profiles: Record<string, UserProfile>;
  journals: Record<string, JournalEntry>;
}

const DB_PATH = join(process.cwd(), ".data", "serena.json");

class FileStore implements Store {
  private read(): DbShape {
    try {
      if (!existsSync(DB_PATH)) return { profiles: {}, journals: {} };
      return JSON.parse(readFileSync(DB_PATH, "utf-8")) as DbShape;
    } catch {
      return { profiles: {}, journals: {} };
    }
  }

  private write(db: DbShape): void {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  }

  async getProfile(userId: string): Promise<UserProfile> {
    return this.read().profiles[userId] ?? { ...DEFAULT_PROFILE };
  }

  async saveProfile(userId: string, profile: UserProfile): Promise<void> {
    const db = this.read();
    db.profiles[userId] = profile;
    this.write(db);
  }

  async getRecentJournals(userId: string, limit: number): Promise<JournalEntry[]> {
    return Object.values(this.read().journals)
      .filter((j) => j.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getJournal(id: string): Promise<JournalEntry | null> {
    return this.read().journals[id] ?? null;
  }

  async saveJournal(
    entry: Omit<JournalEntry, "id" | "createdAt"> & {
      id?: string;
      createdAt?: string;
    }
  ): Promise<JournalEntry> {
    const db = this.read();
    const full: JournalEntry = {
      id: entry.id ?? randomUUID(),
      userId: entry.userId,
      text: entry.text,
      createdAt: entry.createdAt ?? new Date().toISOString(),
      mood: entry.mood,
    };
    db.journals[full.id] = full;
    this.write(db);
    return full;
  }

  async setJournalMood(id: string, mood: MoodAnalysis): Promise<void> {
    const db = this.read();
    if (db.journals[id]) {
      db.journals[id].mood = mood;
      this.write(db);
    }
  }
}

// Swappable singleton. The team calls setStore(dbStore) at merge time.
let _store: Store = new FileStore();

export function getStore(): Store {
  return _store;
}

export function setStore(store: Store): void {
  _store = store;
}
