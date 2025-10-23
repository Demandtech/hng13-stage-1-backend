import { initDB } from "../db/index.js";
import ResponseStatusException, {
  StatusCode,
} from "../utils/ResponseStatusException.js";
import { createHash } from "node:crypto";

export async function analyseString(value) {
  if (typeof value !== "string") {
    throw new ResponseStatusException(
      "Input must be a string",
      StatusCode.UNPROCESSABLE_ENTITY,
      null
    );
  }

  const string = value.trim();
  const string_lower = string.toLowerCase();
  const length = string.length;
  const is_palindrome =
    string_lower === string_lower.split("").reverse().join("");
  const unique_chars = new Set(string).size;
  const word_count = string.split(/\s+/).filter(Boolean).length;
  const hash = createHash("sha256").update(string).digest("hex");

  const char_frequency = {};

  for (const char of string) {
    char_frequency[char] = (char_frequency[char] || 0) + 1;
  }

  const db = await initDB();

  const existing = await db.get("SELECT * FROM strings WHERE id = ?", [hash]);

  if (existing) {
    throw new ResponseStatusException(
      "String already exists",
      StatusCode.CONFLICT,
      null
    );
  }

  const created_at = new Date().toISOString();

  await db.run(
    "INSERT INTO strings (id, value, properties, created_at) VALUES (?, ?, ?, ?)",
    [
      hash,
      string,
      JSON.stringify({
        length,
        is_palindrome,
        unique_chars,
        word_count,
        char_frequency,
      }),
      created_at,
    ]
  );

  return {
    id: hash,
    value: string,
    properties: {
      length,
      is_palindrome,
      unique_chars,
      word_count,
      char_frequency,
    },
    created_at,
  };
}

export async function getStringByValue(value) {
  if (!value || typeof value !== "string") {
    throw new ResponseStatusException(
      "Missing or invalid string value.",
      StatusCode.BAD_REQUEST,
      null
    );
  }

  const db = await initDB();
  const row = await db.get("SELECT * FROM strings WHERE value = ?", [value]);

  if (!row) {
    throw new ResponseStatusException(
      "String does not exist in the system",
      StatusCode.NOT_FOUND,
      null
    );
  }

  return {
    id: row.id,
    value: row.value,
    properties: JSON.parse(row.properties),
    created_at: row.created_at,
  };
}

export async function getFilteredStrings(filters) {
  const db = await initDB();

  let query = "SELECT * FROM strings WHERE 1=1";
  const params = [];

  if (filters.is_palindrome !== undefined) {
    query += " AND json_extract(properties, '$.is_palindrome') = ?";
    params.push(filters.is_palindrome ? true : false);
  }

  if (filters.min_length !== undefined) {
    query += " AND json_extract(properties, '$.length') >= ?";
    params.push(filters.min_length);
  }

  if (filters.max_length !== undefined) {
    query += " AND json_extract(properties, '$.length') <= ?";
    params.push(filters.max_length);
  }

  if (filters.word_count !== undefined) {
    query += " AND json_extract(properties, '$.word_count') = ?";
    params.push(filters.word_count);
  }

  if (filters.contains_character !== undefined) {
    query += " AND value LIKE ?";
    params.push(`%${filters.contains_character}%`);
  }

  const rows = await db.all(query, params);

  const data = rows.map((row) => ({
    id: row.id,
    value: row.value,
    properties: JSON.parse(row.properties),
    created_at: row.created_at,
  }));

  return {
    data,
    count: data.length,
    filters_applied: filters,
  };
}

export async function deleteStringByValue(value) {
  const db = await initDB();
  const result = await db.run("DELETE FROM strings WHERE value = ?", [value]);

  if (result.changes === 0) {
    throw new ResponseStatusException(
      "String not found",
      StatusCode.NOT_FOUND,
      null
    );
  }

  return true;
}
