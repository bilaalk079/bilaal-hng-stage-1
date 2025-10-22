import express from "express";
import {
  analyzeAndCreateString,
  getAllStrings,
  getSpecificString,
  deleteString,
  filterByNaturalLanguage,
} from "../controllers/stringController.js";

const router = express.Router();

router.post("/", analyzeAndCreateString);
router.get("/", getAllStrings);
router.get("/filter-by-natural-language", filterByNaturalLanguage);
router.get("/:value", getSpecificString);
router.delete("/:value", deleteString);

export default router;
