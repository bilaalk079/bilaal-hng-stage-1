import mongoose from "mongoose";

const stringSchema = new mongoose.Schema({
  value: { type: String, required: true },
  properties: {
    length: Number,
    is_palindrome: Boolean,
    unique_characters: Number,
    word_count: Number,
    sha256_hash: { type: String, unique: true },
    character_frequency_map: { type: Map, of: Number },
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("String", stringSchema);
