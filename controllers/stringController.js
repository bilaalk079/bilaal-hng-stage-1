import crypto from "crypto";
import StringModel from "../models/stringModel.js";

const analyzeString = (value) => {
  const length = value.length;
  const normalized = value.toLowerCase().replace(/\s+/g, "");
  const is_palindrome = normalized === [...normalized].reverse().join("");
  const unique_characters = new Set(value).size;
  const word_count = value.trim().split(/\s+/).filter(Boolean).length;
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

  const character_frequency_map = {};
  for (const c of value) character_frequency_map[c] = (character_frequency_map[c] || 0) + 1;

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
};

// POST /strings
export const analyzeAndCreateString = async (req, res) => {
  const { value } = req.body;

  if (!value) return res.status(400).json({ error: "Missing 'value' field" });
  if (typeof value !== "string") return res.status(422).json({ error: "'value' must be a string" });

  const analyzed = analyzeString(value);

  try {
    const existing = await StringModel.findOne({ "properties.sha256_hash": analyzed.sha256_hash });
    if (existing) return res.status(409).json({ error: "String already exists" });

    const stringDoc = await StringModel.create({
      value,
      properties: analyzed,
    });

    return res.status(201).json(stringDoc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /strings/:value
export const getSpecificString = async (req, res) => {
  const { value } = req.params;
  try {
    const stringDoc = await StringModel.findOne({ value });
    if (!stringDoc) return res.status(404).json({ error: "String not found" });
    res.json(stringDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /strings
export const getAllStrings = async (req, res) => {
  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

  const filter = {};

  if (is_palindrome !== undefined) filter["properties.is_palindrome"] = is_palindrome === "true";
  if (min_length)
    filter["properties.length"] = { ...filter["properties.length"], $gte: Number(min_length) };
  if (max_length)
    filter["properties.length"] = { ...filter["properties.length"], $lte: Number(max_length) };
  if (word_count) filter["properties.word_count"] = Number(word_count);
  if (contains_character) filter["value"] = { $regex: contains_character, $options: "i" };

  try {
    const data = await StringModel.find(filter);
    res.json({
      data,
      count: data.length,
      filters_applied: req.query,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /strings/:value
export const deleteString = async (req, res) => {
  const { value } = req.params;
  try {
    const deleted = await StringModel.findOneAndDelete({ value });
    if (!deleted) return res.status(404).json({ error: "String not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /strings/filter-by-natural-language
export const filterByNaturalLanguage = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query" });
  const q = query.toLowerCase();
  const filters = {};

  try {
    if (/single word/.test(q)) filters["properties.word_count"] = 1;
    if (/palindromic|palindrome/.test(q)) filters["properties.is_palindrome"] = true;
    const longerMatch = q.match(/longer than (\d+)/);
    if (longerMatch) filters["properties.length"] = { $gte: Number(longerMatch[1]) + 1 };
    const containsMatch = q.match(/containing (?:the )?letter (\w)/);
    if (containsMatch) filters["value"] = { $regex: containsMatch[1], $options: "i" };

    if (/first vowel/.test(q) && filters["properties.is_palindrome"]) {
      filters["value"] = { $regex: "a", $options: "i" };
    }

    if (filters["properties.word_count"] && filters["properties.word_count"] <= 0) {
      return res.status(422).json({ error: "Conflicting filters" });
    }

    const data = await StringModel.find(filters);

    res.json({
      data,
      count: data.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Unable to parse natural language query" });
  }
};
