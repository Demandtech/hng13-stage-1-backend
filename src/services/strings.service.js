import StringModel from "../models/strings.model.js";
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

  const existing = await StringModel.findByPk(hash);

  if (existing) {
    throw new ResponseStatusException(
      "String already exists",
      StatusCode.CONFLICT,
      null
    );
  }

  const record = await StringModel.create({
    id: hash,
    value: string,
    properties: JSON.stringify({
      length,
      is_palindrome,
      unique_chars,
      word_count,
      char_frequency,
    }),
  });

  return {
    id: record.id,
    value: record.value,
    properties: JSON.parse(record.properties),
    created_at: record.created_at,
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

  const row = await StringModel.findOne({ where: { value } });

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
  const where = {};

  if (filters.contains_character)
    where.value = { [Op.like]: `%${filters.contains_character}%` };

  const rows = await StringModel.findAll();

  const filtered = rows.filter((row) => {
    const props = JSON.parse(row.properties);

    if (
      filters.is_palindrome !== undefined &&
      props.is_palindrome !== filters.is_palindrome
    )
      return false;
    if (filters.min_length !== undefined && props.length < filters.min_length)
      return false;
    if (filters.max_length !== undefined && props.length > filters.max_length)
      return false;
    if (
      filters.word_count !== undefined &&
      props.word_count !== filters.word_count
    )
      return false;

    return true;
  });

  const data = filtered.map((r) => ({
    id: r.id,
    value: r.value,
    properties: JSON.parse(r.properties),
    created_at: r.created_at,
  }));

  return {
    data,
    count: data.length,
    filters_applied: filters,
  };
}

export async function deleteStringByValue(value) {
  const deleted = await StringModel.destroy({ where: { value } });

  if (deleted === 0) {
    throw new ResponseStatusException("String not found", StatusCode.NOT_FOUND);
  }

  return true;
}
