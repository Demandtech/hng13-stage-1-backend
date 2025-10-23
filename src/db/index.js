import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

export async function initDB() {
  if (db) return db;

  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  db.exec(`
            CREATE TABLE IF NOT EXISTS strings (
                id TEXT PRIMARY KEY,
                value TEXT UNIQUE NOT NULL,
                properties TEXT NOT NULL,
                created_at TEXT NOT NULL UNIQUE
                )
                `);

  return db;
}
