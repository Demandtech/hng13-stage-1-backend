import {
  analyseString,
  getStringByValue,
  deleteStringByValue,
  getFilteredStrings,
} from "../services/strings.service.js";
import logRequest from "../utils/logRequest.js";
import { parseNaturalLanguageQuery } from "../utils/parseNaturalLanguageQuery.js";
import ResponseStatusException, {
  StatusCode,
} from "../utils/ResponseStatusException.js";


export async function handleNewString(req, res) {
  const start = Date.now();
  try {
    const { value } = req.body;

    const result = await analyseString(value);

    res.status(StatusCode.CREATED).json(result);
    logRequest(req, StatusCode.CREATED, start);
  } catch (error) {
  
    if (error instanceof ResponseStatusException) {
      logRequest(req, error.statusCode, start);
      res.status(error.statusCode).json({ message: error.message });
    } else {
      logRequest(req, StatusCode.INTERNAL_SERVER_ERROR, start);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error, please try again later!" });
    }
  }
}

export async function handleGetStringByValue(req, res) {
  const start = Date.now();

  try {
    const { value } = req.params;

    const result = await getStringByValue(value);
    logRequest(req, StatusCode.OK, start);
    return res.status(StatusCode.OK).json(result);
  } catch (error) {
    if (error instanceof ResponseStatusException) {
      logRequest(req, error.statusCode, start);
      return res.status(error.statusCode).json({ message: error.message });
    }
    logRequest(req, StatusCode.INTERNAL_SERVER_ERROR, start);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error, please try again later!" });
  }
}

export async function handleGetAllStrings(req, res) {
  const start = Date.now();

  try {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    const filters = {};
    if (is_palindrome !== undefined)
      filters.is_palindrome = is_palindrome === "true";
    if (min_length !== undefined) filters.min_length = parseInt(min_length);
    if (max_length !== undefined) filters.max_length = parseInt(max_length);
    if (word_count !== undefined) filters.word_count = parseInt(word_count);
    if (contains_character !== undefined)
      filters.contains_character = contains_character;

    const result = await getFilteredStrings(filters);
    logRequest(req, StatusCode.OK, start);
    return res.status(StatusCode.OK).json(result);
  } catch (error) {
    if (error instanceof ResponseStatusException) {
      logRequest(req, error.statusCode, start);
      return res.status(error.statusCode).json({ message: error.message });
    }
    logRequest(req, StatusCode.INTERNAL_SERVER_ERROR, start);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error, please try again later!" });
  }
}

export async function handleNaturalLanguageFilter(req, res) {
  const start = Date.now();

  try {
    const { query } = req.query;
    if (!query) {
      throw new ResponseStatusException(
        "Missing 'query' parameter",
        StatusCode.BAD_REQUEST,
        null
      );
    }

    const filters = parseNaturalLanguageQuery(query);
    const result = await getFilteredStrings(filters);
    logRequest(req, StatusCode.OK, start);
    return res.status(StatusCode.OK).json({
      data: result.data,
      count: result.count,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (error) {
    if (error instanceof ResponseStatusException) {
      logRequest(req, error.statusCode, start);
      return res.status(error.statusCode).json({ message: error.message });
    }
    logRequest(req, StatusCode.INTERNAL_SERVER_ERROR, start);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error, please try again later!" });
  }
}

export async function handleDeleteString(req, res) {
  const start = Date.now();
  try {
    const { value } = req.params;
    await deleteStringByValue(value);

    logRequest(req, StatusCode.NO_CONTENT, start);
    return res.status(StatusCode.NO_CONTENT).send();
  } catch (error) {
    if (error instanceof ResponseStatusException) {
      logRequest(req, error.statusCode, start);
      return res.status(error.statusCode).json({ message: error.message });
    }
    logRequest(req, StatusCode.INTERNAL_SERVER_ERROR, start);
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error, please try again later!" });
  }
}


