import Database from "better-sqlite3";

let db;

export async function initDB() {
  if (!db) {
    db = new Database("./database.db");

    db.exec(`
            CREATE TABLE IF NOT EXISTS strings (
                id TEXT PRIMARY KEY,
                value TEXT UNIQUE NOT NULL,
                properties TEXT NOT NULL,
                created_at TEXT NOT NULL UNIQUE
                )
                `);
  }

  return db;
}
