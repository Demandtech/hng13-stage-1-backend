import ResponseStatusException, {
  StatusCode,
} from "./ResponseStatusException.js";

export function parseNaturalLanguageQuery(query) {
  const normalized = query.toLowerCase().trim();
  const filters = {};

  if (normalized.includes("palindromic")) filters.is_palindrome = true;

  if (normalized.includes("single word")) filters.word_count = 1;

  if (normalized.match(/longer than (\d+)/)) {
    const [, num] = normalized.match(/longer than (\d+)/);
    filters.min_length = parseInt(num) + 1;
  }

  if (normalized.match(/shorter than (\d+)/)) {
    const [, num] = normalized.match(/shorter than (\d+)/);
    filters.max_length = parseInt(num) - 1;
  }

  if (normalized.match(/containing the letter ([a-z])/)) {
    const [, char] = normalized.match(/containing the letter ([a-z])/);
    filters.contains_character = char;
  }

  if (Object.keys(filters).length === 0) {
    throw new ResponseStatusException(
      "Unable to parse natural language query",
      StatusCode.BAD_REQUEST,
      null
    );
  }

  return filters;
}
