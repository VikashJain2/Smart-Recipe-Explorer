import express from "express";
import {
  analyzeNutrition,
  generateRecipe,
  simplifyRecipe,
  suggestRecipe,
} from "../controllers/aiController.js";
const router = express.Router();
router.post("/suggest", suggestRecipe);
router.post("/simplify/:recipeId", simplifyRecipe);
router.post("/generate", generateRecipe);
router.get("/analyze/:recipeId", analyzeNutrition);

export default router;
