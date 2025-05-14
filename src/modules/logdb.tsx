import { openDB } from 'idb';

const DB_NAME = 'LogDB';
const STORE_NAME = 'logs';
const DB_VERSION = 1;

export interface LogEntry {
  id?: number;
  gameResult: 'win' | 'loss' | 'forfeit';
  gameMode: string | null;
  usedLives: number;
  totalLives: number;
  timeTaken: number;
  timeSetting: boolean;
  word: string;
  WordArray: string;
  timestamp?: number;
}

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    },
  });
}

export async function addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<void> {
  const db = await getDB();
  await db.add(STORE_NAME, {
    ...entry,
    timestamp: Date.now(),
  });
}

export async function getAllLogs(): Promise<LogEntry[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function resetLogs(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
